// The micro-app: serves the form and runs the workflow on submit. Credentials stay here, on the server.
// Start: node server.mjs  ->  http://127.0.0.1:8786/?source=arrival-guide&campaign_id=bilbao-welcome&variant_id=checklist-a
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { processSubmission, NEEDS, ARRIVAL_WINDOWS } from './welcome.mjs';
import { capacity } from './capacity.mjs';
import { buildContext } from './setup.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ctx = buildContext();
const page = () => readFileSync(join(HERE, 'public', 'index.html'), 'utf8');
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type }); res.end(type === 'application/json' ? JSON.stringify(body) : body); };
const readBody = (req) => new Promise((ok, no) => { let b = ''; req.on('data', (c) => { b += c; if (b.length > 2e4) req.destroy(); }); req.on('end', () => ok(b)); req.on('error', no); });

createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://x').pathname;
    if (req.method === 'GET' && path === '/') return send(res, 200, page(), 'text/html; charset=utf-8');
    if (req.method === 'GET' && path === '/health') return send(res, 200, { ok: true, ...ctx.mode, options: { needs: NEEDS, arrival_windows: ARRIVAL_WINDOWS } });
    if (req.method === 'GET' && path === '/api/capacity') return send(res, 200, capacity(undefined, ctx.capture.rows ? ctx.capture.rows() : []));
    if (req.method === 'POST' && path === '/api/submit') {
      let body;
      try { body = JSON.parse(await readBody(req)); } catch { return send(res, 400, { status: 'invalid', errors: ['body is not JSON'] }); }
      const out = await processSubmission(body, ctx);
      return send(res, out.status === 'invalid' ? 400 : 200, { ...out, mode: ctx.mode });
    }
    send(res, 404, { error: 'not found' });
  } catch (e) { send(res, 500, { error: 'server error' }); console.error(e); }
}).listen(process.env.PORT || 8786, '127.0.0.1', () => console.log(`welcome app on http://127.0.0.1:${process.env.PORT || 8786}/  (model: ${ctx.mode.model}, capture: ${ctx.mode.capture})`));
