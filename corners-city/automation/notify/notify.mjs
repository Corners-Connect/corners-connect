// Notify (Mini Project 2, pair 5, C-18): route a stored lead to the right person, retry once in a controlled way,
// hand a failure to Operations, and never send the same message twice.
// Rules R1 to R6 are in ../routing.md. Retry limits are in ./policy.mjs. No dependencies.
import { randomUUID } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { POLICY } from './policy.mjs';

// ── Owners. Fictional, for the demo. Real owners are the company's decision (routing.md section 2). ──────────────
export const OWNERS = {
  audience: { id: 'demo-owner-audience', team: 'Audience', channel: 'corners-test-audience' },
  operations: { id: 'demo-owner-operations', team: 'Operations', channel: 'corners-test-operations' }
};

const DAY = 24 * 3600 * 1000;

// ── State and log ────────────────────────────────────────────────────────────────────────────────────────────────
// The store keeps delivery state per dispatch key, so a replay resumes instead of repeating.
export function createStore(file) {
  let data = { records: {}, incidents: [], replies: {} };
  if (file && existsSync(file)) data = JSON.parse(readFileSync(file, 'utf8'));
  const save = () => {
    if (!file) return;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(data, null, 2));
  };
  return {
    get: (key) => data.records[key],
    put(rec) { data.records[rec.key] = rec; save(); },
    all: () => Object.values(data.records),
    addIncident(i) { data.incidents.push(i); save(); },
    incidents: () => data.incidents,
    reply: (lead_id) => data.replies[lead_id],
    setReply(lead_id, at) { data.replies[lead_id] = at; save(); }
  };
}

// The redacted record for Dar and Jose: run_id, lead_id, notification_kind, status, attempt_count, recorded_at.
// It never holds an address, a name or free text.
export function createLog(file) {
  const rows = [];
  return {
    rows,
    write(row) {
      rows.push(row);
      if (!file) return;
      mkdirSync(dirname(file), { recursive: true });
      appendFileSync(file, JSON.stringify(row) + '\n');
    }
  };
}

export function createContext({ adapters, store = createStore(), log = createLog(), policy = POLICY, owners = OWNERS,
  now = () => new Date(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), runId = () => 'run-' + randomUUID().slice(0, 8) }) {
  return { adapters, store, log, policy, owners, now, sleep, runId };
}

// ── The gate: act only on a stored, cleared lead (R1, R2, R5) ──────────────────────────────────────────────────────
export function gate(lead) {
  if (!lead || !lead.lead_id) return { ok: false, reason: 'no lead_id' };
  if (!lead.stored_at) return { ok: false, reason: 'not stored yet' };
  const cleared = lead.enrichment?.status === 'ready' || lead.review?.decision === 'approved';
  if (!cleared) return { ok: false, reason: lead.enrichment?.status === 'needs_review' ? 'waiting for review' : 'not enriched yet' };
  if (lead.kind === 'student') {
    if (lead.consent === false) return { ok: false, reason: 'no consent to email' };
    if (!lead.contact_email) return { ok: false, reason: 'no contact' };
    if (!Array.isArray(lead.checklist) || !lead.checklist.length) return { ok: false, reason: 'no checklist' };
    return { ok: true };
  }
  if (lead.kind === 'partner') return lead.organization ? { ok: true } : { ok: false, reason: 'no organization' };
  return { ok: false, reason: 'unknown kind' };
}

export function pickOwner(lead, owners) {
  return lead.organization_type === 'residence' ? owners.operations : owners.audience;
}

// ── Messages. Short sentences, a thing to do (PROJECT.md voice). Alerts carry no personal data. ─────────────────────
function welcome(lead) {
  return {
    dispatchKey: `${lead.lead_id}:student_welcome`, channel: 'email', to: lead.contact_email,
    subject: 'Your first week in Bilbao',
    text: ['Hi,', '', 'You signed up for Corners. Here is your first-week checklist:',
      ...lead.checklist.map((c) => '- ' + c), '', 'One thing to try this week: pick one plan and go.', '',
      'Reply STOP and we delete your address.', '', 'Corners'].join('\n')
  };
}
function ownerAlert(lead, owner, due) {
  return {
    dispatchKey: `${lead.lead_id}:partner_owner_alert`, channel: 'owner', to: owner.channel,
    text: `New partner lead ${lead.lead_id} from ${lead.organization}. Owner: ${owner.id}. Reply due: ${due}. Open the lead table for the details.`
  };
}

