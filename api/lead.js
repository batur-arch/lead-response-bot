// ============================================================
// POST /api/lead
// Called by the broker's website when a NEW lead fills the form.
// Triggers the first SMS (with AI disclosure + qualifier question).
//
// Security: requires LEAD_WEBHOOK_SECRET header to prevent abuse.
// Compliance: runs through canSendNow() gate; queues if quiet hours.
// ============================================================

import { toE164 } from '../lib/areacodes.js';
import { buildFirstMessage } from '../lib/compliance.js';
import { sendSms } from '../lib/twilio.js';
import {
  saveLeadContext,
  getLeadContext,
  saveConsentRecord,
} from '../lib/redis.js';

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
    name,
    phone,
    city,
    property,
    email,
    // Consent record (broker must send these to prove TCPA compliance):
    consent_text,    // exact disclosure shown to lead
    consent_url,     // URL of the form they filled
    consent_ip,      // their IP at time of submission
    consent_ts,      // timestamp from broker's form
  } = body || {};

  // -------- 4. Validation ----------------------------------
  if (!phone) {
    return res.status(400).json({ error: 'Missing phone' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }

  const phoneE164 = toE164(phone);
  if (!phoneE164) {
    return res.status(400).json({ error: 'Invalid US phone format' });
  }

  // -------- 5. Save consent record (TCPA proof of consent) -
  // Even if consent fields are missing, save what we have.
  // The broker bears legal responsibility for collecting consent;
  // we store the audit trail.
  await saveConsentRecord(phoneE164, {
    receivedAt: new Date().toISOString(),
    name,
    email,
    consent_text: consent_text || '(not provided by broker — REVIEW)',
    consent_url: consent_url || '(not provided by broker — REVIEW)',
    consent_ip: consent_ip || null,
    consent_ts: consent_ts || null,
    broker: process.env.BROKER_NAME,
  });

  // -------- 6. Initialize lead context ---------------------
  // If lead already exists (resubmitted form), preserve audit history.
  const existing = (await getLeadContext(phoneE164)) || {};
  const ctx = {
    ...existing,
    phone: phoneE164,
    name,
    email: email || existing.email || null,
    city: city || existing.city || null,
    property: property || existing.property || null,
    status: 'qualifying',
    createdAt: existing.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: existing.history || [],
    audit: existing.audit || [],
  };
  await saveLeadContext(phoneE164, ctx);

  // -------- 7. Build the first message ---------------------
  const firstMsg = buildFirstMessage(ctx, process.env.BROKER_NAME);

  // -------- 8. Send via Twilio (gated by compliance) -------
  const result = await sendSms(phoneE164, firstMsg);

  // -------- 9. Update history if sent ----------------------
  if (result.sent) {
    ctx.history.push({ role: 'assistant', content: firstMsg });
    await saveLeadContext(phoneE164, ctx);
  }

  // -------- 10. Respond ------------------------------------
  return res.status(200).json({
    ok: true,
    sent: result.sent,
    reason: result.reason,
    detail: result.detail || null,
    leadPhone: phoneE164,
  });
}
