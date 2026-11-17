// Welcome micro-app (Mini Project 2, pair 1, C-14 and C-15): turn a new arrival's answers into a source-backed
// "Your first week in Bilbao" checklist and hand one traceable student lead to Capture (pair 2).
// No dependencies. Policy for retries is in POLICY below; the prompt is in prompts/; the approved facts in city-content.json.
import { createHash, randomUUID } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

export const PROMPT_VERSION = 'checklist-v1';
export const POLICY = {
  captureAttempts: 3,          // tries before the lead is left pending and the student can retry
  captureWaitMs: 800,          // first wait; doubles each try. WELCOME_FAST=1 sets it to 0 for rehearsal
  minItems: 5,
  maxItems: 7
};

export const NEEDS = ['housing', 'paperwork', 'transport', 'budget', 'study', 'people'];
export const ARRIVAL_WINDOWS = ['September', 'January', 'other'];
export const LANGUAGES = ['en', 'es'];

export function loadContent(file = join(HERE, 'city-content.json')) {
  return JSON.parse(readFileSync(file, 'utf8'));
}
export function loadPrompt(version = PROMPT_VERSION) {
  return readFileSync(join(HERE, 'prompts', version + '.md'), 'utf8');
}

// ── Input validation ─────────────────────────────────────────────────────────────────────────────────────────────
const TAG = /^[a-z0-9-]{1,40}$/;
const COHORT = /^[A-Z0-9-]{2,20}$/;
const SUBMISSION = /^[A-Za-z0-9-]{8,64}$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

export function validate(body) {
  const errors = [];
  const b = body && typeof body === 'object' ? body : {};
  const needs = Array.isArray(b.needs) ? [...new Set(b.needs)] : [];
  if (!SUBMISSION.test(b.submission_id || '')) errors.push('submission_id missing or malformed');
  if (!EMAIL.test(b.contact_email || '')) errors.push('contact_email is not a valid address');
  if (b.consent !== true) errors.push('consent is required');
  if (!ARRIVAL_WINDOWS.includes(b.arrival_window)) errors.push('arrival_window must be one of ' + ARRIVAL_WINDOWS.join(', '));
  if (!LANGUAGES.includes(b.language)) errors.push('language must be en or es');
  if (needs.length === 0 || needs.some((n) => !NEEDS.includes(n))) errors.push('needs must be one or more of ' + NEEDS.join(', '));
  const cohort = b.cohort_code ? String(b.cohort_code).trim().toUpperCase() : null;
  if (cohort && !COHORT.test(cohort)) errors.push('cohort_code must be 2-20 letters, digits or dashes');
  for (const k of ['source', 'campaign_id', 'variant_id']) if (b[k] != null && b[k] !== '' && !TAG.test(b[k])) errors.push(k + ' is malformed');
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    input: {
      submission_id: b.submission_id,
      contact_email: b.contact_email.trim(),
      consent: true,
      arrival_window: b.arrival_window,
      language: b.language,
      needs,
      cohort_code: cohort,
      source: b.source || 'direct',
      campaign_id: b.campaign_id || null,
      variant_id: b.variant_id || null
    }
  };
}

// One submission always gives the same lead id, so a retry or replay never creates a second lead.
export const leadIdFor = (submissionId) => 'lead-' + createHash('sha256').update(submissionId).digest('hex').slice(0, 12);

// ── Checklist ────────────────────────────────────────────────────────────────────────────────────────────────────
const NEXT = {
  en: 'After week one, the hard part is finding your people. Open Find Your Corner to see who is nearby and what is on this week.',
  es: 'Después de la primera semana, lo difícil es encontrar a tu gente. Abre Find Your Corner para ver quién está cerca y qué hay esta semana.'
};

// Checks the model's answer against the rules we can test in code: shape, length, known source ids, and no number
// that is not backed by a fact.
export function checkItems(items, content) {
  const ids = new Set(content.facts.map((f) => f.id));
  if (!Array.isArray(items)) return 'items is not a list';
  if (items.length < POLICY.minItems || items.length > POLICY.maxItems) return `expected ${POLICY.minItems}-${POLICY.maxItems} items, got ${items.length}`;
  for (const it of items) {
    if (!it || typeof it.text !== 'string' || !it.text.trim()) return 'an item has no text';
    if (it.source_id != null && !ids.has(it.source_id)) return 'unknown source_id ' + it.source_id;
    if (it.source_id == null && /\d/.test(it.text)) return 'an unsourced item contains a number';
  }
  return null;
}

