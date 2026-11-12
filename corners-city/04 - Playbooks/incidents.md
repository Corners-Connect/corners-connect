# C-18 · Run, break and recover the notify step

**Status: DRAFT v2 (12 Nov 2026).** Rewritten for the code in `automation/notify/`. The author ran steps 2 to 10 once
as a dry run. **Not yet run by a second person**, and never against a live Slack or email destination.

**Owner:** Finn and Daniele together (Finn leads, proposal) · **Apprentice:** (a classmate outside the pair, not chosen yet) · **Last used:** 12 Nov 2026, by the authors, dry run

## What you get at the end
A tested notify step: the welcome email and the partner alert each sent once, one forced failure turned into an
incident for Operations, a replay that recovers without a duplicate, and a filled row in the incident log below.

## Before you start
- **Access:** to the repo and to Node 20 or newer. Nothing else is installed.
- **Dry run only.** `node notify-cli.mjs` writes to a local outbox. Never force a failure against a live Slack or email destination.
- **The rules:** read `automation/routing.md` (rules R1 to R6), `automation/notify.json` (pass marks) and `automation/notify/README.md`.
- **Invented data only:** addresses at `example.com`, names like "Test One". Never a real student, partner or
  staff address in the table, the log or this repo.

## The steps
Run everything in `corners-city/automation/notify`. `NOTIFY_FAST=1` skips the 5-minute wait between tries.
1. Write today's date and your name in the incident log below, before you start.
2. `node --test` and read the result: every test must pass before you go on.
3. `node notify-cli.mjs reset`, then `node notify-cli.mjs run fixtures/student.json`. Expect `status: sent`.
4. `node notify-cli.mjs run fixtures/student.json` again. Expect `already_sent` and still one line in `.data/outbox.jsonl`.
5. `node notify-cli.mjs run fixtures/partner.json`. Expect an alert to `demo-owner-audience` with a reply-due time 24 hours after submission.
6. Open `.data/outbox.jsonl`. Is there any address, name or free text in the partner alert? There must not be.
7. **Force a failure:** `node notify-cli.mjs reset`, then `NOTIFY_FAST=1 node notify-cli.mjs run fixtures/student.json --force-fail=temporary:3`.
8. Expect `status: incident` after 3 tries, with the run id, the failed step, the owner (Operations) and the recovery action.
9. **Recover:** `NOTIFY_FAST=1 node notify-cli.mjs replay fixtures/student.json`. Expect `sent`, then run it once more and expect `already_sent`. The outbox must hold exactly one message.
10. `node notify-cli.mjs sweep --now=2026-11-18T15:00:00Z` after step 5: expect a reminder to the owner. With `--now=2026-11-19T15:00:00Z`, expect Operations to be told.
11. Write the incident row below: failure, impact, recovery, lesson. The Incident Clinic page builds the row.
12. Compare each result with the pass marks in `automation/notify.json`. Write counts, not percentages.

## How you know it worked
**Good:** `node --test` passes; the student gets 1 message and the replay says `already_sent`; the partner alert
goes to one owner with a reply-due time; the forced failure ends in an incident with run id, step, owner and
recovery action; after the replay the outbox holds exactly one message; 0 personal data in alerts and in the log.
**Bad:** two messages for one lead; an alert to two people; an alert that holds an address; a forced failure that
ends without an incident; a retry that never stops.

## What goes wrong
**Not run yet, so this section is empty on purpose.** The template asks for the three things that went wrong the
first time; we will write them after the first run and not before. Risks we expect are listed in
`03 - Deliverables/mp2/notify.md` §6.

## The incident log
One row per failure, forced or real. Failure, impact, recovery and the lesson (the Incident Clinic building).

| Date | Failure | Impact (who was waiting, how long) | Recovery | Lesson | Written by |
|---|---|---|---|---|---|
| 2026-11-12 | Forced: 3 simulated temporary errors on the welcome email (dry run, fixture `mp2-demo-001`) | None: invented lead, local outbox. Without the retry limit the lead would have waited | `replay` sent the message once; a second `replay` said `already_sent`; the outbox held 1 line | The incident named the run, the step, the owner and the exact recovery command, and the dispatch key made the replay safe | Claude (AI) for Daniele and Finn, to be repeated by a person outside the pair |

## Who has done this
| Person | When | What they made |
|---|---|---|
| (nobody yet) | | |

---
*Drafted by Claude (AI) at Daniele's request, from the Mission 2 slides and the repo files. Nothing in it comes
from a run. Owner signs: ______*
