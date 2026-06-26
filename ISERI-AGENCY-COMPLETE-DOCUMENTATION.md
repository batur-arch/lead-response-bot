# ISERI AGENCY — COMPLETE OPERATIONS & TECHNICAL DOCUMENTATION

**Project:** AI SMS Lead-Response Bot for US HVAC + Roofing Contractors
**Founder:** Batur Iseri
**Brand:** Iseri Agency (operating independently, LLC pending)
**Documentation date:** 2026-06-24
**Bot status:** Deployed to production, awaiting first paid client
**Doc maintained by:** Batur — update after every major change

---

## TABLE OF CONTENTS

1. Executive Summary
2. Business Identity & Founder Profile
3. Niche Selection Journey (Why HVAC)
4. Complete Tech Stack & Service Inventory
5. Environment Variables Reference
6. System Architecture
7. Code Structure (File-by-File)
8. Bot Operational Flows
9. Compliance Framework (5-Layer Legal Defense)
10. v2 Hardening Patterns
11. Setup Sequence Log (Chronological)
12. Deployment Pipeline
13. Cost Structure (Per Month, Per Client)
14. Pricing & Packaging Tiers
15. Sales Funnel End-to-End
16. Cold Email Strategy (Smartlead)
17. Apollo ICP & Lead Pull Filters
18. Loom Demo Script (90 seconds)
19. Discovery Call Playbook (15 minutes)
20. Onboarding Workflow Per Broker
21. Operations Cadence (Daily / Weekly / Monthly / Quarterly)
22. Risk Management & Mitigations
23. Growth Roadmap (Year 1, Year 2, Year 3)
24. Decisions Log (Why X Over Y)
25. KPIs & Metrics to Track
26. Tools & Accounts Reference Index
27. Upwork Setup (Parallel Cash Channel)
28. Twitter/X Closer Outreach (Pending)
29. Glossary of Terms
30. Open Tasks & Next Actions

---

## 1. EXECUTIVE SUMMARY

Iseri Agency builds and operates AI-powered SMS lead-response bots for US HVAC and Roofing contractors. The bot responds to inbound form submissions within 5-10 seconds, qualifies leads through multi-turn SMS conversation, and books them on the contractor's Calendly — all while staying TCPA + state mini-TCPA + California SB 243 compliant.

**Revenue model:** Monthly subscription per broker ($1,500-$3,500/month tier-based)
**Target margin:** 92-95% net (Twilio + OpenAI variable costs ~$15-90/month per broker)
**Current state:** Bot deployed and live in production. Sales channel infrastructure in setup.
**12-month revenue target (median scenario):** $26-32K MRR exiting Year 1

---

## 2. BUSINESS IDENTITY & FOUNDER PROFILE

### Brand
- **Company name:** Iseri Agency
- **Tagline:** "Production AI for businesses that need it yesterday"
- **Founder:** Batur Iseri
- **Location:** İzmit, Kocaeli, Turkey
- **Time zone:** GMT+3 (Istanbul)
- **Domain:** iseriagency.com (Namecheap, expires Jun 20, 2027, auto-renew ON, WHOIS privacy ON)
- **Primary email:** batur@iseriagency.com (Google Workspace)
- **Recovery email:** iseri.b17@gmail.com
- **Legal structure:** Not incorporated (operating as sole prop / independent contractor). Wyoming LLC planned for Month 2-3.

### Founder Background
- Age: 20 (turning 21 in September 2026)
- DOB: 2005-09-17
- Languages: Turkish (native), English (near-fluent), Japanese (basic, learning)
- Education: Starting Bachelor's in International Business at Temple University Japan Campus (Tokyo) — September 2026
- Other projects:
  - **Jarvis** (Python voice assistant: wake word + Whisper STT + OpenAI GPT + ElevenLabs TTS)
  - **Day-trading AI experiment** (personal, not for client use)
  - **Cosmic Conatus framework** (speculative physics, side intellectual pursuit)
- Cash motivation: contributing to dad for Tokyo tuition + living expenses

### Brand Voice
- Direct, opinionated, not corporate-speak
- Engineering-led credibility
- "I tell you when something's a bad idea before you pay me to build it"
- Avoids: AI-generated buzzwords, em-dashes used in lists, ChatGPT cadence, generic motivational language

---

## 3. NICHE SELECTION JOURNEY (WHY HVAC)

### Initial concept
Real estate broker lead response bot. Investigated for ~1 week.

### Pivot research
7 web searches comparing niches scoring on 6 dimensions (urgency, pricing tolerance, compliance complexity, market size, competition, scale-ability).

| Niche | Score | Notes |
|-------|-------|-------|
| Real Estate | 41/60 | Saturated, slow sales cycles, Fair Housing complications |
| **HVAC + Roofing** | **52/60** | **Selected — emergency urgency, less competition, simpler scope** |
| Med Spa | 38/60 | High churn, HIPAA-adjacent, cosmetic = lower urgency |
| Auto Dealers | 35/60 | Established competitors (Drift, etc.) |
| Legal Services | 32/60 | Bar association ethics rules complicate |
| Dental | 30/60 | Practice management software locks in |

### Why HVAC won
- High emergency factor (no AC / no heat = lead converts within hours)
- Fragmented market (50,000+ US contractors, no dominant brand)
- Average contractor is technical-blind (high willingness-to-pay for "set and forget" AI)
- Storm-season surges create urgency for automation
- Less saturated than real estate
- No Fair Housing complications
- Climate change creates 5-10 year tailwind

### Geographic focus
**Included states (first 6 months):** TX, AZ, GA, NC, CA, SC, NV, TN, AL
**Excluded states (first 6 months):** FL, OK, WA, MD
**Why excluded:** Strictest mini-TCPAs (8pm cutoff vs federal 9pm, plus 3 SMS/day caps). Risk-to-reward poor in first 6 months.

---

## 4. COMPLETE TECH STACK & SERVICE INVENTORY

### Hosting & Compute
- **Vercel** (vercel.com)
  - Region: `iad1` (US East — Washington DC)
  - Plan: Hobby (free tier)
  - Runtime: Node.js 20.x
  - Functions: 3 serverless (`api/lead.js`, `api/sms-reply.js`, `api/health.js`)
  - Auto-deploys: From GitHub main branch
  - Project name: `lead-response-bot`
  - Production URL: `https://lead-response-bot.vercel.app`

### SMS Provider
- **Twilio** (console.twilio.com)
  - Account: Trial tier (not upgraded yet)
  - Phone number: +1 567 313 1045 (Cardington, OH)
  - SMS webhook: `https://lead-response-bot.vercel.app/api/sms-reply` (POST)
  - 2FA: Enabled (Google Authenticator)
  - A2P 10DLC: **Not yet registered** (10-15 day approval process)
  - Verified Caller IDs: Batur's Turkish number (for testing only)

### AI / LLM
- **OpenAI** (platform.openai.com)
  - Model: `gpt-4o-mini`
  - Reason: Best cost/quality for short SMS responses
  - Cost: ~$5-15/month per active broker
  - Backup option (not active): Anthropic Claude API

