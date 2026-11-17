// Adapters: the model and the Capture endpoint. Secrets come from the environment and stay on the server.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

// ── Model ────────────────────────────────────────────────────────────────────────────────────────────────────────
// Live: Claude through the Anthropic Messages API. Needs ANTHROPIC_API_KEY. WELCOME_MODEL picks the model.
export function createClaudeModel({ apiKey = process.env.ANTHROPIC_API_KEY, model = process.env.WELCOME_MODEL || 'claude-haiku-5-5', timeoutMs = 20000 } = {}) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return {
    name: 'claude:' + model,
    async checklist({ prompt, profile, facts }) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          signal: ctrl.signal,
          headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({
            model,
            max_tokens: 1200,
            system: prompt,
            messages: [{ role: 'user', content: 'PROFILE:\n' + JSON.stringify(profile) + '\n\nFACTS:\n' + JSON.stringify(facts) }]
          })
        });
        if (!res.ok) throw new Error('model HTTP ' + res.status);
        const data = await res.json();
        const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
        const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
        return JSON.parse(json).items;
      } finally { clearTimeout(timer); }
    }
  };
}

// Mock: a fixed, rule-following answer built from the facts. For tests and dry-run rehearsal. Labelled as mock.
export function createMockModel({ fail = null } = {}) {
  let calls = 0;
  return {
    name: 'mock',
    get calls() { return calls; },
    async checklist({ profile, facts }) {
      calls++;
      if (fail === 'error') throw new Error('mock model unavailable');
      if (fail === 'invented') return [{ text: 'Rooms cost €200.', source_id: 'made-up' }, ...Array(4).fill({ text: 'Walk around.', source_id: null })];
      const mine = facts.filter((f) => profile.needs.includes(f.need));
      const rest = facts.filter((f) => !profile.needs.includes(f.need));
      const items = [...mine, ...rest].slice(0, 5).map((f) => ({ text: f.text, source_id: f.id }));
      items.push({ text: 'After week one, the hard part is finding your people. Open Find Your Corner.', source_id: null });
      return items;
    }
  };
}

// ── Capture ──────────────────────────────────────────────────────────────────────────────────────────────────────
// Live: pair 2's endpoint. Assumed contract until Federica and Carter confirm it:
//   POST CAPTURE_URL, JSON lead  ->  2xx {"lead_id": "...", "accepted": true}  or  {"lead_id": "...", "duplicate": true}
export function createHttpCapture({ url = process.env.CAPTURE_URL, token = process.env.CAPTURE_TOKEN, timeoutMs = 8000 } = {}) {
  if (!url) throw new Error('CAPTURE_URL is not set');
  return {
    name: 'http:' + new URL(url).host,
    async submit(lead) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          method: 'POST',
          signal: ctrl.signal,
          headers: { 'content-type': 'application/json', 'idempotency-key': lead.lead_id, ...(token ? { authorization: 'Bearer ' + token } : {}) },
          body: JSON.stringify(lead)
        });
        // Capture's contract (Carter, 17 Nov 2026): 201 accepted (new), 200 replayed (same id, identical data, no new
        // record), 400 invalid fields, 409 same id with changed data, 503 temporary (retry with the same id).
        if (!res.ok) {
          const err = new Error('capture HTTP ' + res.status);
          // 4xx other than 408/429 will not change on a retry (invalid fields, id reused with other data).
          err.permanent = res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429;
          throw err;
        }
        let body = {};
        try { const j = await res.json(); if (j && typeof j === 'object') body = j; } catch { /* an empty body is fine */ }
        // The HTTP status is the acknowledgement: 201 = accepted, 200 = replayed. readAck still refuses a body that
        // names another lead_id or carries errors / ok:false.
        const word = res.status === 201 ? 'accepted' : res.status === 200 ? 'replayed' : body.status;
        return { ...body, status: word };
      } finally { clearTimeout(timer); }
    }
  };
}

// Local stand-in for Capture while pair 2's endpoint is not ready: keeps one row per lead_id, acknowledges
// duplicates, and can be told to fail the next N calls to rehearse recovery.
export function createLocalCapture({ file = null, failNext = 0 } = {}) {
  let rows = {};
  if (file && existsSync(file)) rows = JSON.parse(readFileSync(file, 'utf8'));
  let toFail = failNext;
  const save = () => { if (file) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(rows, null, 2)); } };
  return {
    name: 'local-capture (dry run)',
    rows: () => Object.values(rows),
    failNext(n) { toFail = n; },
    async submit(lead) {
      if (toFail > 0) { toFail--; throw new Error('local capture forced failure'); }
      if (rows[lead.lead_id]) return { lead_id: lead.lead_id, duplicate: true };
      rows[lead.lead_id] = { ...lead, captured_at: new Date().toISOString() };
      save();
      return { lead_id: lead.lead_id, accepted: true };
    }
  };
}
