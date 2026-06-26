// ============================================================
// Broker Config Helpers — Multi-Tenant Architecture
//
// Each HVAC contractor (broker) has:
//   - Their OWN Twilio account (with their EIN registered for A2P 10DLC)
//   - Their OWN phone number
//   - Their OWN Calendly URL
//   - A unique broker_id in our Redis
//
// We store their config as JSON in Redis keyed by their phone number.
// This decouples broker config from Vercel env vars entirely.
//
// CRITICAL: broker.twilio_phone_number IS the broker_id. They match.
// ============================================================

import { getRedis } from './redis.js';

const BROKER_KEY_PREFIX = 'broker:';

/**
 * Get a broker's config by phone number (their Twilio sender number).
 * Returns null if broker not found or inactive.
 */
export async function getBroker(phoneE164) {
  if (!phoneE164) return null;
  const r = getRedis();
  const raw = await r.get(`${BROKER_KEY_PREFIX}${phoneE164}`);
  if (!raw) return null;
  const broker = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return broker.active ? broker : null;
}

/**
 * Get broker by broker_id (which equals their phone number).
 * Convenience alias for getBroker().
 */
export async function getBrokerById(brokerId) {
  return getBroker(brokerId);
}

/**
 * Save (create or update) a broker's config.
 * Pass the FULL config object — this overwrites any existing entry.
 *
 * Required fields:
 *   - twilio_phone_number (E.164)
 *   - name
 *   - email
 *   - calendar_url
 *   - twilio_account_sid
 *   - twilio_auth_token
 *
 * Optional fields:
 *   - daily_cap (default 200)
 *   - service_area_city
 *   - service_types (default "HVAC + Roofing")
 *   - active (default true)
 *   - state_license_number, bbb_rating, etc. (compliance metadata)
 */
export async function saveBroker(brokerConfig) {
  if (!brokerConfig.twilio_phone_number) {
    throw new Error('broker.twilio_phone_number required');
  }
  if (!brokerConfig.twilio_account_sid || !brokerConfig.twilio_auth_token) {
    throw new Error('broker.twilio_account_sid and twilio_auth_token required');
  }
  if (!brokerConfig.name) {
    throw new Error('broker.name required');
  }
  if (!brokerConfig.calendar_url) {
    throw new Error('broker.calendar_url required');
  }

  const r = getRedis();
  const broker = {
    // Defaults
    daily_cap: 200,
    service_types: 'HVAC + Roofing',
    active: true,
    createdAt: new Date().toISOString(),
    // Override with provided values
    ...brokerConfig,
    // Always update timestamp
    updatedAt: new Date().toISOString(),
    // Ensure id matches phone number
    id: brokerConfig.twilio_phone_number,
  };

  await r.set(`${BROKER_KEY_PREFIX}${broker.twilio_phone_number}`, JSON.stringify(broker));
  return broker;
}

/**
 * Deactivate a broker (soft delete — keeps config for audit but bot stops responding).
 * Use this when broker churns instead of deleting.
 */
export async function deactivateBroker(phoneE164) {
  const broker = await getBroker(phoneE164);
  if (!broker) return null;
  broker.active = false;
  broker.deactivatedAt = new Date().toISOString();
  const r = getRedis();
  await r.set(`${BROKER_KEY_PREFIX}${phoneE164}`, JSON.stringify(broker));
  return broker;
}

/**
 * Hard delete a broker config (use only for testing/cleanup).
 */
export async function deleteBroker(phoneE164) {
  const r = getRedis();
  return r.del(`${BROKER_KEY_PREFIX}${phoneE164}`);
}

/**
 * List all broker IDs (phone numbers) currently in Redis.
 * Useful for ops dashboard, billing, audit.
 */
export async function listBrokerIds() {
  const r = getRedis();
  const keys = await r.keys(`${BROKER_KEY_PREFIX}*`);
  return keys.map((k) => k.replace(BROKER_KEY_PREFIX, ''));
}

/**
 * Convenience: return broker config with required fields for AI/Twilio.
 * Throws if any required field missing (catches misconfigured brokers early).
 */
export function validateBrokerConfig(broker) {
  const required = [
    'twilio_phone_number',
    'twilio_account_sid',
    'twilio_auth_token',
    'name',
    'calendar_url',
  ];
  const missing = required.filter((f) => !broker?.[f]);
  if (missing.length > 0) {
    throw new Error(`Broker config missing required fields: ${missing.join(', ')}`);
  }
  return true;
}
