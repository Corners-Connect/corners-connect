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

// Email through SMTP (Finn). Tested live against an Ethereal test inbox; works the same with a class SMTP test
// inbox such as Mailtrap. nodemailer is loaded only when this adapter sends, so the dry run still needs no install.
//   NOTIFY_TRANSPORT=ethereal  a throwaway Ethereal inbox is created; every ack carries the preview URL as receipt
//   NOTIFY_TRANSPORT=smtp      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, optional SMTP_SECURE=true
// Every message goes to NOTIFY_TEST_TO (the class test destination), never to the lead's contact_email or a
// channel name: those are fixture data. The original target stays in the subject so the owner is visible.
// SMTP has no history API, so there is no find(): an uncertain send goes to a person, like the Slack webhook.
export function createSmtpEmail({
  ethereal = process.env.NOTIFY_TRANSPORT === 'ethereal',
  testTo = process.env.NOTIFY_TEST_TO || 'class-test-inbox@corners.test',
  from = process.env.NOTIFY_FROM || 'Corners Notify <notify@corners.test>',
  transport,                       // tests pass a fake { sendMail }
  log = console.log
} = {}) {
  let ready = transport ? Promise.resolve({ transport, previewUrl: () => undefined }) : null;
  const connect = async () => {
    let nodemailer;
    try { nodemailer = (await import('nodemailer')).default; } catch {
      throw new NotifyError('nodemailer is not installed: run npm install in corners-city/automation/notify', { temporary: false });
    }
    let opts;
    if (ethereal) {
      const acc = await nodemailer.createTestAccount();
      opts = { host: acc.smtp.host, port: acc.smtp.port, secure: acc.smtp.secure, auth: { user: acc.user, pass: acc.pass } };
      log(`[notify] Ethereal test inbox created: ${acc.user} (log in at https://ethereal.email/login)`);
    } else {
      if (!process.env.SMTP_HOST) throw new NotifyError('SMTP_HOST is not set', { temporary: false });
      opts = { host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } };
    }
    return { transport: nodemailer.createTransport(opts), previewUrl: (info) => (ethereal ? nodemailer.getTestMessageUrl(info) : undefined) };
  };
  const name = ethereal ? 'ethereal email' : 'smtp email';
  return {
    name,
    dryRun: false,
    async send(message) {
      ready ??= connect().catch((e) => { ready = null; throw e; });
      const { transport: t, previewUrl } = await ready;
      const target = message.channel === 'owner' ? `owner channel ${message.to}` : 'student welcome';
      let info;
      try {
        info = await t.sendMail({
          from, to: testTo,
          subject: `[Corners test · ${target}] ${message.subject || 'Partner lead for you'}`,
          text: `${message.text}\n\n(key: ${message.dispatchKey})`,
          messageId: `<${message.dispatchKey.replace(/[^\w.-]/g, '.')}@corners-notify.test>`
        });
      } catch (e) {
        // A timeout after DATA may mean the server accepted it: uncertain. 4xx and connection errors: temporary.
        const uncertain = e.code === 'ETIMEDOUT' && e.command === 'DATA';
        const temporary = uncertain || (e.responseCode >= 400 && e.responseCode < 500) ||
          ['ETIMEDOUT', 'ECONNECTION', 'ECONNRESET', 'ECONNREFUSED', 'ESOCKET', 'EDNS'].includes(e.code);
        throw new NotifyError(`smtp: ${e.responseCode || e.code || ''} ${e.message}`.trim(), { temporary, uncertain });
      }
      const url = previewUrl(info);
      if (url) log(`[notify] receipt for ${message.dispatchKey}: ${url}`);
      return { ack: url ? 'ethereal:' + url : 'smtp:' + info.messageId };
    }
  };
}
