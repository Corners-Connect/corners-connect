# Open Corners City on localhost

This is the canonical startup runbook for local Codex (desktop or CLI), Claude
Code and manual launch. Follow it when asked to open, run or show Corners City.
The student can open the repository folder in their agent and say:

> Open Corners City on localhost and leave the server running.

The agent must run **on the student's computer**, with access to local files
and a terminal. A remote sandbox's localhost belongs to that sandbox; it does
not open the city on the student's laptop. Use a local agent session for this
request and honor its actual file, terminal and browser permissions.

## Get the source if it is missing

The exact public repository is https://github.com/Corners-Connect/corners-connect.
If the student already has a matching copy, use it and preserve local changes.
Otherwise obtain it in a new, unused local directory: clone it if Git is already
available, or download and extract the public source ZIP without installing Git.
Do not overwrite an existing folder, reset a checkout, switch its branch or pull
over local work just to launch. Read the downloaded agent instructions before
running the launcher. Downloading this public code needs no GitHub login.

Brief to give an agent before the repository is on the laptop:

> Get https://github.com/Corners-Connect/corners-connect into a new local folder without overwriting existing work. Read its agent instructions, open Corners City on localhost, and leave the server running. Check the requirements and working page, then give me the actual URL.

## Locate the workspace and check Python

From the repository root, the launcher is `corners-city/start.py`. From inside
`corners-city/` or the extracted `Corners-City-GitHub/` kit, it is `start.py`.
Resolve paths from the current folder and quote paths containing spaces.
Confirm that `board/city.html`, `board/city.js`, `board/city-data.js`,
`board/city-models.js`, `board/city.css`, `board/index.html`, this runbook,
`board/CORNERS-CITY-START.md`, the builder prompt and `board/city-assets/` exist.

Check a real interpreter before installing anything:

- macOS/Linux: `python3 --version`, then `python3 -c "import http.server, pathlib; print('standard library ready')"`.
- Windows: `py -3 --version` and the same import check with `py -3 -c`.
  If `py` fails, try `python --version` and `python -c` with that check.
  Verify it is Python 3 and executes code; a Store shortcut is not an interpreter.

If none works, guide the student through a supported stable Python 3 from the
official [macOS](https://www.python.org/downloads/macos/) or
[Windows](https://www.python.org/downloads/windows/) installer. Prepare or open
the appropriate official page; installation and OS permission prompts follow
the student's actual authorization. Reopen the terminal and repeat the checks.
Report a missing interpreter honestly until those checks pass. Do not install
Python when a usable interpreter is already present.

Only Python's standard library is needed. There is no npm/pip install, build,
virtual environment, API key, database, hosting service or extra subscription
for this startup. Use the student's existing agent and browser.

## Reuse or start a persistent server

First probe the intended local city URL, starting with
`http://127.0.0.1:8097/city.html`, using a short HTTP timeout. Reuse a server only
when its served city files match this workspace and the checks below pass.
Compare the served `city.html`, `city.js`, `city-data.js`, `city-models.js`,
`city.css` and this runbook against their local bytes. A listening port or a
page with the right title alone does not identify the right copy. Do not restart
or stop an existing suitable server; browser drafts belong to its exact origin.

If no suitable server is running, use the working Python command in your agent's
**persistent/background terminal session**, and keep that session alive after
replying. For a tool without persistent sessions, start a detached process with
output redirected to a new temporary log outside the repository, retain its PID
and read that log. On Windows, launch it from the city workspace directory so
`start.py` has no spaced path in the argument list. Do not use a timeout that
kills the server, close its terminal, or stop it during final cleanup. If the
tool cannot keep a process alive, open a local terminal, run the command there
and leave it open; report that limitation instead of claiming background success.

| Current folder | macOS/Linux | Windows PowerShell |
|---|---|---|
| Repository root | `python3 "corners-city/start.py"` | `py -3 "corners-city/start.py"` |
| City workspace or standalone kit | `python3 start.py` | `py -3 start.py` |

Use `python` instead of `py -3` on Windows only if the interpreter check passed
for it. The launcher serves only `board/` on `127.0.0.1`, opens the browser and
prints the actual URL. It starts at 8097 and tries the next 19 ports when busy.
An unrelated server on 8097 is left running; use the new printed port. If all
20 ports are occupied, pass `--port` with another free local port. For controlled
browser checks, `--no-open` suppresses the automatic browser opening.

## Verify and return the actual URL

Read the URL from the running session/log; do not assume the port. Use the
verified Python interpreter's `urllib.request` or an existing HTTP tool with
short timeouts to confirm HTTP 200 for `/city.html`, `/city.css`, `/city.js`,
`/city-data.js`, `/city-models.js`, `/index.html`, `/city-guide.html`,
`/CORNERS-CITY-LOCALHOST.md`, `/CORNERS-CITY-START.md`, and the builder prompt.
Check the matching Three.js core/module files, mark, both fonts and their
licenses in `/city-assets/`. No runtime asset should require a CDN.

Open the **printed URL** in a local browser, using available browser tools or
the launcher's default browser opening. If browser inspection is available,
confirm a visible city, loaded assets, no module/console errors, department
navigation and return. WebGL 2 must work in that browser. HTTP 200 alone does
not prove 3D rendering: if you cannot inspect the browser, report HTTP/assets
as checked and visual rendering as unverified; ask the student to confirm the
city is visible. Do not install browser QA tools just to start this prototype.

Confirm the server still responds before replying. Return the actual clickable
city URL, what was checked, and the session/PID or open terminal keeping it alive.
Only stop a process you started if the student asks. Do not modify the city,
company data or other applications just to launch it. No push or deployment is
part of this runbook. The full builder prompt is for a later feature request.