// ── Delivery: one dispatch key per lead and kind, controlled retry, incident for Operations ────────────────────────
async function deliver(ctx, runId, lead, kind, message, adapter, meta = {}) {
  const key = message.dispatchKey;
  let rec = ctx.store.get(key) || { key, lead_id: lead.lead_id, kind, status: 'pending', total_attempts: 0, ...meta };
  let attempts = 0;
  const done = (status, extra = {}) => {
    const row = { run_id: runId, lead_id: lead.lead_id, notification_kind: kind, status, attempt_count: attempts, recorded_at: ctx.now().toISOString() };
    ctx.log.write(row);
    return { ...row, dry_run: !!adapter.dryRun, ...extra };
  };
  const incident = (why, recovery) => {
    rec.status = 'incident';
    ctx.store.put(rec);
    const inc = { run_id: runId, lead_id: lead.lead_id, notification_kind: kind, failed_step: 'send via ' + adapter.name,
      owner: ctx.owners.operations.id, reason: why, recovery_action: recovery, recorded_at: ctx.now().toISOString() };
    ctx.store.addIncident(inc);
    return done('incident', { incident: inc });
  };

  if (rec.status === 'sent') return done('already_sent');

  // A replay after an incident starts a fresh run of tries; the key still prevents a second message.
  if (rec.status === 'uncertain') {
    const hit = adapter.find ? await adapter.find(key) : undefined;
    if (hit) { rec.status = 'sent'; rec.ack = hit.ack; ctx.store.put(rec); return done('already_sent'); }
    if (!adapter.find) return incident('delivery is uncertain and this provider has no history',
      `Look in the destination for key ${key}. If it is there, mark it delivered; if not, run replay ${lead.lead_id}.`);
  }
  rec.status = 'pending';

  while (attempts < ctx.policy.maxAttempts) {
    attempts++; rec.total_attempts++;
    try {
      const r = await adapter.send(message);
      rec.status = 'sent'; rec.ack = r.ack; rec.last_error = null;
      ctx.store.put(rec);
      return done('sent', { ack: r.ack });          // shown to the caller; the redacted log row stays six fields
    } catch (e) {
      rec.last_error = e.message;
      if (e.uncertain) {
        rec.status = 'uncertain'; ctx.store.put(rec);
        const hit = adapter.find ? await adapter.find(key) : undefined;
        if (hit) { rec.status = 'sent'; rec.ack = hit.ack; ctx.store.put(rec); return done('sent'); }
        if (!adapter.find) return incident('delivery is uncertain and this provider has no history',
          `Look in the destination for key ${key}. If it is there, mark it delivered; if not, run replay ${lead.lead_id}.`);
        rec.status = 'pending';                      // checked, nothing there: safe to try again
      } else if (!e.temporary) {
        return incident('permanent error: ' + e.message, `Fix the cause (${e.message}), then run replay ${lead.lead_id}.`);
      }
      ctx.store.put(rec);
      if (attempts < ctx.policy.maxAttempts) await ctx.sleep(ctx.policy.backoffMs);
    }
  }
  return incident('retry limit reached after ' + attempts + ' tries: ' + rec.last_error,
    `When the provider is back, run replay ${lead.lead_id}. The key ${key} stops a second message.`);
}

// ── Entry points ───────────────────────────────────────────────────────────────────────────────────────────────────
export async function processLead(lead, ctx, runId = ctx.runId()) {
  const g = gate(lead);
  const kind = lead?.kind === 'student' ? 'student_welcome' : lead?.kind === 'partner' ? 'partner_owner_alert' : 'none';
  if (!g.ok) {
    const row = { run_id: runId, lead_id: lead?.lead_id ?? null, notification_kind: kind, status: 'waiting', attempt_count: 0, recorded_at: ctx.now().toISOString() };
    ctx.log.write(row);
    return { ...row, reason: g.reason };              // R5: nothing is sent; the lead goes on the weekly review list
  }
  if (lead.kind === 'student') return deliver(ctx, runId, lead, 'student_welcome', welcome(lead), ctx.adapters.email);
  const owner = pickOwner(lead, ctx.owners);
  const due = new Date(new Date(lead.submitted_at).getTime() + ctx.policy.replyDueHours * 3600 * 1000).toISOString();
  return deliver(ctx, runId, lead, 'partner_owner_alert', ownerAlert(lead, owner, due), ctx.adapters.owner,
    { owner_id: owner.id, submitted_at: lead.submitted_at, reply_due_at: due });
}

export function logReply(ctx, lead_id, at = ctx.now().toISOString()) { ctx.store.setReply(lead_id, at); }

// R3 and R4: run this on a schedule. A reminder at 24 hours, Operations told at 48, each at most once.
export async function sweep(ctx, now = ctx.now()) {
  const out = [];
  for (const rec of ctx.store.all().filter((r) => r.kind === 'partner_owner_alert' && r.status === 'sent')) {
    if (ctx.store.reply(rec.lead_id)) continue;
    const age = now.getTime() - new Date(rec.submitted_at).getTime();
    const lead = { lead_id: rec.lead_id };
    const step = async (kind, owner, text, hours) => {
      if (age < hours * 3600 * 1000) return;
      const key = `${rec.lead_id}:${kind}`;
      const message = { dispatchKey: key, channel: 'owner', to: owner.channel, text };
      out.push(await deliver(ctx, ctx.runId(), lead, kind, message, ctx.adapters.owner));
    };
    await step('partner_reminder', { channel: ctx.owners.audience.channel },
      `Reminder: partner lead ${rec.lead_id} has no reply logged after ${ctx.policy.reminderAfterHours} hours. Owner: ${rec.owner_id}.`, ctx.policy.reminderAfterHours);
    await step('partner_escalation', ctx.owners.operations,
      `Day limit missed: partner lead ${rec.lead_id}, owner ${rec.owner_id}, no reply logged after ${ctx.policy.escalateAfterHours} hours.`, ctx.policy.escalateAfterHours);
  }
  return out;
}