### State Storage
- **Upstash Redis** (console.upstash.com)
  - Database name: `lead-response-bot`
  - Region: `us-east-1` (N. Virginia)
  - Type: Regional, Free tier
  - Eviction policy: `noeviction` (don't drop legal records)
  - Free tier limit: 10,000 commands/day
  - HTTP-based API (works in serverless edge functions)

### Version Control
- **GitHub** (github.com)
  - Repo: `batur-arch/lead-response-bot`
  - Branch: `main`
  - Commits:
    - `666f563` — Initial commit (real estate version)
    - `2560566` — HVAC pivot + v2 hardening (current production)
  - Local tool: GitHub Desktop

### Domain & DNS
- **Namecheap** (namecheap.com)
  - Domain: `iseriagency.com`
  - Expires: Jun 20, 2027
  - Auto-renew: ON
  - WhoisGuard: ON (privacy enabled)
  - Nameservers: Namecheap BasicDNS
  - Login username: `ButterTheBread`
  - 2FA: Enabled

### Email Infrastructure
- **Google Workspace** (workspace.google.com)
  - Primary email: `batur@iseriagency.com`
  - SPF / DKIM / DMARC: Configured
  - Used for: client communication, agency outreach, account signups

### Cold Email
- **Smartlead** (smartlead.ai)
  - Status: Account created, warmup pending
  - Plan: Starter ($39/month) sufficient for 1-3 inboxes
  - Need: 5-7 warmed inboxes for 200/day volume
  - Strategy: Warmup 2-3 weeks before sending real volume

### Lead Data
- **Apollo.io** (apollo.io)
  - Status: Account ready
  - Plan: TBD ($49-99/month based on usage)
  - Filters: HVAC ICP defined (see §17)

### Booking
- **Calendly** (calendly.com)
  - Username: `batur-iseriagency`
  - Event URL: `https://calendly.com/batur-iseriagency/30min`
  - Event type: 30-min discovery call
  - Availability: Mon-Fri 16:00-23:00 Turkey time (matches US business hours)
  - Weekends: Disabled (no US contractor books weekend)

### Freelance Marketplace (Parallel Cash Channel)
- **Upwork** (upwork.com)
  - Profile: Batur Iseri — "AI Chatbot Developer | Voice AI, SMS Bots, Workflow Automations"
  - Hourly rate: $45/hr
  - Plan: Freelancer Plus ($9.99 first month, $19.99/mo after — **CANCEL BEFORE JUL 24** unless renewing)
  - Connects: 150 starting balance
  - Portfolio: HVAC SMS Bot (published)
  - Status: Submitted for Upwork manual review (1-24 hour approval)

---

## 5. ENVIRONMENT VARIABLES REFERENCE

All stored in **Vercel → Settings → Environment Variables** (Production + Preview enabled).

| Variable | Purpose | Sensitive? | Where to get |
|----------|---------|------------|--------------|
| `TWILIO_ACCOUNT_SID` | Twilio account identifier | Medium | Twilio Console → Account |
| `TWILIO_AUTH_TOKEN` | Twilio API auth | **Yes** (rotated) | Twilio Console → Account → API keys & tokens |
| `TWILIO_PHONE_NUMBER` | Sender phone in E.164 format | No | Twilio Console → Phone Numbers |
| `OPENAI_API_KEY` | OpenAI API auth | **Yes** (rotated) | platform.openai.com/api-keys |
| `UPSTASH_REDIS_REST_URL` | Redis HTTP endpoint | No | Upstash Console → REST API tab |
| `UPSTASH_REDIS_REST_TOKEN` | Redis API auth | **Yes** | Upstash Console → REST API tab |
| `BROKER_NAME` | Active broker display name in SMS | No | Manually set per client |
| `BROKER_EMAIL` | Active broker contact email | No | Manually set per client |
| `BROKER_CALENDAR_URL` | Active broker Calendly URL | No | Manually set per client |
| `LEAD_WEBHOOK_SECRET` | Auth for inbound form webhook | **Yes** | Generated 32-char random string |
| `NODE_ENV` | Should be `production` | No | Static |

**Sensitive flag in Vercel:** Once set, prevents reading the value back. Must be re-entered if changed.

**Multi-client architecture (future):** Currently single-tenant. To support multiple brokers, refactor to use broker_id in URL path and look up broker config in Redis instead of env vars.

---

## 6. SYSTEM ARCHITECTURE

```
[Broker's website form submission]
        │
        │ POST { name, phone, city, ... }
        │ Header: x-webhook-secret
        ▼
┌──────────────────────────────────────────┐
│  VERCEL — iad1 (US East)                 │
│  ┌────────────────────────────────────┐  │
│  │ api/lead.js                        │  │
│  │  → validate webhook secret         │  │
│  │  → validate name + phone format    │  │
│  │  → idempotency lock (Redis SETNX)  │  │
│  │  → broker daily cap check          │  │
│  │  → save consent record (Redis)     │  │
│  │  → init lead context (Redis)       │  │
│  │  → buildFirstMessage()             │  │
│  │  → sendSms() (compliance-gated)    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ api/sms-reply.js (Twilio webhook)  │  │
│  │  → validate Twilio signature       │  │
│  │  → detect opt-out / opt-in / help  │  │
│  │  → check if already opted out      │  │
│  │  → conversation handoff guard      │  │
│  │  → generateReply() via OpenAI      │  │
│  │  → enforce safety regex            │  │
│  │  → sendSms() (compliance-gated)    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ api/health.js                      │  │
│  │  → returns config status JSON      │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
        │              ▲
        ▼              │
┌────────────────┐  ┌─────────────────┐
│ UPSTASH REDIS  │  │  TWILIO API     │
│ us-east-1      │  │  (US-based)     │
│                │  │                 │
│ Keys:          │  │  Sends outbound │
│ - lead:{phone} │  │  Receives reply │
│ - optout:...   │  │  Signs webhooks │
│ - smscount:... │  └─────────────────┘
│ - consent:...  │           │
│ - lock:lead:.. │           │ inbound SMS
│ - brokerleads  │           ▼
└────────────────┘    [Lead's phone]
                              │ reply
                              ▼
                       Twilio webhook
                              │ POST
                              ▼
                  api/sms-reply.js
```

**Data residency:** ALL data stays in US-East. No flow to Turkey or EU. This is intentional for KVKK and GDPR avoidance — Iseri Agency operates as a US-data-residing processor on behalf of US brokers.

---

## 7. CODE STRUCTURE (File-by-File)

### `/api/lead.js`
- **Method:** POST
- **Auth:** `x-webhook-secret` header required
- **Purpose:** Entry point for new leads from broker website forms
- **Flow:**
  1. Method check (POST only, else 405)
  2. Webhook secret validation (else 401)
  3. Parse JSON body (handles both raw and parsed)
  4. Extract fields: `name`, `phone`, `city`, `property`, `email`, `consent_text`, `consent_url`, `consent_ip`, `consent_ts`
  5. Validate required: phone present, name present
  6. Validate phone E.164 US format via `toE164()`
  7. Validate name (min 2 chars, not numbers-only)
  8. **Idempotency lock:** `acquireSubmissionLock(phone, broker)` — Redis SETNX with 5-min TTL. If duplicate, return 200 with `reason: 'DUPLICATE_SUBMISSION'` (idempotent).
  9. **Broker daily cap:** `isBrokerOverDailyCap(broker)`. If over (default 200/day), return 429.
  10. **Increment broker count:** `incrementBrokerLeadCount(broker)`
  11. **Save consent record:** `saveConsentRecord(phone, {...})` — permanent (no TTL) for legal proof
  12. **Initialize lead context:** merge with existing if resubmitted, set status `qualifying`, 90-day TTL
  13. **Build first message:** `buildFirstMessage(ctx, brokerName)`
  14. **Send via Twilio:** `sendSms(phoneE164, firstMsg)` — passes through compliance gate
  15. Update history if sent
  16. Return JSON: `{ ok, sent, reason, detail, leadPhone }`

### `/api/sms-reply.js`
- **Method:** POST
- **Auth:** Twilio signature validation in production
- **Purpose:** Twilio webhook for inbound SMS replies
- **Body:** Form-encoded (NOT JSON), parsed automatically by Vercel
- **Flow:**
  1. Method check (POST only)
  2. **Signature validation:** `validateTwilioSignature(req)` — production only (dev skipped due to unreliable signing)
  3. Extract `From`, `Body`, `MessageSid`
  4. Normalize phone via `toE164()`
  5. Load or create lead context
  6. **Audit log inbound:** push `newAuditEntry({direction: 'inbound', ...})`
  7. **Detect opt-out / opt-in / help:** `detectOptOut(messageBody)` → `{type, keyword}`
  8. **Case A: opt-out**
     - `markOptOut(phone)` — sets `optout:{phone}=1` permanently
     - Set status `opted_out`
     - Send ONE confirmation message (FCC explicitly allows this)
     - Bypass compliance gate (allowed for opt-out confirmation)
     - Return TwiML empty response
  9. **Case B: opt-in** (e.g. "START")
     - `clearOptOut(phone)`
     - Set status `qualifying`
     - Send welcome-back message
  10. **Case C: help**
     - Send help message with broker contact
  11. **Silent ignore if opted out:** `isOptedOut(phone)` check
  12. **Conversation handoff guard:** `shouldHandoffToBroker(history)` (≥20 messages)
      - Send handoff message with Calendly URL
      - Set status `handoff_to_broker`
      - Stop further bot responses
  13. **Normal AI reply:**
      - Push user message to history
      - Build aiCtx (broker name, calendar URL, city)
      - Cap history at last 12 messages (token cost control)
      - `generateReply(recentHistory, messageBody, aiCtx)` → response text
      - `sendSms(phoneE164, reply)` — gated
  14. Update context, return TwiML

### `/api/health.js`
- **Method:** GET
- **Purpose:** Health check + config validation
- **Returns:**
  ```json
  {
    "status": "ok" | "misconfigured",
    "bot": "lead-response-bot",
    "version": "1.0.0",
    "region": "iad1",
    "env": "production",
    "twilio_phone": "+*******1045",
    "broker": "Iseri Demo HVAC",
    "missing_env_vars": [],
    "timestamp": "2026-06-24T..."
  }
  ```
- Useful for monitoring uptime, config drift detection

### `/lib/openai.js`
- **Exports:** `generateReply(history, lastUserMessage, ctx)`
- **System prompt:** Locked HVAC/Roofing AI assistant persona
- **Required behavior:**
  - Identify as AI assistant for [Broker] (CA SB 243 requirement)
  - Ask about: issue type, urgency, property type, zip code, equipment age, best contact time
  - Stay concise (SMS-length)
  - Offer Calendly link after 3-4 qualifying answers
- **Forbidden behavior:**
  - Never quote prices
  - Never diagnose issues
  - Never recommend brands (Carrier, Trane, Lennox, etc.)
  - Never give DIY advice
  - Never give warranty/legal/tax/mortgage advice
- **Safety regex patterns (11 total):**
  ```js
  const forbiddenPatterns = [
    /\$[\d,]+/,                                                    // dollar amounts
    /\bcost(s|ing)?\s+(around|about|approximately)/,               // cost language
    /\bestimat(e|ed|ing)\s+(is|cost|price|around)/,                // estimates
    /\babout\s+\$/,                                                // "about $X"
    /\breplace\s+(the|your)\s+(compressor|condenser|coil|furnace|capacitor|thermostat|shingle|underlayment)/,
    /\bdiy|do it yourself/,                                        // DIY suggestions
    /\b(turn off|shut off|reset)\s+the\s+(breaker|valve|gas)/,     // dangerous DIY
    /\b(carrier|trane|lennox|york|rheem|goodman|gaf|owens corning|certainteed)\b/i,  // brand recs
    /\bwarrant(y|ies)\s+(covers?|include|exclude)/,                // warranty advice
    // + 2 more
  ];
  ```
- **If regex matches:** Substitute a safe response like "I can't quote that — our technician will give you a proper estimate. Want to book a free assessment?"
- **Model:** `gpt-4o-mini`
- **Max tokens:** Small (SMS-sized output)
- **Temperature:** Low (consistent, predictable responses)

### `/lib/compliance.js`
- **Exports:**
  - `detectOptOut(messageBody)` → `{type, keyword}` (types: `optout`, `optin`, `help`, `none`)
  - `buildOptOutConfirmation(brokerName)` → string
  - `buildHelpMessage(brokerName, brokerEmail)` → string
  - `buildFirstMessage(ctx, brokerName)` → string
  - `newAuditEntry({direction, body, status, reason, meta})` → object
  - `canSendNow(phone, brokerName)` → boolean (checks quiet hours, daily caps, opt-out)
- **First message template (HVAC):**
  > "Hi {firstName}, AI assistant for {broker} here about your {service} request in {city}. Quick question — is this an emergency (no AC / leak / no heat) or planned service? Reply STOP to unsubscribe."
- **Opt-out keywords:** STOP, CANCEL, END, QUIT, UNSUBSCRIBE, STOPALL, REVOKE, OPTOUT
- **Opt-in keywords:** START, YES, SUBSCRIBE, UNSTOP
- **Help keywords:** HELP, INFO, SUPPORT

### `/lib/redis.js`
- Singleton Upstash Redis client
- **Key naming convention:**
  - `lead:{phoneE164}` — lead context JSON, 90-day TTL
  - `optout:{phoneE164}` — "1", no TTL (permanent)
  - `optout_at:{phoneE164}` — ISO timestamp of opt-out
  - `smscount:{phoneE164}:{YYYYMMDD}` — integer, 30-hour TTL
  - `consent:{phoneE164}` — consent record JSON, no TTL (legal proof)
  - `lock:lead:{broker}:{phoneE164}` — "1", 5-min TTL (idempotency)
  - `brokerleads:{broker}:{YYYYMMDD}` — integer, 30-hour TTL (rate limiting)
- **Exports:**
  - `saveLeadContext(phone, ctx)` / `getLeadContext(phone)`
  - `markOptOut(phone)` / `clearOptOut(phone)` / `isOptedOut(phone)`
  - `incrementDailyCount(phone)` / `getDailyCount(phone)`
  - `saveConsentRecord(phone, record)` / `getConsentRecord(phone)`
  - `acquireSubmissionLock(phone, broker)` → atomic SET NX EX
  - `incrementBrokerLeadCount(broker)` / `isBrokerOverDailyCap(broker, cap)`
  - `shouldHandoffToBroker(history)` → boolean (history.length ≥ 20)
- **Constants:**
  - `TTL_LEAD_DAYS = 90`
  - `TTL_SMSCOUNT_HOURS = 30`
  - `DEFAULT_BROKER_DAILY_CAP = 200`
  - `MAX_MESSAGES_BEFORE_HANDOFF = 20`

### `/lib/twilio.js`
- **Exports:**
  - `sendSms(toPhone, body)` → `{sent, reason, detail}`
    - Passes through `canSendNow()` gate first
    - If gate fails, returns block reason (QUIET_HOURS, DAILY_CAP_HIT, OPTED_OUT, BROKER_OFFLINE)
    - If gate passes, actually sends via Twilio Programmable Messaging API
    - Increments daily count on success
  - `validateTwilioSignature(req)` → boolean
    - Uses `TWILIO_AUTH_TOKEN`
    - Verifies `X-Twilio-Signature` header
    - Prevents webhook spoofing
- **Block reasons enum:**
  - `QUIET_HOURS` — outside 8am-9pm federal or 8am-8pm state-strict
  - `DAILY_CAP_HIT` — 3 SMS/day cap for FL/OK/WA/MD reached
  - `OPTED_OUT` — recipient previously opted out
  - `BROKER_OFFLINE` — broker disabled via config

### `/lib/timezone.js`
- **Exports:** `quietHourCheck(stateCode, currentTime)` → boolean
- **Federal TCPA:** 8am - 9pm local recipient time
- **State strict** (FL, OK, WA, MD): 8am - 8pm local recipient time
- **Plus daily SMS cap:** 3 messages/day per recipient in strict states
- Uses IANA timezone database for accurate DST handling

### `/lib/areacodes.js`
- **Exports:**
  - `toE164(phone)` → "+1XXXXXXXXXX" or null
  - `getStateFromPhone(phone)` → "TX" or null
  - `getTimezoneFromPhone(phone)` → "America/Chicago" or null
- US area code (NPA) → state mapping
- US area code → IANA timezone mapping
- Returns null for non-US, Mexican (+52), Canadian (+1 but not US area code), or invalid

### `/package.json`
```json
{
  "name": "lead-response-bot",
  "type": "module",
  "engines": { "node": ">=20.x" },
  "dependencies": {
    "@upstash/redis": "^1.x",
    "openai": "^4.x",
    "twilio": "^5.x"
  }
}
```

### `/vercel.json`
```json
{
  "regions": ["iad1"],
  "functions": {
    "api/*.js": { "runtime": "nodejs20.x" }
  }
}
```

### `/.env.example`
- Template file with all env vars as placeholders (e.g. `OPENAI_API_KEY=sk-proj-your_key_here`)
- Comments explain each variable
- Safe to commit to git (no real secrets)

### `/.gitignore`
```
.env
.env.local
.env.*.local
node_modules/
.vercel
```

### `/README.md`
- Project overview
- Architecture diagram
- 15-min setup guide
- Onboarding checklist
- Compliance features matrix
- Pricing tiers
- Maintenance notes

### `/HVAC-PLAYBOOK.md` (801 lines)
- §1: Apollo ICP and filters
- §2: Cold email 3-mail sequence with A/B subject lines
- §3: 90-second Loom script
- §4: 15-min discovery call script with 5 objection handles
- §5: A2P 10DLC submission text (Customer Care category)
- §6: Hardened DPA template (full text, 9 clauses)
- §6.5: Broker pre-screen 5-point checklist
- §7: Per-broker onboarding checklist (Phase A-E)
- §8: Pricing tiers detail
- §9: KPIs to track
- §9.5: E&O Insurance setup (Hiscox process)
- §9.6: Quarterly Self-Audit 15-item checklist
- §10: 30-day post-launch SOP

---

## 8. BOT OPERATIONAL FLOWS

### Flow A: New lead from broker's form
1. Homeowner fills HVAC contractor's contact form
2. Broker website backend POSTs to `https://lead-response-bot.vercel.app/api/lead` with `x-webhook-secret` header
3. Bot validates secret → returns 401 if wrong
4. Bot checks idempotency (Redis SETNX 5-min lock per phone+broker)
5. Bot checks broker daily cap (default 200/day)
6. Bot saves consent record permanently in Redis (TCPA legal proof)
7. Bot initializes lead context (90-day TTL)
8. Bot generates first SMS (template above)
9. Bot sends via Twilio (compliance gate checks: quiet hours? state SMS cap?)
10. Lead receives SMS in 5-10 seconds

### Flow B: Lead replies
1. Lead sends SMS to broker's Twilio number
2. Twilio receives → POSTs to `https://lead-response-bot.vercel.app/api/sms-reply`
3. Bot validates Twilio signature (production)
4. Bot logs inbound to audit array in Redis
5. Bot checks keyword: STOP / HELP / START → handles appropriately
6. If normal reply: OpenAI generates next qualifying question
7. Safety regex enforced (no prices, no diagnosis, no brand recs)
8. Reply sent via Twilio (gated)
9. Conversation continues until enough info → offers Calendly link

### Flow C: Opt-out (TCPA-mandated)
1. Lead replies STOP / CANCEL / END / QUIT / UNSUBSCRIBE / STOPALL / REVOKE
2. Bot marks `optout:{phone}=1` permanently in Redis
3. Bot records `optout_at:{phone}=ISO_TIMESTAMP`
4. Bot sends ONE confirmation message (FCC explicitly allows this single follow-up)
5. All future attempts to message this phone return `OPTED_OUT` reason and don't send

### Flow D: Help request
1. Lead replies HELP / INFO
2. Bot sends help message with broker email and emergency line
3. Audit logged

### Flow E: Conversation handoff
1. History reaches 20 messages
2. `shouldHandoffToBroker()` returns true
3. Bot sends final message: "Thanks for the detail. Let me have a [Broker] agent reach out directly — pick a time that works: [Calendly URL]"
4. Status set to `handoff_to_broker`
5. Bot stops responding (any further inbound is logged but not replied)

### Flow F: Health check (monitoring)
1. GET `https://lead-response-bot.vercel.app/api/health`
2. Returns JSON with `status: "ok"`, env presence, region, etc.
3. Can be polled by uptime monitor (UptimeRobot, BetterUptime) for SLA tracking

---

## 9. COMPLIANCE FRAMEWORK (5-LAYER LEGAL DEFENSE)

### Layer 1: State Exclusion (First 6 Months)
- Apollo lead pull **EXCLUDES**: Florida, Oklahoma, Washington, Maryland
- **Why:** These states have stricter mini-TCPAs (8pm cutoff vs federal 9pm, plus 3 SMS/day caps)
- **After Month 6:** Re-evaluate with legal counsel for cautious re-entry

### Layer 2: E&O Insurance (Month 2)
- **Provider:** Hiscox (hiscox.com/small-business-insurance)
- **Cost:** ~$500/year
- **Activation:** When first paid client signs
- **Coverage:** Errors & Omissions for technology services
- **Includes:** Defense costs, settlement, regulatory action defense

### Layer 3: Broker Pre-Screen (Per Client, MANDATORY)
- **5-point checklist** before any broker can sign:
  1. **State contractor license active** — verified at state board (e.g. TX: tdlr.texas.gov)
  2. **BBB rating A or A+** with <5 unresolved complaints
  3. **Google reviews ≥4.0 stars, 20+ reviews**
  4. **No active consumer fraud / TCPA lawsuits** — search PACER ($0.10/page) + state court records
  5. **No insurance fraud / storm chasing / AOB abuse complaints**
- **If ANY fail:** DO NOT proceed. Refund any deposit. Document why declined.

### Layer 4: Hardened DPA (Data Processing Agreement)
- Required signed before bot goes live for any broker
- Key clauses (full template in HVAC-PLAYBOOK.md §6):
  - **4.d** — License maintenance: Broker warrants license remains active
  - **4.f** — Insurance fraud / deceptive practice prohibition
  - **9.a-c** — Mutual indemnification clauses
  - Broker = Data Controller, Iseri Agency = Data Processor
  - 90-day data retention
  - US data residency required
  - Consent metadata required per lead (consent_text, consent_url, consent_ip, consent_ts)
- Files in `/clients/[brokerName]/dpa-signed.pdf`

### Layer 5: Quarterly Self-Audit
- 15-item checklist run every 3 months (HVAC-PLAYBOOK.md §9.6)
- Items include:
  - Verify all active brokers still licensed
  - Review opt-out compliance rate (must be 100%)
  - Review daily cap violations (should be 0)
  - Review AI safety regex hits (track frequency, refine if increasing)
  - Review handoff frequency
  - Review average conversation length
  - Review delivery failure rate
  - Verify A2P 10DLC campaign status
  - Verify Twilio account health
  - Verify E&O insurance current
  - Review broker DPA renewal dates
  - Verify domain auto-renew
  - Verify env var rotation schedule
  - Verify backup credentials accessible
  - Verify quarterly tax filings current
- Documented in audit log

### Honest Risk Assessment
- **Pre-mitigation Year 1 catastrophic risk:** ~15-25%
- **Post-5-layer mitigation Year 1 catastrophic risk:** ~3-8%
- The earlier "35→4" framing was hype. Actual numbers above are conservative honest estimates.
- **Action that further reduces risk:** Lawyer consultation ($500-1500) before launch — recommended Month 2

---

## 10. v2 HARDENING PATTERNS

### Pattern 1: Idempotency Lock
```js
export async function acquireSubmissionLock(phone, broker) {
  const r = getRedis();
  const key = `lock:lead:${broker}:${phone}`;
  const result = await r.set(key, '1', { nx: true, ex: 300 });
  return result === 'OK';
}
```
- Atomic SET if Not eXists with 5-minute TTL
- Prevents: duplicate form submissions, double-clicks, network retry storms
- Returns false on duplicate → bot returns 200 OK with `reason: 'DUPLICATE_SUBMISSION'` (idempotent behavior)

### Pattern 2: Broker Daily Cap
```js
const DEFAULT_BROKER_DAILY_CAP = 200;

export async function incrementBrokerLeadCount(broker) {
  const r = getRedis();
  const key = `brokerleads:${broker}:${todayKey()}`;
  const newVal = await r.incr(key);
  if (newVal === 1) await r.expire(key, 30 * 3600);
  return newVal;
}

export async function isBrokerOverDailyCap(broker, cap = DEFAULT_BROKER_DAILY_CAP) {
  const r = getRedis();
  const v = await r.get(`brokerleads:${broker}:${todayKey()}`);
  const count = parseInt(v ?? 0, 10);
  return { over: count >= cap, count, cap };
}
```
- Per-broker daily lead ceiling (default 200)
- Configurable per broker via override (future feature)
- Prevents: cost explosions from bugs, attacks, storm season surges
- Returns 429 to broker with clear reason

### Pattern 3: Conversation Handoff Guard
```js
const MAX_MESSAGES_BEFORE_HANDOFF = 20;

export function shouldHandoffToBroker(history) {
  return Array.isArray(history) && history.length >= MAX_MESSAGES_BEFORE_HANDOFF;
}
```
- After 20 message exchanges, bot stops responding
- Sends handoff message with broker Calendly URL
- Status set to `handoff_to_broker`
- Prevents: infinite conversation costs, never-ending bot loops, frustrated leads

### Pattern 4: Field Validation
- Name: minimum 2 characters, cannot be numbers-only
- Phone: must pass `toE164()` US format validation
- Email: optional but validated if present
- Prevents: spam submissions, fake leads, test data leakage

### Pattern 5: Twilio Signature Validation
- All inbound webhook requests verified via Twilio's signature scheme
- Uses `TWILIO_AUTH_TOKEN` + request URL + form params
- Prevents: webhook spoofing, fake conversation injection
- Skipped only in dev (`NODE_ENV !== 'production'`)

---

## 11. SETUP SEQUENCE LOG

| # | Action | Date | Status |
|---|--------|------|--------|
| 1 | Niche selection research | Day 1 | ✓ |
| 2 | Domain purchase: iseriagency.com | Day 1 | ✓ |
| 3 | Google Workspace setup | Day 1-2 | ✓ |
| 4 | SPF/DKIM/DMARC DNS configuration | Day 2 | ✓ |
| 5 | Smartlead account creation | Day 3 | ✓ |
| 6 | Twilio account + phone purchase (+1 567 313 1045) | Day 4 | ✓ |
| 7 | Twilio 2FA enabled | Day 4 | ✓ |
| 8 | OpenAI account + API key generated | Day 5 | ✓ |
| 9 | Upstash Redis database (us-east-1, lead-response-bot) | Day 6 | ✓ |
| 10 | Vercel project + 12 env vars | Day 7 | ✓ |
| 11 | Initial bot code architecture (real estate) | Day 7-8 | ✓ |
| 12 | HVAC pivot decision (data-driven niche switch) | Day 8 | ✓ |
| 13 | HVAC system prompt + 11 safety regex patterns | Day 8 | ✓ |
| 14 | Compliance module (TCPA + state + SB 243) | Day 8 | ✓ |
| 15 | 5-Layer legal defense framework designed | Day 8-9 | ✓ |
| 16 | v2 hardening (idempotency, broker cap, handoff) | Day 9 | ✓ |
| 17 | HVAC-PLAYBOOK.md written (801 lines, 10 sections) | Day 9 | ✓ |
| 18 | Calendly account + 30-min event configured | Day 9-10 | ✓ |
| 19 | Code committed locally (Iseri repo) | Day 10 | ✓ |
| 20 | GitHub Desktop file copy (Documents/GitHub/) | Day 10 | ✓ |
| 21 | Push to GitHub origin (2 commits) | Day 10 | ✓ |
| 22 | Vercel auto-deploy triggered + Ready | Day 10 | ✓ |
| 23 | Health check verified: status=ok, missing_env_vars=[] | Day 10 | ✓ |
| 24 | Twilio webhook URL configured (SMS POST) | Day 10 | ✓ |
| 25 | Verified Caller ID added (Turkish phone for testing) | Day 10 | ✓ |
| 26 | E2E SMS test attempted | Day 10 | ⚠️ Blocked (need US virtual number — TextNow / GV) |
| 27 | API key rotation plan (Anthropic/Twilio/OpenAI) | Day 10 | Pending |
| 28 | Domain WHOIS privacy confirmed (already on) | Day 10 | ✓ |
| 29 | Upwork profile created | Day 11 | ✓ |
| 30 | Upwork title + bio + skills + rate ($45/hr) | Day 11 | ✓ |
| 31 | Upwork portfolio entry: HVAC SMS Bot published | Day 11 | ✓ |
| 32 | Upwork Freelancer Plus subscribed (cancel by Jul 22!) | Day 11 | ✓ |
| 33 | Upwork job alerts configured | Day 11 | ✓ |
| 34 | Upwork profile submitted for review | Day 11 | ✓ Pending approval |
| 35 | Twitter/X account setup (for closer outreach) | TBD | Pending |
| 36 | A2P 10DLC Sole Proprietor registration ($4, 10-15 day) | TBD | Pending |
| 37 | First Apollo lead pull (100 HVAC contractors) | TBD | Pending |
| 38 | Smartlead inbox warmup (2-3 weeks) | TBD | Pending |
| 39 | Loom 90-sec demo recording | TBD | Pending |
| 40 | First cold email campaign sent | TBD | Pending |
| 41 | First discovery call (Calendly booked) | TBD | Pending |
| 42 | First paid HVAC broker client | TBD | Pending |
| 43 | LLC formation (Wyoming, ~$300, 1-2 weeks) | Month 2-3 | Planned |
| 44 | Business bank account (Mercury) | After LLC | Planned |
| 45 | E&O Insurance (Hiscox, ~$500/yr) | Month 2 | Planned |
| 46 | First quarterly self-audit | Month 4 | Planned |
| 47 | UK market entry (Twilio UK number + UK GDPR compliance) | Month 10-12 | Planned |
| 48 | UAE / Australia expansion | Month 13-18 | Planned |

---

## 12. DEPLOYMENT PIPELINE

```
[Local file edit on Windows]
       │
       ▼
[GitHub Desktop: commit with message]
       │
       ▼
[Push origin → GitHub repo updated]
       │
       │ (webhook to Vercel)
       ▼
[Vercel detects commit on main branch]
       │
       ▼
[Vercel build in iad1 (~60-90 sec)]
       │
       ▼
[Functions deployed, env vars injected]
       │
       ▼
[Production URL serves latest code]
       │
       ▼
[Verify: GET /api/health → status:ok]
       │
       ▼
[Smoke test: send test SMS through]
```

**Rollback:** If deployment breaks, click "Promote to Production" on previous Ready deployment in Vercel dashboard. Reverts in ~30 seconds.

**Preview deployments:** Every git branch gets a preview URL. Use for testing changes before merging to main.

---

## 13. COST STRUCTURE

### Fixed Monthly Costs (Agency Operations)
| Item | Cost/month |
|------|------------|
| Vercel Hobby | $0 |
| Upstash Free tier | $0 |
| Twilio phone rental | ~$1 |
| Domain (annualized) | ~$1 |
| Google Workspace | ~$6 |
| Smartlead Starter | $39-99 |
| Apollo | $49-99 |
| Calendly | $0 (free tier) |
| **Total fixed** | **~$100-200** |

### Per-Active-Broker Variable Costs
| Item | Cost/broker/month |
|------|-------------------|
| Twilio SMS ($0.0075 × ~50-200 msgs × 20-50 leads) | $7.50-75 |
| OpenAI gpt-4o-mini | $5-15 |
| Upstash Redis | $0 (free tier scales) |
| **Total variable per broker** | **$15-90** |

### Margin Per Broker
| Tier | Price/mo | Variable cost | Margin |
|------|----------|---------------|--------|
| Starter ($1,500) | $1,500 | $30 | $1,470 (98%) |
| Pro ($2,500) | $2,500 | $60 | $2,440 (97.6%) |
| Premium ($3,500) | $3,500 | $90 | $3,410 (97.4%) |

### Optional / Discretionary Spend
- Upwork Freelancer Plus: $9.99 first month, $19.99/mo after
- E&O Insurance (Month 2+): $500/year ≈ $42/month
- LLC formation: $300-500 one-time
- Mercury bank account: $0
- Lawyer consultation (Month 2): $500-1500 one-time

---

## 14. PRICING & PACKAGING

| Tier | Price/mo | Lead cap | Includes |
|------|----------|----------|----------|
| **Starter** | $1,500 | 200 leads/mo | 1 broker site, basic config |
| **Pro** | $2,500 | 500 leads/mo | 1 broker site, custom prompts, weekly KPI report |
| **Premium** | $3,500 | Unlimited | 1 broker site, Slack ops channel, custom integrations |

All tiers include:
- Twilio SMS costs (covered)
- OpenAI costs (covered)
- TCPA compliance gate
- Full audit trail (legal proof)
- Monthly maintenance
- 24-hour response to broker support requests

**One-time setup fee:** $500 (waivable for first 5 clients to build case studies)

---

## 15. SALES FUNNEL END-TO-END

```
[Apollo lead pull] (100 contractors/week, filtered)
       │
       ▼
[Smartlead cold email sequence] (3 emails over 7 days)
       │
       │ (reply rate: 1-3% with good copy)
       ▼
[Reply received → Calendly booking link sent]
       │
       │ (book rate: 30-50% of positive replies)
       ▼
[15-min Discovery Call]
       │
       │ (close rate: 20-40% of demos for new agency)
       ▼
[Pricing/proposal sent within 24 hours]
       │
       │ (close at this stage: 50-70% of proposals)
       ▼
[Pre-screen 5-point check] (GATE — must pass ALL 5)
       │
       │ (pass rate: ~70-80%)
       ▼
[DPA sent → signed (3-7 days typical)]
       │
       ▼
[Consent metadata setup on their lead form]
       │
       ▼
[Bot goes live for new broker]
       │
       ▼
[First monthly invoice issued]
       │
       ▼
[Audit log starts accumulating per-broker]
       │
       ▼
[30-day check-in call + KPI report]
       │
       ▼
[Renewal / upsell / churn]
```

---

## 16. COLD EMAIL STRATEGY (Smartlead)

### Sequence Structure (3 emails over 7 days)

**Email 1 (Day 1) — Value-led**
- Subject (A/B test): "[Company] losing leads to slower competitors?" / "60-second response for [Company]?"
- Opening: 1-sentence specific observation about their business
- Body: 2-3 sentences on the problem (slow response = lost leads)
- CTA: Soft — "Would a 15-min look interest you?"

**Email 2 (Day 3) — Case study / proof**
- Subject: "Quick proof — [related contractor] case"
- Body: Reference a comparable success (real or hypothetical until first case)
- CTA: Loom link with personalized intro

**Email 3 (Day 7) — Break-up / soft close**
- Subject: "Closing the loop"
- Body: "Haven't heard back. Assuming wrong timing. Door stays open."
- CTA: Calendly link, no pressure

### Volume Plan
- Week 1-2: 50/day (1 warmed inbox)
- Week 3-4: 100/day (2 inboxes)
- Month 2+: 200/day (5-7 inboxes)

### Deliverability requirements
- 5-7 warmed inboxes on SECONDARY domains (NOT iseriagency.com — keep that clean)
- Examples: iseri-services.io, iseri-hvac.com, iseri-agency.io
- Cost: ~$10/domain/year + $6/inbox/month via Google Workspace
- Smartlead handles automatic warmup (2-3 weeks before sending real volume)

---

## 17. APOLLO ICP & LEAD PULL FILTERS

### Target Profile
- **Industry:** HVAC Services OR Roofing Contractors
- **Company size:** 5-50 employees
- **Annual revenue:** $500K - $10M
- **Decision-maker title:** Owner / President / CEO / Marketing Director / Operations Manager
- **Location:** United States only
- **States INCLUDED** (Months 1-6): TX, AZ, GA, NC, CA, SC, NV, TN, AL
- **States EXCLUDED** (Months 1-6): FL, OK, WA, MD
- **Tech indicator:** Has website with active contact form (signals digital maturity)
- **Recent activity:** Hiring growth, Google Ads spend, BBB activity (signals growth phase)
- **Verified email present** (Apollo confidence ≥ "verified")

### Auto-Disqualifiers (remove from list)
- Storm chaser / fly-by-night operators (cross-reference BBB)
- Insurance fraud history (state insurance department search)
- Active TCPA litigation (PACER + state court)
- BBB rating below A-
- Google reviews below 4.0 stars
- Less than 20 Google reviews (insufficient signal)

### Weekly Pull Volume
- 100 contractors/week passing all filters
- ~400/month
- Sufficient for 1-2 inboxes at 50-100/day cold email volume

---

## 18. LOOM DEMO SCRIPT (90 seconds)

### Section 1: Hook (15 sec)
> "Quick question: when a homeowner calls a HVAC company at 8 PM with no AC, and that company takes 47 minutes to respond, where does that lead go? To the next contractor on the list. Industry data — 60-80% of inbound leads get lost to faster competitors."

### Section 2: Solution (30 sec)
> "I built an AI SMS bot that responds in 5 seconds. Not a chatbot widget on a website — an actual SMS conversation. Asks the right qualifying questions: emergency vs planned, property type, equipment age. Then books them on the contractor's calendar. Stays TCPA-compliant in every state, with full audit trail for legal proof."

### Section 3: Proof (30 sec)
> "Here's the production deployment on Vercel. Here's the health check returning real status. Here's the code structure — compliance gates, opt-out handling, idempotency, rate caps, conversation handoff at 20 messages so it doesn't run up your OpenAI bill. This is real engineering, not no-code Zapier templates."

### Section 4: CTA (15 sec)
> "15-minute call this week if you want to see if it fits your operation. Calendar link below. If it's not a fit, I'll tell you why in the first 5 minutes — no pitch trap."

### Production notes
- Record in Loom (free up to 5 min, 25 video limit on free)
- Background: clean wall, neutral lighting
- Use webcam + screen share
- Don't read script word-for-word — talk natural
- Re-record until under 90 seconds (longer = drop-off)

---

## 19. DISCOVERY CALL PLAYBOOK (15 min)

### Pre-call (5 min before)
- Open their website
- Open their Google reviews
- Open Apollo profile
- Have notes ready
- Calendly auto-sent the Loom link → assume they watched 30 seconds

### Minute 1-2: Frame (anti-pitch opener)
> "Quick before we start — I want to make sure this is mutual fit, not a sales pitch. If at any point this feels like a pitch or setup, just call it and we end the call. Fair?"

This is Sandler-style anti-frame. Disarms defensive prospects.

### Minute 2-5: Discovery (asking real questions)
- "How many inbound leads do you currently get per month from your website?"
- "What happens when one comes in at 7 PM on a Friday?"
- "Roughly how long until your team responds?"
- "And what's the close rate from web leads vs phone-call leads?"
- "What tools do you use today — CRM, scheduling?"
- "Is anyone in your office watching for new leads all day?"

Listen 80%, talk 20%.

### Minute 5-10: Show (Loom + screen share)
- Reference what they just said: "Based on what you described, here's what would change..."
- Pull up bot architecture briefly
- Show the first SMS that would go out for their company
- Show compliance gate (so they trust legality)
- Show audit log (so they trust they have proof of consent)

### Minute 10-13: Objection Handling

**"It's too expensive"**
> "Compared to what? If you close even ONE lead per month that you would have lost to a faster competitor, the bot pays for itself 3x over. What's an average install value for you?"

**"I already have a chatbot on my website"**
> "Yours probably responds in the browser, right? SMS is different — text response rates are 3-8x higher than chat widget. Plus your existing chatbot likely isn't TCPA compliant. Want me to audit it?"

**"I need to think about it"**
> "Of course. Quick question — what specifically would change between now and a week from now that would let you say yes?"

**"I need to talk to my partner / wife / advisor"**
> "Smart. What would they need to see to be comfortable saying yes? Want me to put together a 1-page summary you can share with them?"

**"Send me more info / I'll get back to you"**
> "Sure. To save us both a follow-up loop — what's your honest read right now? Sounds like a 'no thanks' or sounds like a 'maybe with X conditions'?"

### Minute 13-15: Close
- Soft pre-screen (informal): "Just so I know we're a fit — your state license is active, right? Any BBB complaints I should know about?"
- Tier recommendation based on their lead volume
- "Want me to send a written proposal by tomorrow morning?"
- Schedule follow-up call for proposal review (5-min call)

### Post-call (within 1 hour)
- Send thank-you email
- Send proposal PDF + DPA template
- Set CRM reminder for follow-up

---

## 20. ONBOARDING WORKFLOW PER BROKER (Phase A-E)

### Phase A: Pre-screen (1-2 days)
- [ ] State contractor license verified at state board
- [ ] BBB rating A or A+ confirmed
- [ ] Google reviews ≥4.0 stars + 20+ count confirmed
- [ ] PACER + state court search clean (no TCPA lawsuits)
- [ ] Insurance fraud check clean
- **If ANY fail:** DO NOT proceed. Refund deposit. Document why.

### Phase B: DPA Signing (3-5 days)
- [ ] Send hardened DPA template (PDF)
- [ ] Schedule 15-min call to review key clauses (4.d, 4.f, 9.a-c)
- [ ] DocuSign or wet-signed PDF
- [ ] File signed copy: `/clients/[brokerName]/dpa-signed-YYYY-MM-DD.pdf`

### Phase C: Consent Setup (1 day)
- [ ] Review broker's lead form for SMS opt-in checkbox
- [ ] Verify TCPA disclosure language:
  > "☐ I agree to receive SMS messages from [Company] about my service inquiry. Reply STOP to opt out. Msg & data rates may apply."
- [ ] Verify Privacy Policy mentions Iseri Agency as third-party SMS processor
- [ ] If missing: provide template, hold launch until added

### Phase D: Webhook Wiring (1 day)
- [ ] Update Vercel env vars: BROKER_NAME, BROKER_EMAIL, BROKER_CALENDAR_URL
- [ ] Verify broker's form sends POST to `/api/lead` with `x-webhook-secret` header
- [ ] Test submission with real consent metadata
- [ ] Verify first SMS arrives to test phone

### Phase E: Go-Live (1 day + monitoring)
- [ ] First invoice issued (Stripe / wire / however contracted)
- [ ] Monitor first 24 hours actively (every 2-4 hours)
- [ ] Verify audit log accumulating properly
- [ ] Send 24-hour post-launch summary to broker
- [ ] Schedule 30-day check-in call

---

## 21. OPERATIONS CADENCE

### Daily (~15 min)
- Check Vercel deployment status (auto-deploys, but verify Ready)
- Check Twilio dashboard for SMS delivery failures
- Check Upstash Redis stats (commands used vs free tier limit)
- Check Smartlead reply inbox (respond to interested prospects within 2 hours)
- Reply to any Upwork client messages
- Reply to any Twitter/X DMs

### Weekly (~1-2 hours)
- Apollo: pull 100 new leads (filtered per ICP)
- Smartlead: upload new leads to campaign + adjust copy if reply rate <1%
- Review previous week's discovery calls (notes on what worked / didn't)
- Update KPI spreadsheet
- Twitter/X: 3-5 build-in-public posts
- Upwork: send 5-10 new job applications

