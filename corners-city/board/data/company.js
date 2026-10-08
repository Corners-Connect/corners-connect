/* ═══ company.js · who we are, when we work, what we are shaped like ═════════
   Owner: Operations. Changes maybe four times all term.

   The board edits this file for you — everything here has a form behind the
   Edit buttons. Hand-editing works too; keep it valid and run check.py.

   FIELDS
     sample     true until you have replaced the placeholder rows. While true,
                every screen carries a SAMPLE DATA stamp, which is correct,
                because none of it is yours yet.
     name       the company's name, once it has one
     purpose    one sentence. Why this exists. Every other line is measured
                against it.
     unit       what this company counts in. There is no money in this course,
                so the currency is hours. If money ever arrives, put "EUR" here
                and the Hours screen becomes a money screen with no code change.
     today      null uses the real date. Set "2026-10-22" to see the board on a
                delivery day — useful once, for a rehearsal.
     blockObjective   one per block, four all term, set by whoever carries the
                      company through that block.
     inheritedObjective   the one objective this company did not set for itself.
     teams      grouped by what ships, never by topic.
     milestones USAC's dates. They do not move.
     calendar   the term, session by session. This is the company's real clock:
                you do not have 38 days until Mini Project 1, you have 11
                sessions.
     competences  the 21 from the course outline, one per class. The levels
                  live in people.js.
   ══════════════════════════════════════════════════════════════════════════ */
window.DIP = window.DIP || {};
window.DIP.company = {
  "sample": true,
  "name": "—",
  "purpose": "—",
  "unit": "hours",
  "today": null,
  "blockObjective": { "block": 1, "text": "—", "owner": "—" },
  "inheritedObjective": "Every member of this company demonstrates all 21 competences by 3 December.",
  "teams": [
    { "id": "product",    "name": "Product",    "seats": 4, "question": "What we make, and whether it works" },
    { "id": "audience",   "name": "Audience",   "seats": 3, "question": "Who it is for, and how they hear about it" },
    { "id": "operations", "name": "Operations", "seats": 4, "question": "How the company runs, and how it knows" }
  ],
  "milestones": [
    { "id": "M0", "session":  5, "date": "2026-09-22", "name": "Manual ratified · Case Study 1" },
    { "id": "M1", "session": 13, "date": "2026-10-22", "name": "Mini Project 1 — the launch" },
    { "id": "M2", "session": 18, "date": "2026-11-10", "name": "Mini Project 2 — the machine" },
    { "id": "M3", "session": 25, "date": "2026-12-03", "name": "Final Project" },
    { "id": "M4", "session": 27, "date": "2026-12-15", "name": "Final presentation" }
  ],
  "calendar": [
    { "n":  1, "date": "2026-09-08" }, { "n":  2, "date": "2026-09-10" },
    { "n":  3, "date": "2026-09-15" }, { "n":  4, "date": "2026-09-17" },
    { "n":  5, "date": "2026-09-22" }, { "n":  6, "date": "2026-09-24" },
    { "n":  7, "date": "2026-09-29" }, { "n":  8, "date": "2026-10-01" },
    { "n":  9, "date": "2026-10-06" }, { "n": 10, "date": "2026-10-08" },
    { "n": 11, "date": "2026-10-13" }, { "n": 12, "date": "2026-10-15" },
    { "n": null, "date": "2026-10-20", "off": "USAC excursion" },
    { "n": 13, "date": "2026-10-22" }, { "n": 14, "date": "2026-10-27" },
    { "n": 15, "date": "2026-10-29" }, { "n": 16, "date": "2026-11-03" },
    { "n": 17, "date": "2026-11-05" }, { "n": 18, "date": "2026-11-10" },
    { "n": 19, "date": "2026-11-12" }, { "n": 20, "date": "2026-11-17" },
    { "n": 21, "date": "2026-11-19" }, { "n": 22, "date": "2026-11-24" },
    { "n": 23, "date": "2026-11-26" }, { "n": 24, "date": "2026-12-01" },
    { "n": 25, "date": "2026-12-03" },
    { "n": null, "date": "2026-12-08", "off": "public holiday" },
    { "n": 26, "date": "2026-12-10" }, { "n": 27, "date": "2026-12-15" }
  ],
  "competences": [
    { "id": "C-01", "text": "Explain what a language model is, what it is not, and where it fails" },
    { "id": "C-02", "text": "Write a prompt with role, context, constraints and output format" },
    { "id": "C-03", "text": "Chain prompts and work with multimodal inputs" },
    { "id": "C-04", "text": "Evaluate an output and make it reproducible" },
    { "id": "C-05", "text": "Spot and argue an ethical or legal problem" },
    { "id": "C-06", "text": "Generate and direct consistent brand imagery" },
    { "id": "C-07", "text": "Build a node-based flow with real control over the result" },
    { "id": "C-08", "text": "Produce video with audio, dubbing and subtitles" },
    { "id": "C-09", "text": "Build an avatar, and know when you must disclose it" },
    { "id": "C-10", "text": "Run market research with AI and come out with usable segments" },
    { "id": "C-11", "text": "Write an SEO brief starting from search intent" },
    { "id": "C-12", "text": "Generate SEM variants and design the test that compares them" },
    { "id": "C-13", "text": "Build a content calendar with safe automation" },
    { "id": "C-14", "text": "Build a vibe-coded micro-app and ship it" },
    { "id": "C-15", "text": "Connect that app to a model and to data" },
    { "id": "C-16", "text": "Build a webhook or form trigger in Make/n8n" },
    { "id": "C-17", "text": "Enrich and classify with AI, and write the result somewhere" },
    { "id": "C-18", "text": "Close an end-to-end scenario with notifications and error handling" },
    { "id": "C-19", "text": "Describe an AI business model and its go-to-market" },
    { "id": "C-20", "text": "Build an ROI model with real costs" },
    { "id": "C-21", "text": "Present a case with evidence and hold it under questioning" }
  ]
};
