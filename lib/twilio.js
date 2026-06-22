// ============================================================
// Twilio wrapper with safety + compliance gate
// EVERY outbound message goes through sendSms() — NEVER call
// twilio.messages.create() directly. The gate enforces TCPA.
// ============================================================

import twilio from 'twilio';
import { canSendNow, newAuditEntry } from './compliance.js';
import { incrementDailyCount, getLeadContext, saveLeadContext } from './redis.js';

let _client = null;

function getClient() {
  if (_client) return _client;
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
  }
  _client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return _client;
}

/**
 * Send an SMS. THIS IS THE ONLY WAY MESSAGES LEAVE THE BOT.
 *
 * @param {string} toPhone  - E.164 format (+15551234567)
 * @param {string} body     - message body (truncate to 320 chars / 2 segments)
 * @param {object} options  - { allowOutsideHours: false } default
 * @returns {object}        - { sent: bool, sid: string|null, reason: string }
 */
export async function sendSms(toPhone, body, options = {}) {
  // 1. Run compliance gate ----------------------------------
  const gate = await canSendNow(toPhone);

  if (!gate.allowed) {
    // Log the block in lead context for audit
    const ctx = (await getLeadContext(toPhone)) || { phone: toPhone, audit: [] };
    ctx.audit = ctx.audit || [];
    ctx.audit.push(
      newAuditEntry({
        direction: 'outbound',
        body,
        status: 'blocked',
        reason: gate.reason,
        meta: { state: gate.state, tz: gate.tz },
      }),
    );
    await saveLeadContext(toPhone, ctx);

    return {
      sent: false,
      sid: null,
      reason: gate.reason,
      detail: gate.message,
    };
  }

  // 2. Truncate body to 2 SMS segments max (320 chars) ------
  // This avoids surprise charges and keeps messages readable.
  const safe = body.length > 320 ? body.slice(0, 317) + '...' : body;

  // 3. Send via Twilio ---------------------------------------
  try {
    const client = getClient();
    const msg = await client.messages.create({
      to: toPhone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: safe,
    });

    // 4. Increment daily counter -----------------------------
    await incrementDailyCount(toPhone);

    // 5. Log to audit ----------------------------------------
    const ctx = (await getLeadContext(toPhone)) || { phone: toPhone, audit: [] };
    ctx.audit = ctx.audit || [];
    ctx.audit.push(
      newAuditEntry({
        direction: 'outbound',
        body: safe,
        status: 'sent',
        reason: 'OK',
        meta: { sid: msg.sid, state: gate.state },
      }),
    );
    await saveLeadContext(toPhone, ctx);

    return { sent: true, sid: msg.sid, reason: 'OK' };
  } catch (err) {
    console.error('[twilio] send failed:', err.message, err.code);
    return {
      sent: false,
      sid: null,
      reason: 'TWILIO_ERROR',
      detail: err.message,
    };
  }
}

/**
 * Validate that an inbound webhook request actually came from Twilio.
 * Twilio signs each request with HMAC-SHA1.
 * Without this, anyone could spoof "lead replies" to your endpoint.
 */
export function validateTwilioSignature(req) {
  const signature = req.headers['x-twilio-signature'];
  if (!signature) return false;

  const url = `https://${req.headers.host}${req.url}`;
  // Twilio sends form-encoded body; we need to reconstruct the canonical string.
  const params = req.body || {};

  try {
    return twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      signature,
      url,
      params,
    );
  } catch (err) {
    console.error('[twilio] signature validation failed:', err.message);
    return false;
  }
}
