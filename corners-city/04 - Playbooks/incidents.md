# C-18 · Run, break and recover the notify step

**Status: DRAFT v1.** Written from the plan, **before any run**. The steps below are not proven. **Not yet run
by a second person.**

**Owner:** Finn and Daniele together (Finn leads, proposal) · **Apprentice:** (a classmate outside the pair, not chosen yet) · **Last used:** never

## What you get at the end
A tested notify step: ten invented sign-ups answered, three invented partner leads routed to their owner, one
forced failure reported to Operations, and a filled row in the incident log below.

## Before you start
- **Access:** to the n8n account that holds the scenario, to the lead table, and to the repo.
- **The scenario in test mode.** Never force a failure in the live scenario. Test mode only.
- **The rules:** read `automation/routing.md` (rules R1 to R6) and `automation/notify.json` (pass marks).
- **Invented data only:** addresses at `example.com`, names like "Test One". Never a real student, partner or
  staff address in the table, the log or this repo.

## The steps
1. Write today's date and your name in the incident log below, before you start.
2. In test mode, add ten rows of invented student sign-ups, five with `consent = yes` and five without.
3. Check the five with consent each got the welcome email within 5 minutes, and the five without got nothing.
4. Add three invented partner leads (one international office, one provider, one ESN section).
5. Check each alert reached the owner named in `routing.md` §2, within 5 minutes.
6. Read the three alerts as the owner would. Is there any address, name or free text? There must not be.
7. **Force a failure:** in test mode, switch off the email step (or give it a wrong key), then add one invented
   sign-up.
8. Check the scenario retried twice, 5 minutes apart, then alerted Operations within 15 minutes with the run id.
9. **Recover:** switch the step back on, re-run the failed sign-up, and check the welcome email now arrives.
10. Write the incident row below: failure, impact, recovery, lesson.
11. Compare each result with the pass marks in `automation/notify.json`. Write counts, not percentages.

## How you know it worked
**Good:** 5 of 5 consented sign-ups emailed, 0 of 5 without consent; 3 of 3 alerts to the right owner; 1 of 1
forced failure reported with a run id; 0 personal data in alerts; the failed sign-up recovered by step 9.
**Bad:** an email to someone without consent; an alert to the wrong person or to two people; an alert that holds
an address; a forced failure nobody was told about; a retry that loops.

## What goes wrong
**Not run yet, so this section is empty on purpose.** The template asks for the three things that went wrong the
first time; we will write them after the first run and not before. Risks we expect are listed in
`03 - Deliverables/mp2/notify.md` §6.

## The incident log
One row per failure, forced or real. Failure, impact, recovery and the lesson (the Incident Clinic building).

| Date | Failure | Impact (who was waiting, how long) | Recovery | Lesson | Written by |
|---|---|---|---|---|---|
| (none yet) | | | | | |

## Who has done this
| Person | When | What they made |
|---|---|---|
| (nobody yet) | | |

---
*Drafted by Claude (AI) at Daniele's request, from the Mission 2 slides and the repo files. Nothing in it comes
from a run. Owner signs: ______*
