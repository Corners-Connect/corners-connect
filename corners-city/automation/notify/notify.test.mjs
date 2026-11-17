import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createContext, createStore, createLog, processLead, sweep, logReply, gate } from './notify.mjs';
import { createOutbox, createSlackWebhook } from './adapters.mjs';
import { POLICY } from './policy.mjs';

const load = (n) => JSON.parse(readFileSync(new URL('./fixtures/' + n, import.meta.url), 'utf8'));
const fast = { ...POLICY, backoffMs: 0 };
const temp = (message = 'provider busy') => ({ message, temporary: true });

function setup({ emailFail = [], ownerFail = [], policy = fast, at = '2026-11-17T14:06:00Z' } = {}) {
  const sent = [];
  const mk = (failures) => {
    const o = createOutbox({ failures });
    const send = o.send;
    o.send = async (m) => { const r = await send(m); sent.push(m); return r; };
    return o;
  };
  const ctx = createContext({
    adapters: { email: mk(emailFail), owner: mk(ownerFail) },
    store: createStore(), log: createLog(), policy,
    now: () => new Date(at), sleep: async () => {}, runId: (() => { let n = 0; return () => 'run-t' + ++n; })()
  });
  return { ctx, sent };
}

test('R1: a stored, ready student gets the welcome email with the checklist', async () => {
  const { ctx, sent } = setup();
  const r = await processLead(load('student.json'), ctx);
  assert.equal(r.status, 'sent');
  assert.equal(r.attempt_count, 1);
  assert.equal(sent.length, 1);
  assert.match(sent[0].text, /Find a quiet study spot/);
  assert.equal(sent[0].to, 'arrivals@example.invalid');
});

test('R2: a partner enquiry is assigned to an owner and shows the one-day target', async () => {
  const { ctx, sent } = setup();
  const r = await processLead(load('partner.json'), ctx);
  assert.equal(r.status, 'sent');
  assert.match(sent[0].text, /demo-owner-audience/);
  assert.match(sent[0].text, /Reply due: 2026-11-18T14:05:00.000Z/);
  assert.equal(ctx.store.get('mp2-demo-002:partner_owner_alert').owner_id, 'demo-owner-audience');
});

test('R5: a lead that needs review, or is not stored, sends nothing', async () => {
  const { ctx, sent } = setup();
  const r = await processLead(load('student-needs-review.json'), ctx);
  assert.equal(r.status, 'waiting');
  assert.equal(r.reason, 'waiting for review');
  const notStored = { ...load('student.json'), stored_at: undefined };
  assert.equal((await processLead(notStored, ctx)).reason, 'not stored yet');
  assert.equal(sent.length, 0);
});

test('a human review decision clears a needs_review lead', async () => {
  const { ctx, sent } = setup();
  const lead = { ...load('student-needs-review.json'), review: { decision: 'approved', at: '2026-11-17T15:00:00Z' } };
  assert.equal((await processLead(lead, ctx)).status, 'sent');
  assert.equal(sent.length, 1);
});

test('a student who did not agree to be emailed gets nothing', () => {
  assert.equal(gate({ ...load('student.json'), consent: false }).reason, 'no consent to email');
});

test('R6: a temporary error is retried, then the message goes out once', async () => {
  const { ctx, sent } = setup({ emailFail: [temp(), temp()] });
  const r = await processLead(load('student.json'), ctx);
  assert.equal(r.status, 'sent');
  assert.equal(r.attempt_count, 3);
  assert.equal(sent.length, 1);
});

test('R6: at the retry limit an incident goes to Operations, then a replay recovers without a duplicate', async () => {
  const { ctx, sent } = setup({ emailFail: [temp(), temp(), temp()] });
  const lead = load('student.json');
  const r = await processLead(lead, ctx);
  assert.equal(r.status, 'incident');
  assert.equal(r.attempt_count, 3);
  assert.equal(r.incident.owner, 'demo-owner-operations');
  assert.match(r.incident.recovery_action, /replay mp2-demo-001/);
  assert.equal(sent.length, 0);
  const again = await processLead(lead, ctx);            // the provider is back
  assert.equal(again.status, 'sent');
  assert.equal(sent.length, 1);
  const third = await processLead(lead, ctx);            // a second replay must not send again
  assert.equal(third.status, 'already_sent');
  assert.equal(sent.length, 1);
});

test('a permanent error stops at once and does not retry', async () => {
  const { ctx } = setup({ emailFail: [{ message: 'bad key', temporary: false }] });
  const r = await processLead(load('student.json'), ctx);
  assert.equal(r.status, 'incident');
  assert.equal(r.attempt_count, 1);
});

test('uncertain delivery that never arrived is checked in history, then sent once', async () => {
  const { ctx, sent } = setup({ emailFail: [{ message: 'timeout after send', uncertain: true, afterDelivery: false }] });
  // The message was not delivered: history finds nothing, so the next try sends it once.
  const r = await processLead(load('student.json'), ctx);
  assert.equal(r.status, 'sent');
  assert.equal(sent.length, 1);
});

test('uncertain delivery with no provider history goes to a person, not a blind replay', async () => {
  const slow = createSlackWebhook({ url: 'https://example.invalid/hook', fetchImpl: async () => { const e = new Error('t'); e.name = 'TimeoutError'; throw e; } });
  const { ctx } = setup();
  ctx.adapters.owner = slow;
  const r = await processLead(load('partner.json'), ctx);
  assert.equal(r.status, 'incident');
  assert.match(r.incident.reason, /uncertain/);
});

