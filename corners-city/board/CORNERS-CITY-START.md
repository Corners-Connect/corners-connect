# Corners City — today's builder guide

Corners City is the shared **source-code canvas** for the company you are building. Its purpose is to make the workspace tangible: enter through a place, see room for the next idea, and build one useful function together. Students decide what the company does. This base provides shapes and interactions, not a new organization.

## Read the city

**Buildings are places to enter.** Product, Audience and Operations open their existing screens on the company board. Their labels come from `data/company.js`; that file is still a sample template. The prototype does not prove current team membership or ratify the organization. A studio, tower or office is a visual shape, not a prescribed workflow.

**Learning Lab is a working instructor contribution.** The library on `plot-08` opens `learning-lab.html`: four delivery guides, all 25 syllabus topics, proposed company builds and copy/download preparation briefs. Course rules distinguish USAC requirements, published course requirements and student decisions. It creates no tasks, progress or grades. Its mapping is `learning-lab-data.json`; read `LEARNING-LAB.md` before extending it.

**Robots are demonstration characters.** Five blue robots move along a street. Pause them with “Pause robots.” They do not run AI, execute tasks, read messages, or represent people. Building a real agent would be a separate student-designed feature with its own data and access decisions.

On mobile, use **Choose a place** to select any building or open plot. The compact list uses the same place details and actions as the map.

**Open plots are room to build.** The team added seven product-section buildings on plots 01–07; they open the published app in a new tab and show existing board actions without creating records. Learning Lab is on plot-08. Plot-09 remains open. Select one, click “Build on this plot,” choose an invented place name and one of seven shapes, then build. This creates a visual shell. It does not create a company task or a finished tool. Start with one shell, then decide what useful function your team wants to implement there.

**The streets connect the base.** Drag the scene to move, use the wheel or zoom buttons, and click “Fit city” to return. Named place buttons also work with a keyboard. “Company board” takes you back to the existing workspace. The builder guide and prompt are available from the top bar.

## What is ready; what you can build

The ready base has an isometric 3D city, three department links, five animated robots, one vacant plot, a plot-building form, browser-local saving, and JSON export. It includes its drawing library, fonts and mark. It has no backend, AI execution, login, live company feeds, real-time collaboration or automatic publication.

For the hackathon, pick one outcome you can demonstrate: a new building shape; one reviewed place with a student-defined purpose; a better interaction; or one small functioning tool inside an existing department. Define what “works” means before coding. Reuse the board’s data for commitments and activity; the city is not a second task system.

## The two kinds of saving

**Browser draft:** the build form stores a visual proposal in this browser at this exact URL origin. Reloading the same host and port normally keeps it. Another browser, computer or port does not see it. Restricted or private storage may prevent saving; the page tells you when export is needed. “Export city draft” downloads your draft as JSON, without student details. It does not write shared source files.

**Team source change:** give the JSON to your agent, review the idea, and put accepted visual entries in `EXTENSIONS` in `city-data.js`. Exchange the changed source files through the team's agreed method. If you use Git, review the diff and follow your actual repository workflow. If no repository exists, return the changed files for review. Live co-editing and synchronization are not implemented.

## Start on your own laptop

Open the repository root or the city workspace folder in local **Codex (desktop/CLI)** or **Claude Code**, start a new session, and ask:

> Open Corners City on localhost and leave the server running.

The agent instructions in both folders point to [the single startup runbook](CORNERS-CITY-LOCALHOST.md). It covers obtaining the source safely, checking Python, launching from either folder on Mac/Windows, reusing a suitable server or choosing another port, keeping it running, and checking the actual URL and assets. No builder prompt is needed just to open the city.

If you do not have the folder yet:

> Get https://github.com/Corners-Connect/corners-connect into a new local folder without overwriting existing work. Read its agent instructions, open Corners City on localhost, and leave the server running. Check the requirements and working page, then give me the actual URL.

The agent must work on your laptop with access to files and a terminal. A remote sandbox's localhost belongs to that sandbox. The city uses Python's standard library, bundled Three.js and local fonts; no npm/pip setup, API key or hosting service is needed. Manual launch follows the same runbook.

## Give your agent the right brief

For a feature you want to build, open **`CORNERS-CITY-BUILDER-PROMPT.md`** in this same folder. Give the entire prompt to your agent with the workspace folder and your desired outcome. It includes installation checks, Mac/Windows commands, exact editable components, the palette, validation and delivery rules.

Important files: `city.html` (interface), `city.css` (style), `city-data.js` (plots/reviewed extensions), `city-models.js` (shapes/robots), and `city.js` (interaction/drafts). Keep permanent ids and bundled library licenses. Keep chocolate `#5A422F` on every background, baby blue `#A8DDFB` with vivid `#6BCBFF` and shading `#54B0E5` on the city. The exact name is **Corners City**.

Check from the city workspace root: `python3 board/check.py` on Mac or `py -3 board/check.py` on Windows. Then open and test your feature: the checker covers the board’s data, not the 3D scene. Verify desktop/mobile, build/reload/export, and department links. Present one working change and its evidence. Students review and sign it; the agent drafts and checks.

Prepared by Codex from the actual prototype, 8 October 2026. Human review/sign-off: pending. No new student commitments or company decisions are recorded by this guide. Windows commands are documented but have not been exercised on Windows in this handoff.
