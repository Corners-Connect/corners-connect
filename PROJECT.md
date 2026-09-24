# Corners — project reference

The single place to catch up on what Corners is, where it came from, what's decided and what isn't.
Keep this file updated. If something here is out of date, fix it here first.

- **Last updated:** 22 September 2026
- **Company:** Corners — a student company, autumn 2026, Bilbao
- **Team:** 12 people. None of them from Bilbao.
- **Onboarding + dashboard (one page, light):** https://claude.ai/artifact/43EJ3fwJPR93fCKgvgraBM
  — add `#demo` to the URL for a filled-in example that opens straight on the dashboard.
  The same `#demo` works on the app link, which opens set up in Bilbao. That's the run-through to show the class.
- **App demo (the product):** https://claude.ai/artifact/SyVrLipV63UHqEjPSweDyj
- **Live preview (website):** https://claude.ai/artifact/KgwCmfG8kqduNSqJDEsqDg
- **Launch book (strategy):** https://claude.ai/artifact/6ZeW8csDJwnZG8QmXRy8Yk — *written for the earlier concept, see [§9](#9-whats-out-of-date)*

---

## 1. What Corners is

**Corners is the app for your semester abroad.** For Erasmus students, study-abroad students and
first-years who moved city: what students near you are saying, where to eat and train, groups to
join, guided experiences, weekend trips that fit your budget, and everything about your programme.
In one place.

