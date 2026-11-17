#!/usr/bin/env node
// Store -> Notify, one lead ID end to end. Uses Haru and Morgan's real Store module and fixtures (branch
// codex/mp2-store, folder mp2/store/) and hands its committed `handoff` straight to Notify, with no glue in between.
//
//   node store-demo.mjs                              dry run (local outbox)
//   node store-demo.mjs --force-fail=temporary:3     dry run, the student send fails 3 times -> incident -> replay
//   NOTIFY_TRANSPORT=ethereal node store-demo.mjs    live email to a throwaway Ethereal inbox
//
// Store is found at ../../../mp2/store/ (repository root) or at STORE_DIR. Until Store is merged, bring its files in
// without committing them:  git restore --source=origin/codex/mp2-store --worktree -- mp2/store
// Store uses node:sqlite, so this needs Node 24. Store runs in memory here; Notify state starts fresh each run.
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { processLead } from './notify.mjs';
import { buildContext, parseFail, DATA } from './setup.mjs';
import { POLICY } from './policy.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const storeDir = resolve(process.env.STORE_DIR || resolve(here, '../../../mp2/store'));
if (!existsSync(resolve(storeDir, 'store.mjs'))) {
  console.error(`Store not found at ${storeDir}.\nRun from the repository root:  git restore --source=origin/codex/mp2-store --worktree -- mp2/store`);
  process.exit(1);
}
const { openStore } = await import(pathToFileURL(resolve(storeDir, 'store.mjs')).href);
const { fixtures } = await import(pathToFileURL(resolve(storeDir, 'fixtures.mjs')).href);

const failSpec = process.argv.find((a) => a.startsWith('--force-fail='))?.split('=')[1];
const live = ['ethereal', 'smtp'].includes(process.env.NOTIFY_TRANSPORT);
if (failSpec && live) { console.error('--force-fail works with the dry run only (local outbox).'); process.exit(1); }

rmSync(DATA, { recursive: true, force: true });
const store = openStore(':memory:');
// Notify's state lives in .data/state.json and a context reads it when created. The forced failures go into a
// context used only for the student's first send; everything after uses a fresh context that sees the saved state.
const fast = { policy: { ...POLICY, backoffMs: 0 } };
const failing = buildContext({ failures: parseFail(failSpec), ...fast });
const say = (s) => console.log('\n' + s);
const show = (r) => console.log(`   Notify  ${r.lead_id}  ${r.notification_kind}  ${r.status}  attempts=${r.attempt_count}` +
  (r.reason ? `  reason=${r.reason}` : '') + (r.incident ? `\n           incident: ${r.incident.reason}\n           recovery: ${r.incident.recovery_action}` : ''));

console.log(`Store -> Notify · ${live ? 'LIVE email via ' + process.env.NOTIFY_TRANSPORT : 'DRY RUN (local outbox)'} · fictional data`);

say('1. Student signs up: Store stores it, enrichment is ready, so Store hands it over at once');
const s = store.store(structuredClone(fixtures.student));
console.log(`   Store   ${fixtures.student.lead_id}  created=${s.created}  stored_at=${s.stored_at}  handoff=${s.handoff ? 'ready' : 'none'}`);
const first = await processLead(s.handoff, failing);
show(first);
const ctx = live ? failing : buildContext(fast);     // live: keep the one Ethereal inbox for every message
if (first.status === 'incident') {
  say('   Operations replays the same lead from Store after the provider is back');
  show(await processLead(store.readyLead(fixtures.student.lead_id), ctx));
}

say('2. Partner writes: enrichment needs review, so Store holds it and Notify gets nothing');
const p = store.store(structuredClone(fixtures.partner));
console.log(`   Store   ${fixtures.partner.lead_id}  created=${p.created}  handoff=${p.handoff ? 'ready' : 'none (waiting for review)'}`);
const a = store.approve(fixtures.partner.lead_id, 'Demo Reviewer');
console.log(`   Review  approved by ${a.handoff.review.reviewer} at ${a.handoff.review.decided_at}, Store releases it`);
show(await processLead(a.handoff, ctx));

say('3. Both leads are replayed from Store: no second message');
for (const f of [fixtures.student, fixtures.partner]) show(await processLead(store.readyLead(f.lead_id), ctx));

say('Handoff record for Dar and Jose (.data/notify-log.jsonl, six fields, no contact details):');
const { readFileSync } = await import('node:fs');
console.log(readFileSync(DATA + 'notify-log.jsonl', 'utf8').trim().split('\n').map((l) => '   ' + l).join('\n'));
