// ============================================================
// Twilio wrapper with safety + compliance gate
// EVERY outbound message goes through sendSms() — NEVER call
// twilio.messages.create() directly. The gate enforces TCPA.
//
// MULTI-TENANT: each broker has their OWN Twilio account.
// We instantiate a separate client per broker on demand.
// Broker credentials live in Redis (lib/broker.js), NOT env vars.
// ============================================================

import twilio from 'twilio';
import { canSendNow, newAuditEntry } from './compliance.js';
import { incrementDailyCount, getLeadContext, saveLeadContext } from './redis.js';

// Cache of Twilio clients per broker — avoids re-instantiating
// the SDK for every request. Keyed by twilio_account_sid.
const _clientCache = new Map();

function getClientForBroker(broker) {
  if (!broker?.twilio_account_sid || !broker?.twilio_auth_token) {
    throw new Error(
      'Cannot create Twilio client — broker config missing twilio_account_sid or twilio_auth_token',
    );
  }
  if (_clientCache.has(broker.twilio_account_sid)) {
    return _clientCache.get(broker.twilio_account_sid);
  }
  const client = twilio(broker.twilio_account_sid, broker.twilio_auth_token);
  _clientCache.set(broker.twilio_account_sid, client);
  return client;
}

/**
 * Send an SMS using a specific broker's Twilio credentials.
 * THIS IS THE ONLY WAY MESSAGES LEAVE THE BOT.
 *
 * @param {object} broker   - broker config (from lib/broker.js)
 * @param {string} toPhone  - recipient E.164 (+15551234567)
 * @param {string} body     - message body (truncated to 320 chars)
 * @param {object} options  - reserved
 * @returns {object}        - { sent, sid, reason, detail }
 */
export async function sendSms(broker, toPhone, body, options = {}) {
  if (!broker?.twilio_phone_number) {
    return {
      sent: false,
      sid: null,
      reason: 'BROKER_MISCONFIGURED',
      detail: 'Broker config missing twilio_phone_number',
    };
  }

  // 1. Run compliance gate ----------------------------------
  const gate = await canSendNow(toPhone);

  if (!gate.allowed) {
    const ctx = (await getLeadContext(toPhone)) || { phone: toPhone, audit: [] };
    ctx.audit = ctx.audit || [];
    ctx.audit.push(
      newAuditEntry({
        direction: 'outbound',
        body,
        status: 'blocked',
        reason: gate.reason,
        meta: { state: gate.state, tz: gate.tz, brokerId: broker.id },
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
  const safe = body.length > 320 ? body.slice(0, 317) + '...' : body;

  // 3. Send via this BROKER's Twilio account ----------------
  try {
    const client = getClientForBroker(broker);
    const msg = await client.messages.create({
      to: toPhone,
      from: broker.twilio_phone_number,
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
        meta: { sid: msg.sid, state: gate.state, brokerId: broker.id },
      }),
    );
    await saveLeadContext(toPhone, ctx);

    return { sent: true, sid: msg.sid, reason: 'OK' };
  } catch (err) {
    console.error('[twilio] send failed:', err.message, err.code, 'broker:', broker.id);
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
 * MULTI-TENANT: we use THIS BROKER's auth token (not a global env var).
 *
 * Note on body parsing: Vercel parses form-encoded bodies before our handler
 * receives them. Twilio's validateRequest() accepts the parsed params object
 * (it canonicalizes by sorting keys internally), so parsed body works.
 * If we ever switch to a raw-body approach, this signature can stay the same.
 */
export function validateTwilioSignature(req, broker) {
  if (!broker?.twilio_auth_token) {
    console.warn('[twilio] cannot validate signature — broker has no twilio_auth_token');
    return false;
  }
  const signature = req.headers['x-twilio-signature'];
  if (!signature) return false;

  const url = `https://${req.headers.host}${req.url}`;
  const params = req.body || {};

  try {
    return twilio.validateRequest(broker.twilio_auth_token, signature, url, params);
  } catch (err) {
    console.error('[twilio] signature validation failed:', err.message);
    return false;
  }
}
