// node --test   (Node 20 or newer, no install)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { processSubmission, createContext, validate, leadIdFor, loadContent, checkItems, readAck, POLICY } from './welcome.mjs';
import { createMockModel, createLocalCapture } from './adapters.mjs';
import { capacity, ASSUMPTIONS } from './capacity.mjs';

const fixture = (name) => JSON.parse(readFileSync(new URL('./fixtures/' + name + '.json', import.meta.url)));
const ctxWith = (opts = {}) => createContext({
  model: opts.model || createMockModel(),
  capture: opts.capture || createLocalCapture(),
  policy: { ...POLICY, captureWaitMs: 0 },
  now: () => new Date('2026-11-17T14:00:00Z'),
  sleep: async () => {}
});
const content = loadContent();
const SHARED = ['lead_id', 'kind', 'submitted_at', 'source', 'campaign_id', 'variant_id', 'cohort_code', 'contact_email', 'language', 'arrival_window', 'needs', 'checklist'];

test('a valid sign-up gets a source-backed AI checklist and Capture acknowledges one lead', async () => {
  const ctx = ctxWith();
  const out = await processSubmission(fixture('chiara'), ctx);
  assert.equal(out.status, 'confirmed');
  assert.equal(out.checklist_mode, 'ai');
  assert.ok(out.items.some((i) => i.source_id && i.source), 'at least one item shows its source');
  assert.match(out.items.at(-1).text, /Find Your Corner/);
  const rows = ctx.capture.rows();
  assert.equal(rows.length, 1);
  for (const k of SHARED) assert.ok(k in rows[0], 'lead record has ' + k);
  assert.equal(rows[0].kind, 'student');
  assert.equal(rows[0].lead_id, leadIdFor('fixture-chiara-0001'));
});

test('campaign, variant, source and cohort tags reach Capture unchanged', async () => {
  const ctx = ctxWith();
  await processSubmission(fixture('chiara'), ctx);
  const [lead] = ctx.capture.rows();
  assert.deepEqual([lead.source, lead.campaign_id, lead.variant_id, lead.cohort_code], ['arrival-guide', 'bilbao-welcome', 'checklist-a', 'DEMO-JAN']);
});

test('model down: the student still gets a labelled fallback checklist and the lead still reaches Capture', async () => {
  const ctx = ctxWith({ model: createMockModel({ fail: 'error' }) });
  const out = await processSubmission(fixture('marta'), ctx);
  assert.equal(out.status, 'confirmed');
  assert.equal(out.checklist_mode, 'fallback');
  assert.equal(ctx.capture.rows()[0].checklist_mode, 'fallback');
  assert.equal(ctx.capture.rows()[0].checklist_prompt_version, null);
  assert.equal(checkItems(out.items, content), null);
});

test('a model answer with an invented source is rejected and replaced by the fallback', async () => {
  const ctx = ctxWith({ model: createMockModel({ fail: 'invented' }) });
  const out = await processSubmission(fixture('chiara'), ctx);
  assert.equal(out.checklist_mode, 'fallback');
  assert.ok(ctx.log.rows.some((r) => r.step === 'checklist' && /unknown source_id/.test(r.note || '')));
});

test('Capture fails twice, then accepts: one lead, acknowledged on the third try', async () => {
  const ctx = ctxWith({ capture: createLocalCapture({ failNext: 2 }) });
  const out = await processSubmission(fixture('chiara'), ctx);
  assert.equal(out.status, 'confirmed');
  assert.equal(out.capture.attempts, 3);
  assert.equal(ctx.capture.rows().length, 1);
});

test('Capture down: no confirmation is shown; a replay recovers with the same lead id, one model call and one row', async () => {
  const model = createMockModel();
  const capture = createLocalCapture({ failNext: POLICY.captureAttempts });
  const ctx = ctxWith({ model, capture });
  const first = await processSubmission(fixture('chiara'), ctx);
  assert.equal(first.status, 'pending');
  assert.equal(capture.rows().length, 0);
  const second = await processSubmission(fixture('chiara'), ctx);
  assert.equal(second.status, 'confirmed');
  assert.equal(second.lead_id, first.lead_id);
  assert.deepEqual(second.items, first.items, 'the checklist is the same text');
  assert.equal(model.calls, 1, 'the model is not called again on replay');
  assert.equal(capture.rows().length, 1);
});

