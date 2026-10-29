# MP2 · Notify: the right person follows up within a day

**Status: DRAFT v1 for Finn and Daniele to correct and sign.** Mini Project 2, pair 5 (Notify, C-18). Written
29 Oct 2026. Presentation: Tuesday 10 November 2026 (session 18). **Nothing on this page has been built or run
yet.** Where a result is needed, the page says "not run" instead of writing one.

---

## 1. What this piece is for

The machine ends with a person. Capture catches a sign-up or a partner lead, Enrich adds ring, persona,
university and wave, Store puts it in one table, and **Notify makes sure somebody acts**:

- the student gets a welcome email with their first-week checklist, the moment they sign up;
- a partner who writes (international office, provider, ESN section, residence) reaches **one named owner** within
  a day;
- when a step breaks, an error route retries and then tells Operations, so nobody who signed up is left waiting.

**Who needs it, outside the twelve.** The student who signs up and gets a first step instead of a void. The
partner who writes and hears back. Both are named users outside the company (checklist, "does someone need it?").

## 2. Concept map

Welcome email → Owners → Routing → Errors → Within a day → Review → Follow-up. Written out:

| Piece | In one line | Where it lives |
|---|---|---|
| Welcome email | The student's first message from Corners, with their checklist | `automation/routing.md` §4 |
| Owners | One named person per kind of lead | `automation/routing.md` §2 |
| Routing | Who is told what, written once | `automation/routing.md` §1 |
| Errors | Retry twice, then alert Operations | `automation/notify.json`, `04 - Playbooks/incidents.md` |
| Within a day | The reminder at 24 hours and the escalation at 48 | `automation/routing.md` §3 |
| Review | A person outside the pair runs the whole scenario | `04 - Playbooks/incidents.md` |
| Follow-up | The owner's reply, logged in the lead table | Store pair's table (C-17) |

## 3. How it runs, day to day

**Generate.** A new row in the lead table starts the scenario (n8n). Routing rules R1 to R6
decide who is told what. Claude (AI) drafted the rules and the welcome email text; the pair edits them.

**Review.** A person outside the pair runs the scenario with invented test data and the playbook alone
(`04 - Playbooks/incidents.md`). A review checks: right person, within the day limit, no personal data in any
alert, a forced failure reported.

**Implement, every week.** The owner answers within a day and logs the reply. Errors go to Operations. A weekly
review reads the list of unrouted leads and the failed runs. A change to a rule goes by pull request, so the rule
file and the scenario never disagree.

## 4. What it saves or creates, in numbers we can count

Counts, not percentages (fewer than 30 records). All of them are read from the lead table and the scenario log.
Nothing is measured yet.

| Number | Why it matters | Source (to read, when run) |
|---|---|---|
| Welcome emails sent within 5 minutes, of those due | The first step reaches the student at once | Scenario log |
| Partner leads that got a logged reply within 24 hours, of those received | The day promise, checked | Lead table |
| Partner leads that needed the 48-hour escalation | Where the owner is overloaded | Lead table |
| Failed runs, and how many were recovered | Whether the error route works | Scenario log |
| Hours the owners spend on notifying by hand, before and after | The hours it saves | Hours log (`board/data`) |

These feed `docs/kpi-tree.md` §3: *sign-ups by source* and *partner conversations booked*. Visibility is
counted as things outsiders did (sign-ups, replies, codes used), never followers.

## 5. One alternative considered, and why it lost

**Considered:** one daily digest email to the whole team listing every new lead.

**Chosen:** one alert to one named owner per lead, plus the day-limit reminder.

**Why the digest lost**
1. `board/data/actions.js` fixes the rule: an owner is one name, never two and never a team. A digest goes to
   everybody, so each person assumes another one replies.
2. A digest sent once a day can itself take 24 hours to arrive, which uses the whole promise before anyone reads it.
3. It cannot be checked: nothing says who owed which reply.

## 6. One failure found, and how the review process catches it

**Not found yet.** The failure goes here after the forced-failure test, with what broke, who was affected and
how it was recovered. We do not write a failure we have not seen.

**Failures we expect, and which review step catches each** (risks, not findings):

| Risk | Caught by |
|---|---|
| An alert carries an address or a name | Review check 4 in the playbook: read three alerts as the owner |
| The welcome email goes to someone who did not agree to be emailed | Rule R1 sends only when `consent = yes`; review sends one test without consent and expects nothing |
| The owner is on holiday and the day limit passes | R3 and R4: reminder at 24 hours, Operations at 48 |
| An outside service is down and the retry loops forever | Retries are capped at 2; then the error route alerts Operations |

## 7. Data and sources

- Invented or our own data only. Test addresses use `example.com`. No real student, partner or staff address, name
  or id appears here (checklist: "Invented or your own data only").
- The day-limit promise comes from `PROJECT.md` (safety rules: "a person reads reports, in your city, within a
  day") and from the Mission 2 slides for pair 5 (29 Oct 2026).
- No figure on this page comes from outside the repo. Every pass mark is **set before the run**, in
  `automation/notify.json`, so a result cannot be bent to fit.

## 8. Files, owners and the handover

| File | What | Leads (answers for it) |
|---|---|---|
| `automation/notify.json` | The scenario spec | Finn |
| `automation/routing.md` | Routing rules, owners, welcome email | Daniele |
| `automation/build-notify.md` | Step-by-step guide to build the scenario in n8n | Finn |
| `03 - Deliverables/mp2/notify.md` | This page | Daniele |
| `04 - Playbooks/incidents.md` | How to run, break and recover | Finn |
| `board/coordination-hall.html` | The two buildings in Corners City | Daniele |
| `board/coordination-hall.js`, `board/coordination-hall.css` | Three small tools inside the building: a routing check for one lead, a reply desk with drafts for the owner, and an incident-row builder. They store and send nothing | Daniele |

**Finn and Daniele work on every file together.** Both write, build, test and review; neither one only watches. The name in the third column is who answers for that part in the end, because the course asks that each name owns a named part. The split is a proposal from the draft: Finn and Daniele change it and sign.
The handover (`01 - Registry/HANDOVER-TEMPLATE.md`) is written after the first full run.

## 9. Open items

| What | By when | Who is waiting on it |
|---|---|---|
| n8n: what it costs to run (read it from the real account page) | Before building | The one-page readme (pair 6) |
| The lead table's real field names (Store pair, C-17) | Before building | `notify.json`, `routing.md` |
| Names of the owners in `routing.md` §2 | Before the first run | R2, R3, R4 |
| The checklist link from the lead magnet (pair 1) | Before the welcome email works | R1 |
| A reviewer outside the pair, not chosen yet | Before the pull request is ready | The whole piece |
| The forced-failure test | By 10 Nov | §6 of this page |

---
*Drafted by Claude (AI) at Daniele's request from `PROJECT.md`, `docs/kpi-tree.md`, `CLAUDE.md` and the Mission 2
slides. AI-generated content is marked. Signed by: ______ (Finn) · ______ (Daniele)*
