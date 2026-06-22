// ============================================================
// US Area Code → State + Timezone Mapping
// Used for state-specific TCPA compliance (mini-TCPA states)
// and quiet-hour enforcement (8am-8pm local time)
// ============================================================

// Map of US area codes to state + timezone (IANA)
// Source: NANPA + NPA-NXX data, simplified for common codes
// Note: covers ~80% of US area codes; defaults to America/New_York if unknown
export const AREA_CODES = {
  // Texas (Central Time, mostly)
  '210': { state: 'TX', tz: 'America/Chicago' },
  '214': { state: 'TX', tz: 'America/Chicago' },
  '254': { state: 'TX', tz: 'America/Chicago' },
  '281': { state: 'TX', tz: 'America/Chicago' },
  '325': { state: 'TX', tz: 'America/Chicago' },
  '346': { state: 'TX', tz: 'America/Chicago' },
  '361': { state: 'TX', tz: 'America/Chicago' },
  '409': { state: 'TX', tz: 'America/Chicago' },
  '430': { state: 'TX', tz: 'America/Chicago' },
  '432': { state: 'TX', tz: 'America/Chicago' }, // West TX, some Mountain
  '469': { state: 'TX', tz: 'America/Chicago' },
  '512': { state: 'TX', tz: 'America/Chicago' },
  '682': { state: 'TX', tz: 'America/Chicago' },
  '713': { state: 'TX', tz: 'America/Chicago' },
  '726': { state: 'TX', tz: 'America/Chicago' },
  '737': { state: 'TX', tz: 'America/Chicago' },
  '806': { state: 'TX', tz: 'America/Chicago' },
  '817': { state: 'TX', tz: 'America/Chicago' },
  '830': { state: 'TX', tz: 'America/Chicago' },
  '832': { state: 'TX', tz: 'America/Chicago' },
  '903': { state: 'TX', tz: 'America/Chicago' },
  '915': { state: 'TX', tz: 'America/Denver' },  // El Paso = Mountain
  '936': { state: 'TX', tz: 'America/Chicago' },
  '940': { state: 'TX', tz: 'America/Chicago' },
  '956': { state: 'TX', tz: 'America/Chicago' },
  '972': { state: 'TX', tz: 'America/Chicago' },
  '979': { state: 'TX', tz: 'America/Chicago' },
  '281': { state: 'TX', tz: 'America/Chicago' },

  // Florida (Eastern Time, mostly)
  '239': { state: 'FL', tz: 'America/New_York' },
  '305': { state: 'FL', tz: 'America/New_York' },
  '321': { state: 'FL', tz: 'America/New_York' },
  '352': { state: 'FL', tz: 'America/New_York' },
  '386': { state: 'FL', tz: 'America/New_York' },
  '407': { state: 'FL', tz: 'America/New_York' },
  '561': { state: 'FL', tz: 'America/New_York' },
  '689': { state: 'FL', tz: 'America/New_York' },
  '727': { state: 'FL', tz: 'America/New_York' },
  '754': { state: 'FL', tz: 'America/New_York' },
  '772': { state: 'FL', tz: 'America/New_York' },
  '786': { state: 'FL', tz: 'America/New_York' },
  '813': { state: 'FL', tz: 'America/New_York' },
  '850': { state: 'FL', tz: 'America/Chicago' }, // Panhandle = Central
  '863': { state: 'FL', tz: 'America/New_York' },
  '904': { state: 'FL', tz: 'America/New_York' },
  '941': { state: 'FL', tz: 'America/New_York' },
  '954': { state: 'FL', tz: 'America/New_York' },

  // Arizona (Mountain Time, no DST)
  '480': { state: 'AZ', tz: 'America/Phoenix' },
  '520': { state: 'AZ', tz: 'America/Phoenix' },
  '602': { state: 'AZ', tz: 'America/Phoenix' },
  '623': { state: 'AZ', tz: 'America/Phoenix' },
  '928': { state: 'AZ', tz: 'America/Phoenix' },

  // Georgia (Eastern Time)
  '229': { state: 'GA', tz: 'America/New_York' },
  '404': { state: 'GA', tz: 'America/New_York' },
  '470': { state: 'GA', tz: 'America/New_York' },
  '478': { state: 'GA', tz: 'America/New_York' },
  '678': { state: 'GA', tz: 'America/New_York' },
  '706': { state: 'GA', tz: 'America/New_York' },
  '762': { state: 'GA', tz: 'America/New_York' },
  '770': { state: 'GA', tz: 'America/New_York' },
  '912': { state: 'GA', tz: 'America/New_York' },

  // North Carolina (Eastern Time)
  '252': { state: 'NC', tz: 'America/New_York' },
  '336': { state: 'NC', tz: 'America/New_York' },
  '704': { state: 'NC', tz: 'America/New_York' },
  '743': { state: 'NC', tz: 'America/New_York' },
  '828': { state: 'NC', tz: 'America/New_York' },
  '910': { state: 'NC', tz: 'America/New_York' },
  '919': { state: 'NC', tz: 'America/New_York' },
  '980': { state: 'NC', tz: 'America/New_York' },
  '984': { state: 'NC', tz: 'America/New_York' },

  // California (Pacific Time) - for CA SB 243 compliance
  '209': { state: 'CA', tz: 'America/Los_Angeles' },
  '213': { state: 'CA', tz: 'America/Los_Angeles' },
  '279': { state: 'CA', tz: 'America/Los_Angeles' },
  '310': { state: 'CA', tz: 'America/Los_Angeles' },
  '323': { state: 'CA', tz: 'America/Los_Angeles' },
  '341': { state: 'CA', tz: 'America/Los_Angeles' },
  '408': { state: 'CA', tz: 'America/Los_Angeles' },
  '415': { state: 'CA', tz: 'America/Los_Angeles' },
  '424': { state: 'CA', tz: 'America/Los_Angeles' },
  '442': { state: 'CA', tz: 'America/Los_Angeles' },
  '510': { state: 'CA', tz: 'America/Los_Angeles' },
  '530': { state: 'CA', tz: 'America/Los_Angeles' },
  '559': { state: 'CA', tz: 'America/Los_Angeles' },
  '562': { state: 'CA', tz: 'America/Los_Angeles' },
  '619': { state: 'CA', tz: 'America/Los_Angeles' },
  '626': { state: 'CA', tz: 'America/Los_Angeles' },
  '628': { state: 'CA', tz: 'America/Los_Angeles' },
  '650': { state: 'CA', tz: 'America/Los_Angeles' },
  '657': { state: 'CA', tz: 'America/Los_Angeles' },
  '661': { state: 'CA', tz: 'America/Los_Angeles' },
  '669': { state: 'CA', tz: 'America/Los_Angeles' },
  '707': { state: 'CA', tz: 'America/Los_Angeles' },
  '714': { state: 'CA', tz: 'America/Los_Angeles' },
  '747': { state: 'CA', tz: 'America/Los_Angeles' },
  '760': { state: 'CA', tz: 'America/Los_Angeles' },
  '805': { state: 'CA', tz: 'America/Los_Angeles' },
  '818': { state: 'CA', tz: 'America/Los_Angeles' },
  '820': { state: 'CA', tz: 'America/Los_Angeles' },
  '831': { state: 'CA', tz: 'America/Los_Angeles' },
  '858': { state: 'CA', tz: 'America/Los_Angeles' },
  '909': { state: 'CA', tz: 'America/Los_Angeles' },
  '916': { state: 'CA', tz: 'America/Los_Angeles' },
  '925': { state: 'CA', tz: 'America/Los_Angeles' },
  '949': { state: 'CA', tz: 'America/Los_Angeles' },
  '951': { state: 'CA', tz: 'America/Los_Angeles' },

  // Oklahoma (Central) - mini-TCPA state
  '405': { state: 'OK', tz: 'America/Chicago' },
  '539': { state: 'OK', tz: 'America/Chicago' },
  '572': { state: 'OK', tz: 'America/Chicago' },
  '580': { state: 'OK', tz: 'America/Chicago' },
  '918': { state: 'OK', tz: 'America/Chicago' },

  // Washington state (Pacific) - mini-TCPA state
  '206': { state: 'WA', tz: 'America/Los_Angeles' },
  '253': { state: 'WA', tz: 'America/Los_Angeles' },
  '360': { state: 'WA', tz: 'America/Los_Angeles' },
  '425': { state: 'WA', tz: 'America/Los_Angeles' },
  '509': { state: 'WA', tz: 'America/Los_Angeles' },
  '564': { state: 'WA', tz: 'America/Los_Angeles' },

  // Maryland (Eastern) - daily-cap state
  '227': { state: 'MD', tz: 'America/New_York' },
  '240': { state: 'MD', tz: 'America/New_York' },
  '301': { state: 'MD', tz: 'America/New_York' },
  '410': { state: 'MD', tz: 'America/New_York' },
  '443': { state: 'MD', tz: 'America/New_York' },
  '667': { state: 'MD', tz: 'America/New_York' },
};

