# Migration: v1 (single-tenant) → v2 (multi-tenant)

**Status:** Code refactored, ready to commit + deploy
**Date:** 2026-06-24
**Why:** Reviewer caught architectural debt — env-var-per-broker doesn't scale past 1 client. Also fixes A2P 10DLC EIN problem by delegating to clients.

---

## TL;DR — what changed

1. **Broker config moved from Vercel env vars → Redis JSON.** Each broker has their own entry. No redeploys to add/remove brokers.
2. **Each broker uses their OWN Twilio account.** Their credentials stored in Redis. Solves A2P 10DLC EIN problem (you have no US EIN, they do).
3. **`/api/lead` requires `broker_id` + `consent_checked: true`.** Prevents accidental TCPA violations.
4. **`/api/sms-reply` looks up broker by inbound `To` number.** No env var change ever needed for new brokers.

---

## What you need to do tomorrow (in order)

### Step 1 — Install dotenv (1 min)

Open terminal in the project folder:

```bash
cd C:\Users\BATUR\OneDrive\Masaüstü\lead-response-bot
npm install
```

(This installs the new `dotenv` dependency for the seed scripts.)

### Step 2 — Local .env file for seed script (2 min)

Create or update `.env` in the project root (NOT `.env.example`):

```
TWILIO_ACCOUNT_SID=AC... (your current value from Vercel)
TWILIO_AUTH_TOKEN=...    (your current value from Vercel)
UPSTASH_REDIS_REST_URL=https://...    (your current value)
UPSTASH_REDIS_REST_TOKEN=...           (your current value)
```

The seed script reads these to bootstrap "Iseri Demo HVAC" as broker #1 in Redis.

**This file is git-ignored.** Don't commit it.

### Step 3 — Seed the demo broker into Redis (1 min)

```bash
node scripts/seed-broker.js
```

Expected output:
```
Seeding broker into Redis...
  ID (phone): +15673131045
  Name:       Iseri Demo HVAC
  Active:     true

✅ Broker saved successfully:
   Redis key: broker:+15673131045
   ...
```

Now your existing Twilio number (+15673131045) is registered as broker #1 in Redis. Bot will work with it.

### Step 4 — Verify with list-brokers (30 sec)

```bash
node scripts/list-brokers.js
```

Should show 1 broker (Iseri Demo HVAC).

### Step 5 — Commit + push (1 min)

Open GitHub Desktop. You should see ~10 changed files:
- `api/lead.js` (refactored)
- `api/sms-reply.js` (refactored)
- `api/health.js` (refactored)
- `lib/broker.js` (NEW)
- `lib/openai.js` (refactored)
- `lib/twilio.js` (refactored)
- `lib/compliance.js` (small change)
- `scripts/seed-broker.js` (NEW)
- `scripts/list-brokers.js` (NEW)
- `package.json` (added dotenv)
- `MIGRATION-V2-MULTITENANT.md` (NEW — this file)

Commit message:
```
v2: multi-tenant architecture + consent validation + A2P delegation
```

Push origin.

### Step 6 — Vercel auto-redeploys (60-90 sec)

Watch Vercel dashboard. Should show "Ready" within 90 seconds.

### Step 7 — Health check (30 sec)

Open: `https://lead-response-bot.vercel.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "bot": "lead-response-bot",
  "version": "2.0.0",
  "architecture": "multi-tenant",
  "redis_ok": true,
  "broker_count": 1,
  "active_brokers": 1,
  "missing_env_vars": [],
  ...
}
```

If `broker_count: 0` → Step 3 didn't run successfully. Re-run.
If `redis_ok: false` → Redis credentials problem.
If `status: misconfigured` → check `missing_env_vars` array.

### Step 8 — Remove now-unused env vars from Vercel (optional, 2 min)

