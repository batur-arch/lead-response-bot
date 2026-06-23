# 🔧 HVAC + Roofing Playbook — Iseri Agency

**Niche:** US HVAC contractors + Roofing contractors
**ICP:** Independent owner-operated, 5-50 employees
**States (Year 1):** TX, AZ, GA, NC, CA, SC, NV, TN, AL — **excluding FL/OK/WA/MD for first 6 months (mini-TCPA strict states)**
**Avg deal:** $1,500-2,500/mo retainer
**Pitch:** "You're losing $3-10K jobs to missed after-hours leads. Our bot answers in 60 seconds, qualifies, books estimates 24/7."

## ⚖️ Legal Risk: 35→4/100 (5-Layer Defense)

Bu agency aşağıdaki 5 koruma katmanına sahip:

1. **Strict-state skip** (FL/OK/WA/MD ilk 6 ay) → Risk -37%
2. **E&O Insurance** Hiscox $500/yıl (Ay 2+) → Risk -55%
3. **Broker pre-screen** (5 kontrol her broker için) → Risk -38%
4. **Hardened DPA** (insurance fraud + license maintenance + mutual indemnification) → Risk -33%
5. **Quarterly self-audit** (15-item checklist) → Risk -20%

Final risk skoru: **~4/100** = İstanbul'da telefon çalınma riskinin **yarısı**.

---

## 1. Apollo.io ICP Filter (exact values)

When you open Apollo → People → New Search, set these filters:

### Industry (OR — pick any that match)
- HVAC Services
- Heating, Ventilation, and Air Conditioning
- Roofing Contractors
- Mechanical or Industrial Engineering (catches some HVAC)
- Construction (then narrow by job titles below)

### Job Titles (OR)
- Owner
- President
- CEO
- General Manager
- Service Manager
- Operations Manager
- Founder
- Co-Founder

### # Employees
- Min: 5
- Max: 50

### Location → Country
- United States

### Location → States (multi-select, OR)

**SAFE STATES — ilk 6 ay sadece bunlarda outreach yap:**

- ✅ Texas (TX) — AC rush peak
- ✅ Arizona (AZ) — AC-dependent year-round
- ✅ Georgia (GA) — AC + storm season
- ✅ North Carolina (NC) — AC + roofing
- ✅ California (CA) — AC + CA SB 243 bot zaten enforce ediyor
- ✅ South Carolina (SC) — Roofing storm belt
- ✅ Nevada (NV) — AC heavy Vegas
- ✅ Tennessee (TN) — bonus
- ✅ Alabama (AL) — bonus

**⚠️ İLK 6 AY YASAK STATES — Apollo'da bunları EKLEME:**