- **Tagline:** Nobody here is local.
- **Pilot city:** Bilbao, autumn 2026.
- **Who pays:** free for students. Universities and programmes are the intended buyers. *Not finally decided — see [§8](#8-open-decisions).*

### The thesis

Everyone arrives at the same time, and for about six weeks anyone will say yes to anything. After
that the city is normal, the circles are set, and the chance is gone. Everything a newcomer needs in
those weeks is currently scattered across a 400-person WhatsApp group, a PDF from July, Google, and
whoever they happen to sit next to.

---

## 2. Where it came from — session 02 (8 September 2026)

The professor delivered seven pitches. Under the decision system, everything except the System
Prompt is a pitch: never binding, always voted, and the class can throw out the whole thing.

| # | Pitch | Substance |
|---|---|---|
| 1 | Decision system | Every session: professor pitches 10 min → class argues in the open → votes in secret → builds. Five answers: **approve, amend, park, reject, counter-pitch**. Counter-pitch is the best answer. |
| 2 | Objectives | 21 competences × every person, by 3 December. Grades: two mini-projects 20% each (22 Oct, 10 Nov), final 20% (3 Dec), in-class labs 20%, participation 10%. |
| 3 | Types of organisation | Six shapes, each buys something and sells something. Proposed: three teams — **Product / Audience / Operations** — grouped by what ships, never by topic. Galbraith's ladder: pick the cheapest coordination rung that works. |
| 4 | Social media | "Not one of you is local" is an advantage that expires in about six weeks. Content split **70 / 25 / 5**. Original product idea: a private journal, no replies, no likes. |
| 5 | Brand book | Five decisions: mark, colours, type, voice, size floor. Direction A "the wreath" (chocolate + baby blue, every leaf an eye) vs Direction B "the eleven" (eleven coloured squares). |
| 6 | KPIs | Leading (a behaviour, this week) vs lagging (a result, later). Five things to watch: growth, quality, cost, delivery, motivation. **No KPI ever touches a grade.** |
| 7 | Workspace | The river (chat) vs the shelf (files with a name, a version, a history). Teams + one GitHub repo. |

### Course calendar (fixed)

| Block | Dates | Topic | Deliverable |
|---|---|---|---|
| 1 | 8–22 Sep | Foundations & prompting | Prompt lab · 22 Sep |
| 2 | 24 Sep – 22 Oct | Marketing & creative media | **Mini-project one · 20% · 22 Oct** |
| 3 | 27 Oct – 12 Nov | Vibe coding & automation | **Mini-project two · 20% · 10 Nov** |
| 4 | 17 Nov – 3 Dec | Strategy & innovation | **Final project · 20% · 3 Dec** |

---

## 3. What we kept, changed and dropped

| From session 02 | | Now |
|---|---|---|
| Decision system | **Keep** | Unchanged. Everything in this file is votable. |
| Three teams | **Keep** | Product builds the app. Audience runs marketing and partner pitches. Operations runs the pilot, moderation and data. |
| "Not one of you is local" | **Keep** | Became the product thesis and the tagline. |
| The six-week window | **Keep** | The reason the product exists, and the timing of all marketing. |
| 70 / 25 / 5 content split | **Keep** | Still the content rule. |
| KPI tree, leading vs lagging | **Keep** | Adapted to product numbers ([§7](#7-numbers-we-watch)). |
| Teams + one GitHub repo | **Keep** | Teams for the institution, repo for anything that matters in December. |
| Wreath mark (direction A) | **Keep, restyled** | The eye wreath is still the mark, now drawn in blue gradient on near-black. **Chocolate brown is gone from the website** — this changes a pitch-5 decision the class voted on, so it needs an amendment. |
| Direction B, eleven squares | **Drop** | Dies in one ink. |
| Private journal, no replies | **Drop** | Replaced by the feature set in [§4](#4-the-product). |
| Groups of eleven, "corners" of 11 people | **Drop** | Never agreed by the class. Removed from the website entirely on 22 Sep. |
| No likes, no followers, no comments | **Drop** | Incompatible with an anonymous voted feed. Nearby has votes and replies. |

---

## 4. The product

Six features. Each is a section on the website.

### Nearby — anonymous posts
Anonymous posts from verified students within a few kilometres. Bus questions, "who's out tonight",
lost umbrellas, warnings. Vote up what's useful; the best of the day rises. Closest reference: Yik Yak.
- Anonymous to other students, **never to moderators**
- Only verified students in your city can post
- Posts that name, rate or target a person are removed

### Recs — food, gym & sport, events, things to do
Ranked by students, not tourists. Tagged by what a student actually filters on: under €15, Thursdays,
free, late, student rate.

### Groups & communities
Interest groups you join with one tap — surf, hiking, language exchange, board games, football,
film club. Found by what you do, not where you're from.

### Guides — tours and experiences
Bookable experiences: pintxo tours, surf lessons, Gaztelugatxe day trips, cooking classes.
The one obvious revenue line (commission), and the one that needs suppliers.

### Weekends — budget trip planner
Tell it your budget and how many nights; it shows where you can go from your city, broken into
travel, bed and food. Eight destinations from Bilbao are modelled on the site.

### Before you leave (added 22 Sep)
Choosing where to go is the step before everything else, so the app starts there: six questions
(activities, budget, city size, climate, language, where you're flying from) rank **ten cities** —
Bilbao, San Sebastián, Barcelona, Madrid, Valencia, Granada, Sevilla, Salamanca, Lisbon, Porto.
Each has a page (cost breakdown, safety, climate, language and universities, flights, what you'd do
there), any three compare side by side, and a phased pre-departure checklist follows.

**Data provenance** — the numbers are real, not invented, and the app says where each comes from:
rents from idealista (Q2–Q3 2026), meals and the safety index from Numbeo, youth transport passes
from the operators themselves, climate from AEMET and IPMA 1991–2020 normals, flights from airline
schedules. Known weaknesses, all flagged in the app: Numbeo safety is crowdsourced perception and
Bilbao's score looks like a small-sample artefact; Granada and Salamanca rents come from a different
source than the rest; Valencia's transport price is confirmed only to 30 June 2026. **Not verified,
so not shown:** Erasmus intake numbers per university, EF English proficiency scores, and a ranking
of Spanish cities by Erasmus intake. The "English spoken", nightlife, outdoors and academic-fit
ratings are our own judgement calls, labelled as such.

**Added later on 22 Sep, now sourced:** English proficiency is the **EF EPI 2025 city score** (Porto 618
and Lisbon 612 beat every Spanish city; Sevilla 535 is lowest; Portugal ranks 6th of 123 countries,
Spain 36th). Erasmus intake per city comes from **European Commission mobility microdata, 2023**:
Lisbon 5,349 (the most of any city in Europe), Madrid 5,205, Barcelona 4,374, Valencia 4,194,
Porto 2,192, Granada 1,929, Sevilla 1,820, Bilbao 1,185 including Leioa, Salamanca 803,
San Sebastián 143 (a known undercount — UPV/EHU registers most exchange students under Leioa).
University entries now carry the **campus trap**: UAB, UAM, Carlos III, Pablo de Olavide and
UPV/EHU's Bizkaia campus are not in the city their name suggests. One claim to stop repeating:
**Granada is no longer Europe's #1 Erasmus-receiving university** — that dates from 2015/16. It is
still Spain's top university for Erasmus+ funding, and takes ~1,930 Erasmus students into a city
of 230,000, which is the better story.

### Housing (added 24 Sep, from the team mock-up — website only so far)
The hardest part of arriving, and the biggest gap in the app. Design: every portal in one search
(Idealista, Spotahome, Uniplaces side by side), **Corners Verified** listings we've checked, a map
view with price pins against your campus, direct student listings that show who you'd live with, and
**sublets** — the student leaving hands their room to the one arriving. The mock-up's own tab bar
reads **Departure · Housing · Events · Uni**, which is a different information architecture from the
app's current one and needs reconciling. No portal partnership exists, and verification is a process
we would have to staff: both are labelled on the site.

### Your programme
Key dates, first-week checklist (transport card, empadronamiento, TIE appointment, SIM),
who to ask, housing and paperwork answers, and what people are asking most this week.
This is also the hook for universities and programmes.

### Safety rules (on the site, load-bearing)
1. Verified students only — every account belongs to someone enrolled in your city
2. Anonymous to students, not to us — break the rules and the account goes, not just the post
3. No names, no targets
4. A person reads reports, in your city, within a day

> Anonymous posting is the highest-risk part of the product. Yik Yak's history is the warning.
> There is no moderation plan yet beyond these four lines. **This must exist before launch.**

---

## 5. Audience

We target **arrival**, not age. "Students" is unreachable; "arrived in Bilbao in September" is a date,
a place and an inbox.

| Ring | Who | Why |
|---|---|---|
| **Core, now** | Incoming exchange students in Spain (Erasmus + US study abroad), 19–24 | Known arrival date, arriving in waves, concentrated in a few cities and universities, reachable through institutions |
| **Next** | First-years who moved city (Spanish, 18–19) | One arrival wave, harder to reach before they come, needs Spanish |
| **Later** | New in town: interns, language assistants, first jobs | Same problem, no institution to reach them through, and no student email to verify |
| **Buyers** | International offices, study abroad providers (USAC, CIEE, API, IES), ESN sections, residences | They already email every arrival |

### Personas
- **Chiara, 21** — Erasmus from Bologna at UPV/EHU. Afraid of spending the semester only speaking Italian. Reachable via ESN and the pre-arrival group chats.
- **Aiyana, 20** — US study abroad through a provider. Afraid of going home having only met her own cohort. Reachable via the provider's pre-departure packet.
- **Marta, 18** — first-year from Valladolid at Deusto. Afraid everyone local already has their school friends. Reachable via her residence.

### Market figures (sourced — don't quote anything without a source)

| Figure | What it measures | Source |
|---|---|---|
| **59,271** | Erasmus+ HE students who came to **Spain** in 2024 — **the most of any country** (Italy 43,065 next) | [Erasmus+ Annual Report 2024, statistical annex p.29–30](http://sepie.es/doc/comunicacion/publicaciones/2025/statistical_erasmus_annual_report_2024en.pdf) |
| **403,878** | Erasmus+ HE student mobilities that started in 2024, all countries | [EU publications](https://op.europa.eu/en/publication-detail/-/publication/513afdc9-c05c-11f0-a612-01aa75ed71a1/language-en) |
| **36,826** | US students who studied abroad for credit in **Spain**, 2023/24 — 12.4%, **second** after Italy, an all-time high | [IIE Open Doors 2025](https://opendoorsdata.org/data/us-study-abroad/leading-destinations/) |
| **159,002** | International students physically at Spanish universities, 2023-24 (63,624 exchange + 95,378 full degree) | [SIIU / Ministerio de Ciencia](https://www.ciencia.gob.es/dam/jcr:4d72063c-c0b7-41a7-bbe5-998ba9e7fdc8/PrincipalesResultados_Internacionalizacion2024.pdf) |
| **669** | Exchange students at UPV/EHU's **Bizkaia campus**, first semester 2024-25 (1,054 university-wide) | [EHU Campusa, 10 Sep 2024](https://www.ehu.eus/es/web/campusa/-/upv/ehu-acoge-mas-de-2000-estudiantes-internacionales-nuevo-curso) |
| **600+** | International students welcomed by University of Deusto, autumn 2025 (Bilbao/San Sebastián split unverified) | [Deia, 4 Sep 2025](https://www.deia.eus/actualidad/sociedad/2025/09/04/universidad-deusto-da-bienvenida-600-estudiantes-10046168.html) |
| **54.67%** | Exchange students who took part in **no** local activity; 17.16% said they weren't integrated | [ESNsurvey XIV, ~11,100 responses, 2021 (COVID-era data)](https://www.eaie.org/resource/understanding-international-student-needs.html) |
| **~2 in 3** | International students in an Australian study who had experienced loneliness, especially early | [Sawir et al. 2008, n=200](https://journals.sagepub.com/doi/10.1177/1028315307299699) |
| **76% / 55%** | EU 15–24 year-olds using Instagram / TikTok (2023) | [EPRS briefing, Dec 2025](https://www.europarl.europa.eu/RegData/etudes/BRIE/2025/779235/EPRS_BRI(2025)779235_EN.pdf) |

**Cautions.** The loneliness studies are old and small — measure it ourselves in the pilot. Spain's own
count of US exchange students (8,698) is far below Open Doors' 36,826, probably because US-run
programmes aren't in Spanish university statistics; if so, providers are a channel separate from
universities. ESN Bilbao is the only ESN section listed for the Basque Country, based at UPV/EHU.

### Arrival waves (when to market)
- **Autumn:** late August → early September. UPV/EHU autumn classes started 8 Sep 2025.
- **Spring:** mid-to-late January. Spring classes started 26 Jan 2026.
(Faculty of Science and Technology calendar; other faculties vary by about a week.)

### Alternatives

| Alternative | Gets right | Gap |
|---|---|---|
| The WhatsApp cohort group | Everyone's in it, free | Hundreds of people, announcements only by week three |
| **[Unera](https://unera.app/erasmus-bilbao)** | Erasmus students and plans nearby — **already has a Bilbao page** | Discovery-shaped. **Closest direct competitor: someone should install it and write a teardown.** |
| ESN Bilbao events / ESN apps | Big, cheap, trusted, weekly | A party of 200 is good at meeting, bad at keeping. Partner before competitor. |
| Erasmus+ App, Erasmusu | Paperwork, housing, forums | Information, not people |
| Bumble For Friends | Friend matching, interest groups | Profiles and matching, not arrival-timed |
| Timeleft | Six strangers at dinner, weekly | Paid per dinner, **not in Bilbao** (Barcelona, Madrid, Málaga, Valencia) |
| Meetup, Couchsurfing Hangouts | A place and a time | Hobby-sorted, regulars and travellers, not newcomers |

---

## 6. Marketing

**Positioning:** For students in their first weeks in a new city, Corners is the one app for what's
happening nearby, where to go, who to go with and what your programme needs from you.

**Voice:** short sentences, full stops. Never "community", "vibes" or "connect with like-minded
people". Describe the thing: a place, a time, a price.

| Channel | Tactic | Team | First test |
|---|---|---|---|
| Institutions | A cohort code in the welcome email of one ESN section and one provider. One partner = a whole cohort. | Audience | Two partners pitched by 22 Oct |
| Instagram + TikTok | The "one image, several readings" format from pitch 4 — nobody bigger can copy it | Audience | Account live, 17 Sep |
| Arrival group chats | Show up honestly in "Erasmus Bilbao 2026" groups and r/Erasmus. Post something real, not an ad. | Audience | This week |
| Partner cafés | A card in the window for the week's meeting spot; costs the café nothing | Operations | First pilot week |
| Residences | Welcome card with a QR on the desk of each new room | Operations | January wave |
| Invites | Invite a coursemate, both move up the city's list | Product | With the MVP |

**Content rule (70 / 25 / 5):** 70% the product showing itself (places, posts, trips) · 25% the idea
(why newcomers see a city differently — shared by people who'll never use the app) · 5% the twelve of
us, never as a confession. Nothing gets made without knowing which of the three it is.

**Calendar**

| When | Do |
|---|---|
| Block 1, to 22 Sep | Vote the direction. One owner per feature. Account live. Waitlist on a real domain with a form that stores entries. |
| Block 2, 24 Sep – 22 Oct | Run it by hand: real recs, real trips, real posts, collected and posted manually in Bilbao. Campaign runs alongside. Pitch two partners. → **Mini-project one** |
| Block 3, 27 Oct – 10 Nov | Build only what the pilot proved: sign-in, the feed, recs, the programme page. Automate with Make/n8n, data in Supabase. → **Mini-project two** |
| Block 4, 17 Nov – 3 Dec | Business model and ROI. Sign one institution for the January wave. → **Final project** |
| Jan–Feb 2027 | The spring arrival wave: the first launch that isn't a pilot |

---

## 7. Numbers we watch

Same rule as pitch 6: one owner per box, read in the last five minutes of each session, and
**none of these ever touches anyone's grade.**

| | Leading (this week) | Lagging (later) |
|---|---|---|
| **Product** | Posts, recs and trips created this week | Week-4 retention: share of sign-ups still opening it |
| **Audience** | Sign-ups this week, by city and arrival month | Share of a partner's cohort that joined in its first two weeks |
| **Operations** | Hours to keep one city stocked with content; time to action a report | Hours per active student |

**Nobody owns these two:** motivation (how many different names shipped something this week) and
whether knowledge crossed between teams.

**North star candidate:** students who found something through Corners they'd otherwise have missed.
Needs a real definition before it can be measured.

---

## 8. Open decisions

To be voted under the decision system. Recommendations are mine, not decisions.

1. **Does the whole feature set ship, or one feature first?** Six features is a lot for one semester.
   *Recommendation: Nearby + Recs first; they're the ones that need no supplier and no partner.*
2. **Anonymous or not?** Anonymity drives honesty and is the main moderation risk.
   *Recommendation: anonymous in Nearby only, everything else first-name.*
3. **Who pays?** Students won't. Institutions already pay for orientation; guides pay commission.
   *Recommendation: model both in block 4, decide with numbers.*
4. **Students only, or anyone new in town?** A student email is the cheapest identity check there is.
   *Recommendation: students only until January.*
5. **Brand: is chocolate gone?** The website is now near-black, blue and glass. Pitch 5 approved
   chocolate + baby blue. *Recommendation: bring it as an amendment, keep the eye wreath either way.*
6. **Name, handle and domain.** "Corners" alone is almost certainly taken.
   *Recommendation: Operations brings three options with availability checked.*
7. **App, or hand-run for the pilot?** *Recommendation: hand-run until 22 October — it's zero build
   work and it's what mini-project one is graded on.*

---

## 9. What's out of date

- **[docs/launch-book.html](docs/launch-book.html)** — audience, market figures, channels, calendar,
  KPIs and risks are all still good, but it is written around the dropped "groups of eleven" concept
  and the chocolate brand. Needs a rewrite, or a front page saying which parts still stand.
- **[docs/audience-research-plan.html](docs/audience-research-plan.html)** — the research method is
  reusable, but it tests the old concept and says "the eleven of us" throughout. The team is twelve.
- Both artifacts above are published; republishing from this repo updates them at the same links.

---

## 9b. Look (as of 24 Sep)

Both the app and the onboarding are now **light and Apple-styled**: white, `#f5f5f7` for banded
sections, `#1d1d1f` text, `#0071e3` blue, SF Pro via the system stack with Inter as fallback. The dark
glass version is gone. In `app/app.css` the light values are set on the tokens in `:root`, with a
"light theme adjustments" block near the end for the places that hard-coded dark colours — that block
is the first place to look if something still renders dark.

**Artwork** is hand-drawn flat SVG in `app/app.js` (`SCENES`): the Guggenheim, Sopelana surf, hills,
a campus, old-town houses, a bridge, an arcaded square, a stadium, a skyline, pintxos. They're used
for city thumbnails, city-page headers, guide cards and the landing. They are **illustrations, not
photographs**, and the page says so. Published pages can't load external images, so real photos would
need embedding as data URIs or uploading as artifact assets — and would need licensing.

**Landing section** (`start` view, first tab): hero, four feature cards, and a "Bilbao first" strip
with the city's real numbers and its three universities.

## 9c. How to structure the repo (proposal, 24 Sep)

There are now three separate builds — the comparison prototype (`corners-connect`), the onboarding
survey, and the in-city app. They share a brand and a subject but not a line of code. Proposed layout
for one repo, `corners-connect`:

```
corners-connect/
├─ index.html              landing: the card grid, links to both tools
├─ find/                   "Find your corner": survey + comparison chart
├─ app/                    the in-city app (Bilbao)
├─ onboarding/             survey + dashboard
├─ shared/
│  ├─ theme.css            design tokens — the single source of truth
│  ├─ cities.js            one city dataset, used by all three
│  └─ photos/              real photos as .jpg files
├─ docs/                   PROJECT.md, launch book, research plan, sources.md
└─ README.md
```

**The three rules that matter**

1. **One dataset.** Today there are two: ten cities in Spain and Portugal (this app) and six across
   Europe (the comparison prototype: Lisbon, Barcelona, Bilbao, Bologna, Vienna, Copenhagen). Pick one
   list and one file, or the two tools will disagree in front of a user. **This needs a vote.**
2. **One theme file.** `shared/theme.css` holds the tokens: `--primary #1D4ED8`, `--secondary #0F172A`,
   `--muted #64748B`, `--line #E2E8F0`, `--surface #F1F5F9`, `--accent #EFF4FF`, Inter, 12px radius.
   Everything else imports it. No page defines its own palette.
3. **One provenance vocabulary**, taken from the comparison prototype, because it's the best idea in
   the project: every number carries a chip — **Sourced · Calculated · Our rating · Mock data · Not
   researched** — and tapping it opens where it came from, when, and what it misses. Never ship a
   number without one.

**Kept separate on purpose:** three pages rather than one file. Twelve people can work on three pages
at once; one 4,000-line `index.html` guarantees merge conflicts.

**Workflow:** protect `main`; one branch per change (`feat/housing-row`); pull request with one
reviewer; GitHub Pages serves `main`. Each surface has a named owner, and `shared/` needs a review
from the owner of each surface that uses it.

**One easy win:** on GitHub Pages, real image files work normally, so `photos.js` (1.1 MB of embedded
base64, needed only because published previews block external images) becomes `shared/photos/*.jpg`
with ordinary `<img src>`. Smaller, cacheable, easier to swap.

## 10. Repo

| Path | What |
|---|---|
| `PROJECT.md` | This file. The master reference. |
| `README.md` | How to run the site, what's example content, the design system. |
| `app/onboarding.*` | **The onboarding survey**: one page, light Apple-style, three selectable sections (Where you're going · About you · Your match). Writes the same `corners.demo.v2` state the app reads, so finishing it sets your city and profile. |
| `app/` | **The app demo**: `index.html`, `app.css`, `app.js`. Two modes — *Before you leave* (match, compare, city pages, prep checklist for 10 cities) and *When you're there* (the Bilbao app). State saved in the browser. |
| `website/index.html` | The landing page. |
| `website/styles.css` | All styling: tokens, the 13 section layouts, motion. |
| `website/main.js` | The wreath, scroll reveals, tilt, the feed, tabs, groups, the rail, the budget planner, the checklist, the form. |
| `docs/launch-book.html` | Strategy, "pitch eight". See §9. |
| `docs/audience-research-plan.html` | Research plan. See §9. |

**Run:** open `website/index.html`, or `npx serve website`.
**Deploy note:** the HTML omits the optional `<html>`/`<head>`/`<body>` tags so it can publish as a
preview. Add `<!doctype html>` as the first line before hosting it anywhere real.

**Everything on the site is example content** and labelled as such: posts, recs, groups, listings and
prices, trip estimates (`TRIPS` in `main.js`), programme dates, report figures. Real Bilbao places are
named (pintxo pote, Bilbao Kirolak, the Barik card, Artxanda, Gaztelugatxe) but details like prices
and opening days are **not verified**.

**Before launch:** connect the waitlist form to a backend · write the moderation plan · verify or
replace every example · decide the handle and domain · check GDPR for student emails and posts
(store the minimum, in the EU, nothing with a name in the repo).

---

## 11. Log

| Date | What happened |
|---|---|
| 8 Sep 2026 | Session 02: seven pitches delivered. |
| 15 Sep 2026 | Website v1 (chocolate + baby blue, wreath) and the launch book written. Market research sourced. |
| 15 Sep 2026 | Redesigned dark glass: near-black, blue gradients, Geist + Instrument Serif. |
| 24 Sep 2026 | **Onboarding + dashboard** built as one light page: four selectable sections, a checklist tailored to your answers, `#demo` preview link. Artifact links change if the signed-in account changes — republish and update the links here when that happens. |
| 22 Sep 2026 | **App restructured into two modes**: choosing a city (10 cities, matcher, comparison, prep checklist, sourced data) and living in it (Bilbao). |
| 22 Sep 2026 | **App UI built** (`app/`): eight screens, bottom sheets, local state. Linked from the landing page. |
| 22 Sep 2026 | Team count corrected to twelve. **Concept changed:** groups of eleven dropped; the site is now the six-feature product. Every section given its own layout and motion. |
