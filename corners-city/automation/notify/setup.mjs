// Builds the context for the CLI and the server. Dry run by default: a local outbox in .data/.
// Live adapters switch on with NOTIFY_LIVE=1 and the secrets in the environment (server side only).
import { fileURLToPath } from 'node:url';
import { createContext, createStore, createLog } from './notify.mjs';
import { createOutbox, createSlackWebhook, createResendEmail } from './adapters.mjs';

export const DATA = fileURLToPath(new URL('./.data/', import.meta.url));

export function buildContext({ failures = [], policy } = {}) {
  const live = process.env.NOTIFY_LIVE === '1';
  const outbox = DATA + 'outbox.jsonl';
  return createContext({
    adapters: live
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
