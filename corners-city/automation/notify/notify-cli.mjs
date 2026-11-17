#!/usr/bin/env node
// node notify-cli.mjs run fixtures/student.json [--force-fail=temporary:3]
// node notify-cli.mjs replay fixtures/student.json      (same lead again: resumes, never duplicates)
// node notify-cli.mjs reply mp2-demo-002                (log the owner's reply)
// node notify-cli.mjs sweep --now=2026-11-18T15:00:00Z  (R3 reminder at 24 h, R4 Operations at 48 h)
// node notify-cli.mjs reset                             (delete the local state and outbox)
import { readFileSync, rmSync } from 'node:fs';
import { processLead, sweep, logReply } from './notify.mjs';
import { buildContext, parseFail, DATA } from './setup.mjs';

const [cmd, arg, ...rest] = process.argv.slice(2);
const opt = (name) => [arg, ...rest].find((a) => a?.startsWith('--' + name + '='))?.split('=')[1];
const quick = process.env.NOTIFY_FAST === '1' ? { policy: { ...(await import('./policy.mjs')).POLICY, backoffMs: 0 } } : {};

if (cmd === 'reset') { rmSync(DATA, { recursive: true, force: true }); console.log('state and outbox deleted'); process.exit(0); }
const ctx = buildContext({ failures: parseFail(opt('force-fail')), ...quick });

if (cmd === 'run' || cmd === 'replay') {
  const res = await processLead(JSON.parse(readFileSync(arg, 'utf8')), ctx);
  console.log(JSON.stringify(res, null, 2));
} else if (cmd === 'reply') {
  logReply(ctx, arg); console.log('reply logged for ' + arg);
} else if (cmd === 'sweep') {
  const now = opt('now') ? new Date(opt('now')) : new Date();
  console.log(JSON.stringify(await sweep(ctx, now), null, 2));
} else {
  console.log('commands: run <lead.json> | replay <lead.json> | reply <lead_id> | sweep [--now=ISO] | reset');
  process.exit(1);
}