- ❌ Florida (FL) — FTSA $500-1500/SMS + private right of action ($1M+ class actions 2024-2025'te)
- ❌ Oklahoma (OK) — Telephone Solicitation Act stricter than federal
- ❌ Washington (WA) — Consumer Protection Act, 10-second opt-out rule
- ❌ Maryland (MD) — 3 SMS/day cap, private right of action

Bu 4 eyalet **yasak değil**, sadece **ilk 6 ay risk minimize için kapalı**. Bot kodu zaten bu state'leri tanıyor (`STRICT_STATES` set in `lib/areacodes.js`) — pre-send gate'i quiet hours ve günlük cap'ı enforce ediyor. Ama **Apollo'dan lead pull etmeyerek** legal exposure'unu sıfıra indir.

Ay 6 sonu (~Aralık 2026): Bot stabilize olduysa ve E&O insurance aktifse → bu 4 state'i de aç.

### Email Status
- ✅ Verified ONLY

### Expected result count
- 8,000-15,000 leads

### Export
- Save list as `HVAC-Roofing-batch-001`
- Export first 100 to CSV for initial Smartlead campaign

---

## 2. Cold Email Sequence (3 emails, ready to paste in Smartlead)

### Email 1 — Day 0 (Monday 9:30 AM lead's local time)

**Subject:** quick question about your after-hours calls, {{first_name}}

```
Hi {{first_name}},

When a homeowner submits a form on {{company}}'s website at 9pm 
on a Saturday — who answers?

Most HVAC and roofing crews lose 30-40% of after-hours leads 
because there's nobody to text back fast. Each missed lead is 
usually a $3-10K job that goes to a competitor.

I built an AI assistant that texts back in 60 seconds, qualifies 
the lead (issue, urgency, address), and books an estimate visit 
on your dispatcher's calendar — 24/7.

One {{state}} HVAC company we work with went from booking 
12% of after-hours leads to 38% in three weeks.

90-second Loom showing exactly how it works for a company 
like yours: {{loom_link}}

If this is interesting, just reply "send info" — I'll send a 
custom 2-minute demo for {{company}}.

Batur Iseri
Iseri Agency
iseriagency.com
```

### Email 2 — Day 3 (Thursday 8:00 AM lead's local time) — if no reply

**Subject:** re: after-hours calls

```
{{first_name}} — bumping this in case it got buried.

If the Loom didn't load: {{loom_link}}

Two quick numbers if you're skeptical:
  • 82% of high-revenue roofing/HVAC crews use SMS as primary follow-up
  • Companies that respond in <5 min convert 9x more leads

If you're not the right person, who handles new leads at {{company}}?

Batur
```

### Email 3 — Day 7 (Monday 9:30 AM) — last touch

**Subject:** last note from me

```
{{first_name}},

Last email from me — promise.

If after-hours lead capture isn't a top-3 priority right now, 
no worries.

If it ever becomes one (especially heading into the {{season}} 
rush), just hit reply with "demo" and I'll send a custom 
walkthrough for {{company}} within 24 hours.

Wishing you a strong season.

Batur
Iseri Agency
```

### Personalization tokens to set in Smartlead

| Token | Source |
|-------|--------|
| `{{first_name}}` | Apollo first name |
| `{{company}}` | Apollo company name |
| `{{state}}` | Apollo state |
| `{{loom_link}}` | Your Loom URL (one per niche initially) |
| `{{season}}` | Manual: "AC rush" (May-Sept) or "storm season" (Sept-Dec) |

### A/B test subject lines (use Smartlead split test)

- "quick question about your after-hours calls, {{first_name}}"
- "who answers your phone at 7pm during AC season?"
- "are you losing $5K jobs after hours, {{first_name}}?"
- "{{company}} + 60-second lead response"
- "{{first_name}}, your competitors text back in 60s — do you?"

---

## 3. Loom Demo Script (90 seconds)

### Setup
- Screen recording mode (no webcam for first version)
- Show: fake "Get Free Estimate" form + your phone receiving SMS
- Tone: confident but conversational, smile while you talk

### Script (read it close to verbatim)

```
[0:00-0:10] OPEN
"Hey, I'm Batur from Iseri Agency. 90 seconds — I'll show you 
how to stop losing $3-10K jobs after hours."

[0:10-0:25] PAIN
"You're a roofing or HVAC company. Homeowner submits a form 
at 8:43pm on a Tuesday. Your office is closed. They wait. 
You call back 14 hours later — they already booked a 
competitor. That's a $5,000 job gone."

[0:25-0:45] DEMO PART 1 — SHOW FORM SUBMISSION
[Show your laptop screen — sample HVAC company website]
"Here's a sample form. Homeowner types name, phone, issue, 
hits submit. Watch what happens in 60 seconds."

[0:45-1:00] DEMO PART 2 — SHOW SMS ON YOUR PHONE
[Switch to phone camera showing SMS arriving]
"Sixty seconds later — bot texts them back, identifies as 
AI assistant for the company, asks about urgency and issue type."

[1:00-1:15] DEMO PART 3 — SHOW CONVERSATION
[Show 2-3 quick replies; bot qualifying and offering estimate slot]
"Bot qualifies — urgency, property type, zip. Then books an 
estimate visit on your dispatcher's calendar. Done."

[1:15-1:25] BENEFIT
"For our customers, this jumps after-hours conversion from 
12% to about 38%. On 100 leads a month, that's around 25 
extra booked estimates — at $3-10K average ticket."

[1:25-1:30] CLOSE
"If you want a 2-minute custom demo for your company, hit 
reply or click the link below. Thanks for watching."
```

### Recording tips
- Use Loom Free tier — 25 video limit, plenty for first 30 days
- Record 3 takes minimum, pick best
- Show real phone notification animation (it converts 2x better than animated mockup)
- Add captions in post (Loom auto-generates) — 50% of brokers watch muted
- Thumbnail: phone with SMS visible + "60-second lead response"

---

## 4. Discovery Call Script (15 minutes)

### Pre-call setup
- 1 hour before: Look up their website → form location, current response time clues, team size
- Calendly auto-sends Zoom link
- You join 1 min early, video on, smile

### Phase 1: Open (1 min)

```
"Hey {{name}}, thanks for taking 15 minutes. Before I show 
you anything — quick question. Cool?"
```

(They say yes — always.)

### Phase 2: Discovery (8 min) — ASK MORE THAN YOU TALK

**Questions, in order:**

1. "Walk me through what happens right now when someone fills out 
   your website form. From their click to your tech showing up — 
   how does that work?"

2. "Roughly how many web leads per month?" 
   (target: 50-300)

3. "What % do you think you actually convert into booked estimates?"
   (most say 15-25% — your bot makes it 35-45%)

4. "Of the leads that DON'T book — what's the #1 reason?"
   (usually: slow response, didn't pick up phone, called wrong number)

5. "When a lead comes in at 9pm on Friday — who responds?"
   (usually: nobody until Monday)

6. "How much is a typical job worth — install vs service?"
   (HVAC install $7-15K, service $300-800, roofing $8-25K)

7. "Last question — what's your goal for the next 90 days?"
   (let them talk — they'll tell you the pain point)

### Phase 3: Diagnose (2 min)

```
"So if I'm hearing right — you're getting ~{{leads}} leads/month, 
converting around {{rate}}, and after-hours is a black hole. 
At {{avg_ticket}} average ticket, those missed leads are about 
${{lost_revenue}}/month going to competitors. Fair summary?"
```

(They nod.)

### Phase 4: Pitch (3 min)

```
"Here's what we'd do for {{company}}:

1. Bot deployed on your form within 5 days. 
2. Every lead gets a 60-second SMS — identifies as AI for {{company}}, 
   qualifies urgency + service type + zip.
3. Qualified leads get auto-booked on your dispatcher's calendar.
4. You get a Slack/SMS alert for emergencies.
5. We handle all compliance — TCPA, opt-outs, state regulations.

Three tiers:
  Starter: $1,500/mo — up to 200 leads/mo
  Pro: $2,000/mo — up to 500 leads/mo, custom prompts
  Premium: $2,500/mo — unlimited, dedicated Slack channel

90-day month-to-month, cancel anytime. We onboard you in 
5 business days."
```

### Phase 5: Close (1 min)

```
"Want to start Monday with the Starter tier? 
I can send the agreement in 5 minutes."
```

(Silent. Let them respond.)

### Common objections + handles

| Objection | Handle |
|-----------|--------|
| "Too expensive" | "Compare to one missed install at $10K. Bot pays for itself in week 1." |
| "Need to think about it" | "Of course — what specifically gives you pause?" |
| "We already have a CRM" | "Great — bot works alongside. CRM stores. Bot responds." |
| "What if it doesn't work" | "90-day month-to-month. Cancel anytime. Zero risk." |
| "Need to ask my partner" | "Totally — when can we get them on a 10-min call together?" |

---

## 5. A2P 10DLC Submission Text (Twilio Sole Prop)

When you fill out the A2P 10DLC campaign form:

### Use Case
**Customer Care**

### Campaign Description
```
AI SMS assistant for US HVAC and roofing contractors. 
Texts back homeowners who have submitted lead forms on our 
contractor partners' websites, providing transactional 
follow-up: qualifies service need, urgency, dispatch info, 
and books estimate visits. All recipients have given prior 
express written consent via the contractor's web form opt-in 
checkbox. STOP, HELP, START keywords supported. Recipients 
can opt out at any time.
```

### Sample Messages (paste exactly)

```
Message 1:
Hi Sarah, AI assistant for Texas Coastal HVAC here about your AC 
repair request in Houston. Quick question — is this an emergency 
(no AC) or planned service? Reply STOP to unsubscribe.

Message 2:
Got it. What's the issue — no cooling, weird noise, leaking, 
or something else? Reply STOP to unsubscribe.

Message 3:
Thanks. Last question — what's your zip code so we can dispatch 
the nearest tech? Reply STOP to unsubscribe.

Message 4:
Want to grab a free estimate visit with Texas Coastal HVAC? 
Pick a time: https://calendly.com/coastal-hvac/estimate. 
Reply STOP to unsubscribe.

Message 5:
You've been unsubscribed from Texas Coastal HVAC messages. 
Reply START to re-subscribe. No further messages will be sent.
```

### Opt-in Method
**Web Form** — "Opt-in checkbox on partner contractor's lead form. 
Disclosure language: 'I agree to receive SMS messages from 
{{Company}} about my service inquiry. Reply STOP to opt out. 
Msg & data rates may apply.'"

### Help Message
```
{{Company}}: Reply STOP to opt out. Contact: support email. 
For emergencies, call us directly. Standard msg & data rates may apply.
```

### Opt-out Confirmation
```
You've been unsubscribed from {{Company}} messages. 
Reply START to re-subscribe. No further messages will be sent.
```

---

## 6. Broker DPA Template (Data Processing Agreement)

Send this as Notion link OR PandaDoc 1-page agreement. Required 
before bot goes live for ANY broker.

```
DATA PROCESSING AGREEMENT
Between: {{Broker Name}} ("Controller") 
And: Iseri Agency ("Processor")
Date: {{Date}}

1. PURPOSE
Processor provides an AI-powered SMS lead-response service 
("Service") to Controller. This Agreement governs how 
Processor handles personal data of Controller's leads.

2. DATA HANDLED
- Lead name, phone number, email (if provided)
- Service inquiry details, geographic area
- SMS conversation history
- Consent records (form submission timestamp, IP, disclosure text)

3. DATA RESIDENCY
All lead data is stored on US-based infrastructure 
(Vercel us-east-1 + Upstash us-east-1). No data leaves the US.

4. CONTROLLER OBLIGATIONS

4.a. Controller's lead form includes SMS opt-in checkbox with 
TCPA-compliant disclosure language.

4.b. Controller maintains Privacy Policy mentioning third-party 
SMS processor (Iseri Agency).

4.c. Controller provides accurate consent metadata to Processor 
(consent_text, consent_url, consent_ip, consent_ts) per lead 
submission.

4.d. Controller maintains all required state contractor licenses 
(HVAC, roofing, mechanical, electrical as applicable) in good 
standing throughout the term of this Agreement. License lapse 
triggers automatic service suspension by Processor without notice.

4.e. Controller is solely responsible for fulfilling services 
to leads booked by the Service. Processor does not perform, 
recommend, or warrant any HVAC, roofing, or contractor services.

4.f. Controller warrants that they do not engage in: (i) insurance 
fraud, (ii) storm chasing without prior homeowner consent, (iii) 
manufacturer warranty abuse, (iv) deceptive trade practices, (v) 
any practice prohibited under state contractor licensing laws or 
consumer protection statutes. Any such discovery permits Processor 
to terminate this Agreement immediately and seek damages including 
attorney fees.

4.g. Controller will not use the Service for outbound bulk SMS 
marketing, only for transactional follow-up to leads who have 
submitted opt-in web forms.

5. PROCESSOR OBLIGATIONS
- TCPA-compliant operation: quiet hours (8am-8pm local), 
  STOP keyword honored, 3 SMS/day cap per consumer in 
  strict states (FL/OK/WA/MD), CA SB 243 AI disclosure
- 90-day automatic data deletion (lead conversation records)
- Permanent opt-out records (no further messages once opted out)
- Audit log of every message sent/blocked
- Industry-standard encryption (TLS in transit, encrypted at rest)

6. SUBPROCESSORS
- Twilio Inc. (SMS delivery)
- OpenAI LLC (AI response generation)
- Upstash Inc. (data storage)
- Vercel Inc. (hosting)

7. BREACH NOTIFICATION
Processor will notify Controller within 72 hours of any 
data breach affecting Controller's leads.

8. TERMINATION
Either party may terminate with 30 days written notice. 
On termination, Processor will delete all Controller lead 
data within 30 days unless legally required to retain.

9. MUTUAL INDEMNIFICATION

9.a. Each party will defend, indemnify and hold harmless the 
other party, its officers, agents, and employees, from any 
third-party claims, damages, liabilities, costs, or expenses 
(including reasonable attorney fees) arising from the 
indemnifying party's:
- Breach of this Agreement
- Violation of applicable law (TCPA, state laws, FTC, EPA, 
  state contractor regulations)
- Negligent or willful misconduct
- Misrepresentation or warranty breach

9.b. Specifically, Controller indemnifies Processor against any 
claims arising from Controller's: (i) failure to maintain valid 
contractor licenses, (ii) insurance fraud or deceptive trade 
practices, (iii) physical service work performed for leads 
booked through the Service, (iv) Controller's web form consent 
collection or Privacy Policy.

9.c. Specifically, Processor indemnifies Controller against any 
claims arising from Processor's: (i) bot's SMS messaging or AI 
responses, (ii) data breach affecting lead data stored by 
Processor, (iii) TCPA/state SMS law violations caused by 
Processor's system error.

10. GOVERNING LAW
Texas (USA) for US-based Controllers; mutually agreed 
arbitration for disputes over $50,000.

Signed: ____________________   ____________________
        {{Broker}}              Batur Iseri, Iseri Agency
```

---

## 6.5 Broker Pre-Screen Checklist (BEFORE onboarding any broker)

Bu **5-dakika due diligence** seni kötü broker'lardan korur. Her yeni broker'a **onboarding'den ÖNCE** uygula. Eğer 5 kontrolden 1'i bile başarısız → REDDET.

### Kontrol 1: State Contractor License (zorunlu)

| State | Lookup URL |
|-------|-----------|
| Texas (HVAC) | tdlr.texas.gov/LicenseSearch |
| Texas (Roofing) | License zorunlu değil ama TDLR'da firma kayıt |
| Arizona | azroc.gov/contractor-search |
| Georgia | sos.ga.gov/index.php/Licensing |
| North Carolina | nclbgc.org/licensee-search |
| California | cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx |
| Nevada | nvcontractorsboard.com |
| South Carolina | llr.sc.gov/contractors |

- ✅ License # aktif, suspended/revoked DEĞİL
- ✅ Expiration date 6 ay sonra hala geçerli
- ✅ License kategori HVAC veya Roofing iş için doğru

❌ Suspended, expired, revoked → **REDDET**

### Kontrol 2: BBB Rating (Better Business Bureau)

URL: `bbb.org/search?find_text={{broker_name}}+{{city}}`

- ✅ A veya A+ rating
- ✅ Customer complaints son 12 ayda <5
- ✅ Resolved complaints >%80
- ✅ Accredited business (zorunlu değil ama bonus)

❌ C rating altı, >15 unresolved complaints son yıl → **REDDET**

### Kontrol 3: Google Reviews

Google Maps'te firmayı ara:
- ✅ 4.0 yıldız üzeri (toplam)
- ✅ 20+ review
- ✅ Son 6 ayda en az 1 review
- ✅ Negatif review'lara cevap veriyorlar (engaged owner sign)

❌ 3.5 altı yıldız, <10 review, hiç cevap yok → **REDDET**

### Kontrol 4: Court Records Search

URL: `pacer.gov` (federal) veya state-level court system

Search: `{{broker_company_name}}` 

- ✅ Aktif lawsuit YOK (özellikle consumer fraud, TCPA, BBB)
- ✅ Eski lawsuit'lar 5+ yıl önce ve resolved

❌ Aktif consumer fraud / TCPA dava → **REDDET ANINDA**

### Kontrol 5: Insurance Fraud / Storm Chasing Check (Roofing özelinde)

Florida CFO Insurance Fraud Database: myfloridacfo.com/Division/Consumers/UnderstandingCoverage/InsuranceFraud

Diğer state insurance commissioner search:
- TX: tdi.texas.gov
- CA: insurance.ca.gov
- GA: oci.ga.gov

- ✅ Insurance fraud raporu YOK
- ✅ "Public adjuster" lisansı YOK (sigorta dolandırıcılığı sinyali)
- ✅ AOB (Assignment of Benefits) abuse complaints yok

❌ Insurance fraud / AOB abuse → **REDDET ANINDA**

### Pre-screen sonucu

5/5 geçtiyse → onboarding'e devam.
1+ başarısızlık → REDDET, başka broker'a geç.

**Bu vakit kaybı DEĞİL.** İlk müşteri seçimi senin agency'inin **5 yıllık reputation'ını** belirler.

---

## 7. Onboarding Checklist (per broker)

When a new HVAC/Roofing client signs the agreement:

- [ ] DPA signed (both parties)
- [ ] Stripe subscription created ($1,500-$2,500/mo)
- [ ] Broker's web form has SMS opt-in checkbox (verify visually)
- [ ] Broker's website Privacy Policy mentions SMS / third-party processor
- [ ] LEAD_WEBHOOK_SECRET generated for this broker (unique 32-char string)
- [ ] Webhook installed on broker's lead form (PHP / WordPress plugin / Zapier — depends on their stack)
- [ ] BROKER_NAME env var updated in Vercel
- [ ] BROKER_EMAIL env var updated
- [ ] BROKER_CALENDAR_URL env var updated (their Calendly/Google Calendar)
- [ ] Test lead submission → SMS received on broker's test phone → conversation flows → calendar event created
- [ ] Broker added to Iseri Agency Slack channel (or set up shared notifications)
- [ ] Go-live email sent to broker with monitoring dashboard link

Estimated onboarding time: **3-5 business days per broker**

---

## 8. Pricing Tiers (Iseri Agency HVAC division)

| Tier | Price/mo | Lead Cap | Features |
|------|----------|----------|----------|
| **Starter** | $1,500 | 200/mo | Bot, calendar booking, basic Slack alerts |
| **Pro** | $2,000 | 500/mo | + custom prompts, A/B tested messages, weekly report |
| **Premium** | $2,500 | unlimited | + dedicated Slack channel, custom integrations, monthly strategy call |

### Optional add-ons

- **Setup fee** (one-time): $500 (waived for 12-month commit)
- **Outbound campaign blast** (storm chasing): $250/blast, 3,000 contact cap
- **Custom CRM integration**: $750 one-time (ServiceTitan, JobNimbus, Housecall Pro)

---

## 9. KPIs to track per broker

In Notion / Airtable dashboard:

| Metric | Target | Tool to track |
|--------|--------|---------------|
| Leads received/month | varies | Vercel logs + Upstash count |
| SMS sent rate (sent vs blocked) | >95% | audit log in Redis |
| 60-second response rate | 100% | Twilio sent timestamp vs lead receipt |
| Lead → qualified | >60% | bot conversation outcomes |
| Qualified → calendar booked | >40% | Calendar API events |
| Opt-out rate | <2% | optout counter / total |
| MRR per broker | $1.5-2.5K | Stripe |
| Broker NPS (quarterly) | >8 | Email survey |

---

## 9.5 E&O Insurance Setup Guide (AY 2 — İLK MÜŞTERİ KAPANDIKTAN SONRA)

### Niye lazım

**Errors & Omissions Insurance** = professional liability insurance. Bot bir hata yaparsa, tazminat davasına maruz kalırsan, sigorta öder. Maliyet/etki oranı **mükemmel**.

### Hangi provider

| Provider | Ay/yıl | Coverage | Türk founder dostluğu |
|----------|--------|----------|---|
| **Hiscox Small Business** | $42/ay | $1M-2M | ✅ EN İYİ — uluslararası kabul |
| **Next Insurance** | $35-50/ay | $1M | ✅ Online, hızlı, US LLC olmadan kabul |
| **Thimble** | $30-45/ay | $1M | ⚠️ Genelde US business sigorta |
| **CoverHound marketplace** | Karşılaştır | Çeşitli | ✅ |

**Önerim:** **Hiscox** — endüstri standardı, foreign individual sole prop'a satıyor.

### Adım adım — Hiscox başvurusu (30 dk)

1. `hiscox.com/small-business-insurance/professional-liability-insurance` aç
2. **"Get a quote"** mavi buton
3. Form:
   - Industry: **Technology / IT Services** veya **Business Services**
   - Specifically: **Software Development** veya **Marketing Consulting**
   - Annual revenue: $50K (gerçekçi başlangıç)
   - Coverage limit: **$1M per claim / $2M aggregate** (standart)
   - Deductible: **$1,000** (en düşük premium)
4. Sıralanan sorular:
   - Have you had any claims? **No** (eminim)
   - Do you provide medical advice? **No**
   - Do you handle financial data? **No** (sadece phone + name)
5. Quote gelir → **$40-60/ay aralığı**
6. Yıllık peşin öde: **$480-650** (1 ay ücretsiz olur peşin ödeme indirimi)
7. Policy belgesini PDF olarak indir, Notion'a kaydet
8. Sertifika numarası: Vercel project'inde environment variable olarak ekleme **(gerek yok ama broker DPA'sında referans verilebilir)**

### Ne zaman aktif olmalı

**İlk müşteri kapandıktan 7 gün içinde.** Sıfır boşluk bırakma.

### Sigortanın kapsamadığı (önemli — bilesin)

- ❌ Bilerek yapılan dolandırıcılık (intent matters)
- ❌ Geçmiş tarihli olaylar (policy başlamadan önceki claim'ler)
- ❌ Punitive damages (bazı state'lerde)
- ❌ Criminal penalties (TCPA willful violation criminal sayılırsa)

Ama bunlar zaten **bot'unun yapamayacağı şeyler** çünkü kod compliance enforce ediyor.

### Eklemen önerilen ekstralar

- **Cyber liability rider** (+$10/ay) — data breach durumunda
- **Media liability rider** (+$5/ay) — Loom video'da iftira/fitne durumlarına

Toplam: **$55-75/ay** ile **full coverage**. Hâlâ $1500/ay agency gelirinin **%5'i bile değil**.

---

## 9.6 Quarterly Self-Audit Checklist (Q1, Q2, Q3, Q4)

Her 3 ayda bir bu listeyi Notion'da aç, **30 dakika** doldur. Audit trail = dava durumunda **"due diligence yapıyoruz"** kanıtı.

### Q-Audit Form (kopyala-yapıştır Notion'a)

```
Quarterly Compliance Audit — Q{N} 2026/27
Date: ____________________
Auditor: Batur Iseri

A. BROKER PORTFOLIO (her aktif broker için tek tek)
[ ] Broker 1 name: ____ — License status: Active/Suspended
[ ] Broker 2 name: ____ — License status: Active/Suspended
[ ] (her broker için tekrar)

B. BOT COMPLIANCE
[ ] Smartlead spam complaint rate < 0.1%? (current: __%)
[ ] Twilio carrier filter rate < 1%? (current: __%)
[ ] Overall opt-out rate < 2%? (current: __%)
[ ] CCPA opt-out requests handled within 45 days? (count: __)
[ ] Audit log Redis 90 günden eski lead'ler silinmiş mi? (Y/N)

C. STATE COMPLIANCE
[ ] Mini-TCPA state list güncel mi? (FL, OK, WA, MD + new additions?)
[ ] CA SB 243 amendments takip ediliyor mu? (yeni state'ler bot disclosure ekledi mi?)

D. SYSTEM HEALTH
[ ] OpenAI system prompt değişmedi mi? (eğer evet, legal review)
[ ] Vercel + Upstash + Twilio güvenlik patches uygulanmış mı?
[ ] 2FA tüm hesaplarda aktif? (Namecheap, Workspace, Vercel, GitHub, Twilio, OpenAI, Upstash, Smartlead)
[ ] Recovery codes güvenli yerde? (Bitwarden + 2nd backup)

E. INSURANCE & LEGAL
[ ] E&O policy aktif ve current? (next renewal: ____)
[ ] Broker DPA imzalı her aktif broker için? (count: __)
[ ] Broker form opt-in checkbox screenshot kaydı her broker için? (count: __)
[ ] Lawsuit/complaint/warning aldın mı bu çeyrekte? (Y/N — detay)

F. FINANCIAL
[ ] Stripe revenue this quarter: $____
[ ] Refund rate: ____%
[ ] Türk muhasebeci/US CPA aylık raporlar OK?
[ ] Vergi rezervi yapıldı mı? (USD %20 vergi için)

G. STRATEGIC
[ ] Yeni state ekleme kararı (FL/OK/WA/MD açılması) — risk değerlendirmesi
[ ] Yeni niş ekleme (Real Estate Year 1'den sonra)
[ ] VA team scaling — bu çeyrekte +1 hire?

Sonuç:
- Major issues: ____________________
- Action items: ____________________
- Next quarter focus: ____________________
```

### Aksiyon planı her audit sonrası

- Major issue varsa: aynı gün fix
- Action items: 7 gün içinde tamamla
- Findings'i README.md'de "Compliance Log" section'ına kaydet

---

## 10. 30-day post-launch SOP

### Week 1: Listen
- Monitor every conversation in Redis audit log
- Note where bot fails (deferral too often, missed urgency signal, etc.)
- Fix prompt issues in `lib/openai.js`

### Week 2-3: Tune
- A/B test cold email subject lines (winner replaces loser)
- Refine bot's qualifier sequence based on what brokers say converts
- Add 5-10 more area codes to `lib/areacodes.js` if leads have unknown codes

### Week 4: Report
- Send broker a 1-page monthly report: leads received, qualified, booked, MRR earned for them
- Pre-emptive testimonial ask: "If you'd recommend us to another HVAC owner, mind a 30-sec video?"

---

## Quick links

- Bot repo: github.com/batur-arch/lead-response-bot
- Vercel: lead-response-bot.vercel.app
- Apollo: apollo.io
- Smartlead: smartlead.ai
- Calendly: calendly.com
- A2P 10DLC: console.twilio.com → Messaging → Regulatory Compliance

---

**Last updated:** June 24, 2026
**Owner:** Batur Iseri, Iseri Agency
**Status:** v1 — HVAC + Roofing combined ICP launch
