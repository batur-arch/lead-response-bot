# Lead Response Bot

**60-second AI SMS lead response bot for US real estate brokerages.**
TCPA + state mini-TCPA (FL/OK/WA/MD) + CA SB 243 + Fair Housing Act compliant.

Built by Iseri Agency. Stack: Vercel Serverless · Twilio · OpenAI · Upstash Redis.

---

## What it does

1. Broker's website form submits a lead → calls `POST /api/lead`
2. Bot sends a 60-second SMS introducing itself **as an AI assistant** (CA SB 243), referencing the lead's inquiry and asking a qualifier question (TCPA transactional).
3. Lead replies → Twilio webhook hits `POST /api/sms-reply`.
4. Bot detects opt-out / help / re-subscribe keywords and handles them per TCPA.
5. Otherwise, GPT-4o-mini generates a qualifier reply (budget, timeline, type, pre-approval) — never quotes prices, never discusses race/religion/family (FHA), never gives mortgage advice.
6. After 2-3 qualifying answers, bot offers the broker's Calendly link.
7. All compliance checks (quiet hours, daily caps, opt-out blocks) run **before every outbound send**.

---

## Architecture

```
Broker website form
        │ POST { name, phone, city, ... }
        ▼
┌─────────────────────────────────┐
│  Vercel iad1 (US East)          │
│  ┌───────────────────────────┐  │
│  │ api/lead.js               │  │  ← gates: secret header
│  │   → compliance.canSendNow │  │  ← gates: opt-out, quiet hours, daily cap
│  │   → twilio.sendSms        │  │  ← logs every send
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ api/sms-reply.js          │  │  ← gates: Twilio signature
│  │   → compliance.detectOptOut│ │  ← STOP, cancel, end, etc.
│  │   → openai.generateReply  │  │  ← locked system prompt
│  │   → twilio.sendSms        │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
        │                  ▲
        ▼                  │
┌────────────────┐  ┌──────────────┐
│ Upstash Redis  │  │  Twilio API  │
│  us-east-1     │  │   (US-based) │
│  (lead state,  │  │              │
│   audit log,   │  └──────────────┘
│   opt-out)     │
└────────────────┘
```

**All data stays in US-East. No data flows to Turkey or EU.**

---

## Setup (15 minutes)

### 1. Push this code to your GitHub repo

```bash
cd lead-response-bot
git init
git remote add origin https://github.com/batur-arch/lead-response-bot.git
git add .
git commit -m "Initial bot — compliance-baked"
git push -u origin main
```

(If repo already exists, just copy these files into your existing local clone.)

### 2. Create Upstash Redis (free tier)

1. Go to https://console.upstash.com/
2. Sign up with `batur@iseriagency.com` (Google OAuth)
3. **Create Database** → name: `lead-response-bot` → **Region: us-east-1 (N. Virginia)** → Type: Regional → Eviction: noeviction → Create
4. Open the DB → "REST API" tab → copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 3. Add environment variables to Vercel

Open Vercel project → **Settings → Environment Variables**. Add each from `.env.example`:

