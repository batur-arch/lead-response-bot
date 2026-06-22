// ============================================================
// GET /api/health
// Health-check endpoint. Verifies env vars are set and
// the bot can be reached. No external API calls — just config check.
// ============================================================

export const config = {
  runtime: 'nodejs',
  regions: ['iad1'],
};

export default async function handler(req, res) {
  const required = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'OPENAI_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'BROKER_NAME',
    'LEAD_WEBHOOK_SECRET',
  ];

  const missing = required.filter((k) => !process.env[k]);

  // Compute basic info without leaking secrets
  const status = missing.length === 0 ? 'ok' : 'misconfigured';

  return res.status(missing.length === 0 ? 200 : 503).json({
    status,
    bot: 'lead-response-bot',
    version: '1.0.0',
    region: process.env.VERCEL_REGION || 'unknown',
    env: process.env.NODE_ENV || 'unknown',
    twilio_phone: process.env.TWILIO_PHONE_NUMBER
      ? process.env.TWILIO_PHONE_NUMBER.replace(/\d(?=\d{4})/g, '*')
      : null,
    broker: process.env.BROKER_NAME || null,
    missing_env_vars: missing,
    timestamp: new Date().toISOString(),
  });
}
