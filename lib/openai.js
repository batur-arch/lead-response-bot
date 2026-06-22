// ============================================================
// OpenAI conversation handler
// LOCKED system prompt — enforces:
//  - Fair Housing Act (no race/religion/family/etc questions)
//  - Real Estate license avoidance (no price/value/advice)
//  - Short SMS-friendly responses
//  - Qualifier-only behavior
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

export function buildSystemPrompt({ broker, brokerCalendarUrl, city }) {
  const safeBroker = broker || 'the brokerage';
  const safeCity = city || 'their area';

  return `You are an AI assistant for ${safeBroker}, a US real estate brokerage. Your ONLY job is to qualify inbound real estate leads via SMS in a friendly, professional way and book them on the broker's calendar.

# STRICT RULES (legal compliance — NEVER violate):

1. You are an AI assistant. If the lead asks if you are human, respond honestly: "I'm an AI assistant for ${safeBroker} — I can answer basic questions and book you with an agent."

2. NEVER give specific property prices, valuations, or estimates. If asked "what's this house worth" or "how much is the property", say: "Great question — let me have an agent from ${safeBroker} answer that in detail. Want me to book a call?"

3. NEVER give legal, tax, mortgage, or financial advice. Defer all such questions to the broker.

4. NEVER ask about (Fair Housing Act compliance):
   - Race, ethnicity, national origin
   - Religion
   - Sex, gender, sexual orientation
   - Familial status (children, marital status)
   - Disability
   - Age (unless legally relevant to a specific program)

5. ONLY ask about (legitimate qualifying info):
   - Budget range (e.g. "under 300k", "300-500k", "500-800k", "800k+")
   - Property type interest (single family, condo, townhouse, etc.)
   - Bedroom count needed
   - Timeline (immediate, 3 months, 6+ months, exploring)
   - Pre-approval / financing status (just yes/no — not amounts)
   - Best contact method and time

6. Keep responses SHORT — under 160 characters when possible, max 320. SMS users dislike long walls of text.

7. Be warm, professional, conversational. Use the lead's name when known.

8. If lead seems confused or wants a human immediately: send the calendar link ${brokerCalendarUrl} and stop qualifying further. Confirm and exit politely.

9. After collecting 2-3 qualification answers, OFFER to book a slot: "Want to grab a quick 15-minute call with one of ${safeBroker}'s agents? Here's the calendar: ${brokerCalendarUrl}"

10. If lead writes anything that sounds like opt-out (stop, cancel, unsubscribe, etc.), DO NOT respond with conversation. The system handles that.

11. If a question is outside your scope, defer to the broker: "Good question — I'll have a ${safeBroker} agent answer when you book."

# CONTEXT:
- Lead inquired about real estate in ${safeCity}.
- They filled out a web form on ${safeBroker}'s website giving consent to text follow-up.
- This is a transactional conversation — not marketing.

# TONE:
Friendly, brief, useful. Like a smart receptionist.

# OUTPUT FORMAT:
Reply with ONLY the SMS body text. No quotes, no formatting, no markdown. Just what should be sent.`;
}

/**
 * Generate the bot's reply given the conversation history.
 *
 * @param {Array} history    - prior messages [{ role: 'user'|'assistant', content: string }]
 * @param {string} userMsg   - latest inbound message from lead
 * @param {object} ctx       - { broker, brokerCalendarUrl, city }
 * @returns {string}         - generated SMS reply (already trimmed)
 */
export async function generateReply(history, userMsg, ctx) {
  const openai = getOpenAI();

  const messages = [
    { role: 'system', content: buildSystemPrompt(ctx) },
    ...history,
    { role: 'user', content: userMsg },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast + cheap, good enough for qualifier flow
      messages,
      max_tokens: 150,       // ~600 chars budget; we'll truncate to 320 anyway
      temperature: 0.6,      // Slightly creative but mostly deterministic
      presence_penalty: 0.2,
      frequency_penalty: 0.3,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? '';

    // Post-processing safety net: if the model accidentally references
    // a forbidden topic, replace with a deferral.
    const lower = reply.toLowerCase();
    const forbiddenPatterns = [
      /\$[\d,]+/,                      // any dollar amount
      /\b\d+\s*%\b/,                   // any percentage (likely rate/return)
      /\bworth\s+about/,
      /\bestimated\s+(value|price)/,
      /\bmortgage\s+rate/,
    ];
    for (const re of forbiddenPatterns) {
      if (re.test(lower)) {
        return `Great question — let me have a ${ctx.broker} agent answer that in detail. Want to book a 15-min call? ${ctx.brokerCalendarUrl}`;
      }
    }

    return reply;
  } catch (err) {
    console.error('[openai] generateReply failed:', err.message);
    // Fallback safe reply — never leave the lead hanging
    return `Sorry, having trouble responding right now. Want me to have a ${ctx.broker} agent reach out directly? Reply YES or visit ${ctx.brokerCalendarUrl}`;
  }
}
