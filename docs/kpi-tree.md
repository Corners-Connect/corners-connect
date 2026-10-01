# Corners KPI tree — GQCDM

**Drafted 24 September 2026, the first day of block 2 · a pitch under the decision system, amendable like everything else**

Pitch 6 gave us five boxes — **G**rowth, **Q**uality, **C**ost, **D**elivery, **M**otivation — and two rules:
every box has one owner, and **no KPI ever touches anyone's grade.** This document turns the five boxes into
indicators we can actually count during the Bilbao pilot. [PROJECT.md §7](../PROJECT.md#7-numbers-we-watch)
holds the short version; the definitions live here.

**At a glance:** five boxes · one headline number each · read in the last five minutes of each session ·
most of block 2 counted by hand, because the pilot is hand-run.

---

## 1. The rules before the numbers

1. **Leading is a behaviour, this week. Lagging is a result, later.** Leading is the only kind you can
   still change. Lagging is the only kind that proves anything. Every box carries both.
2. **One owner per box.** Not a team that agrees to look at it — a name.
3. **No number without a source and a date.** Where it came from, and when it was counted. A number with
   neither is an opinion.
4. **Under 30, no percentages.** Same rule as the [field plan](audience-research-plan.md#4-who-we-ask). In a
   pilot of tens of people a percentage moves three points because one person did something. Report counts
   and quotes until the denominator is real.
5. **Log it the same day or it didn't happen.** Hours especially. Hours reconstructed on Sunday are fiction.
6. **A number nobody acts on gets dropped.** At the end of each block, any indicator that never changed a
   decision comes off the list. The list is meant to get shorter.
7. **None of it touches a grade.** Delivery is the box most likely to be mistaken for one. It isn't.

### Not KPIs

Followers. Impressions. Total sign-ups ever. Posts published. Lines of code. Hours worked *as a virtue* —
hours are a cost, and going up is bad news. Anything the twelve of us can move without a student outside
the twelve doing something.

---

## 2. The five boxes

| Box | The one number | Owner | Read |
|---|---|---|---|
| **Growth** | Verified Bilbao students who did something in Corners this week | Audience | Weekly |
| **Quality** | Students who found something through Corners they'd otherwise have missed | Product | Weekly |
| **Cost** | Hours per active student, this week | Operations | Weekly |
| **Delivery** | Share of what we committed to that shipped by the next session | Operations | Every session |
| **Motivation** | How many different names of the twelve shipped something this week | **Nobody, on purpose** | Weekly |

---

## 3. Growth — are we reaching more of the right people?

**Owner: Audience.** The right people are an arrival cohort, not an age group. Someone who signs up in
March and someone who landed last week are not the same number.

| | Indicator | Definition | Source |
|---|---|---|---|
| **Headline** | Weekly actives | Verified Bilbao students who posted, voted, saved a rec, joined a group or opened a trip in the last 7 days | Pilot sheet (block 2), event log (block 3) |
| Leading | Sign-ups this week **by source** | Cohort code, arrival group chat, café card, residence card, invite, word of mouth. Source recorded at the time — never reconstructed later | Sign-up form |
| Leading | Activation | Of this week's sign-ups, how many did something within 48 hours | Pilot sheet |
| Leading | Invites sent per active student | The only growth that scales without our hours | App (block 3) |
| Leading | Partner conversations booked | Meetings in the diary with an ESN section, an international office, a provider or a residence | Audience log |
| Lagging | **Cohort conversion** | Of one partner's cohort, the share who joined within two weeks of the code going out. The number that says whether institutions are a channel at all | Partner + sign-up form |
| Lagging | Week-4 retention | Of the students who signed up in week *n*, the share still opening it in week *n+4* | Pilot sheet / event log |
| Lagging | January pre-registrations | The spring wave is the first launch that isn't a pilot. Watch it from 12 October | Waitlist |

**The trap.** Total sign-ups is a number twelve motivated students can move a long way by themselves.
Cohort conversion and week-4 retention can't be faked. When they disagree with sign-ups, believe them.

---

## 4. Quality — is it good enough to come back to?

**Owner: Product**, with Operations owning the moderation rows.

### The north star, defined

PROJECT.md §7 says the candidate is *"students who found something through Corners they'd otherwise have
missed"*, and that it needs a real definition before it can be measured. Proposed:

> A **find** is one student, in one week, who (a) opened a rec, group, guide or trip in Corners, (b) went,
> and (c) answers *no* to one weekly question: **"Would you have found this without Corners?"**

Three parts, because each alone is a lie. A tap is not a visit. A visit is not a discovery — the pintxo bar
everyone already knows doesn't count. We ask; we don't infer. One question, once a week, to actives only.
If this stays under five finds a week through the whole pilot, the product isn't working and no other
number rescues it.

| | Indicator | Definition | Source |
|---|---|---|---|
| **Headline** | Finds this week | As defined above | Weekly one-question check |
| Leading | Useful-reply rate | Share of Nearby posts that get a reply within 2 hours. A question nobody answers is the group chat again | Pilot sheet / event log |
| Leading | Rec completeness | Share of published recs carrying a price, a time and a student-rate tag. Those tags are what make it not Google | Content sheet |
| Leading | Provenance freshness | Share of the numbers on the city pages with a named source dated within 12 months ([PROJECT.md §4](../PROJECT.md#4-the-product)) | Monthly manual audit |
| Lagging | Week-4 retention | Shared with Growth, on purpose. Retention is the honest quality measure | Pilot sheet / event log |
| Lagging | Reports per 100 posts | Content reported under the naming, rating and targeting rule | Moderation log |
| Lagging | Corrections | Numbers we published and had to fix. Zero is suspicious, not good — it means nobody checked | Repo history |

---

## 5. Cost — what does it take to keep one city alive?

**Owner: Operations.** This course has no money, so cost is hours. Every hour is logged the same day, by the
person who spent it, in one sheet on the shelf — not in chat.

| | Indicator | Definition | Source |
|---|---|---|---|
| **Headline** | Hours per active student | All logged hours this week ÷ weekly actives. Falling is the whole point | Hours sheet |
| Leading | Hours to keep one city stocked | Finding, checking and publishing a week of recs, posts and trips for Bilbao | Hours sheet |
| Leading | Hours per 100 sign-ups, by channel | The number that decides where next week's campaign hours go | Hours + sign-up source |
| Leading | Hours per supplier signed | Guides is the revenue line, and the one that needs people to say yes | Hours sheet |
| Lagging | Four-week trend | Hours per active student across four weeks. One week is noise | Hours sheet |
| Lagging | **The automation dividend** | Hours saved per week after block 3's Make/n8n work, against the block 2 baseline. This is what mini-project two is for | Hours sheet |
| Lagging | Euros per active student | Domain, any paid reach, anything we spend. Small, but not zero | Receipts |

**Baseline first.** We have no idea what a stocked city costs. The first two weeks of block 2 set the
baseline; targets come after, from our own numbers, not from a guess made today.

---

## 6. Delivery — did we ship what we said, when we said?

**Owner: Operations**, across all three teams. **This is not a grade and never feeds one.** It measures
whether our commitments mean anything, which is a property of the group, not of a person.

| | Indicator | Definition | Source |
|---|---|---|---|
| **Headline** | Commitment hit rate | Of the items committed at the start of a session, the share shipped by the next one | Session notes |
| Leading | Committed but not started, midweek | Items with nothing done on them halfway through the week. The earliest warning we get | Repo / board |
| Leading | **Time to action a report** | From a report arriving to a decision made. The Safety section promises within a day — this is that promise, counted | Moderation log |
| Leading | Rec cycle time | From "someone asks for a rec" to "rec published" | Content sheet |
| Lagging | Fixed dates hit | 22 Oct, 10 Nov, 3 Dec. Three chances, no extensions | Course calendar |
| Lagging | Slipped twice | Items that moved in two consecutive sessions. One slip is a week; two is a decision nobody wants to make | Session notes |
| Lagging | Decisions still unvoted | Open items from [PROJECT.md §8](../PROJECT.md#8-open-decisions) past the block they were due. Seven are open today | PROJECT.md |

---

## 7. Motivation — deliberately unowned

Pitch 6 left motivation and cross-team knowledge without an owner on purpose, and the launch book kept it
that way. Keep it. A motivation number with an owner becomes a target, and a motivation target becomes
performance for whoever is holding the clipboard. The reader rotates; nobody owns it.

| | Indicator | Definition | Source |
|---|---|---|---|
| **Headline** | Distinct names shipping | How many of the twelve shipped something this week. Shipped means in the repo, on the shelf, or in front of a student in Bilbao | Repo + session notes |
| Leading | Field shifts filled | Sign-ups for the week's hours in residences, libraries and Spanish courses | Operations rota |
| Leading | Voices before the vote | How many different people spoke in the open argument. Silence before a secret vote is the failure mode of the decision system | Session notes |
| Lagging | Concentration | Over four weeks, the share of shipped things made by the same three names. Rising is bad news even while the headline looks fine | Repo |
| Lagging | Would you go again? | Asked of each of us after every pilot event. One question, yes or no | Pilot debrief |
| Lagging | Knowledge crossing | Times a thing one team made got used by another without being rebuilt | Session notes |

**Never publish the per-person list.** The unit is the count of distinct names, not which names. The moment
it becomes a leaderboard it stops measuring motivation and starts measuring who is comfortable being seen.

---

## 8. What we can actually count, and when

The pilot is hand-run until at least 22 October ([open decision 7](../PROJECT.md#8-open-decisions)), so most
of block 2 is a sheet and a pen. That's fine — it's also the cheapest instrumentation there is. What it
can't do is count opens, and retention needs opens.

| Indicator | Block 2 (hand-run, to 22 Oct) | Block 3 (built, from 27 Oct) |
|---|---|---|
| Sign-ups, source, activation | Sheet, filled at the time | Form → Supabase |
| Weekly actives | Sheet: who did something we saw | Event log |
| Week-4 retention | **Not countable.** Say so rather than estimating | Event log, first real read mid-November |
| Finds (north star) | Weekly question, asked in person or by message | In-app weekly prompt |
| Hours | Sheet, same day | Sheet, same day. This one never automates |
| Useful-reply rate, rec cycle time | Sheet | Event log |
| Delivery, motivation | Session notes and the repo | Same |

**Say "not yet countable" out loud.** An estimate repeated three times becomes a fact, and we keep a whole
section of sourced market figures precisely because we don't work that way.

---

## 9. The weekly read — five minutes

Last five minutes of each session. One screen, five numbers, this week against last.

1. **Growth** — weekly actives, and where this week's sign-ups came from.
2. **Quality** — finds this week, and anything reported.
3. **Cost** — hours per active student, and where the hours went.
4. **Delivery** — what we said, what shipped, what slipped twice.
5. **Motivation** — how many different names.

Then one question and nothing else: **which number changed a decision this week?** If none did for two
sessions running, the list is wrong and we cut it.

---

## 10. What this asks the class to decide

Under the decision system these are pitches, not decisions. Recommendations are mine.

1. **Adopt GQCDM as the axis**, replacing the team × leading/lagging grid in PROJECT.md §7. Teams still own
   boxes, but the boxes are the five, so pitch 6 and the numbers finally agree.
2. **Adopt the north star definition** in §4 — opened, went, wouldn't have found it. *Recommendation: yes,
   and start asking the question this week, before there's anything worth measuring.*
3. **Name four owners.** One per box for Growth, Quality, Cost and Delivery; motivation stays unowned.
4. **No targets until 8 October.** Two weeks of baseline first. *Recommendation: yes — targets invented
   today would be guesses we would then have to defend.*
5. **Confirm the hours rule.** Same-day logging, by the person who spent them, one sheet on the shelf.
