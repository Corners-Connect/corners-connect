/* ═══ people.js · the eleven, what they can give, what they can do ═══════════
   Owner: Operations, with the liaison keeping the mastery claims honest.

   ⚠ FIRST NAMES ONLY. No emails, no phone numbers, no student ids, no grades.
     Those live in Teams, which is the university's system and the only place
     for them. check.py refuses this file if it finds one.

   FIELDS
     id        never changes, even when the name does. Actions and the ledger
               point at it.
     name      what the room calls them.
     team      product | audience | operations. Everybody is in exactly one.
     hat       a second job on top of the team: "liaison" | "record" | null.
     git       OPTIONAL — the name this person's commits are signed with, so
               import-activity.py can match them. A handle, NEVER an email.
     capacity  hours this person puts in during a normal week. An honest small
               number beats an aspirational big one — the Hours screen divides
               by it, and a promise built on a lie is a lie with arithmetic.
     away      weeks where capacity is different. The week is named by its
               MONDAY: { "week": "2026-10-19", "capacity": 0, "note": "..." }
     mastery   claims, newest last:
               { "c": "C-02", "level": 2, "on": "2026-09-17", "proof": "..." }
               0 not touched · 1 seen it done · 2 I HAVE DONE IT, a deliverable
               carries my name · 3 I TAUGHT IT and they did it, their
               deliverable is the proof. Level 2 is what USAC requires, level 3
               is what this company requires of itself. Above level 1 a claim
               needs proof: a link or a filename.
   ══════════════════════════════════════════════════════════════════════════ */
window.DIP = window.DIP || {};
window.DIP.people = [
  { "id": "p01", "name": "—", "team": "product",    "hat": "liaison", "capacity": 4, "away": [], "mastery": [] },
  { "id": "p02", "name": "—", "team": "product",    "hat": null, "capacity": 4, "away": [], "mastery": [] },
  { "id": "p03", "name": "—", "team": "product",    "hat": null, "capacity": 4,
    "away": [ { "week": "2026-10-19", "capacity": 0, "note": "USAC excursion week" } ], "mastery": [] },
  { "id": "p04", "name": "—", "team": "product",    "hat": null, "capacity": 4, "away": [], "mastery": [] },
  { "id": "p05", "name": "—", "team": "audience",   "hat": null, "capacity": 4, "away": [], "mastery": [] },
  { "id": "p06", "name": "—", "team": "audience",   "hat": null, "capacity": 4, "away": [], "mastery": [] },
  { "id": "p07", "name": "—", "team": "audience",   "hat": null, "capacity": 4, "away": [], "mastery": [] },
  { "id": "p08", "name": "—", "team": "operations", "hat": "record", "capacity": 4, "away": [], "mastery": [] },
  { "id": "p09", "name": "—", "team": "operations", "hat": null, "capacity": 4, "away": [], "mastery": [] },
  { "id": "p10", "name": "—", "team": "operations", "hat": null, "capacity": 4, "away": [], "mastery": [] },
  { "id": "p11", "name": "—", "team": "operations", "hat": null, "capacity": 4, "away": [], "mastery": [] }
];