export function fallbackChecklist(input, content) {
  const picked = [];
  for (const need of input.needs) for (const f of content.facts) if (f.need === need && !picked.includes(f)) picked.push(f);
  for (const id of ['barik', 'empadronamiento', 'esn', 'campus-leioa']) {
    const f = content.facts.find((x) => x.id === id);
    if (f && !picked.includes(f)) picked.push(f);
  }
  const items = picked.slice(0, POLICY.maxItems - 1).map((f) => ({ text: f.text, source_id: f.id }));
  items.push({ text: NEXT[input.language] || NEXT.en, source_id: null });
  return items;
}

export async function makeChecklist(input, ctx) {
  const { content, model } = ctx;
  const profile = { arrival_window: input.arrival_window, language: input.language, needs: input.needs };
  const facts = content.facts.map(({ id, need, text }) => ({ id, need, text }));
  try {
    const items = await model.checklist({ prompt: ctx.prompt, profile, facts });
    const problem = checkItems(items, content);
    if (problem) throw new Error('model output rejected: ' + problem);
    return { mode: 'ai', items, note: null };
  } catch (e) {
    return { mode: 'fallback', items: fallbackChecklist(input, content), note: e.message };
  }
}

// The lead record we pass to Capture: the shared class fixture plus our checklist provenance.
export function buildLead(input, checklist, content, submittedAt) {
  return {
    lead_id: leadIdFor(input.submission_id),
    kind: 'student',
    submitted_at: submittedAt,
    source: input.source,
    campaign_id: input.campaign_id,
    variant_id: input.variant_id,
    cohort_code: input.cohort_code,
    contact_email: input.contact_email,
    consent: true,
    language: input.language,
    arrival_window: input.arrival_window,
    needs: input.needs,
    checklist: checklist.items.map((i) => i.text),
    checklist_sources: checklist.items.map((i) => i.source_id),
    checklist_mode: checklist.mode,
    checklist_prompt_version: checklist.mode === 'ai' ? PROMPT_VERSION : null,
    content_version: content.version
  };
}

// ── Capture hand-off, with retry under the same lead id ──────────────────────────────────────────────────────────
// What counts as Capture acknowledging THIS lead. Flexible on purpose, because pair 2 has not fixed its reply yet
// (their brief only says a replay gets "the same acknowledgement"). It counts when the reply
//   - echoes our lead_id, or says accepted/duplicate, or carries a status word: received | accepted | duplicate | replayed.
// It never counts when the reply names another lead_id, says accepted:false, carries an error, or has an unknown status word.
// Returns { duplicate } for an acknowledgement, null otherwise.
const FRESH_WORDS = ['received', 'accepted'];
const REPLAY_WORDS = ['duplicate', 'replayed'];
// A reply that REFUSES the lead can still echo our lead_id (found by Austin, 16 Nov). Any of these marks it refused:
// accepted / ok / success = false, rejected = true, or a non-empty `error` / `errors`.
const filled = (v) => Array.isArray(v) ? v.length > 0 : v && typeof v === 'object' ? Object.keys(v).length > 0 : Boolean(v);
export function isRefusal(reply) {
  return reply.accepted === false || reply.ok === false || reply.success === false || reply.rejected === true ||
    filled(reply.error) || filled(reply.errors);
}

export function readAck(reply, lead) {
  if (!reply || typeof reply !== 'object') return null;
  if (reply.lead_id !== undefined && reply.lead_id !== lead.lead_id) return null;
  if (isRefusal(reply)) return null;
  const word = typeof reply.status === 'string' ? reply.status.toLowerCase() : null;
  if (word !== null && !FRESH_WORDS.includes(word) && !REPLAY_WORDS.includes(word)) return null;
  const replay = reply.duplicate === true || (word !== null && REPLAY_WORDS.includes(word));
  const fresh = reply.accepted === true || (word !== null && FRESH_WORDS.includes(word));
  const echoed = reply.lead_id === lead.lead_id;
  if (!replay && !fresh && !echoed) return null;
  return { duplicate: replay };
}

