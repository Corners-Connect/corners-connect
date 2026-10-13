# Video Production

The studio for Corners videos. One video walks five stages, always in the same order:

| # | Stage | Folder | What goes in it |
|---|---|---|---|
| 1 | Ideas | `ideas/` | Hooks, topics and formats worth filming. Park every idea here first. |
| 2 | Script | `scripts/` | The idea turned into hook, body and call to action. |
| 3 | Recording | `recordings/` | Shot list, locations, gear and the day-of checklist. |
| 4 | Edit | `edits/` | Notes for the cut. The tool itself is `../video-tool/` (captioned vertical clips). |
| 5 | Post | `posts/` | Caption, hashtags, posting time, platforms. |

## One video = one slug, five files

Name every file with the same slug: `2026-10-first-week-abroad.md`. The slug is the video's identity from idea to post, so you can find every stage of it by searching one name. Start from the `TEMPLATE.md` in each folder.

## Status

Every file starts with a `status:` line: `idea → scripted → recorded → edited → posted` (or `dropped`). Move it when the video moves. This is the single place where "where are we on this video?" is answered.

## For the Audience team: how to add your work

You do not need to touch any code. Open the repository folder in Claude Code (or another agent) and say what you want. The agent reads `CLAUDE.md` here and follows the rules. For example:

> Add a video idea: "3 things nobody tells you about your first week abroad". Hook: "Day 3 in a new city and I still had no idea where to buy groceries." For first-year Erasmus students.

> Write the script for that idea, 30 seconds, using the script template.

> Move that video to "recorded" and fill the recording file with the shot list we agreed.

> Show me every video and the stage it is in.

Or do it by hand: copy the `TEMPLATE.md` of a stage, rename it with the video's slug, fill it in. Then run `py -3 video-production/status.py` so the city's Video Production panel shows the new count.

The files named `*-example-*` show what a finished video looks like across the five stages. Read them first, then delete them when you no longer need them.

## The editor

Edit uses the Remotion Studio in `../video-tool/`. Run `npm run dev` there and open http://localhost:3000. See `../video-tool/README.md` for transcription and captions.

## Rules for whoever works here (people and agents)

- Keep the stage names and folders as above; do not add new ones without saying so.
- Update `status:` whenever a video changes stage.
- Everything here is in English, like the rest of Corners.
- No personal data: first names only, no contacts of anyone filmed.
- Nothing gets posted without a human saying so.
