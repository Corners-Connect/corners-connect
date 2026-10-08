# Learning Lab — instructor contribution

Enter from the library on plot-08 in Corners City, or open `learning-lab.html`
while the city server is running. This is a preparation tool, not an assessment
or a record of student progress.

## Use it

**Prepare a delivery:** choose one of the four official deliveries. Read its
syllabus date and required contents, follow the proposed preparation steps, and
expand the evidence/review questions. Copy or download a brief for your agent.
The brief needs your context and decisions; it does not submit or approve work.
The expandable course-case menu covers the four short analyses in the term plan,
within the existing Case Studies category. It does not add official projects.

**Build from the syllabus:** search any of the 25 official topics, or filter by
block. Each topic connects knowledge → a proposed useful company piece → first
steps → evidence → the existing workspace location. Follow the existing board
links to the department, PDCA or Mastery. The proposed department route is a
navigation aid, not an assignment of responsibility.

**Course rules & sources:** the five assessment weights, seven official learning
outcomes, 21 existing competence references, published grade scale, policies and
source differences. Reading a template or opening a building proves no mastery.
Request client review before the real delivery date.

## Files and authority

- `learning-lab-data.json` is the single reviewed course/preparation mapping.
  Official topic titles retain the original USAC outline order, 1–25. Dates
  come from the published Fall 2026 Term Syllabus. Each record references source
  IDs; delivery contents distinguish **USAC** from **Course** requirements.
  Preparation/build/evidence suggestions are instructor proposals.
- `learning-lab.html`, `learning-lab.css`, `learning-lab.js` render the mapping.
  Topic IDs and delivery IDs support direct links. Filters and selection are
  temporary UI state; this tool writes no storage or company records.
- `COURSE-SYSTEM-PROMPT.md` is the unmodified published student System Prompt,
  included for local agents. It is a source document, not a new assessment system.
- Competence text and existing department labels are read from
  `data/company.js`. No people, grades, role assignments or metrics are added.
- Manual/Registry/Deliverables/Playbooks are included workspace folders. Open
  their named paths in your editor; the localhost server serves only `board/`.
  Original institutional documents and private instructor material are not
  copied into the kit. Sources not included are identified as course materials
  to consult in Teams.

## Source differences remain visible

The term outline still labels topic 21 “Event budget”; the current course plan
uses ROI of the company's work. The original reading list is labelled required,
while the published term syllabus treats it as background. The original Mini
Project 2 description names Make, while the published course also names n8n.
Make fits both; confirm n8n acceptance before choosing it for the submission.
The System Prompt/Manual say five obligations but name four. Do not invent a
fifth or silently amend published assessment rules. These points need instructor
clarification, not an agent's judgement.

3 December is the project deadline; 15 December is the final term presentation.
The course checklist's 20% per mini-project is a course allocation inside the
official combined 40% category. This guide calculates no marks.

## Extend it without creating a second system

Change the existing mapping for a better proposal, and reference its source.
Do not quietly change a requirement, date, weight or policy. Add human decisions
to the Registry/Manual, real commitments to `data/actions.js`, and proof to the
existing Mastery screen. No extra learning tracker is needed.

Keep all student-facing text in English and the Corners chocolate/baby-blue
identity. Run `python3 board/check.py` from the workspace root after board data
edits; separately check the Lab in a browser. Verify all 25 topics, all four
deliveries, source references, filters, copy/download and desktop/mobile.

The city source adds `tool: 'learning-lab'` to a reviewed `EXTENSIONS` entry;
`TOOLS` maps that ID to its local page. Browser drafts cannot set tool URLs.
A prior browser draft on the shared plot remains in storage and JSON export.

Prepared with Codex for Lucas's hackathon contribution, 8 October 2026.
Student company decisions and submission sign-off remain with their authors.
