// ============================================================
// COMPLIANCE LAYER
// All TCPA / mini-TCPA / SB 243 / Fair Housing checks live here.
// EVERY outbound message must pass through canSendNow() before going out.
// EVERY inbound message must pass through detectOptOut() first.
// ============================================================

import { lookupPhone, STRICT_STATES, AI_DISCLOSURE_REQUIRED_STATES } from './areacodes.js';
import { isSendAllowedNow } from './timezone.js';
import { isOptedOut, getDailyCount } from './redis.js';

// ============================================================
// OPT-OUT KEYWORDS (TCPA "any reasonable means" rule, 2025+)
// We accept any reasonable variation, not just exact "STOP".
// Source: FCC TCPA Order, April 2025
// ============================================================

const OPT_OUT_KEYWORDS = [
  // Strong opt-out signals
  'stop',
  'stopall',
  'unsubscribe',
  'cancel',
  'quit',
  'end',
  'optout',
  'opt-out',
  'opt out',
  'revoke',
  'remove',
  'no more',
  'leave me alone',
  'do not text',
  "don't text",
  'dont text',
  // Some carriers also recognize these:
  'arret',  // FR
  'arreter',
  'desabonnement',
];

const OPT_IN_KEYWORDS = ['start', 'unstop', 'subscribe', 'yes', 'resume'];

const HELP_KEYWORDS = ['help', 'info', 'support'];

/**
 * Detect if the lead's inbound text is an opt-out signal.
 * Uses normalization (lowercase, trim, strip punctuation).
 *
 * @param {string} text — raw SMS body from lead
 * @returns {object}    — { type: 'optout'|'optin'|'help'|'normal', keyword: string|null }
 */
