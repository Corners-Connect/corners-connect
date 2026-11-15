// Builds the context from the environment. Dry run by default: mock model and local Capture.
//   WELCOME_LIVE_MODEL=1 + ANTHROPIC_API_KEY  -> Claude writes the checklist
//   CAPTURE_URL                               -> hand the lead to pair 2's endpoint
//   WELCOME_FAST=1                            -> no wait between Capture retries (rehearsal)
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, createStore, createLog, POLICY } from './welcome.mjs';
import { createClaudeModel, createMockModel, createHttpCapture, createLocalCapture } from './adapters.mjs';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '.data');

export function buildContext({ failCapture = 0, failModel = null } = {}) {
  const model = process.env.WELCOME_LIVE_MODEL === '1' && !failModel ? createClaudeModel() : createMockModel({ fail: failModel });
  const capture = process.env.CAPTURE_URL ? createHttpCapture() : createLocalCapture({ file: join(DATA, 'local-capture.json'), failNext: failCapture });
  const policy = { ...POLICY, captureWaitMs: process.env.WELCOME_FAST === '1' ? 0 : POLICY.captureWaitMs };
  const ctx = createContext({ model, capture, policy, store: createStore(join(DATA, 'submissions.json')), log: createLog(join(DATA, 'welcome-log.jsonl')) });
  ctx.mode = { model: model.name, capture: capture.name };
  return ctx;
}
