# Build the notify scenario, step by step

**Status: DRAFT v1 (29 Oct 2026).** Not run. Written before the tool is chosen, so it names both Make and n8n and
you follow the column for the one you pick. Button and module names can differ in your version: check each
one in the tool before you rely on it. The rules come from `routing.md`; the pass marks from `notify.json`.

## Before you start
- **Decide the tool** (Make or n8n) and write the choice and its cost in `notify.md` §9. Read the cost from the
  real account page, not from memory.
- **The lead table exists** (Store pair, C-17) and you know its real field names. Replace the placeholders in
  `notify.json` first.
- **A sending address you own** for tests. Test leads use invented names. A test email may go to an inbox you
  own; never to a real student or partner.
- **Two scenarios, not one:** the main notify scenario, and a separate error scenario for Operations.

## The steps

| # | What you do | Make | n8n |
|---|---|---|---|
| 1 | Start the scenario when a new lead row appears | A trigger module on the lead table (or a webhook from Capture) | A trigger node on the table, or a Webhook node |
| 2 | Read only the fields in `notify.json` → `fields_read` | Map those fields, nothing else | Set node that keeps only those fields |
| 3 | Split by kind: student, partner, other | Router with one route per kind | Switch node |
| 4 | **R1.** Student route: continue only if `consent = yes`, then send the welcome email (`routing.md` §4) | Filter on the route, then an email module | IF node, then an email node |
| 5 | **R2.** Partner route: send one alert to the one owner named for that kind (`routing.md` §2). Put in the alert only lead id, kind, ring, university, created time, reply-due time | Email module, fields mapped by hand | Email node, fields set by hand |
| 6 | **R5.** Other route: write the lead id to the weekly review list. Send nothing to anyone outside the twelve | A "write a row" module | A "write a row" node |
| 7 | **R3 and R4.** A second, timed scenario: every hour, find partner leads with no reply logged at 24 hours (remind the owner) and at 48 hours (tell Operations) | Scheduled scenario with a filter on created time and reply date | Schedule trigger, then a filter |
| 8 | **Retries.** On every step that calls an outside service, retry twice, 5 minutes apart | An error handler with the Break directive: 2 attempts, 5-minute interval | The node's retry-on-fail setting: 2 tries, 5-minute wait |
| 9 | **R6.** When a step still fails, start the error scenario. It alerts Operations with scenario name, step, run id, error text and lead id. No address, no name | Error route to the second scenario | An error workflow set on the main one |
| 10 | Mark the failed lead `notify failed` in the table, so the weekly review finds it | A "update row" module in the error route | An "update row" node in the error workflow |
| 11 | Turn on the log: you need the run id and the time of every run | Scenario history | Executions list |

## Check it before anyone else does
1. Run steps 1 to 6 on the ten invented sign-ups and three invented partner leads from `notify.json`.
2. Compare with the pass marks. Write counts, not percentages.
3. Read three alerts as the owner would. Any address, name or free text means go back to step 5.
4. Hand `04 - Playbooks/incidents.md` to a person outside the pair and leave. They force the failure and recover.

## What to write down as you go
- The tool, the plan and what each run costs (for the one-page readme, pair 6).
- Every failure, in the incident log, with the Incident Clinic builder in `board/coordination-hall.html`.
- Any rule you changed: change `routing.md` and `coordination-hall.js` in the same pull request.

---
*Drafted by Claude (AI) at Daniele's request. It describes steps nobody has run yet. Owner signs: ______*
