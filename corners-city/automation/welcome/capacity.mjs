// Capacity check: can the team review the sign-ups this app is expected to bring in?
// Every input below is an ASSUMPTION for the demo, not a measured figure. Replace them with the team's numbers.
export const ASSUMPTIONS = {
  goal: 'Arrival goal: sign-ups from the January wave before spring classes start (PROJECT.md, Arrival waves)',
  expected_signups_per_week: { 'arrival-guide': 15, 'partner-email': 10, 'instagram': 5 },   // assumption
  review_share: 0.2,             // assumption: share of leads Enrich marks needs_review
  minutes_per_review: 5,         // assumption
  review_hours_available: 2,     // assumption: hours per week the team can give to review
  date: '2026-11-13'
};

export function capacity(a = ASSUMPTIONS, actualLeads = []) {
  const expected = Object.values(a.expected_signups_per_week).reduce((s, n) => s + n, 0);
  const reviewHoursNeeded = +(expected * a.review_share * a.minutes_per_review / 60).toFixed(2);
  const actualBySource = {};
  for (const l of actualLeads) actualBySource[l.source || 'direct'] = (actualBySource[l.source || 'direct'] || 0) + 1;
  return {
    label: 'ASSUMPTIONS, not measured',
    goal: a.goal,
    date: a.date,
    expected_signups_per_week: expected,
    review_hours_needed: reviewHoursNeeded,
    review_hours_available: a.review_hours_available,
    fits: reviewHoursNeeded <= a.review_hours_available,
    max_weekly_signups_at_this_capacity: Math.floor(a.review_hours_available * 60 / (a.review_share * a.minutes_per_review)),
    actual_signups_by_source: actualBySource,
    actual_note: actualLeads.length ? 'Counts from this run (fictional data unless stated)' : 'No run data yet'
  };
}