// States with mini-TCPA (stricter than federal):
// - 8am-8pm local time only (vs 8am-9pm federal)
// - Max 3 SMS per consumer per 24h
// - Private right of action ($500-1500/SMS)
export const STRICT_STATES = new Set(['FL', 'OK', 'WA', 'MD']);

// States with AI disclosure law (California SB 243 effective Jan 1, 2026)
export const AI_DISCLOSURE_REQUIRED_STATES = new Set(['CA']);

/**
 * Parse a US phone number string and return state + timezone.
 * Accepts: "+15551234567", "555-123-4567", "(555) 123-4567", "5551234567"
 * Returns: { state, tz, areaCode } or null if not a valid US number
 */
export function lookupPhone(phoneRaw) {
  if (!phoneRaw) return null;
  // Strip everything except digits
  const digits = phoneRaw.toString().replace(/\D/g, '');
  // US numbers are 10 digits, or 11 with leading 1
  let normalized = digits;
  if (digits.length === 11 && digits.startsWith('1')) normalized = digits.slice(1);
  if (normalized.length !== 10) return null;

  const areaCode = normalized.slice(0, 3);
  const data = AREA_CODES[areaCode];

  if (!data) {
    // Unknown area code - default to Eastern Time, no specific state
    // This is the safest default (Eastern is strictest in quiet-hour window)
    return { state: 'UNKNOWN', tz: 'America/New_York', areaCode };
  }

  return { state: data.state, tz: data.tz, areaCode };
}

/**
 * Format a phone number to E.164 (Twilio's required format)
 * "5551234567" → "+15551234567"
 */
export function toE164(phoneRaw) {
  if (!phoneRaw) return null;
  const digits = phoneRaw.toString().replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length === 11) return `+${digits}`;
  return null;
}
