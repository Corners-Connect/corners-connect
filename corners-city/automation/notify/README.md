# Notify: send the welcome email, alert the partner owner, recover from failure

**Status: DRAFT v1 (12 Nov 2026).** Mini Project 2, pair 5 (Finn + Daniele, C-18). Written in code, with no Make and
no n8n, as the Mission 2 brief asks. Presentation: Tuesday 17 November 2026. It runs as a **dry run** (a local
outbox). The Slack and email adapters are written but **not tested against a live service**.

## What it does
It acts on a lead only after Store has stored it and Enrich or a human review has cleared it (`stored_at`, and
`enrichment.status = ready` or `review.decision = approved`). Then:

| Lead | Action | Rule |
|---|---|---|
| student, with a checklist | welcome email with the checklist | R1 |
| partner | alert to one assigned owner, with the reply-due time (24 hours) | R2 |
| partner, no reply logged after 24 h / 48 h | reminder to the owner / Operations is told | R3, R4 |
| not stored, not cleared, no consent, no checklist | nothing is sent; it waits | R5 |
| a send fails | retry, then an incident for Operations with run id, step, owner and recovery action | R6 |

One dispatch key per lead and kind (`lead_id:kind`), so a replay never sends a second copy. If a delivery is
uncertain, the adapter's history is checked before anything is replayed; a provider with no history sends the case
to a person.

## Run it (Node 20 or newer, no install)
```bash
cd corners-city/automation/notify
node --test                                              # 14 tests
node notify-cli.mjs reset
NOTIFY_FAST=1 node notify-cli.mjs run fixtures/student.json --force-fail=temporary:3   # incident after 3 tries
NOTIFY_FAST=1 node notify-cli.mjs replay fixtures/student.json                          # recovers, one message
NOTIFY_FAST=1 node notify-cli.mjs replay fixtures/student.json                          # already_sent, no duplicate
node notify-cli.mjs run fixtures/partner.json            # owner assigned, reply due in 24 h
node notify-cli.mjs sweep --now=2026-11-18T15:00:00Z     # reminder at 24 h; add a later --now for Operations at 48 h
node server.mjs                                          # POST /notify, /sweep, /reply on 127.0.0.1:8787
```
`NOTIFY_FAST=1` removes the 5-minute wait between tries for rehearsal. State and the outbox are written to
`.data/` and are not committed.

## The files
| File | What |
|---|---|
| `policy.mjs` | the retry limit, the wait, the stop condition and the day limits, in one place |
| `notify.mjs` | the gate, routing, delivery with retry and dispatch keys, the sweep, the redacted log |
| `adapters.mjs` | outbox (dry run), Slack webhook, email through Resend; the secrets come from the environment |
| `setup.mjs`, `notify-cli.mjs`, `server.mjs` | the command line and the server the application can call |
| `fixtures/` | three invented leads (`example.invalid` addresses) |
| `notify.test.mjs` | the tests |

## What we hand to Dar and Jose
One line per run in `.data/notify-log.jsonl`: `run_id`, `lead_id`, `notification_kind`, `status`, `attempt_count`,
`recorded_at`. It never holds an address, a name or free text. Incidents are in `.data/state.json`.

## Not done, and decisions that are not ours alone
- **Not tested live.** `createSlackWebhook` and `createResendEmail` need a class-approved test destination and
  secrets in the environment (`NOTIFY_LIVE=1`, `SLACK_WEBHOOK_URL`, `RESEND_API_KEY`, `NOTIFY_FROM`). No secret is
  in the repo. Sending to a real address needs a person's approval first.
- **One backend and one data contract** with the other pairs: not agreed yet. We read the shared fixture fields
  (`lead_id`, `kind`, `submitted_at`, `contact_email`, `checklist`, `organization`, `enrichment`, `stored_at`). The
  review decision field name (`review.decision`) is our guess.
- **Consent.** The shared fixture has no consent field. We send unless `consent` is `false`. Capture should confirm the
  form says the address is used for the checklist.
- **Owners.** `OWNERS` in `notify.mjs` holds fictional demo owners. Real owners are the company's decision.
- **The application does not call `/notify` yet.** That wiring belongs to the pair that owns Store.

---
*Drafted by Claude (AI) at Daniele's request from the Mission 2 brief, `routing.md` and the fixture in the brief.
Finn and Daniele sign: ______ (Finn) · ______ (Daniele)*