test('replaying a confirmed sign-up creates nothing new', async () => {
  const ctx = ctxWith();
  await processSubmission(fixture('chiara'), ctx);
  const again = await processSubmission(fixture('chiara'), ctx);
  assert.equal(again.status, 'confirmed');
  assert.equal(ctx.capture.rows().length, 1);
  assert.ok(ctx.log.rows.some((r) => r.status === 'already_acknowledged'));
});

test('Capture answering "duplicate" counts as acknowledged', async () => {
  const capture = createLocalCapture();
  const a = ctxWith({ capture }), b = ctxWith({ capture });   // two servers, same Capture
  await processSubmission(fixture('chiara'), a);
  const out = await processSubmission(fixture('chiara'), b);
  assert.equal(out.status, 'confirmed');
  assert.equal(out.capture.duplicate, true);
  assert.equal(capture.rows().length, 1);
});

test('readAck: the reply shapes Capture may use are acknowledged', () => {
  const lead = { lead_id: 'lead-1' };
  assert.deepEqual(readAck({ lead_id: 'lead-1', accepted: true }, lead), { duplicate: false });
  assert.deepEqual(readAck({ lead_id: 'lead-1', duplicate: true }, lead), { duplicate: true });
  assert.deepEqual(readAck({ lead_id: 'lead-1' }, lead), { duplicate: false });                        // echo only
  assert.deepEqual(readAck({ lead_id: 'lead-1', status: 'received' }, lead), { duplicate: false });
  assert.deepEqual(readAck({ status: 'Accepted' }, lead), { duplicate: false });                        // status word only
  assert.deepEqual(readAck({ lead_id: 'lead-1', status: 'replayed' }, lead), { duplicate: true });
});

test('readAck: a reply about another lead, a refusal or an unknown status is NOT an acknowledgement', () => {
  const lead = { lead_id: 'lead-1' };
  assert.equal(readAck({ lead_id: 'lead-2', accepted: true }, lead), null);
  assert.equal(readAck({ lead_id: 'lead-1', accepted: false }, lead), null);
  assert.equal(readAck({ lead_id: 'lead-1', status: 'rejected' }, lead), null);
  assert.equal(readAck({ lead_id: 'lead-1', error: 'bad field' }, lead), null);
  assert.equal(readAck({ ok: true }, lead), null);
  assert.equal(readAck({}, lead), null);
  assert.equal(readAck(null, lead), null);
  assert.equal(readAck('accepted', lead), null);
});

test('a Capture that answers with status "received" is acknowledged, and a refusal leaves no confirmation', async () => {
  const lenient = createLocalCapture(); const submit = lenient.submit;
  lenient.submit = async (lead) => { const r = await submit(lead); return { lead_id: r.lead_id, status: r.duplicate ? 'replayed' : 'received' }; };
  const out = await processSubmission(fixture('chiara'), ctxWith({ capture: lenient }));
  assert.equal(out.status, 'confirmed');
  assert.equal(lenient.rows().length, 1);

  const refusing = { name: 'refusing', rows: () => [], submit: async (lead) => ({ lead_id: lead.lead_id, status: 'rejected' }) };
  const failed = await processSubmission(fixture('marta'), ctxWith({ capture: refusing }));
  assert.notEqual(failed.status, 'confirmed');
});

test('bad input is refused with reasons and nothing is sent', async () => {
  const ctx = ctxWith();
  const out = await processSubmission(fixture('invalid'), ctx);
  assert.equal(out.status, 'invalid');
  assert.ok(out.errors.length >= 5);
  assert.equal(ctx.capture.rows().length, 0);
  assert.equal(validate({ ...fixture('chiara'), cohort_code: 'demo jan!' }).ok, false);
});

test('the run log never holds the email address', async () => {
  const ctx = ctxWith();
  await processSubmission(fixture('chiara'), ctx);
  assert.ok(!JSON.stringify(ctx.log.rows).includes('@'));
});

test('every fact in the approved content has a source and a check date', () => {
  for (const f of content.facts) { assert.ok(f.source, f.id + ' has a source'); assert.match(f.checked, /^\d{4}-\d{2}-\d{2}$/); }
});

test('capacity check is labelled as assumptions and counts actual sign-ups by source', () => {
  const c = capacity(ASSUMPTIONS, [{ source: 'arrival-guide' }, { source: 'arrival-guide' }, { source: 'instagram' }]);
  assert.match(c.label, /ASSUMPTIONS/);
  assert.equal(c.expected_signups_per_week, 30);
  assert.equal(c.review_hours_needed, 0.5);
  assert.equal(c.fits, true);
  assert.deepEqual(c.actual_signups_by_source, { 'arrival-guide': 2, instagram: 1 });
});