### Monthly (~4-6 hours)
- Review audit logs for compliance drift
- Review opt-out rates per broker (must stay <2%)
- Update Apollo ICP if needed
- Tax/finance bookkeeping
- Cold email copy iteration based on reply rate data
- Update HVAC-PLAYBOOK with learnings
- Renew domains, check SaaS subscriptions
- Cancel anything unused

### Quarterly (~1 full day)
- Run 15-item compliance self-audit
- Review broker pre-screen results (any false negatives?)
- E&O insurance renewal check (Month 2+)
- LLC operating agreement review (Year 2+)
- Geographic expansion evaluation (Month 10+)

### Yearly
- Tax filing (Turkish + US contractor income)
- Domain renewals (auto but verify)
- Annual financial review
- Strategic planning for next 12 months
- LLC annual report (Wyoming = simple)

---

## 22. RISK MANAGEMENT & MITIGATIONS

### Legal Risks Year 1 (with all 5 mitigation layers active)

| Risk | Probability | Magnitude | Mitigation |
|------|-------------|-----------|------------|
| TCPA class action | 2-4% | $50-150K settlement | DPA + audit trail + state filter + per-broker pre-screen |
| State Attorney General inquiry | 1-3% | $20-100K legal defense | Pre-screen filters bad brokers before they're our problem |
| Twilio account suspension | 5-10% | 2-4 week business interruption | A2P 10DLC compliance, low opt-out rate |
| 10DLC registration denial | 10-15% | 1-3 month delay before scale | Proper Customer Care use case framing |
| Personal liability (no LLC) | 1-3% | All personal assets at risk | **Form Wyoming LLC by Month 3** |
| Broker dispute (DPA enforcement) | 5-10% | $5-30K legal fees | Hardened DPA + clear scope of work |
| Tax exposure (TR + US) | 100% | Variable | LLC + Turkish accountant retained |

