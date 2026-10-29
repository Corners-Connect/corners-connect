# Routing rules: who is told what

**Status: DRAFT v1 (29 Oct 2026), for Finn and Daniele to correct and sign.** Mini Project 2, pair 5 (Notify,
C-18). Written once, in one place: the Make or n8n scenario reads these rules, and nobody edits a rule inside
the scenario without changing this page by pull request.

Nothing here is built or run yet. Names of owners are not decided: they are left blank on purpose, because
who owns what is the company's decision, not ours (`CLAUDE.md`, "The line you do not cross").

## 1. The rules

| Id | When | Who is told | What they get | Within | Owner of the rule |
|---|---|---|---|---|---|
| **R1** | A student signs up and agreed to be emailed | The student | The welcome email with their first-week checklist (section 4) | 5 minutes | Audience |
| **R2** | A partner writes (international office, provider, ESN section, residence) | **One** named person in Audience | An alert with the lead id, the kind of partner and the reply-due time | 5 minutes | Audience |
| **R3** | A partner lead has no reply logged after 24 hours | The same owner | One reminder | 24 hours | Audience |
| **R4** | Still no reply after 48 hours | Operations | The lead id and the owner | 48 hours | Operations |
| **R5** | No rule matches, or the AI enrich step marked the row wrong | Nobody outside the twelve | The lead id goes on the weekly review list | Weekly | Operations |
| **R6** | Any step fails twice after retrying | Operations | Scenario, step, run id, error text, lead id | 15 minutes | Operations |

**One owner, one name.** The action rules in `board/data/actions.js` say an owner is one person id, never two,
never a team. R2 follows the same rule: if the alert goes to two people, each assumes the other replies.

**Alerts carry no personal data.** An alert holds the lead id and the kind, never an address, a name or free
text. The owner opens the lead table, where access is already controlled. This also keeps the alert out of
`docs/audience-research-plan.md` §9 and §15 (no addresses collected or passed around without consent).

## 2. Who owns the follow-up (to decide)

| Kind of lead | Owner (name to be set by the team) | Why this team |
|---|---|---|
| International office, provider, ESN section | Audience owner: ______ | Audience runs partner pitches (`PROJECT.md`, three-teams row) |
| Residence, partner café | Operations owner: ______ | Operations runs residences and cafés (`PROJECT.md` §5, channels) |
| Failure of the scenario itself | Operations owner: ______ | Operations runs the pilot and the data |

## 3. The day limit

The promise is *the right person follows up within a day*. R3 and R4 check it. "A reply is logged" means the
owner wrote the date in the lead table; a reply that is not logged does not count, the same way an hour that
is not logged the same day does not count (`docs/kpi-tree.md` §1, rule 5).

## 4. Welcome email, first draft (Claude, AI; Finn and Daniele edit and sign)

Subject: **Your first week in Bilbao**

> Hi {first name},
>
> You signed up for Corners. Here is your first-week checklist: {link}.
>
> It has the dates for your programme and what to do first: transport card, empadronamiento, TIE
> appointment, SIM.
>
> One thing to try this week: pick one plan from the list and go.
>
> Reply STOP and we delete your address.
>
> Corners

Why it reads like this: short sentences with full stops, a thing to do, no "community" or "vibes"
(`PROJECT.md` §5, voice). The first-week items come from the Programme section of the app. Spanish for
first-years comes later (ring "Next").

## 5. What these rules do not do

- They do not decide who the owners are. Section 2 stays blank until the team fills it.
- They do not read replies. Logging the reply is a person's job.
- They do not touch the Capture, Enrich or Store steps. Field names are placeholders until the Store pair fixes
  the table.

---
*Drafted by Claude (AI) at Daniele's request from `PROJECT.md`, `docs/kpi-tree.md` and the Mission 2 slides.
Finn and Daniele sign: ______ (Finn) · ______ (Daniele)*
