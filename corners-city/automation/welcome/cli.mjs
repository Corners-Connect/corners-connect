// Rehearsal from the command line, no browser needed.
//   node cli.mjs run fixtures/chiara.json [--fail-capture=N] [--fail-model=error|invented]
//   node cli.mjs replay fixtures/chiara.json
//   node cli.mjs capacity
//   node cli.mjs reset
import { readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { processSubmission } from './welcome.mjs';
import { capacity } from './capacity.mjs';
import { buildContext } from './setup.mjs';

const [cmd, file, ...flags] = process.argv.slice(2);
const flag = (name) => (flags.find((f) => f.startsWith('--' + name + '=')) || '').split('=')[1];
const HERE = dirname(fileURLToPath(import.meta.url));

if (cmd === 'reset') { rmSync(join(HERE, '.data'), { recursive: true, force: true }); console.log('cleared .data/'); process.exit(0); }
const ctx = buildContext({ failCapture: Number(flag('fail-capture') || 0), failModel: flag('fail-model') || null });
if (cmd === 'capacity') { console.log(JSON.stringify(capacity(undefined, ctx.capture.rows ? ctx.capture.rows() : []), null, 2)); process.exit(0); }
if (cmd === 'run' || cmd === 'replay') {
  const out = await processSubmission(JSON.parse(readFileSync(file, 'utf8')), ctx);
  console.log(JSON.stringify({ mode: ctx.mode, ...out }, null, 2));
  console.log('\nlog for this run:');
  for (const r of ctx.log.rows) console.log(' ', JSON.stringify(r));
  process.exit(out.status === 'invalid' ? 1 : 0);
}
console.log('usage: node cli.mjs run|replay <fixture.json> [--fail-capture=N] [--fail-model=error|invented] | capacity | reset');
