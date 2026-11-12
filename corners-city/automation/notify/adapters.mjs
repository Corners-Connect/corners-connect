// Delivery adapters. Each one has send(message) and, when the provider allows it, find(dispatchKey).
// message = { dispatchKey, channel, to, subject, text }. Secrets come from the environment, on the server only.
import { appendFile, readFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export class NotifyError extends Error {
  constructor(message, { temporary = false, uncertain = false } = {}) {
    super(message);
    this.name = 'NotifyError';
    this.temporary = temporary;   // worth retrying
    this.uncertain = uncertain;   // we do not know whether it was delivered
  }
}

// Dry run: a local outbox file. The same code path as a live adapter, labelled as a dry run.
// failures: [{error}] consumed one per send call, to rehearse retry and escalation.
export function createOutbox({ file, failures = [] } = {}) {
  const queue = [...failures];
  return {
    name: 'outbox (dry run)',
    dryRun: true,
    async send(message) {
      const next = queue.shift();
      if (next) {
        if (next.afterDelivery) await write(file, message, 'delivered-but-no-ack');
        throw new NotifyError(next.message || 'simulated failure', next);
      }
      await write(file, message, 'sent');
      return { ack: 'outbox:' + message.dispatchKey };
    },
    async find(dispatchKey) {
      let raw = '';
      try { raw = await readFile(file, 'utf8'); } catch { return null; }
      const rows = raw.split('\n').filter(Boolean).map((l) => JSON.parse(l));
      const hit = rows.find((r) => r.dispatchKey === dispatchKey && (r.state === 'sent' || r.state === 'delivered-but-no-ack'));
      return hit ? { ack: 'outbox:' + dispatchKey } : null;
    }
  };
}
async function write(file, message, state) {
  if (!file) return;
  await mkdir(dirname(file), { recursive: true });
  await appendFile(file, JSON.stringify({ ...message, state, at: new Date().toISOString() }) + '\n');
}

function classify(status) {
  if (status === 429 || status >= 500) return { temporary: true };
  return { temporary: false };
}

// Slack incoming webhook. NOT tested against a live workspace yet.
export function createSlackWebhook({ url = process.env.SLACK_WEBHOOK_URL, timeoutMs = 8000, fetchImpl = fetch } = {}) {
  return {
    name: 'slack webhook',
    dryRun: false,
    async send(message) {
      if (!url) throw new NotifyError('SLACK_WEBHOOK_URL is not set', { temporary: false });
      let res;
      try {
        res = await fetchImpl(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: `${message.text}\n(key: ${message.dispatchKey})` }),
          signal: AbortSignal.timeout(timeoutMs)
        });
      } catch (e) {
        // A timeout may have happened after Slack accepted it: uncertain, not simply temporary.
        throw new NotifyError('slack request failed: ' + e.name, { temporary: true, uncertain: e.name === 'TimeoutError' });
      }
      if (!res.ok) throw new NotifyError('slack answered ' + res.status, classify(res.status));
      return { ack: 'slack:' + res.status };
    }
    // no find(): a webhook has no history, so an uncertain send goes to a person.
  };
}

// Email through Resend's HTTP API. NOT tested against the live service yet.
export function createResendEmail({ apiKey = process.env.RESEND_API_KEY, from = process.env.NOTIFY_FROM, timeoutMs = 8000, fetchImpl = fetch } = {}) {
  return {
    name: 'resend email',
    dryRun: false,
    async send(message) {
      if (!apiKey || !from) throw new NotifyError('RESEND_API_KEY or NOTIFY_FROM is not set', { temporary: false });
      let res;
      try {
        res = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: 'Bearer ' + apiKey, 'idempotency-key': message.dispatchKey },
          body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text }),
          signal: AbortSignal.timeout(timeoutMs)
        });
      } catch (e) {
        throw new NotifyError('email request failed: ' + e.name, { temporary: true, uncertain: e.name === 'TimeoutError' });
      }
      if (!res.ok) throw new NotifyError('email provider answered ' + res.status, classify(res.status));
      const body = await res.json().catch(() => ({}));
      return { ack: 'resend:' + (body.id || res.status) };
    }
  };
}
