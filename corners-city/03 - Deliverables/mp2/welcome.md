# Mini Project 2 · Pair 1 · Welcome micro-app (C-14, C-15)

**Federico + Austin · presentation Tuesday 17 November 2026 · DRAFT v1 (13 Nov 2026)**
Corners City buildings: P07 App Factory, A17 Welcome Pavilion. Code: `automation/welcome/` (read its README first).

## Mission
Give a new arrival a reason to sign up: their answers become a source-backed "Your first week in Bilbao" checklist,
and one traceable student lead goes to Capture (Federica + Carter).

## How each course requirement is shown
| Requirement | Evidence | Status |
|---|---|---|
| C-14 Ship a micro-app | `node server.mjs`, open the tagged link, submit a fictional profile: checklist plus confirmation and next action | Demonstrated in dry run |
| C-15 Connect AI and data | Server-side model call (`adapters.mjs`, `createClaudeModel`) with only the approved facts (`city-content.json`); sources shown per item; labelled fallback (`--fail-model=error`) | Fallback and mock demonstrated; **live model needs a key** |
| Hand-off to Capture | Stable `lead_id`, retry with the same id, confirmation only on acknowledgement, replay gives one row | Demonstrated against the local stand-in; **pair 2's endpoint not wired yet** |

## Ownership: options for Federico and Austin to decide
The brief asks each of us to own and explain a named part. Two ways to split it:

| Option | Austin | Federico |
|---|---|---|
| A (follows the brief's reuse notes) | Checklist and model connection, city facts, capacity check (from his acquisition and capacity planner) | Source and campaign tags, `lead_id`, Capture hand-off and retry (from his X-matrix and launch kit) |
| B (follows the split already agreed on 13 Nov) | Prompt, city facts, review of the build, test failures | Running the app, agreeing fields with Capture, README links, PR to main |

Claude would pick **A**, because it maps each person to the prototype the brief says they carry forward, so each can
explain a decision and a test in their own words. Not decided until both sign.

## One failure we rehearse
Capture is down for three tries. The student still sees the checklist, sees no confirmation, and a replay recovers
with the same `lead_id` and one row. Commands in the README.

---
*Drafted by Claude (AI) at Austin's request. Federico and Austin sign: ______ (Federico) · ______ (Austin)*
