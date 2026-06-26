// ============================================================
// scripts/seed-broker.js
//
// Bootstrap a broker into Redis. Use this for:
//   - First broker onboarding (demo or real client)
//   - Adding new brokers in production
//   - Testing locally
//
// USAGE:
//   node scripts/seed-broker.js
//
// You can edit the BROKER object below before running.
// Re-running with the same twilio_phone_number UPDATES the existing config.
// ============================================================

import 'dotenv/config';
import { saveBroker } from '../lib/broker.js';

// ============================================================
// EDIT THIS — broker config to add/update in Redis
// ============================================================

const BROKER = {
  // === REQUIRED ===
  twilio_phone_number: '+15673131045',  // ALSO the broker_id
  name: 'Iseri Demo HVAC',
  email: 'batur@iseriagency.com',
  calendar_url: 'https://calendly.com/batur-iseriagency/30min',

  // === BROKER'S OWN TWILIO CREDENTIALS ===
  // For migration: pull from CURRENT env vars. New brokers create their own Twilio.
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,

  // === CONFIGURATION ===
  daily_cap: 200,
  service_area_city: 'Austin, TX',
  service_types: 'HVAC + Roofing',

  // === STATUS ===
  active: true,

  // === COMPLIANCE METADATA (fill when real broker, optional for demo) ===
  state_license_number: 'DEMO-LICENSE',
  bbb_rating: 'N/A (demo)',
  google_reviews_url: null,
  dpa_signed_date: null,
  consent_disclosure_verified: true,
};

// ============================================================
// EXECUTION
// ============================================================

async function main() {
  console.log('Seeding broker into Redis...');
  console.log('  ID (phone):', BROKER.twilio_phone_number);
  console.log('  Name:      ', BROKER.name);
  console.log('  Active:    ', BROKER.active);

  if (!BROKER.twilio_account_sid || !BROKER.twilio_auth_token) {
    console.error('\n❌ ERROR: Twilio credentials missing.');
    console.error('   Set TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN in .env');
    console.error('   OR hardcode the broker\'s real Twilio creds in this script.');
    process.exit(1);
  }

  try {
    const saved = await saveBroker(BROKER);
    console.log('\n✅ Broker saved successfully:');
    console.log('   Redis key: broker:' + saved.id);
    console.log('   Created:   ', saved.createdAt);
    console.log('   Updated:   ', saved.updatedAt);
    console.log('\nNext: test by submitting a lead to /api/lead with:');
    console.log('   { "broker_id": "' + saved.id + '", ... }');
  } catch (err) {
    console.error('\n❌ Failed to save broker:', err.message);
    process.exit(1);
  }
}

main();
