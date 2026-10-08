# Corners City

A local isometric city for the company your AI for Business class is building.
Three buildings enter the existing Product, Audience and Operations screens;
five robots are visual demonstrations; six plots are room for your team's ideas.
The board's data is a **sample template**, not a record of current student work.

## Ask your local agent to open it

Open the repository root, `corners-city/`, or the extracted standalone kit folder
in local **Codex (desktop/CLI)** or **Claude Code**, start a new session, and say:

> Open Corners City on localhost and leave the server running.

The included `AGENTS.md` and `CLAUDE.md` route both agents to one
[startup runbook](board/CORNERS-CITY-LOCALHOST.md). You do not need to copy the
full builder prompt just to start. The agent must run on your laptop with local
file/terminal access; a remote sandbox's localhost belongs to that sandbox.

If you have not downloaded the source, give your local agent this brief:

> Get https://github.com/Corners-Connect/corners-connect into a new local folder without overwriting existing work. Read its agent instructions, open Corners City on localhost, and leave the server running. Check the requirements and working page, then give me the actual URL.

## Get the source

The team repository is [Corners-Connect/corners-connect](https://github.com/Corners-Connect/corners-connect).
The city workspace lives in **`corners-city/`** beside the existing app.

**Without Git:** on the repository page, choose **Code → Download ZIP**, extract
it, then open **`corners-connect-main/corners-city/`**. Git is not required.

**With Git:**
```sh
git clone https://github.com/Corners-Connect/corners-connect.git
cd corners-connect/corners-city
```

**With the instructor's standalone kit ZIP:** extract `Corners-City-GitHub.zip`
and open its `Corners-City-GitHub/` folder instead. Both routes give the same
city workspace: the folder containing **this README, `start.py` and `board/`**.
Run commands there, not in the outer repository or the ZIP archive.
[GitHub's source download instructions](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)
and [clone instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

## Run locally

The [startup runbook](board/CORNERS-CITY-LOCALHOST.md) is the canonical procedure.
Check Python before installing anything. For a new installation use a supported
stable Python 3 from [python.org](https://www.python.org/downloads/).
The prototype also runs on the instructor's older Python 3.9.6, but that is not
an installation recommendation. Use a current browser with WebGL 2.

In a terminal **inside the city workspace**:

macOS:
```sh
python3 --version
python3 start.py
```

Windows PowerShell:
```powershell
py -3 --version
py -3 start.py
```

If Windows has `python` rather than `py`, use `python --version` and
`python start.py`. Or double-click `start.command` / `start.bat`. If double-clicking
is blocked, use the terminal command above; no global security changes are needed.
Keep the terminal open; Ctrl+C stops the server.

Open the **printed** URL, normally `http://127.0.0.1:8097/city.html`.
The launcher tries another port when one is busy. To choose one:
`python3 start.py --port 8100` (Windows: `py -3 start.py --port 8100`).
No npm, pip, build step, API key, database, hosting service or paid agent is
required. Three.js r178, both brand fonts and the mark are local. The company
board also uses these local fonts; there are no runtime CDN requests.

## Build and check

- Read [the environment and quickstart](board/CORNERS-CITY-START.md).
- Give your coding agent [the complete builder prompt](board/CORNERS-CITY-BUILDER-PROMPT.md)
  and this workspace folder. No particular coding agent is required.
- Read [the agent rules](CLAUDE.md). Company decisions stay with students.
- Check changes from this workspace folder: `python3 board/check.py` on Mac;
  `py -3 board/check.py` or `python board/check.py` on Windows. Then test the
  actual feature in the browser; the checker does not test 3D rendering.

The build form saves **visual drafts only in this browser at this exact origin**.
Another browser, laptop or port does not see them. JSON export is a proposal,
not a shared file update. Reviewed additions live in `board/city-data.js`;
reviewed source-file changes are how the team shares builds. Robots do not run
AI. No login, backend, live synchronization or publication is implemented.

## What is included

The existing board and sample data; the city UI, geometry, plots and interactions;
local drawing/font assets and their third-party licenses; Mac/Windows/Python
launchers; the Manual, Registry, Deliverables, Mastery and Playbook templates;
and agent instructions. No teacher folder, clients, credentials, `.git` history,
virtual environment, installed QA tools or automatic GitHub workflow is included.

The project-specific code has **no chosen project license in this package**.
No ownership or distribution permission is decided by this README. Existing
third-party licenses are preserved; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
The instructor and company decide repository access, visibility and their own
licensing arrangements. This package is source distribution, not site hosting.

Prepared by Codex · 8 October 2026. Human review/sign-off: pending.
Windows commands are provided but were not run on Windows. The extracted
package was checked on macOS/Chromium. The repository URL is confirmed; permission to submit changes is managed
by the team. Downloading the public source does not grant write access.

---

# The company workspace

Everything this company knows about itself is in this folder. If it is not here
in December, it did not happen — not because that is a rule somebody imposed,
but because in December nobody will remember it the same way.

**Start here: double-click `start.command`** (`start.bat` on Windows). It opens
**Corners City**, with a link back to the board.

---

## Corners City

The city is the visual entry to this workspace: three department buildings, demonstration robots, and six open plots for student builds. Read `board/CORNERS-CITY-START.md`; for feature work, give your coding agent `board/CORNERS-CITY-BUILDER-PROMPT.md`. To open it, ask your local agent to follow `board/CORNERS-CITY-LOCALHOST.md`. Browser drafts stay on one browser/origin. Reviewed file changes are how your team shares the city. No live synchronization is implemented.

## The board

Grouped in the rail on the left by when you use them. **None of them is a
dashboard you look at** — every one is a place you do something.

| | |
|---|---|
| **Today** · **The close** | The two you open every session. |
| **PDCA** · **Activity** · **Cash flow** | The loop your work walks, what each of you did, and whether the hours reach. |
| **Product** · **Audience** · **Operations** | One screen per department: its live slice of the board, and a list of what it could build. |
| **Teams** · **Mastery** · **Setup** | Who is in what, who can do what, and the numbers everything else divides by. |

**PDCA is the state of an action, not a second system.** `planned → doing →
check → done`, and `dropped` for the ones you stop. Most work never needs more
than that. But when somebody says *"I think if we did X then Y would happen"*,
write it down — and the board will not let you close that action until you have
written what actually happened. That comparison is the whole point.

**Optional Git activity import:** `python3 board/import-activity.py --dry-run`
previews entries from the repository's history. The manual importer requires
Git; ordinary city use and Download ZIP do not. No automatic GitHub workflow is
included or enabled. Hours and work outside the repository still come from people.

**The department screens are deliberately unbuilt.** You design your own system;
that is the course. Each one lists what a department like yours usually needs,
what it is and why it matters, and claiming one turns it into an action with a
name and a date on it.

**It refuses to hold things that would make it lie.** An action with no owner.
Work marked done with no evidence. An expectation closed with no result. An email
address. Every one of those is a specific way a board like this quietly turns
into decoration.

Nothing is typed twice: every number is calculated from the four files in
`board/data/`. If a number is wrong, the data is wrong.

---

## The rest of the folder

| Folder | What goes in it | Who answers for it |
|---|---|---|
| **00 - Manual** | The rules this company wrote for itself. Ratified in session 5, and changed on purpose after that, never by drift | Whoever answers for the Manual |
| **01 - Registry** | One record per session: what was committed, what arrived, what was decided and why. Plus handovers when somebody takes something over | Whoever keeps the record |
| **02 - Mastery matrix** | Nothing. It is the Teams screen — see the README in there for why | The liaison |
| **03 - Deliverables** | The four things USAC asks for, and the checklist for each | The team carrying that date |
| **04 - Playbooks** | One per live competence. The owner writes it, the apprentice produces the deliverable from it. This is the folder that decides whether all eleven of you get there or only the three who were already good at it | Each owner |
| **05 - Brand** | The brand book, the assets, and the rules for using them | Audience |

---

## Two rules about what lives here, and they are not style

**No personal data.** First names only. No emails, no phone numbers, no student
ids, no addresses — yours or anybody's. Those live in Teams, which is the
university's system. The board's checker refuses a file that contains one.

**No grades.** Not yours, not anybody's, not an estimate of one. The numbers here
are for running the company. The moment one of them touches a grade, people stop
measuring and start managing the number, and you lose the instrument at the exact
moment you need it.

---

## The river and the shelf

Everything a company produces falls into one of two places. The **river** is the
chat: fast, it is where the work actually happens, and in December you will not
find anything in it. The **shelf** is files with a name, a version and a history:
slower to write, and in December they are the company.

This folder is the shelf. Teams is the river. The commonest failure of a small
company is putting shelf things in the river — a decision taken in a thread, a
version agreed in a voice note — and then spending December reconstructing it.

The test is one question: **would somebody need this in December?** If yes, it
comes here.

---

## Feeding it without typing

These are files, so your agent can edit them. Open this folder with Claude Code
or any coding agent and say what happened:

> Add the commitments from today's close: Maya is writing the SEO brief for
> 22 October, about four hours; Tom is redoing the logo export, one hour, for
> Thursday.

> Read `board/data/` and tell me which of us is carrying the most hours this
> month, and which competences only one person can do.

That last one is the point. You built a small system, so you can ask it questions
instead of asking each other — which is, more or less, the course. `CLAUDE.md` in
this folder tells your agent how this company works, so you do not have to explain
it every time.

Detail, and the prompts that work: **`board/HOW-TO-FEED-IT.md`**.