### Operational Risks

| Risk | Mitigation |
|------|------------|
| Vercel outage | 99.99% SLA, no action needed |
| Twilio outage | 99.95% SLA, monitor status page |
| OpenAI outage | Cache common responses, fallback prompts |
| Domain expiration | Auto-renew ON, calendar reminder anyway |
| API key compromise | Rotated, in env vars only (not in code), monitored |
| Lost laptop / no backups | Bitwarden + GitHub + Vercel are all cloud-synced |

### Strategic Risks

| Risk | Mitigation |
|------|------------|
| Niche saturation | HVAC is fragmented, low risk for 18-24 months |
| Competition from VC-funded SaaS | Compete on price + compliance + speed of customization |
| Regulatory change (TCPA expansion) | Quarterly audit + lawyer consultation annually |
| Founder burnout | Operations cadence designed sustainable; rest weekly |

---

## 23. GROWTH ROADMAP

### Months 1-3: Foundation
- ✓ Push code to production
- ✓ Deploy bot
- [ ] Complete E2E test (when US phone available)
- [ ] A2P 10DLC registration
- [ ] Apollo + Smartlead infrastructure live
- [ ] First 1-3 paid brokers
- [ ] Document everything learned

**Expected MRR exit Month 3:** $1,500 - $7,500

