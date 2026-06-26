# HVAC Playbook — Addendum v2

**Date added:** 2026-06-24
**Reason:** Incorporating reviewer feedback. Updates supersede same-named sections in HVAC-PLAYBOOK.md.

---

## §8.5 — Performance Pilot Pricing (REPLACES §8 setup fee waiver)

**Why this change:**
"$1,500/month retainer + waived setup fee" still triggers prospect's "what if it doesn't work" defense. Performance Pilot removes that defense entirely.

### New offer for first 3 clients:

> "I'll hook this up for 14 days completely free. You only cover the actual Twilio + OpenAI usage costs, which run about $20 total. If the bot books a real HVAC install OR a roof replacement that would have been missed because it came in after-hours — we flip to the standard $1,500/month contract from day 15. If it doesn't, we walk away clean. Fair?"

### Why this works:
- Zero perceived risk from prospect's side
- Outcome-based proof (not "trust me, it works")
- Filters out brokers who don't actually have inbound lead flow
- Converts the discovery call from "sales" to "exploration"

### Operational requirements:
1. Document the 14-day pilot terms in a 1-page agreement (NOT the full DPA — that comes when they flip to paid)
2. Track in `pilot_started_at` and `pilot_outcome` fields on broker config in Redis
3. Day 14 calendar reminder to call broker for conversion decision

### Pricing tiers AFTER pilot (unchanged):
- **Starter:** $1,500/mo — 200 leads/mo
- **Pro:** $2,500/mo — 500 leads/mo, custom prompts, weekly KPI report
- **Premium:** $3,500/mo — unlimited leads, Slack ops channel

---

## §6.6 — Updated Consent Disclosure Language (REPLACES §6.6 / Phase C requirement)

**Why this change:**
TCPA "prior express written consent" requires the disclosure to explicitly state "Consent is not a condition of purchase." Without this exact phrase, the consent is NOT legally valid prior express written consent — and the very first SMS our bot sends becomes a TCPA violation.

### MANDATORY checkbox label on every broker's lead form:

```
☐ I agree to receive SMS messages from [BROKER NAME] about my service 
   inquiry. Consent is not a condition of purchase. Reply STOP to opt out. 
   Msg & data rates may apply.
```

**Three non-negotiable elements:**
1. Specific broker name (not "us" or "the company")
2. **"Consent is not a condition of purchase"** — verbatim
3. STOP keyword info + rate disclosure

### Broker's form MUST also:
- Default the checkbox to UNCHECKED (TCPA requires affirmative opt-in)
- Block submission if unchecked (no "skip this step" option)
- Send `consent_checked: true` (boolean) in the POST body to `/api/lead`
- Send `consent_text` (the exact label above) in the POST body

### Bot enforcement:
`/api/lead` now rejects any submission where `consent_checked !== true`. This protects you against brokers who try to bypass the checkbox.

### DPA addition:
Add to broker's DPA (new section 4.g):
> **4.g. Consent Disclosure Language.** Broker warrants that Broker's lead intake form requires consumers to affirmatively check a non-pre-checked box adjacent to the following disclosure (or substantially identical language):
>
> *"I agree to receive SMS messages from [Broker Name] about my service inquiry. Consent is not a condition of purchase. Reply STOP to opt out. Msg & data rates may apply."*
>
> Broker further warrants that Broker's form will not submit the lead to Processor's API without the consumer having affirmatively checked the consent box.

---

## §A2P — Updated A2P 10DLC Strategy (REPLACES §5)

**Why this change:**
You (Batur) are in Turkey with no US EIN. Sole Proprietor A2P 10DLC registration requires a US EIN tied to a US business entity. Running multiple brokers under YOUR master Twilio account also means: one dirty broker = all your brokers banned.

### New onboarding model: BROKER OWNS THEIR TWILIO ACCOUNT

Each HVAC contractor must:
1. Sign up for their own Twilio account (using THEIR EIN)
2. Submit A2P 10DLC Sole Proprietor registration under THEIR business
3. Purchase a phone number in their Twilio account
4. Share with Iseri Agency: `Account SID`, `Auth Token`, `Phone Number (E.164)`

Iseri Agency:
1. Stores broker's Twilio credentials in Redis (encrypted at rest)
2. Configures broker's webhook to point at `https://lead-response-bot.vercel.app/api/sms-reply`
3. Operates the bot — but every SMS goes through the BROKER's Twilio account, not ours

### Pros:
- Solves your no-EIN problem
- Legally segregates liability (broker's compliance is broker's responsibility per DPA)
- Bad broker → only THEIR Twilio gets banned, not the whole agency
- A2P 10DLC fees are broker's cost, not yours
- Twilio billing flows direct to broker (you don't front their SMS costs)

### Cons:
- Onboarding adds 2-3 days for broker to set up Twilio + A2P registration
- Some brokers will need hand-holding through the Twilio signup
- Slightly more complex sales pitch ("we run the bot, you own the infrastructure")

### Updated Phase D (broker onboarding flow):

**Phase D — Twilio Setup (replaces old "webhook wiring" step)**
- [ ] Broker creates Twilio account at console.twilio.com
- [ ] Broker submits A2P 10DLC Brand registration ($4, ~10 days)
- [ ] Broker creates A2P 10DLC Campaign with use case "Customer Care"
- [ ] Sample messages (copy-paste for broker):
  - "Hi [Name], AI assistant for [Broker] about your service request in [City]. Is this an emergency or planned service? Reply STOP to opt out."
  - "Got it. What's the property type — single-family, condo, or commercial?"
  - "Thanks. Want to grab a free estimate? Pick a time: [calendly link]"
- [ ] Broker purchases phone number
- [ ] Broker shares: Account SID + Auth Token + Phone Number
- [ ] You: edit `scripts/seed-broker.js` with broker config + run it
- [ ] You: provide broker the webhook URL: `https://lead-response-bot.vercel.app/api/sms-reply`
- [ ] Broker configures their phone number to use that webhook (Messaging → A MESSAGE COMES IN)
- [ ] Test E2E with one lead submission

---

## §9.7 — Upstash Upgrade Trigger

**Free tier limit:** 10,000 commands/day.
**Math:** Each SMS conversation ≈ 15-20 Redis commands. 10 active brokers × moderate traffic = 5K-15K commands/day. Hits cap.

**Action:** The moment broker #1 signs the paid contract (post-pilot), upgrade Upstash to Pay-As-You-Go ($40/mo or thereabouts).

Add to monthly fixed costs: $40 (Upstash PAYG).

---

## §X.1 — Twilio Signature Validation Note

The signature validator now uses the **broker's** auth token (not env var) since each broker has their own Twilio. The current implementation passes the parsed body object — Twilio's validator canonicalizes by sorting, so parsed body works.

**Monitor:** First production webhook from broker. If you see 403 errors, switch to raw-body approach (requires Vercel runtime config tweak).

---

## End of Addendum
