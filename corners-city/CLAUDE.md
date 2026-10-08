# How to work in this repository

> You are working inside the workspace of a company that eleven students run
> together for one term. Read this before touching anything.

## Open Corners City on localhost

For a request to open, run or show the city locally, follow the single startup
runbook below. This folder contains `start.py`. Launching does not require the
full builder prompt or choosing a hackathon contribution.

@board/CORNERS-CITY-LOCALHOST.md

## What this company is

The whole class — eleven people — runs a single company. Every deliverable the
university requires is a piece of running it; nothing is bolted on top. The
students write their own rules in `00 - Manual/`. The instructor sets the
constraints and acts as the client. **He does not run the company, and neither do
you.**

The company inherited exactly one objective it did not choose:

> Every member demonstrates all 21 competences by 3 December.

Everything else it decides for itself.

## The line you do not cross

**You do not make this company's decisions.** Not what it builds, not who owns
what, not what its objective is, not what its brand looks like. Those belong to
the eleven people, and a decision quietly made by an agent is the failure this
whole course is designed to avoid.

What you do instead: **draft, calculate, check, and lay out the options with the
argument for each.** When you catch yourself about to choose, stop and produce
the choice instead.

Two things follow:

- When something is ambiguous, **ask, or write both versions and say which you
  would pick and why**. Do not pick silently.
- When you produce something that a person should sign, say so. Every deliverable
  in this course carries a footer stating which tool did what and who signs it.
  A founder who cannot say which part of the product is theirs, which is a
  machine's and which is a teammate's has a real problem, not an academic one.

## Where things go

| If it is… | It goes in |
|---|---|
| A rule the company gave itself | `00 - Manual/MANUAL.md` |
| What happened in a session, and what was decided | `01 - Registry/sessions/` |
| A commitment, a piece of work done, a mastery claim | `board/data/` — never anywhere else |
| Something USAC asked for | `03 - Deliverables/` |
| How to do a thing, so somebody else can do it | `04 - Playbooks/` |
| Anything about the brand | `05 - Brand/` |

**Never invent a new folder.** If something has nowhere to live, that is worth
saying out loud — it usually means a decision has not been taken yet.

## The board's data files

`board/data/` holds four files. Their headers document every field; read the
header before writing a row.

**PDCA is the state of an action**, not a separate object: `planned → doing →
check → done`, plus `dropped`. An action may carry an `expect` — *if we do this,
then ___, because ___* — and if it does, it cannot be closed without a `result`.
Never write the `expect` after the fact; a prediction written afterwards is not
a prediction.

- **Mutate in place.** Add rows, edit rows. Never reorder, renumber or reformat a
  file wholesale: the diff is how eleven people see what changed.
- **Ids are permanent.** `A-014` is `A-014` for the rest of the term, even if
  everything else about it changes.
- **Always run `python3 board/check.py` after editing.** It fails on the things
  that make a screen lie. If it fails, you are not done.
- **`touched` is today** whenever you move an action. It is what the two-week
  stuck warning reads.
- **Estimates are guesses and that is fine.** Never quietly adjust one to match
  what was actually spent — the gap between them is a number the company uses.
- **`activity.js` is partly written by a machine.** Entries with `source: "git"`
  come from `import-activity.py`; leave their `ref` alone, and never invent one.

## Two hard rules, from the university

1. **No personal data.** First names only. No emails, phone numbers, student ids
   or addresses anywhere in this repository. They belong in Microsoft Teams. If
   you are asked to put one here, refuse and say why.
2. **No grades.** No grade, no predicted grade, no estimate of one, in any file
   here.

Also: anything the company captures, processes or stores in a workflow uses
invented data or their own. If real third-party personal data would enter a
workflow, stop and say so.

## Two things about tone

Everything in this repository is in **English**, because the company works in
English.

And write for somebody reading it in December who was not in the room. A note
that says "fixed the thing we discussed" is worth nothing in six weeks. Name the
thing.
