const student = {
  lead_id: 'mp2-demo-001',
  kind: 'student',
  submitted_at: '2026-11-17T14:00:00Z',
  source: 'arrival-guide',
  campaign_id: 'bilbao-welcome',
  variant_id: 'checklist-a',
  cohort_code: 'DEMO-JAN',
  contact_email: 'arrivals@example.invalid',
  language: 'en',
  arrival_window: 'January',
  needs: ['study', 'budget'],
  checklist: ['Find a quiet study spot', 'Check arrival events'],
  enrichment: {
    status: 'ready', segment: 'student', persona: null, university: null,
    arrival_wave: 'January', language: 'en', intent: 'arrival support',
    reason: 'Requested study and budget support.', prompt_version: 'fixture-v1',
  },
}

const partner = {
  lead_id: 'mp2-demo-002',
  kind: 'partner',
  submitted_at: '2026-11-17T14:01:00Z',
  source: 'partner-form',
  contact_email: 'partner@example.invalid',
  organization: 'Example Study Hall',
  needs: ['Explore a joint event'],
  enrichment: {
    status: 'needs_review', segment: 'partner', persona: null, university: null,
    arrival_wave: null, language: 'en', intent: null,
    reason: 'The proposed event and audience need clarification.', prompt_version: 'fixture-v1',
  },
}

export const fixtures = { student, partner }
