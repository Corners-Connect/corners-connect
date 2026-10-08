# Corners City — today's builder guide

Corners City is the shared **source-code canvas** for the company you are building. Its purpose is to make the workspace tangible: enter through a place, see room for the next idea, and build one useful function together. Students decide what the company does. This base provides shapes and interactions, not a new organization.

## Read the city

**Buildings are places to enter.** Product, Audience and Operations open their existing screens on the company board. Their labels come from `data/company.js`; that file is still a sample template. The prototype does not prove current team membership or ratify the organization. A studio, tower or office is a visual shape, not a prescribed workflow.

**Robots are demonstration characters.** Five blue robots move along a street. Pause them with “Pause robots.” They do not run AI, execute tasks, read messages, or represent people. Building a real agent would be a separate student-designed feature with its own data and access decisions.

**Open plots are room to build.** There are six. Select one, click “Build on this plot,” choose an invented place name and one of seven shapes, then build. This creates a visual shell. It does not create a company task or a finished tool. Start with one shell, then decide what useful function your team wants to implement there.

**The streets connect the base.** Drag the scene to move, use the wheel or zoom buttons, and click “Fit city” to return. Named place buttons also work with a keyboard. “Company board” takes you back to the existing workspace. The builder guide and prompt are available from the top bar.

## What is ready; what you can build

The ready base has an isometric 3D city, three department links, five animated robots, six vacant plots, a plot-building form, browser-local saving, and JSON export. It includes its drawing library, fonts and mark. It has no backend, AI execution, login, live company feeds, real-time collaboration or automatic publication.

For the hackathon, pick one outcome you can demonstrate: a new building shape; one reviewed place with a student-defined purpose; a better interaction; or one small functioning tool inside an existing department. Define what “works” means before coding. Reuse the board’s data for commitments and activity; the city is not a second task system.

## The two kinds of saving

**Browser draft:** the build form stores a visual proposal in this browser at this exact URL origin. Reloading the same host and port normally keeps it. Another browser, computer or port does not see it. Restricted or private storage may prevent saving; the page tells you when export is needed. “Export city draft” downloads your draft as JSON, without student details. It does not write shared source files.

**Team source change:** give the JSON to your agent, review the idea, and put accepted visual entries in `EXTENSIONS` in `city-data.js`. Exchange the changed source files through the team's agreed method. If you use Git, review the diff and follow your actual repository workflow. If no repository exists, return the changed files for review. Live co-editing and synchronization are not implemented.

## Start on your own laptop

Get the team repository from https://github.com/Corners-Connect/corners-connect using clone or Code → Download ZIP. Extract it and enter `corners-city/`. Alternatively, extract the standalone kit ZIP and enter `Corners-City-GitHub/`. Do not open just this page or a localhost URL. Check Python before installing anything. For a fresh installation, choose supported stable Python **3.11–3.14** from [python.org](https://www.python.org/downloads/); see the [supported versions](https://devguide.python.org/versions/). Use a current browser with WebGL 2 and JavaScript enabled.

Open a terminal at the city workspace root (the directory containing `start.py`):

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
If Windows has `python` rather than `py`, use `python --version` and `python start.py`. Double-clicking `start.command` on Mac or `start.bat` on Windows is also supported. Keep the terminal open. Ctrl+C stops it.

Open the URL printed by the launcher, usually `http://127.0.0.1:8097/city.html`. It will try another port if necessary. This URL belongs to **your own laptop**. It is not a classroom-wide server. Avoid `file://`; the drawing code uses browser modules.

There is no npm install or build. Python’s standard library serves the existing board. Three.js r178, Instrument Serif and Space Grotesk are bundled locally. No model key, database, hosting service or paid tool is required. Git and automated browser testing are optional. Source-sharing access and an available coding agent/editor must be confirmed by your team.

## Give your agent the right brief

Open **`CORNERS-CITY-BUILDER-PROMPT.md`** in this same folder. Give the entire prompt to your agent with the workspace folder and your desired outcome. It includes installation checks, Mac/Windows commands, exact editable components, the palette, validation and delivery rules.

Important files: `city.html` (interface), `city.css` (style), `city-data.js` (plots/reviewed extensions), `city-models.js` (shapes/robots), and `city.js` (interaction/drafts). Keep permanent ids and bundled library licenses. Keep chocolate `#5A422F` on every background, baby blue `#A8DDFB` with vivid `#6BCBFF` and shading `#54B0E5` on the city. The exact name is **Corners City**.

Check from the city workspace root: `python3 board/check.py` on Mac or `py -3 board/check.py` on Windows. Then open and test your feature: the checker covers the board’s data, not the 3D scene. Verify desktop/mobile, build/reload/export, and department links. Present one working change and its evidence. Students review and sign it; the agent drafts and checks.

Prepared by Codex from the actual prototype, 8 October 2026. Human review/sign-off: pending. No new student commitments or company decisions are recorded by this guide. Windows commands are documented but have not been exercised on Windows in this handoff.
