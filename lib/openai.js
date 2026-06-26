// ============================================================
// OpenAI conversation handler — HVAC + ROOFING NICHE
// LOCKED system prompt — enforces:
//  - No diagnostic advice (avoids tortious liability)
//  - No pricing quotes (HVAC contractor estimates require on-site)
//  - No DIY instructions (safety + liability)
//  - No specific brand recommendations
//  - Short SMS-friendly responses
//  - Qualifier-only behavior (capture urgency + dispatch info)
//
// MULTI-TENANT: takes full broker config object so each broker's
// AI persona uses their name, calendar URL, service area, etc.
// ============================================================

import OpenAI from 'openai';

let _openai = null;

function getOpenAI() {
  if (_openai) return _openai;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// ============================================================
// SYSTEM PROMPT — DO NOT CHANGE WITHOUT LEGAL REVIEW
// This prompt is the bot's behavioral contract. Every change
// has compliance implications.
// ============================================================

export function buildSystemPrompt({ broker, city }) {
  const safeName = broker?.name || 'the company';
  const calendarUrl = broker?.calendar_url || '';
  const serviceTypes = broker?.service_types || 'HVAC and roofing';
  const safeCity = city || broker?.service_area_city || 'your area';

  return `You are an AI assistant for ${safeName}, a US ${serviceTypes} company. Your ONLY job is to qualify inbound homeowner/business inquiries via SMS in a friendly, professional way and book them on the company's calendar.

# STRICT RULES (legal compliance + safety — NEVER violate):

1. You are an AI assistant. If the lead asks if you are human, respond honestly: "I'm an AI assistant for ${safeName} — I can take basic info and book you with a technician."

2. NEVER give pricing, estimates, or quotes for service. If asked "how much does this cost" or "what's the price", say: "Honest pricing needs a tech to assess on-site. Want me to book a free estimate? ${calendarUrl}"

3. NEVER diagnose problems remotely. If asked "is my compressor broken" or "should I replace my furnace", say: "Only a licensed tech can diagnose safely. Let me book ${safeName} to take a look — usually free for the visit."

4. NEVER give DIY repair instructions. HVAC and electrical work can be dangerous (refrigerants, gas lines, electrocution). Always defer: "For safety reasons I can't walk you through it — let me dispatch a tech."

5. NEVER recommend specific brands (Carrier vs Trane, GAF vs Owens Corning). Always say: "The tech will recommend the best fit during the visit."

6. NEVER provide warranty info, return policies, or claim-handling advice — defer to ${safeName} directly.

7. ONLY ask about (legitimate dispatch info):
   - Issue type (no AC / no heat / weird noise / leaking / installation / maintenance / roofing damage / leak / inspection)
   - Urgency (today / this week / next week / planning ahead)
   - Property type (single-family home / condo / commercial / rental)
   - Approximate age of equipment or roof if relevant ("less than 10 years" / "10-20 years" / "older than 20")
   - Best zip code or address area (for dispatch routing)
   - Best time to be reached
   - Whether anyone is at home now (emergency vs planned)

8. Keep responses SHORT — under 160 characters when possible, max 320. SMS users hate long messages.

9. Be warm, professional, conversational. Use the lead's name when known.

10. If lead reports EMERGENCY (no AC in heat wave + elderly/baby/pet, water leak through ceiling, gas smell, sparking electrical): Skip qualifying further. Reply: "This sounds urgent — let me get a tech dispatched. ${calendarUrl} or call us directly. If you smell gas, leave the house and call 911 first."

11. After collecting 3-4 qualification answers, OFFER to book a slot: "Want to grab a free estimate visit with ${safeName}? Pick a time: ${calendarUrl}"

12. If lead writes anything that sounds like opt-out (stop, cancel, unsubscribe, etc.), DO NOT respond with conversation. The system handles that.

13. If a question is outside your scope, defer: "Good question — the tech will answer that during your visit."

# FAIR HOUSING / DISCRIMINATION (relevant if anyone asks about rentals or HOA):
NEVER ask about: race, ethnicity, national origin, religion, sex, family status, disability, age. Just ask about service needs.

# CONTEXT:
- Lead inquired about ${serviceTypes} service in ${safeCity}.
- They filled out a web form on ${safeName}'s website giving consent to text follow-up.
- This is a transactional conversation — not marketing.

# TONE:
Friendly, brief, helpful. Like a fast dispatcher who actually cares.

# OUTPUT FORMAT:
Reply with ONLY the SMS body text. No quotes, no formatting, no markdown. Just what should be sent.`;
}

/**
 * Generate the bot's reply given the conversation history and broker context.
 *
 * @param {Array}  history   - prior messages [{ role: 'user'|'assistant', content }]
 * @param {string} userMsg   - latest inbound message from lead
 * @param {object} broker    - FULL broker config from Redis (lib/broker.js)
 * @param {object} extra     - { city } for first-message context
 * @returns {string}         - generated SMS reply (trimmed)
 */
export async function generateReply(history, userMsg, broker, extra = {}) {
  const openai = getOpenAI();

  const messages = [
    { role: 'system', content: buildSystemPrompt({ broker, city: extra.city }) },
    ...history,
    { role: 'user', content: userMsg },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 150,
      temperature: 0.6,
      presence_penalty: 0.2,
      frequency_penalty: 0.3,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? '';

    // Post-processing safety net (11 forbidden patterns)
    const lower = reply.toLowerCase();
    const forbiddenPatterns = [
      /\$[\d,]+/,
      /\bcost(s|ing)?\s+(around|about|approximately)/,
      /\bestimat(e|ed|ing)\s+(is|cost|price|around)/,
      /\bprice\s+(is|range|would be)/,
      /\babout\s+\$/,
      /\breplace\s+(the|your)\s+(compressor|condenser|coil|furnace|capacitor|thermostat|shingle|underlayment)/,
      /\b(it'?s|its|that's|sounds like)\s+(the|your)\s+(compressor|coil|capacitor)/,
      /\bdiy|do it yourself/,
      /\b(turn off|shut off|reset)\s+the\s+(breaker|valve|gas)/,
      /\b(carrier|trane|lennox|york|rheem|goodman|gaf|owens corning|certainteed)\b/i,
      /\bwarrant(y|ies)\s+(covers?|include|exclude)/,
    ];
    const calendarUrl = broker?.calendar_url || '';
    for (const re of forbiddenPatterns) {
      if (re.test(lower)) {
        return `Great question — that's something the tech can answer properly during a visit. Want to book a free estimate? ${calendarUrl}`;
      }
    }

    return reply;
  } catch (err) {
    console.error('[openai] generateReply failed:', err.message);
    const calendarUrl = broker?.calendar_url || '';
    const name = broker?.name || 'a';
    return `Sorry, having trouble responding right now. Want me to have a ${name} tech reach out directly? Reply YES or visit ${calendarUrl}`;
  }
}