### Months 4-6: First Real Revenue
- 5-10 paid brokers ($7-25K MRR)
- LLC formed (Wyoming, ~$300)
- Business bank account (Mercury, free)
- E&O Insurance (Hiscox, $500/yr)
- Hire VA for outreach (~$800/month)
- First case studies

**Expected MRR exit Month 6:** $13-17K (median scenario)

### Months 7-12: Scale
- 10-20 brokers ($15-50K MRR)
- Refine copy + conversion funnel
- Add UK market (Month 10-12, UK GDPR + PECR compliance)
- Twitter/X audience build (1-5K followers)
- Lawyer consultation if growth requires

**Expected MRR exit Month 12 (median):** $26-32K
**Expected MRR exit Month 12 (top decile):** $60-80K

### Year 2: Geographic Expansion
- UK (Month 13+)
- UAE (Month 14+)
- Australia (Month 16+)
- 30-50 brokers across regions
- Hire 1-2 employees
- Consider productizing into SaaS

**Expected MRR exit Year 2:** $65-95K (median) / $150-220K (top decile)

### Year 3: Decision Point
- Path A: Sell agency for 3-5x ARR ($3-10M exit)
- Path B: Convert to SaaS product (5-10x ARR multiple, higher exit potential)
- Either path: $1-15M outcome possible based on execution quality

