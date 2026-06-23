// ============================================================
// Upstash Redis client (US East region)
// Stores: lead context, opt-out state, daily SMS counters
// Retention: 90 days max per record (TTL)
// All data stays in US — KVKK avoidance + TCPA proof-of-consent log
// ============================================================

import { Redis } from '@upstash/redis';

// Singleton client — Vercel reuses serverless containers, so this is efficient.
let _redis = null;

export function getRedis() {
  if (_redis) return _redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars');
  }
  _redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return _redis;
}

// ============================================================
// Key naming conventions:
//   lead:{phoneE164}              → lead context (JSON, 90-day TTL)
//   optout:{phoneE164}            → "1" if opted out, no TTL (permanent)
//   smscount:{phoneE164}:{YMD}    → integer counter, 24h TTL
//   consent:{phoneE164}           → consent record (JSON, no TTL for legal proof)
// ============================================================

const TTL_LEAD_DAYS = 90;
const TTL_SMSCOUNT_HOURS = 30; // Slightly more than 24h to be safe

/**
 * Save or update lead context (history, qualification answers, status)
 * Auto-expires after 90 days for data minimization (GDPR/CCPA principle).
 */
export async function saveLeadContext(phone, ctx) {
  const r = getRedis();
  const key = `lead:${phone}`;
  await r.set(key, JSON.stringify(ctx), { ex: TTL_LEAD_DAYS * 86400 });
}

export async function getLeadContext(phone) {
  const r = getRedis();
  const key = `lead:${phone}`;
  const raw = await r.get(key);
  if (!raw) return null;
  // Upstash auto-parses JSON when stored as JSON.stringify'd
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

/**
 * Permanent opt-out flag (TCPA: must stop sending FOREVER once opted out,
 * unless they explicitly resubscribe via START).
 */
export async function markOptOut(phone) {
  const r = getRedis();
  await r.set(`optout:${phone}`, '1');
  // Also store with timestamp for audit
  await r.set(`optout_at:${phone}`, new Date().toISOString());
}

export async function clearOptOut(phone) {
  // Only called if lead replies START (TCPA-compliant re-subscribe)
  const r = getRedis();
  await r.del(`optout:${phone}`);
  await r.del(`optout_at:${phone}`);
}

export async function isOptedOut(phone) {
  const r = getRedis();
  const v = await r.get(`optout:${phone}`);
  return v === '1' || v === 1;
}

/**
 * Daily SMS counter per lead (for FL/OK 3-SMS-per-day cap).
 * Key uses YYYYMMDD in UTC; auto-expires after ~30h.
 */
function todayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
}

export async function incrementDailyCount(phone) {
  const r = getRedis();
  const key = `smscount:${phone}:${todayKey()}`;
  const newVal = await r.incr(key);
  // Set TTL only on first increment
  if (newVal === 1) {
    await r.expire(key, TTL_SMSCOUNT_HOURS * 3600);
  }
  return newVal;
}

export async function getDailyCount(phone) {
  const r = getRedis();
  const v = await r.get(`smscount:${phone}:${todayKey()}`);
  return parseInt(v ?? 0, 10);
}

/**
 * Consent record — TCPA proof of express written consent.
 * Stored permanently (no TTL) per FCC documentation requirements:
 * lead form URL, timestamp, IP, broker, exact disclosure language.
 */
export async function saveConsentRecord(phone, record) {
  const r = getRedis();
  await r.set(`consent:${phone}`, JSON.stringify(record));
}

export async function getConsentRecord(phone) {
  const r = getRedis();
  const raw = await r.get(`consent:${phone}`);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

// ============================================================
// IDEMPOTENCY — prevent duplicate lead submissions
// If broker's form submits 2x (network retry, double-click), we
// only process the first one. Lock expires after 5 minutes.
// ============================================================

/**
 * Atomic check-and-set. Returns true if this is the FIRST submission
 * for this phone+broker combo in the last 5 minutes; false if duplicate.
 */
export async function acquireSubmissionLock(phone, broker) {
  const r = getRedis();
  const key = `lock:lead:${broker}:${phone}`;
  // SET key value NX EX seconds — atomic set-if-not-exists
  const result = await r.set(key, '1', { nx: true, ex: 300 });
  return result === 'OK';
}

// ============================================================
// PER-BROKER DAILY LEAD CAP — cost protection
// Prevents a single broker from submitting unlimited leads in a day
// (could happen due to bug, attack, or surge during storm season).
// Default cap: 200 leads/broker/day (configurable per-broker later).
// ============================================================

const DEFAULT_BROKER_DAILY_CAP = 200;

export async function incrementBrokerLeadCount(broker) {
  const r = getRedis();
  const key = `brokerleads:${broker}:${todayKey()}`;
  const newVal = await r.incr(key);
  if (newVal === 1) {
    await r.expire(key, 30 * 3600); // ~30h, auto-cleanup
  }
  return newVal;
}

export async function isBrokerOverDailyCap(broker, cap = DEFAULT_BROKER_DAILY_CAP) {
  const r = getRedis();
  const v = await r.get(`brokerleads:${broker}:${todayKey()}`);
  const count = parseInt(v ?? 0, 10);
  return { over: count >= cap, count, cap };
}

// ============================================================
// CONVERSATION LENGTH GUARD — cost + handoff control
// After N message exchanges, bot should hand off to broker and stop.
// Prevents runaway OpenAI costs AND ensures leads talk to human eventually.
// ============================================================

const MAX_MESSAGES_BEFORE_HANDOFF = 20;

export function shouldHandoffToBroker(history) {
  if (!history || !Array.isArray(history)) return false;
  return history.length >= MAX_MESSAGES_BEFORE_HANDOFF;
}