export function detectOptOut(text) {
  if (!text) return { type: 'normal', keyword: null };

  // Normalize: lowercase, strip punctuation, collapse whitespace
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Exact keyword match (the most common case)
  for (const kw of OPT_OUT_KEYWORDS) {
    if (normalized === kw) return { type: 'optout', keyword: kw };
  }
  for (const kw of OPT_IN_KEYWORDS) {
    if (normalized === kw) return { type: 'optin', keyword: kw };
  }
  for (const kw of HELP_KEYWORDS) {
    if (normalized === kw) return { type: 'help', keyword: kw };
  }

  // Phrase-level match (e.g. "please stop messaging me", "I want to unsubscribe")
  for (const kw of OPT_OUT_KEYWORDS) {
    // Match as whole word/phrase
    const re = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`);
    if (re.test(normalized)) return { type: 'optout', keyword: kw };
  }

  return { type: 'normal', keyword: null };
}

// ============================================================
// PRE-SEND COMPLIANCE GATE
// Call this before EVERY outbound SMS.
// Returns { allowed, reason, retryAfter } — if not allowed, queue or drop.
// ============================================================

const MAX_SMS_PER_DAY_STRICT = 3;     // FL/OK/WA/MD per 24h cap
const MAX_SMS_PER_DAY_DEFAULT = 10;   // Reasonable default for non-strict states

export async function canSendNow(phoneE164) {
  // 1. Check opt-out (permanent block) -------------------------
  if (await isOptedOut(phoneE164)) {
    return {
      allowed: false,
      reason: 'OPTED_OUT',
      message: 'Lead has opted out — sending is permanently blocked. Re-subscribe with START required.',
    };
  }

  // 2. Identify lead's state + timezone ------------------------
  const info = lookupPhone(phoneE164);
  if (!info) {
    return {
      allowed: false,
      reason: 'INVALID_PHONE',
      message: `Could not parse phone number ${phoneE164} as valid US number.`,
    };
  }

  // 3. Quiet-hours check (TCPA + state mini-TCPA) -------------
  const windowCheck = isSendAllowedNow(info.state, info.tz);
  if (!windowCheck.allowed) {
    return {
      allowed: false,
      reason: 'QUIET_HOURS',
      message: windowCheck.reason,
      state: info.state,
      tz: info.tz,
    };
  }

  // 4. Per-day rate cap (FL/OK mini-TCPA = 3/day) -------------
  const dailyCount = await getDailyCount(phoneE164);
  const cap = STRICT_STATES.has(info.state) ? MAX_SMS_PER_DAY_STRICT : MAX_SMS_PER_DAY_DEFAULT;
  if (dailyCount >= cap) {
    return {
      allowed: false,
      reason: 'DAILY_CAP_REACHED',
      message: `Daily cap of ${cap} SMS reached for ${phoneE164} in ${info.state}.`,
      state: info.state,
      count: dailyCount,
    };
  }

  // All checks passed
  return {
    allowed: true,
    reason: 'OK',
    state: info.state,
    tz: info.tz,
  };
}

// ============================================================
// FIRST-MESSAGE AI DISCLOSURE
// CA SB 243 (effective Jan 1, 2026): chatbot must disclose AI identity
// in initial communication. We apply it nationwide for safety.
// Penalty: $1000+/violation, private right of action.
// ============================================================

/**
 * Build the very first message to a brand-new HVAC/Roofing lead.
 * MUST include AI disclosure + company name + STOP keyword info.
 *
 * @param {object} lead     - { name, city, service, issue }
 * @param {object|string} broker - full broker config object (preferred) or just name string (legacy)
 * @returns {string}        - SMS-ready first message
 */
export function buildFirstMessage(lead, broker) {
  const firstName = lead.name?.split(' ')[0] ?? 'there';
  const brokerName = typeof broker === 'string' ? broker : (broker?.name ?? 'us');
  const city = lead.city ?? (typeof broker === 'object' ? broker?.service_area_city : null) ?? 'your area';
  const service = lead.service || lead.property || 'service';

  // Required elements per layered compliance:
  //  1. "AI assistant" disclosure (CA SB 243)
  //  2. Company name (TCPA brand ID, transactional context)
  //  3. Reference to their inquiry (transactional, not marketing)
  //  4. Open-ended diagnostic question (short)
  //  5. STOP keyword info (TCPA opt-out availability)

  return (
    `Hi ${firstName}, AI assistant for ${brokerName} here about your ` +
    `${service} request in ${city}. ` +
    `Quick question — is this an emergency (no AC / leak / no heat) ` +
    `or planned service? Reply STOP to unsubscribe.`
  );
}

/**
 * Build the opt-out confirmation message.
 * Required by TCPA: confirm receipt of opt-out within 10 business days,
 * and stop all future messages.
 *
 * @param {object|string} broker - full broker config or just name string
 */
export function buildOptOutConfirmation(broker) {
  const brokerName = typeof broker === 'string' ? broker : (broker?.name ?? 'us');
  return `You've been unsubscribed from ${brokerName} messages. Reply START to re-subscribe. No further messages will be sent.`;
}

/**
 * Build the HELP response (TCPA: brand name + contact info).
 *
 * @param {object|string} broker - full broker config or name string
 * @param {string} [brokerEmail] - optional email (used only when broker is string)
 */
export function buildHelpMessage(broker, brokerEmail) {
  const brokerName = typeof broker === 'string' ? broker : (broker?.name ?? 'us');
  const email = typeof broker === 'object' ? (broker?.email ?? brokerEmail) : brokerEmail;
  return `${brokerName}: Reply STOP to opt out. Contact: ${email}. For emergencies, call us directly. Standard msg & data rates may apply.`;
}

// ============================================================
// AUDIT LOG STRUCTURE
// Every send / receive should produce a record we can show a regulator.
// Stored in Redis with the lead context.
// ============================================================

export function newAuditEntry({ direction, body, status, reason, meta }) {
  return {
    ts: new Date().toISOString(),
    direction, // "outbound" | "inbound"
    body,
    status,    // "sent" | "blocked" | "received" | "optout"
    reason,
    meta: meta || {},
  };
}
