// ============================================================
// Quiet-Hour Enforcement
// TCPA federal: 8am-9pm local time
// State mini-TCPAs (FL/OK/WA/MD): 8am-8pm local time (stricter)
// Returns true if it's currently OK to send SMS to this lead
// ============================================================

import { STRICT_STATES } from './areacodes.js';

/**
 * Returns the current hour (0-23) in the given IANA timezone.
 * Uses Intl.DateTimeFormat for proper DST handling.
 */
export function currentHourInTimezone(tz) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find((p) => p.type === 'hour');
    const hour = parseInt(hourPart.value, 10);
    // Intl returns 0-23 with hour12:false in most environments,
    // but some return 24 for midnight - normalize.
    return hour === 24 ? 0 : hour;
  } catch (err) {
    // If timezone is invalid, fail safe by returning a "quiet hour" so we don't send.
    console.error('[timezone] Invalid TZ:', tz, err.message);
    return 23;
  }
}

/**
 * Check if sending an SMS to this lead right now is legal under TCPA/mini-TCPA.
 *
 * @param {string} state - US state code (e.g. "FL", "TX", "CA", "UNKNOWN")
 * @param {string} tz    - IANA timezone (e.g. "America/New_York")
 * @returns {object}     - { allowed: bool, reason: string, retryAfterHour: number|null }
 */
export function isSendAllowedNow(state, tz) {
  const hour = currentHourInTimezone(tz);

  // Strict states: 8am-8pm only (FL/OK/WA/MD have stricter mini-TCPA)
  const isStrict = STRICT_STATES.has(state);
  const startHour = 8;
  const endHour = isStrict ? 20 : 21; // 8pm strict, 9pm federal

  if (hour >= startHour && hour < endHour) {
    return { allowed: true, reason: 'within window', retryAfterHour: null };
  }

  // Calculate when to retry: tomorrow's 8am or today's 8am if before 8am
  const retryHour = startHour;
  return {
    allowed: false,
    reason: `Outside ${startHour}am-${endHour}:00 ${isStrict ? 'strict' : 'federal'} window in ${state} (currently ${hour}:00 local)`,
    retryAfterHour: retryHour,
  };
}

/**
 * Calculate seconds until next 8am in the given timezone.
 * Used to schedule queued messages.
 */
export function secondsUntil8amLocal(tz) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type) => parseInt(parts.find((p) => p.type === type).value, 10);
    const currentHour = get('hour');

    // If currently < 8am, retry today at 8am; else tomorrow at 8am
    // We compute as: seconds until next 8am tick
    const secInHour = 3600;
    if (currentHour < 8) {
      return (8 - currentHour) * secInHour;
    }
    // Tomorrow 8am: (24 - currentHour) + 8 hours
    return (24 - currentHour + 8) * secInHour;
  } catch (err) {
    console.error('[timezone] secondsUntil8amLocal error:', err.message);
    // Fail safe: 12 hours
    return 12 * 3600;
  }
}