| Variable | Value source |
|---|---|
| `TWILIO_ACCOUNT_SID` | Twilio Console |
| `TWILIO_AUTH_TOKEN` | Twilio Console (show → copy) |
| `TWILIO_PHONE_NUMBER` | Your US number (E.164, e.g. `+15551234567`) |
| `OPENAI_API_KEY` | platform.openai.com/api-keys |
| `UPSTASH_REDIS_REST_URL` | Upstash REST API tab |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST API tab |
| `BROKER_NAME` | First broker client's name (you can change per-client later) |
| `BROKER_EMAIL` | Your email or broker's |
| `BROKER_CALENDAR_URL` | Your Calendly URL (or broker's) |
| `LEAD_WEBHOOK_SECRET` | Generate random 32-char string (use `openssl rand -hex 16`) |
| `NODE_ENV` | `production` |

**Save** → Vercel will redeploy automatically.

### 4. Wire Twilio webhook

1. Twilio Console → Phone Numbers → Active Numbers → click your number
2. Scroll to **Messaging Configuration**
3. **A MESSAGE COMES IN** → Webhook → URL: `https://lead-response-bot.vercel.app/api/sms-reply` → HTTP POST
4. Save

### 5. Register A2P 10DLC (Sole Proprietor)

Required by US carriers; takes 10-15 days. Start NOW so it's done by go-live.

1. Twilio Console → Messaging → Regulatory Compliance → Brand Registration
2. Choose **Sole Proprietor** ($4 brand fee)
3. Provide: business name (`Iseri Agency`), your name, US address, OTP via US mobile
4. After brand approved, create **Campaign**:
   - Use case: **Customer Care**
   - Description: "AI SMS assistant qualifying inbound real estate leads who submitted opt-in web forms on broker partner sites"
   - Sample messages (paste 2-3 of these):
     - "Hi [Name], this is the AI assistant for [Broker] about your inquiry in [City]. Quick question — are you pre-approved for a mortgage, or still exploring? Reply STOP to unsubscribe."
     - "Got it. What's your budget range — under 300k, 300-500k, 500-800k, or 800k+?"
     - "Want to grab a 15-min call with one of [Broker]'s agents? Here's the calendar: [link]"
5. Submit → wait 10-15 days

### 6. Test end-to-end

Add YOUR phone number to Twilio's **Verified Caller IDs** (trial account requirement). Then:

```bash
curl -X POST https://lead-response-bot.vercel.app/api/lead \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_LEAD_WEBHOOK_SECRET" \
  -d '{
    "name": "Batur Test",
    "phone": "+90YOURNUMBER",
    "city": "Austin",
    "property": "3BR home",
    "consent_text": "I agree to receive SMS from Iseri Demo Brokerage",
    "consent_url": "https://example.com/contact",
    "consent_ip": "1.2.3.4",
    "consent_ts": "2026-06-22T15:00:00Z"
  }'
```

(Replace `+90YOURNUMBER` with your real phone in E.164.) You should receive the first SMS within 5-10 seconds. Reply to it; bot should respond.

### 7. Health check

```bash
curl https://lead-response-bot.vercel.app/api/health
```

Should return `{ "status": "ok", ... }`. If `misconfigured`, check missing env vars.

---

## Onboarding a new broker client (sales-side checklist)

Before SMS go-live for any broker, broker MUST agree to:

- [ ] Their web lead form includes an **SMS opt-in checkbox**. Suggested language:
  > "☐ I agree to receive SMS messages from [Broker Name] about my inquiry. Reply STOP to opt out. Msg & data rates may apply."
- [ ] Broker signs a **Data Processing Agreement (DPA)** treating them as Data Controller and Iseri Agency as Data Processor.
- [ ] Broker provides for each lead submission: `consent_text`, `consent_url`, `consent_ip`, `consent_ts` (form timestamp).
- [ ] Broker's website has a public **Privacy Policy** mentioning SMS / third-party processor.

**If any of the above is missing → DO NOT go live.** This is the line between "compliant agency" and "TCPA defendant."

---

## Compliance features (what's built in)

| Law | How we comply |
|---|---|
| **TCPA federal** | Implied consent from form fill; opt-out detection (any reasonable means); STOP/HELP keywords; 8am-9pm quiet hours |
| **FL/OK/WA/MD mini-TCPA** | 8am-**8pm** stricter window; 3 SMS/day per consumer cap |
| **CA SB 243** | First message always identifies as "AI assistant for [Broker]" |
| **Fair Housing Act** | System prompt forbids race/religion/family/disability questions |
| **No RE license needed** | Bot is qualifier only; system prompt forbids prices, valuations, advice |
| **CCPA/CPRA** | Broker = Data Controller; we = Processor; 90-day data retention; DPA required |
| **KVKK (Turkey)** | All data in US-East Vercel + Upstash; no Turkey data residency |
| **A2P 10DLC** | Sole Prop brand + Customer Care campaign registered |

---

## Pricing (per-broker, what to charge)

| Tier | Price/mo | Includes |
|---|---|---|
| Starter | $1,500 | 1 broker site, up to 200 leads/mo |
| Pro | $2,500 | 1 broker site, up to 500 leads/mo, custom prompts |
| Premium | $3,500 | 1 broker site, unlimited leads, Slack ops channel |

Twilio + OpenAI usage costs ($30-60/mo per active broker) are included in the price. Net margin ~92-95%.

---

## What this bot is NOT

- ❌ A licensed real estate broker (it forbids itself from giving advice)
- ❌ A general marketing tool (transactional only — replies to inbound inquiries)
- ❌ A bulk cold SMS sender (one-to-one, response-to-opt-in only)
- ❌ A HIPAA-compliant medical messaging system

---

## Files

```
lead-response-bot/
├── api/
│   ├── lead.js             POST endpoint — new lead from broker form
│   ├── sms-reply.js        Twilio webhook — handles lead replies
│   └── health.js           GET — health/config check
├── lib/
│   ├── compliance.js       canSendNow(), detectOptOut(), buildFirstMessage()
│   ├── twilio.js           sendSms() with gate; signature validation
│   ├── openai.js           Locked system prompt; AI reply generator
│   ├── redis.js            Upstash client — leads, opt-outs, daily counters
│   ├── timezone.js         Quiet-hour math (federal + state strict)
│   └── areacodes.js        US area code → state + IANA timezone
├── package.json
├── vercel.json             Region: iad1 (US East)
├── .env.example
├── .gitignore
└── README.md               You are here
```

---

## Maintenance

- Monthly: review `audit` arrays in Redis for blocked sends → fix patterns
- Quarterly: re-check state mini-TCPA list; new states get added often
- After every 10 brokers: consider migrating Redis to a paid plan (free tier = 10K cmd/day)

## License & legal

This software is provided for use by Iseri Agency only. Each broker client signs a separate Service Agreement + DPA. The agency is **not a law firm** — for binding legal advice on TCPA / state laws / data privacy, retain qualified counsel.

For internal questions: batur@iseriagency.com.