---

## 24. DECISIONS LOG (Why X Over Y)

### Why HVAC over Real Estate
- Fragmented (less brand-loyalty)
- Higher emergency urgency = faster conversion
- No Fair Housing complications
- Climate change tailwind
- Lower competition from other AI agencies

### Why Vercel over AWS
- Faster deployment (push → live in 60-90 sec)
- Better DX (zero ops overhead)
- Generous free tier
- Auto-scaling without config
- Edge functions option if needed

### Why GPT-4o-mini over GPT-4o
- Cost: ~30x cheaper
- Quality: Sufficient for SMS qualifier (not creative writing)
- Speed: Faster response = better UX
- Easy to upgrade to GPT-4o later if needed

### Why Upstash Redis over PostgreSQL
- Serverless-friendly (no connection pool issues)
- HTTP-based API (works in edge functions)
- Free tier sufficient for early stage
- Built-in TTLs for ephemeral data (smscount, locks)
- Sub-millisecond latency

### Why Twilio over MessageBird / Vonage
- US-focused tooling
- Best TCPA compliance documentation
- A2P 10DLC support built-in
- Largest community + Stack Overflow coverage
- Twilio Programmable Messaging well-documented

### Why GitHub + Vercel auto-deploy over self-hosted
- Zero ops overhead
- Auto-deploy from main branch
- Built-in preview deployments
- Free at our scale
- Industry standard (easier to hire later)

