// Builds the context for the CLI and the server. Dry run by default: a local outbox in .data/.
// Live adapters switch on with NOTIFY_LIVE=1 (Resend + Slack) or NOTIFY_TRANSPORT=ethereal|smtp (email for both
// the welcome and the owner alert), with the secrets in the environment (server side only).
import { fileURLToPath } from 'node:url';
import { createContext, createStore, createLog } from './notify.mjs';
import { createOutbox, createSlackWebhook, createResendEmail, createSmtpEmail } from './adapters.mjs';

export const DATA = fileURLToPath(new URL('./.data/', import.meta.url));

export function buildContext({ failures = [], policy } = {}) {
  const live = process.env.NOTIFY_LIVE === '1';
  const smtp = ['ethereal', 'smtp'].includes(process.env.NOTIFY_TRANSPORT);
  const outbox = DATA + 'outbox.jsonl';
  const mail = smtp ? createSmtpEmail() : null;      // one inbox for both, so the owner alert is visible too
  return createContext({
    adapters: smtp
      ? { email: mail, owner: mail }
      : live
      ? { email: createResendEmail(), owner: createSlackWebhook() }
      : { email: createOutbox({ file: outbox, failures }), owner: createOutbox({ file: outbox, failures }) },
    store: createStore(DATA + 'state.json'),
    log: createLog(DATA + 'notify-log.jsonl'),
    ...(policy ? { policy } : {})
  });
}

// "temporary:3" = three temporary errors in a row, "permanent" = one permanent error.
export function parseFail(spec) {
  if (!spec) return [];
  const [kind, n = '1'] = spec.split(':');
  const one = kind === 'permanent' ? { message: 'simulated permanent error', temporary: false } : { message: 'simulated provider error', temporary: true };
  return Array.from({ length: Number(n) }, () => ({ ...one }));
}
