import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

test('demo serves the three views and redacts contact details from handoff receipts', { timeout: 10000 }, async t => {
  const app = spawn(process.execPath, [fileURLToPath(new URL('demo.mjs', import.meta.url))], {
    env: { ...process.env, MP2_DB: ':memory:', MP2_PORT: '0' },
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  t.after(() => app.kill())
  const output = createInterface({ input: app.stdout })
  const { value: startup } = await output[Symbol.asyncIterator]().next()
  assert.match(startup, /^Store demo at http:\/\/127\.0\.0\.1:\d+$/)
  const url = startup.split(' at ')[1]

  async function request(path, method = 'GET') {
    const response = await fetch(url + path, { method, signal: AbortSignal.timeout(3000) })
    assert.equal(response.status, 200)
    return path === '/' ? response.text() : response.json()
  }

  const page = await request('/')
  assert.match(page, /Lead archive/)
  const student = await request('/fixtures?kind=student', 'POST')
  const replay = await request('/fixtures?kind=student', 'POST')
  assert.equal(student.created, true)
  assert.equal(student.handoff.lead_id, 'mp2-demo-001')
  assert.deepEqual(replay, { ...student, created: false })

  const partner = await request('/fixtures?kind=partner', 'POST')
  assert.equal(partner.handoff, null)
  const approval = await request('/approve?id=mp2-demo-002&reviewer=Demo%20Reviewer', 'POST')
  assert.equal(approval.handoff.lead_id, 'mp2-demo-002')
  const views = await request('/views')
  assert.equal(views.audience.length, 2)
  assert.equal(views.product.length, 1)
  assert.equal(views.operations.length, 2)
  assert.equal(views.operations.find(lead => lead.lead_id === 'mp2-demo-002').review.reviewer, 'Demo Reviewer')
  assert.doesNotMatch(JSON.stringify([views, student, approval]), /contact_email|example\.invalid/)
  t.diagnostic(JSON.stringify({ student, replay, partner, approval, viewCounts: [2, 1, 2] }))
})
