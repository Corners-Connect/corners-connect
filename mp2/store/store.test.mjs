import assert from 'node:assert/strict'
import { mkdtempSync, unlinkSync, rmdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { test } from 'node:test'
import { fixtures } from './fixtures.mjs'
import { openStore } from './store.mjs'

test('identical replay keeps one row, original provenance and handoff timestamp', t => {
  const store = openStore(':memory:')
  t.after(() => store.close())
  const created = store.store(fixtures.student)
  assert.equal(created.created, true)
  assert.deepEqual(created.handoff, { ...fixtures.student, stored_at: created.stored_at })
  const replay = store.store(fixtures.student)
  assert.deepEqual(replay, { ...created, created: false })
  assert.throws(() => store.store({ ...fixtures.student, source: 'changed' }), { status: 409 })
  const views = store.views()
  assert.equal(views.audience.length, 1)
  assert.equal(views.audience[0].source, 'arrival-guide')
  assert.equal(views.audience[0].variant_id, 'checklist-a')
  assert.equal(views.audience[0].submitted_at, fixtures.student.submitted_at)
  assert.deepEqual(views.product[0].needs, ['study', 'budget'])
  assert.equal(views.operations[0].route, 'Notify')
  assert.doesNotMatch(JSON.stringify(views), /contact_email|example\.invalid/)
})

test('review gates Notify and stays approved on replay and repeat approval', t => {
  const store = openStore(':memory:')
  t.after(() => store.close())
  const pending = store.store(fixtures.partner)
  assert.equal(pending.handoff, null)
  assert.equal(store.readyLead(fixtures.partner.lead_id), null)
  assert.equal(store.views().operations[0].route, 'Human review')
  assert.equal(store.views().product.length, 0)

  const { approved, handoff } = store.approve(fixtures.partner.lead_id, 'Demo Reviewer')
  assert.equal(approved, true)
  assert.equal(handoff.enrichment.status, 'ready')
  assert.equal(handoff.review.reviewer, 'Demo Reviewer')
  assert.equal(handoff.review.decision, 'approved')
  assert.equal(handoff.review.decided_at, handoff.updated_at)
  assert.equal(handoff.stored_at, pending.stored_at)
  assert.deepEqual(store.views().operations[0].review, handoff.review)
  assert.deepEqual(store.readyLead(fixtures.partner.lead_id), handoff)
  assert.deepEqual(store.store(fixtures.partner).handoff, handoff)
  assert.deepEqual(store.approve(fixtures.partner.lead_id, 'Other Reviewer'), { approved: false, handoff })
})

test('SQLite write failure blocks handoff, then retry recovers across reopen', t => {
  const directory = mkdtempSync(join(tmpdir(), 'corners-mp2-'))
  const filename = join(directory, 'store.sqlite')
  let store = openStore(filename)
  const control = new DatabaseSync(filename)
  t.after(() => {
    store.close()
    control.close()
    unlinkSync(filename)
    rmdirSync(directory)
  })

  control.exec(`
    CREATE TRIGGER fail_insert BEFORE INSERT ON leads
    BEGIN SELECT RAISE(ABORT, 'simulated write failure'); END;
  `)
  assert.throws(() => store.store(fixtures.student), /simulated write failure/)
  assert.equal(store.readyLead(fixtures.student.lead_id), null)
  assert.equal(store.views().audience.length, 0)

  control.exec('DROP TRIGGER fail_insert')
  const retry = store.store(fixtures.student)
  assert.equal(retry.created, true)
  store.close()
  store = openStore(filename)
  assert.deepEqual(store.readyLead(fixtures.student.lead_id), retry.handoff)
  assert.equal(store.store(fixtures.student).created, false)
  assert.equal(store.views().audience.length, 1)
})
