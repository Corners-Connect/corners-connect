# How to feed the board

The board calculates everything and invents nothing. Five small files hold what
this company knows about itself; every number on every screen is worked out from
them. **Feeding it is the whole job.** A board nobody feeds is not a board that is
slightly out of date — it is a board that lies with confidence.

---

## Opening it

**Double-click `start.command`** in the folder above this one (`start.bat` on
Windows). It serves the board on your own machine and opens it. Nothing leaves
your laptop, nothing is installed, and closing the window stops it.

You can also double-click `index.html` directly, but then the board is
**read-only**: a browser will not let a page opened that way read a folder. It is
fine for showing somebody. It is not fine for working.

### Three modes, and the board always tells you which one it is in

The state sits next to the tabs and never hides:

| It says | What that means |
|---|---|
| **saving straight to `data/`** | Chrome or Edge, and you granted access once. Save writes the real files; git sees the diff. This is the one to be in. |
| **changes download as files** | Any other browser. Save hands you the changed files and you drop them into `data/` yourself. Click **Connect data folder** if the button is there. |
| **read-only** | You opened it by double-clicking `index.html`. Use `start.command`. |

Nothing is ever lost to a refresh: every change is mirrored into your browser
immediately and offered back the next time you open it. **That mirror is private
to your laptop and it is a safety net, never the truth.** The truth is the files,
because the files are what the other ten people can see. Which is why the state
says *unsaved* in orange until you have saved — an hour you logged and never
saved is an hour nobody else knows about.

---

## The screens, and what you DO in each

Nothing here is a dashboard you look at. The rail on the left groups them by
when you use them.

**Every session**

| | |
|---|---|
| **Today** | What is asking for a decision, right now. Every warning carries the button that resolves it. |
| **The close** | The five minutes at the end. Every action that was due, with four choices, then one commitment per person. **The screen this company lives or dies on.** |

**The work**

| | |
|---|---|
| **PDCA** | Plan, do, check, act — drawn as the loop it is, with your real counts on it. Click a step to filter. Add an action from the bar. Change the step from the row. Anything sitting in **check** gets a card at the top asking what actually happened. |
| **Activity** | What each person did, day by day. Hours optional. It can fill itself in from git. |
| **Cash flow** | Runway to each date, what your estimates are worth, who is carrying how much. |

**Departments** — one screen each for **Product**, **Audience** and **Operations**:
their live slice of the board, and then a list of what a department like theirs
usually needs. **None of it is built, and that is the point** — the company
designs its own system. Claiming a card does not build anything; it opens a new
action with a name and a date against it.

