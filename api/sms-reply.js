// ============================================================
// POST /api/sms-reply
// Twilio webhook called when a lead REPLIES to our SMS.
//
// MULTI-TENANT FLOW:
//  1. Twilio sends with body.To = the BROKER's number
//  2. We look up broker config in Redis by body.To
//  3. We validate signature using THAT broker's auth token
//  4. We use THAT broker's Twilio credentials to reply
//
// Flow:
//  1. Identify broker from req.body.To
//  2. Validate Twilio signature (using broker's auth token)
//  3. Detect opt-out → confirm + block + exit
//  4. Detect HELP → reply with broker info + exit
//  5. Detect re-subscribe (START) → clear opt-out
//  6. Normal reply → check compliance gate → AI generates reply → send
//
// Twilio sends form-encoded body (NOT JSON). Vercel parses automatically.
// ============================================================

import {
  detectOptOut,
  buildOptOutConfirmation,
  buildHelpMessage,
  newAuditEntry,
} from '../lib/compliance.js';
import {
  getLeadContext,
  saveLeadContext,
  markOptOut,
  clearOptOut,
  isOptedOut,
  shouldHandoffToBroker,
} from '../lib/redis.js';
import { getBroker } from '../lib/broker.js';
import { sendSms, validateTwilioSignature } from '../lib/twilio.js';
import { generateReply } from '../lib/openai.js';
import { toE164 } from '../lib/areacodes.js';
import twilio from 'twilio';

export const config = {
  runtime: 'nodejs',
  regions: ['iad1'],
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  // -------- 1. Extract recipient (broker) + sender (lead) --
  const fromPhone = req.body?.From;       // the LEAD's phone
  const toPhone = req.body?.To;            // the BROKER's Twilio number
  const messageBody = req.body?.Body || '';
  const messageSid = req.body?.MessageSid;

  if (!fromPhone || !toPhone || !messageBody) {
    return res.status(400).send('Missing From, To, or Body');
  }

  const phoneE164 = toE164(fromPhone) || fromPhone;
  const brokerNumberE164 = toE164(toPhone) || toPhone;

  // -------- 2. Look up broker by the receiving number ------
  const broker = await getBroker(brokerNumberE164);
  if (!broker) {
    console.warn(`[sms-reply] No broker found for receiving number ${brokerNumberE164}`);
    return res.status(404).send('Broker not configured');
  }

  // -------- 3. Twilio signature validation -----------------
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    if (!validateTwilioSignature(req, broker)) {
      console.warn('[sms-reply] Invalid Twilio signature — possible spoof attempt');
      return res.status(403).send('Forbidden');
    }
  }

  // -------- 4. Log inbound to audit ------------------------
  const ctx = (await getLeadContext(phoneE164)) || {
    phone: phoneE164,
    brokerId: broker.id,
    history: [],
    audit: [],
    status: 'unknown',
  };
  ctx.audit = ctx.audit || [];
  ctx.audit.push(
    newAuditEntry({
      direction: 'inbound',
      body: messageBody,
      status: 'received',
      reason: 'OK',
      meta: { sid: messageSid, brokerId: broker.id },
    }),
  );

  // -------- 5. Opt-out / opt-in / help detection -----------
  const signal = detectOptOut(messageBody);

  // CASE A: Lead opted out
  if (signal.type === 'optout') {
    await markOptOut(phoneE164);
    ctx.status = 'opted_out';
    ctx.optedOutAt = new Date().toISOString();
    ctx.audit.push(
      newAuditEntry({
        direction: 'inbound',
        body: messageBody,
        status: 'optout',
        reason: signal.keyword,
        meta: { brokerId: broker.id },
      }),
    );
    await saveLeadContext(phoneE164, ctx);

    // FCC explicitly allows ONE confirmation message after opt-out.
    // Bypass compliance gate ONLY for this single confirmation.
    const confirmMsg = buildOptOutConfirmation(broker.name);

    try {
      const directClient = twilio(broker.twilio_account_sid, broker.twilio_auth_token);
      await directClient.messages.create({
        to: phoneE164,
        from: broker.twilio_phone_number,
        body: confirmMsg,
      });
    } catch (err) {
      console.error('[sms-reply] opt-out confirmation failed:', err.message);
    }

    return res.status(200).type('text/xml').send('<Response/>');
  }

  // CASE B: Lead opt-in (e.g. "START")
  if (signal.type === 'optin') {
    await clearOptOut(phoneE164);
    ctx.status = 'qualifying';
    ctx.optedOutAt = null;
    await saveLeadContext(phoneE164, ctx);

    await sendSms(
      broker,
      phoneE164,
      `Welcome back. You're re-subscribed to ${broker.name} messages. Reply STOP anytime to opt out.`,
    );
    return res.status(200).type('text/xml').send('<Response/>');
  }

  // CASE C: HELP request
  if (signal.type === 'help') {
    await sendSms(broker, phoneE164, buildHelpMessage(broker.name, broker.email));
    await saveLeadContext(phoneE164, ctx);
    return res.status(200).type('text/xml').send('<Response/>');
  }

  // -------- 6. If currently opted out, ignore --------------
  if (await isOptedOut(phoneE164)) {
    await saveLeadContext(phoneE164, ctx);
    console.log(`[sms-reply] Message from opted-out lead ${phoneE164} — ignored`);
    return res.status(200).type('text/xml').send('<Response/>');
  }

  // -------- 7. Normal flow → AI reply ----------------------
  ctx.history = ctx.history || [];
  ctx.history.push({ role: 'user', content: messageBody });

  // 7.a. HANDOFF GUARD — if conversation has gone on too long,
  // hand off to broker instead of letting bot loop infinitely.
  if (shouldHandoffToBroker(ctx.history)) {
    const handoffMsg =
      `Thanks for the detail. Let me have a ${broker.name} agent ` +
      `reach out directly — pick a time that works: ${broker.calendar_url}`;
    await sendSms(broker, phoneE164, handoffMsg);
    ctx.history.push({ role: 'assistant', content: handoffMsg });
    ctx.status = 'handoff_to_broker';
    ctx.handoffAt = new Date().toISOString();
    ctx.updatedAt = new Date().toISOString();
    await saveLeadContext(phoneE164, ctx);
    return res.status(200).type('text/xml').send('<Response/>');
  }

  // Cap history at last 12 messages to keep token cost low
  const recentHistory = ctx.history.slice(-12).slice(0, -1);

  const reply = await generateReply(recentHistory, messageBody, broker, { city: ctx.city });

  // -------- 8. Send AI reply (through compliance gate) -----
  const result = await sendSms(broker, phoneE164, reply);

  if (result.sent) {
    ctx.history.push({ role: 'assistant', content: reply });
  } else {
    ctx.audit.push(
      newAuditEntry({
        direction: 'outbound',
        body: reply,
        status: 'blocked',
        reason: result.reason,
        meta: { brokerId: broker.id },
      }),
    );
  }
  ctx.updatedAt = new Date().toISOString();
  await saveLeadContext(phoneE164, ctx);

  return res.status(200).type('text/xml').send('<Response/>');
}
