// ============================================================
// GET /api/health
// Health-check endpoint. Verifies global env vars are set,
// counts active brokers, and confirms Redis reachable.
// ============================================================

import { listBrokerIds, getBroker } from '../lib/broker.js';

export const config = {
  runtime: 'nodejs',
  regions: ['iad1'],
};

export default async function handler(req, res) {
  // Master env vars (global, not per-broker)
  const required = [
    'OPENAI_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'LEAD_WEBHOOK_SECRET',
  ];

  const missing = required.filter((k) => !process.env[k]);

  // Count active brokers in Redis (proves multi-tenant config is live)
  let brokerCount = 0;
  let activeBrokers = 0;
  let redisOk = false;
  try {
    const ids = await listBrokerIds();
    brokerCount = ids.length;
    for (const id of ids) {
      const b = await getBroker(id);
      if (b?.active) activeBrokers++;
    }
    redisOk = true;
  } catch (err) {
    console.warn('[health] Redis check failed:', err.message);
  }

  const status =
    missing.length === 0 && redisOk ? 'ok' : 'misconfigured';

  return res.status(status === 'ok' ? 200 : 503).json({
    status,
    bot: 'lead-response-bot',
    version: '2.0.0',
    architecture: 'multi-tenant',
    region: process.env.VERCEL_REGION || 'unknown',
    env: process.env.NODE_ENV || 'unknown',
    redis_ok: redisOk,
    broker_count: brokerCount,
    active_brokers: activeBrokers,
    missing_env_vars: missing,
    timestamp: new Date().toISOString(),
  });
}