export async function handOff(lead, ctx, runId) {
  const { capture, policy, sleep, log } = ctx;
  let wait = policy.captureWaitMs;
  let last = null;
  let tried = 0;
  for (let attempt = 1; attempt <= policy.captureAttempts; attempt++) {
    tried = attempt;
    try {
      const reply = await capture.submit(lead);
      const ack = readAck(reply, lead);
      if (!ack) throw new Error('capture did not acknowledge this lead');
      log.write({ run_id: runId, lead_id: lead.lead_id, step: 'capture', status: ack.duplicate ? 'duplicate_ack' : 'acknowledged', attempt });
      return { acknowledged: true, attempt, duplicate: ack.duplicate };
    } catch (e) {
      last = e.message;
      log.write({ run_id: runId, lead_id: lead.lead_id, step: 'capture', status: 'failed', attempt, error: last });
      if (e.permanent) break;   // a refusal that a retry cannot change (invalid fields, id reused with other data)
      if (attempt < policy.captureAttempts) { await sleep(wait); wait *= 2; }
    }
  }
  return { acknowledged: false, attempt: tried, error: last };
}

// ── One submission, end to end ───────────────────────────────────────────────────────────────────────────────────
// A replay of the same submission reuses the stored checklist (no second model call, the same text) and only
// retries the Capture hand-off if it was never acknowledged.
export async function processSubmission(body, ctx) {
  const v = validate(body);
  if (!v.ok) return { status: 'invalid', errors: v.errors };
  const input = v.input;
  const leadId = leadIdFor(input.submission_id);
  const runId = ctx.runId();
  const known = ctx.store.get(leadId);

  let lead, checklist;
  if (known) {
    ({ lead, checklist } = known);
    ctx.log.write({ run_id: runId, lead_id: leadId, step: 'replay', status: known.acknowledged ? 'already_acknowledged' : 'retrying_capture' });
    if (known.acknowledged) return result('confirmed', lead, checklist, known.ack, runId, ctx.content);
  } else {
    checklist = await makeChecklist(input, ctx);
    ctx.log.write({ run_id: runId, lead_id: leadId, step: 'checklist', status: checklist.mode, note: checklist.note });
    lead = buildLead(input, checklist, ctx.content, ctx.now().toISOString());
  }

  const ack = await handOff(lead, ctx, runId);
  ctx.store.put(leadId, { lead, checklist, acknowledged: ack.acknowledged, ack });
  return result(ack.acknowledged ? 'confirmed' : 'pending', lead, checklist, ack, runId, ctx.content);
}

function result(status, lead, checklist, ack, runId, content) {
  const sourceOf = (id) => { const f = content.facts.find((x) => x.id === id); return f ? f.source + ', checked ' + f.checked : null; };
  return {
    status,                       // confirmed: Capture acknowledged. pending: show the checklist, offer a retry
    lead_id: lead.lead_id,
    run_id: runId,
    checklist_mode: checklist.mode,
    items: checklist.items.map((i) => ({ ...i, source: sourceOf(i.source_id) })),
    capture: { acknowledged: ack.acknowledged, attempts: ack.attempt, duplicate: !!ack.duplicate }
  };
}

// ── State and log (local files, not committed) ───────────────────────────────────────────────────────────────────
export function createStore(file) {
  let data = {};
  if (file && existsSync(file)) data = JSON.parse(readFileSync(file, 'utf8'));
  return {
    get: (id) => data[id],
    put(id, rec) {
      data[id] = rec;
      if (!file) return;
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, JSON.stringify(data, null, 2));
    },
    all: () => Object.values(data)
  };
}

// The run log never holds an address or free text from the student: run, lead, step, status, attempt, time.
export function createLog(file, now = () => new Date()) {
  const rows = [];
  return {
    rows,
    write(row) {
      const r = { ...row, recorded_at: now().toISOString() };
      rows.push(r);
      if (!file) return;
      mkdirSync(dirname(file), { recursive: true });
      appendFileSync(file, JSON.stringify(r) + '\n');
    }
  };
}

export function createContext({ model, capture, content = loadContent(), prompt = loadPrompt(), store = createStore(),
  log = createLog(), policy = POLICY, now = () => new Date(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  runId = () => 'run-' + randomUUID().slice(0, 8) }) {
  return { model, capture, content, prompt, store, log, policy, now, sleep, runId };
}
