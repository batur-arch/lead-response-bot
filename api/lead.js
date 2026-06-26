// ============================================================
// POST /api/lead
// Called by a BROKER's website when a NEW lead fills the form.
// Triggers the first SMS (with AI disclosure + qualifier question).
//
// MULTI-TENANT FLOW:
//  1. Broker passes their broker_id (= their Twilio phone number)
//  2. We look up broker config from Redis
//  3. We use THEIR Twilio credentials to send the SMS
//
// Security:
//   - Requires LEAD_WEBHOOK_SECRET header
//   - Requires broker_id (must exist + be active in Redis)
//   - Requires consent_checked: true (TCPA prior express written consent)
//
// Compliance: runs through canSendNow() gate.
// ============================================================

import { toE164 } from '../lib/areacodes.js';
import { buildFirstMessage } from '../lib/compliance.js';
import { sendSms } from '../lib/twilio.js';
import {
  saveLeadContext,
  getLeadContext,
  saveConsentRecord,
  acquireSubmissionLock,
  incrementBrokerLeadCount,
  isBrokerOverDailyCap,
} from '../lib/redis.js';
import { getBroker, validateBrokerConfig } from '../lib/broker.js';

export const config = {
  runtime: 'nodejs',
  regions: ['iad1'],
};

export default async function handler(req, res) {
  // -------- 1. Method check --------------------------------
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // -------- 2. Webhook secret check ------------------------
  const secret = req.headers['x-webhook-secret'];
  if (!secret || secret !== process.env.LEAD_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // -------- 3. Parse body ----------------------------------
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  const {
    broker_id,        // REQUIRED — broker's Twilio phone number (E.164)
    name,
    phone,
    city,
    property,
    email,
    // Consent record (broker MUST send these to prove TCPA compliance):
    consent_checked,  // REQUIRED — must be boolean true (proof checkbox was ticked)
    consent_text,     // exact disclosure language shown to lead
    consent_url,      // URL of the form they filled
    consent_ip,       // their IP at time of submission
    consent_ts,       // timestamp from broker's form
  } = body || {};

  // -------- 4. Field validation ----------------------------
  if (!broker_id) {
    return res.status(400).json({ error: 'Missing broker_id' });
  }
  if (!phone) {
    return res.status(400).json({ error: 'Missing phone' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }

  // CRITICAL TCPA CHECK: consent_checked must be explicit boolean true.
  // Anything else (false, undefined, "true" string, 1) is REJECTED.
  // This prevents brokers from pushing leads without verifying consent.
  if (consent_checked !== true) {
    return res.status(400).json({
      error: 'Consent verification required',
      detail:
        'Lead submissions must include consent_checked: true (boolean). ' +
        'The broker form MUST require an explicit opt-in checkbox before submission. ' +
        'TCPA requires prior express written consent — and the disclosure must state ' +
        '"Consent is not a condition of purchase."',
    });
  }

  const phoneE164 = toE164(phone);
  if (!phoneE164) {
    return res.status(400).json({ error: 'Invalid US phone format' });
  }

  // Sanity check: name must be at least 2 chars, no numbers-only
  if (name.trim().length < 2 || /^\d+$/.test(name.trim())) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  // -------- 5. Look up broker config in Redis --------------
  const broker = await getBroker(broker_id);
  if (!broker) {
    return res.status(404).json({
      error: 'Broker not found or inactive',
      detail: `No active broker found with id ${broker_id}. Contact Iseri Agency.`,
    });
  }

  try {
    validateBrokerConfig(broker);
  } catch (err) {
    return res.status(500).json({
      error: 'Broker misconfigured',
      detail: err.message,
    });
  }

  // -------- 6. IDEMPOTENCY — prevent duplicate submissions --
  const isFirstSubmission = await acquireSubmissionLock(phoneE164, broker.id);
  if (!isFirstSubmission) {
    return res.status(200).json({
      ok: true,
      sent: false,
      reason: 'DUPLICATE_SUBMISSION',
      detail: 'Lead already processed within last 5 minutes; ignoring duplicate.',
      leadPhone: phoneE164,
      brokerId: broker.id,
    });
  }

  // -------- 7. BROKER DAILY CAP — cost protection ----------
  const capCheck = await isBrokerOverDailyCap(broker.id, broker.daily_cap);
  if (capCheck.over) {
    console.warn(
      `[lead] Broker ${broker.id} hit daily cap: ${capCheck.count}/${capCheck.cap}`,
    );
    return res.status(429).json({
      ok: false,
      sent: false,
      reason: 'BROKER_DAILY_CAP',
      detail: `Broker ${broker.name} exceeded daily lead cap (${capCheck.cap}). Contact Iseri Agency to increase.`,
      count: capCheck.count,
      cap: capCheck.cap,
    });
  }
  await incrementBrokerLeadCount(broker.id);

  // -------- 8. Save consent record (TCPA proof of consent) --
  await saveConsentRecord(phoneE164, {
    receivedAt: new Date().toISOString(),
    name,
    email,
    consent_checked: true,
    consent_text: consent_text || '(not provided by broker — REVIEW)',
    consent_url: consent_url || '(not provided by broker — REVIEW)',
    consent_ip: consent_ip || null,
    consent_ts: consent_ts || null,
    brokerId: broker.id,
    brokerName: broker.name,
  });

  // -------- 9. Initialize lead context ---------------------
  const existing = (await getLeadContext(phoneE164)) || {};
  const ctx = {
    ...existing,
    phone: phoneE164,
    name,
    email: email || existing.email || null,
    city: city || existing.city || broker.service_area_city || null,
    property: property || existing.property || null,
    brokerId: broker.id,
    status: 'qualifying',
    createdAt: existing.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: existing.history || [],
    audit: existing.audit || [],
  };
  await saveLeadContext(phoneE164, ctx);

  // -------- 10. Build the first message ---------------------
  const firstMsg = buildFirstMessage(ctx, broker);

  // -------- 11. Send via THIS BROKER's Twilio ---------------
  const result = await sendSms(broker, phoneE164, firstMsg);

  // -------- 12. Update history if sent ---------------------
  if (result.sent) {
    ctx.history.push({ role: 'assistant', content: firstMsg });
    await saveLeadContext(phoneE164, ctx);
  }

  // -------- 13. Respond ------------------------------------
  return res.status(200).json({
    ok: true,
    sent: result.sent,
    reason: result.reason,
    detail: result.detail || null,
    leadPhone: phoneE164,
    brokerId: broker.id,
  });
}
