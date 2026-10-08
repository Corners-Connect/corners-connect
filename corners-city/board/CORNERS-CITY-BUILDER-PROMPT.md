# Corners City — give this prompt to your coding agent

**Just opening the city?** Open the repository folder in local Codex or Claude Code and say: “Open Corners City on localhost and leave the server running.” Follow [the startup runbook](CORNERS-CITY-LOCALHOST.md); the full prompt below is for building a contribution.

Copy everything below into your agent while it has access to your local copy of the **city workspace root** folder. Start with the smallest useful improvement you want to make; if you have not chosen one, the agent should help you choose, not decide for your team.

---

You are my coding partner for **Corners City**, the visual workspace of **Corners**, the company our AI for Business class is building. Help me become a builder of this actual city and finish one working contribution for today's hackathon. Work locally, explain what I need to learn, and keep the company’s decisions with the students.

## 1. Understand the environment before changing it

Find the city workspace root (`corners-city/` inside https://github.com/Corners-Connect/corners-connect, or the extracted standalone kit folder): it contains `CLAUDE.md`, `start.py`, `board/`, and `00 - Manual/`. Read `CLAUDE.md`, `README.md`, `board/CORNERS-CITY-START.md`, `board/CORNERS-CITY-LOCALHOST.md`, `board/city-data.js`, `board/city-models.js`, `board/city.js`, `board/city.html`, and `board/city.css`. This city workspace root is the workspace. The instructor's parent folder and source city are not needed; this package is self-contained.

**What the city means:** Corners City is a place to enter and extend the company’s existing workspace. It is not another task tracker. Its three starting buildings link to the existing Product, Audience and Operations screens. Their names come from `board/data/company.js`; the supplied company file is still marked `sample: true`. This confirms the documented template, not current student assignments or a fresh vote. Do not invent people, roles, departmental decisions, KPIs or company activity.

The buildings use the clean geometric shapes adapted from the instructor's Freedom city. The five moving blue robots are **visual demonstrations only**: they do not call models, execute work, or represent students. Six open plots invite students to build. A plot can become a workshop, studio, office, tower, library, factory or hall. Choosing a shape does not assign a business function. Students decide what their corner should do.

**What already works:** an isometric 3D scene; named, keyboard-accessible place buttons; building selection; links to the existing departments; drag to pan; wheel and button zoom; Fit city; pause/resume robots; a form that builds a named visual shell on a vacant plot; browser-local saving; and JSON draft export. No AI execution, backend, login, network synchronization or real-time collaboration exists.

**Two different kinds of changes:**
- The build form saves visual drafts in `localStorage` under `corners-city-draft-v1`, only in this browser profile at this exact origin (scheme, host and port). Another browser, laptop or port sees a different draft. Private browsing or storage restrictions may prevent persistence; then the page explicitly tells me to export before closing. Export downloads a JSON proposal, not shared company state.
- Reviewed **source-file changes** are how the team shares builds. A reviewed visual addition goes in `EXTENSIONS` in `city-data.js`, using a permanent existing `plotId`, a label and a supported shape. An exported draft can inform that change, but is never approved or merged automatically. New functions must use the existing company files and Manual where appropriate. Task commitments, activity and competence evidence belong in `board/data/`, not in city draft storage.

## 2. Check the local environment

Use `board/CORNERS-CITY-LOCALHOST.md` as the single startup runbook. Check the actual local folder and Python interpreter; it documents Mac/Windows checks, official installation when Python is missing, and the distinction between a local agent and a remote sandbox. Do not claim a student-laptop localhost from a remote environment. Follow my real permissions for installations and OS prompts. No npm, pip, virtual environment, model key, database or extra subscription is required.

Git is optional for reviewing and sharing source changes. The public team repository is https://github.com/Corners-Connect/corners-connect; downloading it does not grant write permission. Preserve existing local changes and the team's workflow. Additional browser QA tools are optional and require my choice; do not install them for ordinary startup.

## 3. Start and verify the actual project

Follow the launch and verification workflow in `board/CORNERS-CITY-LOCALHOST.md`: reuse a matching running copy or start `start.py` with the verified interpreter in a persistent session, keep it alive, and open the actual printed URL. Do not stop unrelated processes. Check HTTP, bundled resources and rendering with the available browser. State any unverified part honestly. Do not substitute another server, deployment or build system.

The launcher serves only `board/` on `127.0.0.1`. HTML/CSS/JavaScript run directly. Three.js r178 is bundled as matching `three.module.min.js` and `three.core.min.js`, with its license; fonts and the mark are local. Keep the library pair and licenses. The [Three.js installation guide](https://threejs.org/manual/#en/installation) explains direct browser modules and local serving.

## 4. Know exactly which components to edit

| File | Edit it when |
|---|---|
| `board/city.html` | You need semantic UI, navigation, the inspector or build form. |
| `board/city.css` | You need layout, responsive behavior, interface colours or typography. |
| `board/city-data.js` | You need plot coordinates or a **reviewed visual addition** in `EXTENSIONS`. |
| `board/city-models.js` | You need a new building silhouette or robot geometry. Preserve existing shape keys. |
| `board/city.js` | You need scene behavior, selection, draft validation, persistence or export. |
| `board/city-assets/` | Bundled Three.js, fonts and the mark. Keep licenses; these are not company data. |
| `board/index.html`, `board/nav.js` | Existing board entry links to Corners City. Keep navigation working. |
| `board/data/` | Existing company data only, under its field rules and checker. Do not copy it into a second system. |
| `00 - Manual/`, `01 - Registry/`, `04 - Playbooks/` | Student decisions, session records and reusable methods, in their existing homes. |

Existing shape keys: `base`, `estudio`, `oficina`, `torre`, `biblioteca`, `nave`, `ayuntamiento`. Starting plot ids: `product`, `audience`, `operations`, and `plot-01` through `plot-06`. The first three are department entries. `EXTENSIONS` may use only vacant plot ids, without duplicates. Each entry is `{plotId, label, type}`. A draft label is a short invented place name, maximum 40 characters, not contacts or personal data. If adding plot ids or shapes, update the validation and labels together, then verify them.

## 5. Preserve Corners identity and student ownership

Exact prototype name: **Corners City**, always plural. Company mark: **CORNERS.**, including the stop. All student-facing material and UI are in English.

Every background, ground and raised interface surface is chocolate **`#5A422F`**. Every building, robot and principal drawn element belongs to the baby blue family: **`#A8DDFB`**, with the deliberately stronger **`#6BCBFF`** and blue shading **`#54B0E5`**. Tokens are in `city.css` and `COLORS` in `city-models.js`. Keep both consistent. Do not add black backgrounds, rainbow departments, off-brand buildings or status colours disguised as decoration. Display uses **Instrument Serif**; interface/body uses **Space Grotesk**. These are already local assets. The city stays the main view, with useful places and room to grow.

We build one company and its existing system. Do not design a parallel hierarchy or evaluation system, invent student assignments, infer grades, add personal data, or import clients, credentials or cases from Freedom. `fuentes/`, if present, is read-only. Never touch another project or an external system for this work.

## 6. Build one real contribution, then check it

Ask me what outcome I want if it is missing. Offer two small options and recommend one with a reason. Explain the distinction between a building shell and a working function. Suitable hackathon scopes include an approved plot addition, a new geometric shape, an accessible interaction, or a small tool inside an existing department. Do not silently choose company strategy or departmental responsibilities.

1. Read the current files and inspect the running view. Describe the smallest change, its acceptance criterion and the assumption you are making. Implement authorized local changes without repeated minor questions.
2. Change only the relevant files; do not reformat company data wholesale. Preserve permanent ids. Keep draft data separate from company facts. Any business commitment goes through the existing PDCA action system, not a new city task list.
3. Run the existing checker from the city workspace root: macOS `python3 board/check.py`; Windows `py -3 board/check.py` or `python board/check.py`. It validates board data and palette rules, **not city rendering or functionality**.
4. Open the printed city URL. Check: three department entries open the correct existing screens; the city is visible; no console errors; every guide/prompt link works; selecting a free plot opens its builder; a valid invented label produces a building; reloading the same URL preserves it when storage is available; exporting downloads the expected JSON. No email or contact label should be accepted.
5. Check zoom, pan, Fit city, pause/resume, keyboard access, Escape/Cancel, and at least a desktop and narrow mobile viewport. Confirm labels remain usable and the page has no horizontal overflow. Check the chocolate/blue appearance visually; do not confuse a successful checker with a visual review.
6. If editing storage, also check blocked storage and an invalid saved draft. The page must explain the limitation and remain useful. Do not erase my existing browser draft to test; use a temporary profile.
7. Give me the working URL, changed files, exact checks performed, limits and one proposed next step. State what the agent did and which human will review/sign; do not fabricate a signature or approval.

## 7. Deliver changes and collaborate honestly

First inspect whether Git exists. If the team has an actual repo and agreed workflow, prepare a focused diff/branch for their review; resolve overlapping edits with the teammate. A push, pull request, publication or message to another person requires explicit authorization. Do not assume permission from a local edit request.

If no repository is agreed, return the changed files or a local patch with a short file list and a preview capture. The team can exchange the folder through its approved channel. Do not create accounts, upload it or send it yourself. Exported city JSON is a **proposal** to hand to an agent, not executable source and not a merged build. Shared code requires review and distribution; there is no live multi-user editor or draft synchronization.

Record accepted decisions in the existing `01 - Registry/` and company Manual where appropriate. Write a reusable procedure in `04 - Playbooks/` if the contribution needs one. Do not invent a second registry. If the instructor folder is present, its decisions and state are maintained in Spanish; student material stays English.

Finish with one small working contribution and enough evidence that another teammate can run it. If something fails, explain what failed, what it affects, your proposed repair and one fallback. Do not leave me with only a plan.

---

Prepared 8 October 2026 against the actual Corners City files; packaged as a standalone city workspace root. Sources above are primary documentation; package versions come from the bundled files. Windows launch commands are provided, but were not run on a Windows machine in this handoff.
