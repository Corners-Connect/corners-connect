// The application calls this when a stored lead is ready: POST /notify with the lead as JSON.
// Credentials stay here, on the server. Dry run unless NOTIFY_LIVE=1. Start: node server.mjs (port 8787).
import { createServer } from 'node:http';
import { processLead, sweep, logReply } from './notify.mjs';
import { buildContext } from './setup.mjs';

const ctx = buildContext();
const send = (res, code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
const readBody = (req) => new Promise((ok, no) => { let b = ''; req.on('data', (c) => { b += c; if (b.length > 1e5) req.destroy(); }); req.on('end', () => ok(b)); req.on('error', no); });

createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true, dry_run: process.env.NOTIFY_LIVE !== '1' });
    if (req.method === 'POST' && req.url === '/notify') return send(res, 200, await processLead(JSON.parse(await readBody(req)), ctx));
    if (req.method === 'POST' && req.url === '/sweep') return send(res, 200, await sweep(ctx));
    if (req.method === 'POST' && req.url === '/reply') { const { lead_id } = JSON.parse(await readBody(req)); logReply(ctx, lead_id); return send(res, 200, { ok: true }); }
    send(res, 404, { error: 'not found' });
  } catch (e) { send(res, 400, { error: e.message }); }
}).listen(process.env.PORT || 8787, '127.0.0.1', () => console.log('notify server on 127.0.0.1:' + (process.env.PORT || 8787)));
