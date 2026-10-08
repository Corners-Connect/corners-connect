/* ═══ activity.js · what each person actually did ════════════════════════════
   Owner: everybody writes their own lines.

   This used to be a timesheet and almost nobody fills in a timesheet. What it
   is now is the company's record of WHAT GOT DONE, by whom, on which day —
   which is the thing you will want in December and cannot reconstruct.

   Hours are optional. Put them in and the cash flow works; leave them out and
   the entry still counts as a piece of work with your name on it. An entry
   with no hours is worth more than an hour nobody can point at.

   IT CAN FILL ITSELF IN. `python3 import-activity.py` reads the repository's
   git history and writes one entry per commit — who, when, what the message
   said. Run this optional command manually when using Git. No automatic
   workflow is enabled in this package. The hours and work done outside
   the repository are still entered by people.

   FIELDS
     date    YYYY-MM-DD
     person  a person id from people.js
     what    one sentence, past tense. What you did, not what you intended.
     action  OPTIONAL — the action id this belongs to, or null
     hours   OPTIONAL — how long it took. 0 or absent is allowed
     source  "typed" | "git"
     ref     the short commit sha, on imported entries only. It is how the
             importer knows not to add the same commit twice.
   ══════════════════════════════════════════════════════════════════════════ */
window.DIP = window.DIP || {};
window.DIP.activity = [
  { "date": "2026-09-10", "person": "p09", "what": "created the repository and set the branch protection",
    "action": "A-004", "hours": 1.5, "source": "typed" },
  { "date": "2026-09-12", "person": "p09", "what": "added all eleven as collaborators",
    "action": "A-004", "hours": 1, "source": "typed" },
  { "date": "2026-09-13", "person": "p02", "what": "first screen of the voting app, no backend yet",
    "action": "A-006", "hours": 3, "source": "typed" },
  { "date": "2026-09-14", "person": "p05", "what": "wrote three Corner entries and posted the first",
    "action": "A-003", "hours": 0.5, "source": "typed" },
  { "date": "2026-09-14", "person": "p08", "what": "drafted the five decision rules for the Manual",
    "action": "A-002", "hours": 2, "source": "typed" }
];
