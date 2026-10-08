/* ═══ actions.js · everything this company has said it would do ══════════════
   Owner: every team owns its own rows. The record keeps the file tidy.

   THE PDCA LOOP IS THE STATE OF AN ACTION. It is not a separate thing kept in
   a separate place — that was the mistake in the first version of this board.
   An action walks the loop:

     planned   PLAN  · what we are going to do, and what we expect from it
     doing     DO    · somebody is on it
     check     CHECK · it is finished, and now we look: did it do what we said?
     done      ACT   · checked, and kept. This is the only state that counts
     dropped   ACT   · checked, and stopped. Also a decision, also useful

   Most actions are ordinary work and go planned → doing → done without anybody
   writing an `expect`. That is fine. But the moment somebody says "I think if
   we did X then Y would happen", write the `expect` — and then CHECK has
   something to compare against instead of being a nod.

   FIELDS
     id        A-001, A-002… never reused, never renumbered.
     what      one sentence, starts with a verb, and somebody who was not in
               the room can tell whether it happened.
     owner     one person id. One name. Never two, never a team.
     team      product | audience | operations
     state     planned | doing | check | done | dropped
     estimate  hours. Guess. A wrong estimate you wrote down beats a right one
               you did not, and the cash flow learns from the gap.
     due       the session date it is promised for.
     opened    the date it was first committed to.
     touched   the last date anybody actually moved it. Anything open and
               untouched for two weeks lands on the Today screen.
     expect    OPTIONAL, and this is the P of PDCA: "if we do this, then ___,
               because ___". Write it before you start or not at all.
     result    what actually happened, written when it reaches CHECK. Required
               before an action with an `expect` can be called done — you do
               not get to skip the comparison you asked for.
     evidence  a link or a filename. Required before state can be done.
     shipped   true only if somebody outside this room can see or use it.
               "Almost finished" is not shipped.
     note      why it was dropped, what it waits on. One line, optional.
   ══════════════════════════════════════════════════════════════════════════ */
window.DIP = window.DIP || {};
window.DIP.actions = [
  { "id": "A-001", "what": "Write the company's purpose in one sentence and read it out loud",
    "owner": "p01", "team": "operations", "state": "planned",
    "estimate": 2, "due": "2026-09-17", "opened": "2026-09-15", "touched": "2026-09-15",
    "expect": "", "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-002", "what": "Draft the Manual's decision rules section for ratification",
    "owner": "p08", "team": "operations", "state": "doing",
    "estimate": 5, "due": "2026-09-22", "opened": "2026-09-15", "touched": "2026-09-15",
    "expect": "", "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-003", "what": "Get one Corner entry a day from every member for two weeks",
    "owner": "p05", "team": "audience", "state": "doing",
    "estimate": 3, "due": "2026-09-29", "opened": "2026-09-10", "touched": "2026-09-15",
    "expect": "If everyone writes one entry a day, then by session 6 we will have enough raw material to publish a weekly carousel without inventing anything, because the bottleneck has always been material and not editing. We expect about 55 entries a week.",
    "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-004", "what": "Set up the GitHub repository and give everybody write access",
    "owner": "p09", "team": "operations", "state": "done",
    "estimate": 2, "due": "2026-09-15", "opened": "2026-09-10", "touched": "2026-09-15",
    "expect": "", "result": "", "evidence": "github.com/<org>/<repo>", "shipped": false, "note": "" },
  { "id": "A-005", "what": "Decide which of the two emblem directions is the logo",
    "owner": "p06", "team": "audience", "state": "planned",
    "estimate": 1, "due": "2026-09-17", "opened": "2026-09-10", "touched": "2026-09-10",
    "expect": "", "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-006", "what": "Build the anonymous voting app and use it in session 4",
    "owner": "p02", "team": "product", "state": "check",
    "estimate": 8, "due": "2026-09-17", "opened": "2026-09-10", "touched": "2026-09-15",
    "expect": "If voting is anonymous and instant, then people will vote against a proposal when they think it is wrong, because the reason they do not is that the professor is watching.",
    "result": "", "evidence": "", "shipped": false, "note": "" },

  /* Product's eight functions for Mini Project 1, two per seat, one per thing a
     student can actually do in the app. 27 hours against 28 of capacity, so the
     estimates have no slack in them: cut scope before you cut the date. Nothing
     is due in the week of 19 October, because p03 is away and that is the week
     M1 lands. Surfaces are tracked on GitHub as issues #9 to #12. */

  { "id": "A-007", "what": "Build the booking step on Guides so an activity ends somewhere, not just described",
    "owner": "p01", "team": "product", "state": "planned",
    "estimate": 4, "due": "2026-10-15", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "If an activity ends in a confirmed place rather than a paragraph, then Guides becomes a reason to open the app a second time, because a guidebook is read once.",
    "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-008", "what": "Build the housing screen in the app: portals, saved rooms and a map",
    "owner": "p01", "team": "product", "state": "planned",
    "estimate": 5, "due": "2026-10-22", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "", "result": "", "evidence": "", "shipped": false,
    "note": "The website already promises this; the app has no housing screen at all." },

  { "id": "A-009", "what": "Let a student reply to a Nearby post, not only read the replies",
    "owner": "p02", "team": "product", "state": "planned",
    "estimate": 3, "due": "2026-10-13", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "", "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-010", "what": "Add report and hide to every Nearby post, with a reason",
    "owner": "p02", "team": "product", "state": "planned",
    "estimate": 3, "due": "2026-10-15", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "If every post can be reported in one tap, then we can answer the moderation question on stage instead of promising to think about it, because that is the first question an anonymous feed gets asked.",
    "result": "", "evidence": "", "shipped": false, "note": "" },

  { "id": "A-011", "what": "Make joining a group and I'm going persist, and show who else is going",
    "owner": "p03", "team": "product", "state": "planned",
    "estimate": 3, "due": "2026-10-13", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "", "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-012", "what": "Let a student add their own rec, with a category and one line of why",
    "owner": "p03", "team": "product", "state": "planned",
    "estimate": 3, "due": "2026-10-15", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "", "result": "", "evidence": "", "shipped": false,
    "note": "Both of p03's land before 19 October; p03 is away the week M1 falls in." },

  { "id": "A-013", "what": "Add nights and a sort to the weekend planner, keeping the budget slider in step",
    "owner": "p04", "team": "product", "state": "planned",
    "estimate": 3, "due": "2026-10-15", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "", "result": "", "evidence": "", "shipped": false, "note": "" },
  { "id": "A-014", "what": "Make the first-week programme checklist tick, save and show progress",
    "owner": "p04", "team": "product", "state": "planned",
    "estimate": 3, "due": "2026-10-22", "opened": "2026-10-08", "touched": "2026-10-08",
    "expect": "", "result": "", "evidence": "", "shipped": false, "note": "" }
];