### Why Google Workspace over self-hosted email
- DKIM/SPF/DMARC easier to configure correctly
- Better deliverability reputation
- 99.9% uptime SLA
- Mobile + web access included
- $6/month is cheaper than maintaining own server

### Why cold email over cold call (for sales)
- Async (works from Turkey timezone with US clients)
- Scalable with Smartlead automation
- Less rejection trauma
- Documented compliance trail (CAN-SPAM compliant)
- Reply rate measurable for iteration

### Why $45/hr on Upwork over $30 or $80
- $30 signals "cheap / inexperienced" — gets bad clients
- $80 needs JSS + reviews — won't get clicks at zero
- $45 is "I have skills" without scaring SMB budgets
- Raise to $80-150 after first 3-5 reviews

### Why Wyoming LLC over Delaware
- Cheaper ($100 vs $200/yr)
- No state income tax
- Anonymous ownership (privacy)
- Same liability protection as Delaware
- Delaware advantage only matters for raising VC capital

### Why decline Hai-Sensei job ($5K Upwork)
- Too complex for current skill + AI assistance combined
- NestJS + AWS + PostgreSQL + CI/CD stack not yet learned
- Failure mode risk: client interview reveals knowledge gaps
- Better to start with smaller contained projects to build review history

### Why subscribe to Freelancer Plus
- 150 Connects = ~10-15 quality applications
- Job alerts = apply within minutes of fresh job posts (response rate 5-10x higher)
- $9.99 first month is high ROI even if 1 small project closes
- **MUST CANCEL by Jul 22** if not converting (auto-renews at $19.99)

---

## 25. KPIs & METRICS TO TRACK

### Daily Metrics
- New leads submitted (count)
- SMS delivery success rate (target: >99%)
- Opt-out events (target: <2% of recipients)
- Avg reply response time (bot side, target: <10 sec)

### Weekly Metrics
- Cold emails sent (count)
- Reply rate % (target: 2-3% for warm copy)
- Demos booked
- Demos completed (no-show rate target: <20%)
- Demo → close rate

### Monthly Metrics
- New paid clients (count)
- Churn rate (target: <5%)
- MRR growth % (target: 20-30% MoM in Months 1-6)
- Cost per acquisition (CAC)
- Revenue per active broker (ARPU)
- Net Revenue Retention (NRR, target: >100% with upsells)

### Quarterly Metrics
- Compliance audit pass rate (target: 100%)
- Insurance claims filed (target: 0)
- Broker NPS (target: >50)
- Pricing power (avg deal size trend)
- Geographic distribution (concentration risk)

### Yearly Metrics
- Total revenue
- Total cash collected
- Profit margin
- Customer lifetime value (LTV)
- LTV:CAC ratio (target: >3:1)
- Net Promoter Score

---

## 26. TOOLS & ACCOUNTS REFERENCE INDEX

