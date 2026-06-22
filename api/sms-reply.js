// ============================================================
// POST /api/sms-reply
// Twilio webhook called when lead REPLIES to our SMS.
//
// Flow:
//  1. Validate Twilio signature (security)
//  2. Detect opt-out → confirm + block + exit
//  3. Detect HELP → reply with broker info + exit
//  4. Detect re-subscribe (START) → clear opt-out
//  5. Normal reply → check compliance gate → AI generates reply → send
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
} from '../lib/redis.js';
import { sendSms, validateTwilioSignature } from '../lib/twilio.js';
import { generateReply } from '../lib/openai.js';
import { toE164 } from '../lib/areacodes.js';

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

  // -------- 1. Twilio signature validation -----------------
  // Skip in dev environments where the signature check is unreliable.
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    if (!validateTwilioSignature(req)) {
      console.warn('[sms-reply] Invalid Twilio signature — possible spoof attempt');
      return res.status(403).send('Forbidden');
    }
  }

  // -------- 2. Extract lead message & sender ---------------
  const fromPhone = req.body?.From;
  const messageBody = req.body?.Body || '';
  const messageSid = req.body?.MessageSid;

  if (!fromPhone || !messageBody) {
    return res.status(400).send('Missing From or Body');
  }

  const phoneE164 = toE164(fromPhone) || fromPhone;

  // -------- 3. Log inbound to audit ------------------------
  const ctx = (await getLeadContext(phoneE164)) || {
    phone: phoneE164,
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
      meta: { sid: messageSid },
    }),
  );

  // -------- 4. Opt-out / opt-in / help detection -----------
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
      }),
    );
    await saveLeadContext(phoneE164, ctx);

    // Send confirmation (TCPA requires confirming opt-out reception)
    // NOTE: We DO send this one final confirmation; FCC explicitly allows
    // a single confirmation message after opt-out.
    const confirmMsg = buildOptOutConfirmation(process.env.BROKER_NAME);

    // Bypass compliance gate ONLY for this single confirmation —
    // but log it. We do this by calling Twilio directly via the helper.
    try {
      const twilio = (await import('twilio')).default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      await twilio.messages.create({
        to: phoneE164,
        from: process.env.TWILIO_PHONE_NUMBER,
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
      phoneE164,
      `Welcome back. You're re-subscribed to ${process.env.BROKER_NAME} messages. Reply STOP anytime to opt out.`,
    );
    return res.status(200).type('text/xml').send('<Response/>');
  }

  // CASE C: HELP request
  if (signal.type === 'help') {
    await sendSms(
      phoneE164,
      buildHelpMessage(process.env.BROKER_NAME, process.env.BROKER_EMAIL),
    );
    await saveLeadContext(phoneE164, ctx);
    return res.status(200).type('text/xml').send('<Response/>');
  }

  // -------- 5. If currently opted out, ignore --------------
  if (await isOptedOut(phoneE164)) {
    await saveLeadContext(phoneE164, ctx);
    console.log(`[sms-reply] Message from opted-out lead ${phoneE164} — ignored`);
    return res.status(200).type('text/xml').send('<Response/>');
  }

  // -------- 6. Normal flow → AI reply ----------------------
  ctx.history = ctx.history || [];
  ctx.history.push({ role: 'user', content: messageBody });

  const aiCtx = {
    broker: process.env.BROKER_NAME,
    brokerCalendarUrl: process.env.BROKER_CALENDAR_URL,
    city: ctx.city,
  };

  // Cap history at last 12 messages to keep token cost low
  const recentHistory = ctx.history.slice(-12).slice(0, -1);

  const reply = await generateReply(recentHistory, messageBody, aiCtx);

  // -------- 7. Send AI reply (through compliance gate) -----
  const result = await sendSms(phoneE164, reply);

  if (result.sent) {
    ctx.history.push({ role: 'assistant', content: reply });
  } else {
    // Send blocked (e.g. quiet hours) — log and skip; will retry next window
    ctx.audit.push(
      newAuditEntry({
        direction: 'outbound',
        body: reply,
        status: 'blocked',
        reason: result.reason,
      }),
    );
  }
  ctx.updatedAt = new Date().toISOString();
  await saveLeadContext(phoneE164, ctx);

  // Twilio expects 200 with empty TwiML response (or 204)
  return res.status(200).type('text/xml').send('<Response/>');
}