In Vercel → Settings → Environment Variables, you can DELETE these (they're no longer used by the bot):
- `BROKER_NAME`
- `BROKER_EMAIL`
- `BROKER_CALENDAR_URL`
- `TWILIO_PHONE_NUMBER` (now per-broker in Redis)
- `TWILIO_ACCOUNT_SID` (now per-broker in Redis)
- `TWILIO_AUTH_TOKEN` (now per-broker in Redis)

**KEEP these:**
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `LEAD_WEBHOOK_SECRET`
- `NODE_ENV`

(Skipping this step is fine — unused env vars don't break anything.)

---

## New /api/lead request format

Brokers' websites must now POST with this body:

```json
{
  "broker_id": "+15673131045",
  "consent_checked": true,
  "name": "John Smith",
  "phone": "+15125551234",
  "city": "Austin",
  "property": "house",
  "email": "john@example.com",
  "consent_text": "I agree to receive SMS messages from Iseri Demo HVAC. Consent is not a condition of purchase. Reply STOP to opt out.",
  "consent_url": "https://broker.com/contact",
  "consent_ip": "1.2.3.4",
  "consent_ts": "2026-06-25T10:00:00Z"
}
```

**REQUIRED fields:**
- `broker_id` — broker's Twilio phone in E.164
- `name`, `phone` — lead identity
- `consent_checked: true` — boolean, MUST be exactly `true`

**Failure modes:**
- Missing `broker_id` → 400 "Missing broker_id"
- `broker_id` not in Redis → 404 "Broker not found or inactive"
- `consent_checked` not `true` → 400 "Consent verification required"
- Non-US phone → 400 "Invalid US phone format"
- Daily cap hit → 429 with detail

---

## How to onboard a NEW broker (post-migration)

### Phase A: Pre-screen (1-2 days)
Same as before — 5-point checklist (license, BBB, reviews, court records, fraud check).

### Phase B: DPA signing (3-5 days)
Same hardened DPA + new consent disclosure language ("Consent is not a condition of purchase").

### Phase C: Broker creates their own Twilio account (1 day)
- Broker signs up at console.twilio.com
- Broker submits THEIR EIN for A2P 10DLC Sole Proprietor registration
- Broker buys a phone number
- Broker shares with you: Account SID, Auth Token, Phone Number (E.164)

**Why this matters:**
- You don't have a US EIN — they do
- A2P registration binds business entity to phone number → it's THEIRS, not yours
- If broker runs a dirty list, only THEIR Twilio gets banned (not your master account)
- Legally segregates liability cleanly

### Phase D: You seed broker into Redis (5 min)
Edit `scripts/seed-broker.js`:
```js
const BROKER = {
  twilio_phone_number: '+1XXXXXXXXXX',   // their number
  name: 'Acme HVAC',
  email: 'owner@acme.com',
  calendar_url: 'https://calendly.com/acme/free-estimate',
  twilio_account_sid: 'AC...',           // their SID
  twilio_auth_token: '...',              // their token
  daily_cap: 200,
  service_area_city: 'Phoenix, AZ',
  service_types: 'HVAC + Roofing',
  active: true,
};
```

Run: `node scripts/seed-broker.js`

### Phase E: Configure their form
Their lead form posts to: `https://lead-response-bot.vercel.app/api/lead`
With body including their `broker_id` (= their Twilio phone).

### Phase F: Configure their Twilio webhook
In broker's Twilio Console:
- Phone Number → Messaging webhook
- URL: `https://lead-response-bot.vercel.app/api/sms-reply`
- Method: POST

### Phase G: Go live + monitor
Same as before.

---

## What I did NOT do (you may need to)

1. **Upstash Pay-As-You-Go upgrade** — Wait until first paid client. ~$40/mo.
2. **Form template with new consent disclosure** — Need to give brokers a copy-paste form snippet. Add to HVAC-PLAYBOOK.md when you wake up.
3. **End-to-end test with new code** — Bot is multi-tenant ready but un-tested with real Twilio webhooks. Test before first real broker.
4. **README update** — Old README references env vars for broker. Update when fresh.

---

## Sanity checklist before sleeping

- [ ] All files saved (you don't need to do anything — already saved)
- [ ] Tomorrow morning: open this file first
- [ ] Run npm install, then seed-broker, then list-brokers
- [ ] Commit + push
- [ ] Verify health endpoint shows `broker_count: 1, active_brokers: 1`

If anything errors at health check tomorrow, screenshot it and tell me. We debug from there.

---

## Why this matters (one-liner)

Old code: 1 client max ever. New code: 1000 clients possible, each with their own Twilio account so you don't get banned + each with proper A2P 10DLC registration under THEIR EIN.

Good night. 💤
