// ============================================================
// scripts/list-brokers.js
//
// List all brokers in Redis. Use for ops, billing, audit.
//
// USAGE:
//   node scripts/list-brokers.js
// ============================================================

import 'dotenv/config';
import { listBrokerIds, getBroker } from '../lib/broker.js';

async function main() {
  const ids = await listBrokerIds();

  if (ids.length === 0) {
    console.log('No brokers found in Redis.');
    console.log('Run: node scripts/seed-broker.js to add one.');
    return;
  }

  console.log(`Found ${ids.length} broker(s):\n`);

  for (const id of ids) {
    const b = await getBroker(id);
    if (!b) {
      console.log(`  ${id}  (inactive or missing)`);
      continue;
    }
    console.log(`  ${id}`);
    console.log(`    Name:        ${b.name}`);
    console.log(`    Email:       ${b.email}`);
    console.log(`    Calendar:    ${b.calendar_url}`);
    console.log(`    Daily cap:   ${b.daily_cap}`);
    console.log(`    Active:      ${b.active}`);
    console.log(`    Created:     ${b.createdAt}`);
    console.log('');
  }
}

main();
