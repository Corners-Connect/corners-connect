import { DatabaseSync } from 'node:sqlite'
import { isDeepStrictEqual } from 'node:util'

const enrichmentFields = [
  'segment', 'persona', 'university', 'arrival_wave', 'language', 'intent', 'reason',
]

export class StoreError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const nonempty = value => typeof value === 'string' && value.trim().length > 0
const object = value => value && typeof value === 'object' && !Array.isArray(value)
const stringList = value => Array.isArray(value) && value.every(nonempty)

function validate(lead) {
  const enrichment = lead?.enrichment
  if (!object(lead) || !['student', 'partner'].includes(lead.kind) ||
      !['lead_id', 'submitted_at', 'source', 'contact_email'].every(key => nonempty(lead[key])) ||
      !/^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/.test(lead.submitted_at) ||
      !Number.isFinite(Date.parse(lead.submitted_at))) {
    throw new StoreError(400, 'Expected a lead ID, kind, submission timestamp, source and contact email.')
  }
  if (['campaign_id', 'variant_id', 'cohort_code'].some(key => lead[key] != null && !nonempty(lead[key])) ||
      (lead.needs !== undefined && !stringList(lead.needs)) ||
      (lead.checklist !== undefined && !stringList(lead.checklist)) ||
      (lead.kind === 'partner' && (!nonempty(lead.organization) || !lead.needs?.length))) {
    throw new StoreError(400, 'Invalid tags, needs, checklist or partner organization.')
  }
  if (!object(enrichment) || !['ready', 'needs_review'].includes(enrichment.status) ||
      !enrichmentFields.every(key => enrichment[key] === null || nonempty(enrichment[key])) ||
      !nonempty(enrichment.prompt_version)) {
    throw new StoreError(400, 'Expected validated enrichment and its prompt version.')
  }
  if (['stored_at', 'updated_at', 'review'].some(key => Object.hasOwn(lead, key))) {
    throw new StoreError(400, 'Storage metadata is assigned by Store.')
  }
}

export function openStore(filename) {
  const db = new DatabaseSync(filename)
  db.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS leads (
      lead_id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      stored_at TEXT NOT NULL,
      updated_at TEXT,
      reviewer TEXT
    );
  `)
  const find = db.prepare('SELECT * FROM leads WHERE lead_id = ?')
  const insert = db.prepare(`
    INSERT INTO leads (lead_id, payload, stored_at) VALUES (?, ?, ?)
    ON CONFLICT (lead_id) DO NOTHING
  `)
  const approve = db.prepare(`
    UPDATE leads SET reviewer = ?, updated_at = ?
    WHERE lead_id = ? AND reviewer IS NULL
      AND json_extract(payload, '$.enrichment.status') = 'needs_review'
  `)
  const all = db.prepare('SELECT * FROM leads ORDER BY stored_at DESC, lead_id')

  function record(row) {
    if (!row) return null
    const lead = { ...JSON.parse(row.payload), stored_at: row.stored_at }
    if (row.reviewer) {
      lead.updated_at = row.updated_at
      lead.review = { decision: 'approved', reviewer: row.reviewer, decided_at: row.updated_at }
      lead.enrichment.status = 'ready'
    }
    return lead
  }

  function handoff(row) {
    const lead = record(row)
    return lead?.enrichment.status === 'ready' ? lead : null
  }

  // Commit before returning a result that a downstream caller can act on.
  function transaction(write) {
    db.exec('BEGIN IMMEDIATE')
    try {
      const result = write()
      db.exec('COMMIT')
      return result
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }
  }

  return {
    store(lead) {
      validate(lead)
      return transaction(() => {
        const { changes } = insert.run(lead.lead_id, JSON.stringify(lead), new Date().toISOString())
        const row = find.get(lead.lead_id)
        if (!isDeepStrictEqual(JSON.parse(row.payload), lead)) {
          throw new StoreError(409, 'This lead ID already has a different payload.')
        }
        return { created: changes === 1, stored_at: row.stored_at, handoff: handoff(row) }
      })
    },
    approve(leadId, reviewer) {
      if (!nonempty(reviewer)) throw new StoreError(400, 'Reviewer name is required.')
      return transaction(() => {
        const { changes } = approve.run(reviewer.trim(), new Date().toISOString(), leadId)
        const row = find.get(leadId)
        if (!row) throw new StoreError(404, 'Lead not found.')
        if (!row.reviewer) throw new StoreError(409, 'This lead does not require review.')
        return { approved: changes === 1, handoff: handoff(row) }
      })
    },
    readyLead(leadId) {
      return handoff(find.get(leadId))
    },
    views() {
      const leads = all.all().map(record)
      return {
        audience: leads.map(({ lead_id, source, campaign_id, variant_id, cohort_code, submitted_at }) =>
          ({ lead_id, source, campaign_id, variant_id, cohort_code, submitted_at })),
        product: leads.filter(lead => lead.kind === 'student').map(lead => ({
          lead_id: lead.lead_id, needs: lead.needs ?? [], arrival_window: lead.arrival_window,
        })),
        operations: leads.map(lead => ({
          lead_id: lead.lead_id, kind: lead.kind, organization: lead.organization,
          needs: lead.kind === 'partner' ? lead.needs : undefined,
          status: lead.enrichment.status,
          route: lead.enrichment.status === 'needs_review' ? 'Human review' : 'Notify',
          reason: lead.enrichment.reason,
          stored_at: lead.stored_at, review: lead.review,
        })),
      }
    },
    close() {
      db.close()
    },
  }
}