| Tool | URL | Purpose | Account / Username |
|------|-----|---------|---------------------|
| Vercel | vercel.com | Hosting + serverless | batur@iseriagency.com |
| Twilio | console.twilio.com | SMS provider | batur@iseriagency.com |
| OpenAI | platform.openai.com | LLM API | batur@iseriagency.com |
| Upstash | console.upstash.com | Redis | batur@iseriagency.com (Google OAuth) |
| GitHub | github.com | Code repo | batur-arch |
| Namecheap | namecheap.com | Domain | ButterTheBread |
| Google Workspace | workspace.google.com | Email | batur@iseriagency.com |
| Smartlead | smartlead.ai | Cold email | batur@iseriagency.com |
| Apollo | apollo.io | Lead data | batur@iseriagency.com |
| Calendly | calendly.com | Booking | batur-iseriagency |
| Upwork | upwork.com | Freelance marketplace | batur@iseriagency.com |
| Anthropic | console.anthropic.com | Claude API (backup, not active) | batur@iseriagency.com |
| GitHub Desktop | desktop.github.com | Local Git GUI | batur-arch |
| Bitwarden | bitwarden.com | Password manager (recommended) | TBD |

### 2FA Status
| Account | 2FA Enabled |
|---------|-------------|
| GitHub | ✓ |
| Vercel | ✓ |
| Twilio | ✓ |
| OpenAI | ✓ |
| Anthropic | ✓ |
| Google Workspace | ✓ |
| Namecheap | ✓ (Google Auth) |
| Upstash | ✓ |
| Upwork | Pending |

### Backup Codes Storage
- Move all `recovery-*.txt` and `*_2FA_*.txt` from Downloads → encrypted storage
- Recommended: Bitwarden (free) or 1Password
- Currently: stored as plaintext .txt in Downloads (SECURITY RISK — fix this)

---

## 27. UPWORK SETUP (PARALLEL CASH CHANNEL)

### Profile
- Name: Batur Iseri
- Title: "AI Chatbot Developer | Voice AI, SMS Bots, Workflow Automations"
- Hourly rate: $45/hr (Upwork takes 10% → $40.50/hr take-home)
- Location: İzmit, Kocaeli, Turkey
- Languages: English (Native or Bilingual), Turkish (Native), Japanese (Basic)

### Skills (15/15 used)
1. OpenAI API
2. ChatGPT API
3. Chatbot Development
4. AI Chatbot
5. Node.js
6. Make.com
7. Zapier
8. Python
9. Twilio
10. Prompt Engineering
11. AI Agent Development
12. Conversational AI
13. Generative AI
14. Automatic Speech Recognition
15. Vercel

### Portfolio Project #1: HVAC Bot (PUBLISHED)
- Title: TCPA-Compliant AI SMS Lead Response Bot for HVAC Contractors
- Description: Production AI SMS bot details
- Skills: OpenAI API, Chatbot Development, Twilio, Node.js, AI Agent Development
- Images: Vercel deployments screenshot + Health check JSON
- Role: Solo Developer · Architecture to Production

### Portfolio Project #2: Jarvis (PENDING)
- Title: Jarvis — Python Voice Assistant
- Description: Wake word + Whisper STT + GPT + ElevenLabs TTS
- Add when convenient

### Subscription
- **Freelancer Plus:** $9.99 first month (started Jun 24, 2026)
- **NEXT CHARGE:** Jul 24, 2026 → $19.99/month
- **ACTION:** Cancel by **Jul 22** if not generating leads, otherwise keep

### Strategy
- Apply to fresh jobs (last 24 hours) with <5 proposals
- Target: $500-2K fixed price OR $30+/hr hourly
- Custom cover letter per application (no boilerplate)
- Avoid: low-budget jobs (<$300), unverified payment, vague descriptions

---

## 28. TWITTER/X CLOSER OUTREACH (PENDING SETUP)

### Account Setup (Pending)
- Username: @baturiseri (or similar)
- Bio: "I close calls for AI / SaaS / SMMA agencies. DM if your founder is bottlenecked on discovery calls."
- Profile pic: same as Upwork
- Pinned tweet: offer + Loom

### Strategy
- 30-50 cold DMs per day to agency founders
- Target: AI agency owners, SMMA founders ($20-100K/month), course creators ($30K+/month)
- Offer: free trial week (review past 3 calls + take 5 free), then 10-15% commission split
- Track: replies, trial offers accepted, paid placements

### Why parallel channel
- Faster than Upwork (no platform fees, no waiting for job posts)
- Higher-ceiling income (commissions on $5-20K deals = $500-3K per close)
- Builds personal brand + network
- Free to run

---

## 29. GLOSSARY OF TERMS

- **A2P 10DLC** — Application-to-Person 10-Digit Long Code. US carrier requirement for business SMS at scale. Registration required via The Campaign Registry (TCR).
- **TCPA** — Telephone Consumer Protection Act. Federal law governing automated SMS/calls. Violations = $500-1500/text. Enforced via class actions.
- **Mini-TCPA** — State-level versions (FL, OK, WA, MD strictest). Add 3-SMS/day caps, 8pm cutoff.
- **CA SB 243** — California Senate Bill 243 (2025). Requires AI bot disclosure in first message.
- **DPA** — Data Processing Agreement. Defines Controller (broker) vs Processor (Iseri Agency) responsibilities. Shifts most TCPA liability to broker who collected the consent.
- **JSS** — Job Success Score on Upwork. Calculated from project outcomes. New freelancers start with no JSS.
- **MRR / ARR** — Monthly / Annual Recurring Revenue.
- **CAC** — Customer Acquisition Cost.
- **LTV** — Customer Lifetime Value.
- **NRR** — Net Revenue Retention.
- **ICP** — Ideal Customer Profile. Defines target client characteristics for outbound.
- **NPS** — Net Promoter Score. Customer satisfaction metric (-100 to +100).
- **NEPQ** — Neuro-Emotional Persuasion Questioning. Jeremy Miner's sales methodology.
- **Sandler** — Sales methodology emphasizing qualification and "anti-frame" opener.
- **Tactical Empathy** — Chris Voss negotiation technique (Never Split the Difference).
- **Anti-frame** — Opening that disarms prospect's defense by inviting them to call out manipulation.
- **HVAC** — Heating, Ventilation, Air Conditioning industry.
- **AOB** — Assignment of Benefits. Common roofing fraud pattern (insurance abuse).
- **Conatus** — Spinoza's concept of self-preservation as fundamental drive.

---

## 30. OPEN TASKS & NEXT ACTIONS

### Immediate (next 24-48 hours)
- [ ] Get US virtual number (Google Voice or TextNow) for E2E SMS test
- [ ] Rotate Twilio Auth Token (visible in earlier screenshots)
- [ ] Rotate OpenAI API key (partial visible earlier)
- [ ] Delete leaked Anthropic API key (not used in bot)
- [ ] Move recovery code .txt files from Downloads → Bitwarden
- [ ] Verify Upwork ID (gets verified badge)
- [ ] Add Jarvis as Portfolio Project #2 on Upwork
- [ ] Setup Twitter/X account for closer outreach

### This Week
- [ ] Smartlead inbox warmup begins (2-3 weeks before real sends)
- [ ] First Apollo lead pull (100 HVAC contractors, filtered)
- [ ] Record 90-second Loom demo
- [ ] Send first 100 cold DMs on Twitter (closer pipeline)
- [ ] Send first 20 Upwork applications (when profile approved)

### This Month
- [ ] A2P 10DLC Sole Proprietor registration ($4, 10-15 day approval)
- [ ] First cold email campaign live
- [ ] First Calendly discovery call booked
- [ ] First DPA template review by lawyer (consider $500 consultation)
- [ ] Upwork JSS established (need first 1-2 projects)

### Next 3 Months
- [ ] First paid HVAC broker client
- [ ] LLC formation (Wyoming, ~$300)
- [ ] Business bank account (Mercury)
- [ ] E&O Insurance (Hiscox, $500/yr)
- [ ] First quarterly audit
- [ ] $5-15K MRR

### Year 1 Goals
- [ ] $26-32K MRR (median scenario)
- [ ] 18-22 active brokers
- [ ] 5+ case studies for marketing
- [ ] UK market entry (Month 10-12)
- [ ] $80-180K total cash collected

### Year 2 Goals
- [ ] $65-95K MRR (median scenario)
- [ ] 30-50 brokers across US + UK + UAE + Australia
- [ ] 1-2 employees hired
- [ ] $300-700K total cash collected

### Year 3 Goals
- [ ] $120-180K MRR OR pivot to SaaS product
- [ ] Decision: sell agency vs continue scaling
- [ ] $1-5M wealth (top quartile outcome)

---

## DOCUMENT MAINTENANCE

**Update this file after:**
- Every new client onboarded
- Every major code change
- Every legal/compliance update
- Every quarterly audit
- Every pricing change
- Every new market entered

**File location:** `C:\Users\BATUR\OneDrive\Masaüstü\lead-response-bot\ISERI-AGENCY-COMPLETE-DOCUMENTATION.md`

**Last full review:** 2026-06-24 (creation date)

---

## END OF DOCUMENT
