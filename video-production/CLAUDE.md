# Working in video-production

Read README.md in this folder first. It defines the five stages and the folders.

- One video = one slug. Every stage file for a video uses the same slug, e.g. `2026-10-first-week-abroad.md`. Start each from the `TEMPLATE.md` in that stage's folder.
- Update the `status:` line when a video moves: `idea → scripted → recorded → edited → posted` (or `dropped`).
- After adding or moving a video file, run `py -3 video-production/status.py`. It refreshes the counts shown in the city's Video Production panel. Never edit `corners-city/board/video-status.js` by hand.
- The files named `*-example-*` are demonstrations with invented content. Leave them, they are not counted.
- Edit stage = the Remotion Studio in `../video-tool/` (`npm run dev`, then http://localhost:3000).
- Do not post, upload or send anything. Posting is always a human decision.
- No personal data. First names only. Everything in English.