**The company** — **Teams**, **Mastery** (click a square to claim a level) and
**Setup** (name, purpose, block objective, and everybody's weekly capacity).

Press **B** to pin the rail open. On a phone it becomes a bar along the bottom.

---

## PDCA is the state of an action, not a second system

That is the whole of it, and it is why there is no separate place to keep cycles:

| Step | State | What it means |
|---|---|---|
| **Plan** | `planned` | decided, with a name and a date on it |
| **Do** | `doing` | somebody is on it now |
| **Check** | `check` | finished — and now you look at it |
| **Act** | `done` | checked and kept |
| **Act** | `dropped` | checked and stopped. Also a decision, also useful |

Most work goes planned → doing → done and nobody writes anything extra. Fine.

But the moment somebody says *“I think if we did X then Y would happen”*, write
it in **what we expect** — *if we do this, then ___, **because** ___*. The board
refuses an expectation without the because, because without it you have written
a plan and not a prediction. And then it will not let you close that action until
you have written what actually happened. **That comparison is the only reason the
expectation was worth writing**, and skipping it is how a board like this turns
back into a to-do list with nicer vocabulary.

---

## Activity can fill itself in

The repository already knows who changed what and when. Typing that in a second
time is why nobody keeps a work log for more than three weeks. So:

```
python3 import-activity.py                  everything since the term began
python3 import-activity.py --dry-run        show what it would add, write nothing
```

It writes one entry per commit — who, when, what the message said — and never
adds the same commit twice. It matches the commit author against `git` in
`people.js`, then against `name`; anything it cannot match it **reports rather
than guesses**.

```json
{ "id": "p05", "name": "Maya", "git": "maya-r", ... }
```

> **A git handle, never an email.** `check.py` refuses any file with an email
> address in it, and that rule is the university's, not a preference.

This is an optional manual import for teams that use Git. No automatic GitHub
workflow is included or enabled in this distribution. Preview with `--dry-run`,
then run the checker after importing. Download ZIP users do not need Git.

Then the only things left to type are the hours, and the work that happened
outside the repository — the conversation, the shoot, the meeting. Which is the
right division: **the machine records what it can see, and you record what it
cannot.**

---

## The five files, and who owns each

Everything lives in `data/`. Each file has **one owner**, so that two people
never edit the same file in the same hour and lose each other's work.

| File | What it holds | Owner | Touched |
|---|---|---|---|
| `company.js` | Name, purpose, the block objective, the three teams, the dates | Operations | Four times a term |
| `people.js` | The eleven, their weekly capacity, their git handle, what each can do | Operations, with the liaison | Weekly, in the close |
| `actions.js` | Everything the company has said it would do, and where each sits in the loop | Whoever owns the action | Every session |
| `activity.js` | What each person did. Partly written by git | Everybody, their own lines | The day you work |

They look like this, and that is deliberate — plain text, one thing per line, so
that two versions can be compared and an argument about what changed can be
settled by looking instead of by remembering.

---

## The rhythm

| When | What goes in | Who |
|---|---|---|
| **In the five-minute close**, out loud, in the room | Next session's commitments → new rows in `actions.js` · anything finished → `state: "done"` with its evidence · anybody who moved a level → a claim in `people.js` | Whoever has the record |
| **The day you actually work** | What you did → one line in `activity.js`, hours optional | You, for your own work |
| **When somebody says "I think if we did X…"** | The *expect* line on the action, with the **because** written down | Whoever owns it |
| **When something is finished** | Move it to **check**, and write what actually happened | Whoever owns it |
| **At each of the four dates** | Teams rotate, the block objective changes | Operations |

**Write the close during the session, not afterwards.** A commitment recorded
from memory on Friday is a commitment nobody actually heard anybody make.

---

## Or feed it by talking to it

The forms are there so nobody has to learn a file format. But there is a reason
the data is files and not a database: **an agent can edit a file.**
Open this folder with Claude Code, Codex or any coding agent and say what
happened. Real prompts that work:

> In `data/actions.js`, add the commitments from today's close: Maya is writing
> the SEO brief for 22 October, about 4 hours; Tom is redoing the logo export,
> 1 hour, for Thursday. Keep the existing format exactly, use the next free ids,
> and set `opened` and `touched` to today.

> In `data/activity.js`, record that I redid the logo export yesterday, about an
> hour, against A-005.

> A-003 is finished — the carousel is published at <link>. Mark it done with
> that evidence, set `shipped: true`, and update `touched`.

> A-003 is in check. We expected about 55 Corner entries a week and got 31. Write
> that as the result, and give me the two honest readings of it — we will pick one
> in the session.

> Read `data/` and tell me which of us is carrying the most hours this month,
> and which competences only one person can do.

That last one is the point of the whole exercise. **You built a small system, so
now you can ask it questions instead of asking each other.** Which is, more or
less, the course.

---

## Before every session: check it

```
python3 check.py           # will anything on the board lie?
python3 check.py --stats   # the headline numbers, without opening a browser
```

It refuses the things that quietly turn a board into decoration: an action owned
by nobody, work marked done with no evidence, hours logged against a person who
does not exist, an action closed with an expectation and no result behind it, a class on a
Wednesday. If it fails, the board is wrong until you fix the data.

And it checks itself: `python3 check.py --selftest` breaks every rule on purpose
and proves each one catches its own breakage. **A checker nobody has broken is a
checker nobody should trust.**

---

## Three things that never go in here

1. **No grades.** Not yours, not anybody's, not an estimate of one. The board is
   for running the company. The moment a number on it touches the grade, people
   stop measuring and start managing the number, and you lose the instrument.
2. **No personal data beyond a first name.** No emails, no phone numbers, no
   student ids, no addresses. Those live in Teams, which is the university's
   system and the only place for them. `check.py` will refuse the file if it
   finds one.
3. **No prose.** Discussion belongs in the session and in the record. This file
   set holds the small number of facts you want a machine to add up.

---

## When it starts lying to you

It will, eventually, and here is how it shows:

- **Everything is on time and nothing is overdue.** Either this company is
  extraordinary, or people are quietly moving `due` dates forward rather than
  saying out loud that something slipped.
- **Estimates match reality exactly.** Nobody estimates that well. Somebody is
  writing the estimate after doing the work.
- **The hours are evenly spread across eleven people.** Check the activity against
  what you saw. Even, honest effort looks lumpy.

None of these is a reason to stop using the board. They are the board doing its
job: it is easier to spot a company that is lying to itself in a table than in
a conversation.
