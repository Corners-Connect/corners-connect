// The one place that says how often we retry and when we stop.
// Mirrors rule R6 and the day limit in ../routing.md. Change it here and nowhere else.
export const POLICY = {
  maxAttempts: 3,                 // first try + 2 retries
  backoffMs: 5 * 60 * 1000,       // 5 minutes between tries (tests pass 0)
  retryOn: 'temporary',           // permanent errors stop at once and go to Operations
  stopWhen: 'attempt limit reached, a permanent error, or an uncertain delivery that cannot be checked',
  reminderAfterHours: 24,         // R3: the owner is reminded once
  escalateAfterHours: 48,         // R4: Operations is told
  replyDueHours: 24               // the day limit shown in every partner alert
};