test('R3 and R4: a reminder at 24 hours and Operations at 48, each once, and none after a reply', async () => {
  const { ctx, sent } = setup();
  await processLead(load('partner.json'), ctx);
  const day = (h) => new Date(Date.parse('2026-11-17T14:05:00Z') + h * 3600 * 1000);
  assert.equal((await sweep(ctx, day(10))).length, 0);
  const at25 = await sweep(ctx, day(25));
  assert.deepEqual(at25.map((r) => r.notification_kind), ['partner_reminder']);
  const at49 = await sweep(ctx, day(49));
  assert.ok(at49.some((r) => r.notification_kind === 'partner_escalation' && r.status === 'sent'));
  const before = sent.length;
  await sweep(ctx, day(60));
  assert.equal(sent.length, before, 'no second reminder or escalation');

  const other = setup();
  await processLead(load('partner.json'), other.ctx);
  logReply(other.ctx, 'mp2-demo-002', '2026-11-17T20:00:00Z');
  assert.equal((await sweep(other.ctx, day(60))).length, 0);
});

test('the handoff log holds only the six agreed fields, and no address or name', async () => {
  const { ctx } = setup({ emailFail: [temp()] });
  await processLead(load('student.json'), ctx);
  await processLead(load('partner.json'), ctx);
  for (const row of ctx.log.rows) {
    assert.deepEqual(Object.keys(row).sort(), ['attempt_count', 'lead_id', 'notification_kind', 'recorded_at', 'run_id', 'status']);
    assert.doesNotMatch(JSON.stringify(row), /@|Demo International/);
  }
});

test('the partner alert carries no contact details', async () => {
  const { ctx, sent } = setup();
  const lead = { ...load('partner.json'), contact_email: 'someone@example.invalid' };
  await processLead(lead, ctx);
  assert.doesNotMatch(sent[0].text, /@/);
});

test('delivered but no acknowledgement: history shows it, so the replay does not send a second copy', async () => {
  const file = join(mkdtempSync(join(tmpdir(), 'notify-')), 'outbox.jsonl');
  const email = createOutbox({ file, failures: [{ message: 'connection dropped after send', uncertain: true, afterDelivery: true }] });
  const ctx = createContext({ adapters: { email, owner: createOutbox({ file }) }, store: createStore(), log: createLog(), policy: fast, sleep: async () => {} });
  const r = await processLead(load('student.json'), ctx);
  assert.equal(r.status, 'sent');
  const rows = readFileSync(file, 'utf8').split(String.fromCharCode(10)).filter(Boolean);
  assert.equal(rows.length, 1, 'one copy in the outbox');
});

// ── SMTP / Ethereal adapter (Finn). A fake transport stands in for the mail server. ────────────────────────────────
import { createSmtpEmail } from './adapters.mjs';
function smtpSetup(errors = []) {
  const mails = [];
  const transport = { async sendMail(m) { const e = errors.shift(); if (e) throw Object.assign(new Error(e.message || 'smtp error'), e); mails.push(m); return { messageId: m.messageId }; } };
  const mail = createSmtpEmail({ transport, testTo: 'class-test@corners.test', log: () => {} });
  const ctx = createContext({ adapters: { email: mail, owner: mail }, store: createStore(), log: createLog(), policy: fast,
    now: () => new Date('2026-11-17T14:06:00Z'), sleep: async () => {}, runId: (() => { let n = 0; return () => 'run-s' + ++n; })() });
  return { ctx, mails };
}

test('SMTP: welcome goes to the class test inbox, never to the fixture address, and replays once', async () => {
  const { ctx, mails } = smtpSetup();
  const r = await processLead(load('student.json'), ctx);
  assert.equal(r.status, 'sent');
  assert.equal(mails[0].to, 'class-test@corners.test');
  assert.doesNotMatch(JSON.stringify(mails[0]), /example\.invalid/);
  assert.match(mails[0].text, /Find a quiet study spot/);
  assert.match(r.ack, /^smtp:<mp2-demo-001.student_welcome@corners-notify\.test>$/);
  assert.equal((await processLead(load('student.json'), ctx)).status, 'already_sent');
  assert.equal(mails.length, 1);
});

test('SMTP: a 421 is temporary and retried; a 550 is permanent and goes to Operations at once', async () => {
  let s = smtpSetup([{ responseCode: 421, message: 'try later' }]);
  let r = await processLead(load('student.json'), s.ctx);
  assert.equal(r.status, 'sent'); assert.equal(r.attempt_count, 2);
  s = smtpSetup([{ responseCode: 550, message: 'mailbox unknown' }]);
  r = await processLead(load('student.json'), s.ctx);
  assert.equal(r.status, 'incident'); assert.equal(r.attempt_count, 1); assert.equal(s.mails.length, 0);
});

test('SMTP: a timeout after DATA is uncertain and goes to a person instead of a resend', async () => {
  const { ctx, mails } = smtpSetup([{ code: 'ETIMEDOUT', command: 'DATA', message: 'timeout' }]);
  const r = await processLead(load('student.json'), ctx);
  assert.equal(r.status, 'incident');
  assert.match(r.incident.reason, /no history/);
  assert.equal(mails.length, 0);
});
