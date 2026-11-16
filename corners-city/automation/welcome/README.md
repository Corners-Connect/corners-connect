# Welcome micro-app: "Your first week in Bilbao"

**Status: DRAFT v1 (13 Nov 2026).** Mini Project 2, pair 1 (Federico + Austin), C-14 and C-15. Written in code, no Make
or n8n. Presentation: Tuesday 17 November 2026. Runs as a **dry run** by default (mock model, local Capture stand-in).
The live Claude call and the HTTP hand-off to Capture are written but **not yet tested against the live services**.

## What it does
A new arrival answers four questions (arrival window, needs, language, a demo contact) plus an optional cohort code.
The server turns the answers into a 5–7 item first-week checklist and hands one student lead to Capture (pair 2).

| Step | What happens | Where |
|---|---|---|
| Form | Tags `source`, `campaign_id`, `variant_id` and `cohort_code` are pre-filled from the link | `public/index.html` |
| Validate | Unknown values, a bad address or no consent are refused with reasons; nothing is sent | `validate()` in `welcome.mjs` |
| Checklist | The model gets only the profile and the approved facts. Its answer is checked in code: length, known `source_id`, no number without a source | `makeChecklist()`, `checkItems()` |
| Fallback | Model down or answer rejected: a rule-based checklist from the same facts, labelled "Standard plan" | `fallbackChecklist()` |
| Lead | One stable `lead_id` per submission (hash of the form's `submission_id`) | `leadIdFor()`, `buildLead()` |
| Hand-off | POST to Capture; 3 tries with doubling wait; confirmation shown **only** when Capture acknowledges | `handOff()` |
| Replay | Same submission again: same `lead_id`, same checklist text, no second model call, no second row | `processSubmission()` |

**The lead magnet logic.** The checklist solves one narrow problem, the first week, and its last item names the next
problem (finding your people) with one next action: Find Your Corner. Prompt: `prompts/checklist-v1.md`.

## Run it (Node 20 or newer, no install)
```bash
cd corners-city/automation/welcome
node --test                                                     # 18 tests
node server.mjs                                                 # http://127.0.0.1:8786
# tagged link for the demo:
# http://127.0.0.1:8786/?source=arrival-guide&campaign_id=bilbao-welcome&variant_id=checklist-a&cohort_code=DEMO-JAN

node cli.mjs reset
WELCOME_FAST=1 node cli.mjs run fixtures/chiara.json --fail-capture=3   # Capture down: pending, no confirmation
WELCOME_FAST=1 node cli.mjs replay fixtures/chiara.json                 # recovers: same lead_id, one row
node cli.mjs replay fixtures/chiara.json                                # already_acknowledged, nothing new
node cli.mjs run fixtures/marta.json --fail-model=error                 # labelled fallback checklist
node cli.mjs run fixtures/invalid.json                                  # refused with reasons
node cli.mjs capacity                                                   # capacity check (assumptions)
```

Live mode, once the class agrees the destination:
```bash
WELCOME_LIVE_MODEL=1 ANTHROPIC_API_KEY=... CAPTURE_URL=https://.../capture node server.mjs
```
Secrets come from the environment only. None is in the repo. State and the run log go to `.data/` (not committed).

## What we hand to Federica and Carter (Capture)
The shared class fixture fields, unchanged: `lead_id`, `kind` (`student`), `submitted_at`, `source`, `campaign_id`,
`variant_id`, `cohort_code`, `contact_email`, `language`, `arrival_window`, `needs`, `checklist` (list of strings).
Added by us: `consent`, `checklist_sources` (fact id per item, or null), `checklist_mode` (`ai` or `fallback`),
`checklist_prompt_version`, `content_version`.

**Assumed Capture contract, to confirm with pair 2:** `POST` JSON lead, header `idempotency-key: <lead_id>`, a `2xx`
reply. The reply counts as an acknowledgement (`readAck()` in `welcome.mjs`) when it echoes our `lead_id`, says
`accepted` or `duplicate`, or carries a status word (`received`, `accepted`, `duplicate`, `replayed`). It never counts
when it names another `lead_id`, says `accepted`, `ok` or `success` is `false`, says `rejected: true`, carries a non-empty `error` or `errors`, or has an unknown status word. Changed on
15 Nov 2026 by Federico (with Claude) because the Capture brief asks for "the same acknowledgement" on a replay.

## Evidence from the dry run (13 Nov 2026, fictional data)
| Check | Result |
|---|---|
| `node --test` | 12 pass on 13 Nov; 15 pass on 15 Nov (acknowledgement check); 18 pass on 16 Nov (refusal check) |
| Capture forced down 3 times | `pending`, no confirmation, 3 failed attempts logged under one `lead_id` |
| Replay | `confirmed` on attempt 1, same `lead_id`, 1 row at Capture, model called once |
| Second replay | `already_acknowledged`, still 1 row |
| Model forced down | `fallback` checklist, labelled, lead still acknowledged |
| Form at phone width (390 px) | checklist with sources, confirmation, lead and run ids shown |
| Run log | holds no email address (tested) |

## One failure we caught (16 Nov 2026)
Austin found that a Capture reply that REFUSES the lead but still echoes our `lead_id` (for example `{lead_id, ok:false, errors:[...]}`)
was counted as signed up. Before the fix, `readAck` accepted all five refusal shapes tried; now `isRefusal()` blocks them and the
student sees no confirmation. Tests: three new ones in `welcome.test.mjs` (refusal shapes, empty error fields still acknowledge,
a rejecting Capture leaves no confirmation after the allowed number of tries). Found by Austin, fixed by Federico with Claude.

## Capacity check
`capacity.mjs` compares expected weekly sign-ups with the hours the team has for reviewing `needs_review` leads.
**Every input is an assumption** (labelled in the output). Actual sign-ups by source are counted from the run.

## Reused, changed, verified
- **Reused:** the Bilbao figures and first-week items already in the Corners app (`app/app.js`, CITIES and Programme)
  and `PROJECT.md` (arrival waves); the shared class fixture; the folder and test layout pair 5 used for Notify.
- **Changed:** added sourced paperwork, transport and people facts (each with source and check date) in
  `city-content.json`; the checklist prompt; the code-side check that rejects invented sources.
- **Verified:** the tests and dry-run commands above.

## Not done, and decisions that are not ours alone
- **Live model not tested.** Needs a class-approved API key on the server.
- **Capture endpoint not wired.** Pair 2's URL and reply shape are not published yet.
- **Who owns which part** of this pair's work is Federico's and Austin's decision (proposal in the deliverable note).
- **Capacity numbers** are placeholders until the team sets them.
- Transport prices should be re-checked before 17 Nov (Bizkaia raised 2026 fares about 3%).

---
*Code, prompt and this page drafted by Claude (AI) at Austin's request from `mp2-01-lead-magnet.md`, `app/app.js`,
`PROJECT.md` and pair 5's Notify layout. City facts researched by Claude from the sources named in `city-content.json`.
Federico and Austin review, change and sign: ______ (Federico) · ______ (Austin)*
