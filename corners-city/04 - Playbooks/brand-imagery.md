# C-06 · C-07 · Make an on-brand Corners image

**Status: DRAFT v1.** Run once by the author (18 Oct 2026). Read by an AI reader on 26 Oct 2026, which
found the unclear points fixed below; **not yet run by a human outside the pair**, so the steps are not
proven. Steps follow `05 - Brand/master-prompt.md`, which is itself a proposal.

**Owner:** Federico · **Apprentice:** (a classmate outside the pair, not chosen yet) · **Last used:** 18 Oct 2026

## What you get at the end
One image of Bilbao student life, checked by a second person, labelled as AI-made with its tool and
prompt written next to it, and recorded in `03 - Deliverables/mp1/images/`.

## Before you start
- **A tool.**
  - **Main tool: ChatGPT** (image generation). Everything was tested on the paid plan "Go". A free
    account allows only a few images a day (sources say 2–3 per 24 hours, not verified) and may use a
    different image model, so **the free plan is not proven yet**: the first free-account run by a
    human outside the pair is recorded in the table "Free-plan check" below (Jenna's run used the paid
    plan Plus, so it does not count). Free alternative, not tried: Microsoft Copilot /
    Designer. Template v2.1 was tested here on 19 Oct 2026
    (Bilbao, a night club, Lisbon, a young woman and a young man). It understands "no logos".
  - **Saved flow: ComfyUI on Comfy Cloud** (comfy.org/cloud, sign in with Google, free plan: 5 runs).
    Open `05 - Brand/comfyui/corners.json`. It uses Z-Image-Turbo, which **ignores "do not include"**,
    so use the positive wording in the "ComfyUI variant" of the master prompt. Tested once on
    19 Oct 2026: no readable text, but three people instead of two and a wrong bridge. Do not rely on it
    for counts or real landmarks.
- `05 - Brand/master-prompt.md` (the template and its rules) and `05 - Brand/references/`.
- The licence line for the tool you use. For Z-Image-Turbo: Apache 2.0, see `05 - Brand/comfyui/README.md`.
  Check ChatGPT's terms for commercial use before an image is approved. **Not checked yet.**

## The steps
1. Open `05 - Brand/master-prompt.md` and copy the template.
2. Write a two-line **brief** (a note for yourself, not for the tool): who the image is for and where it
   goes. Persona: Chiara (19, Erasmus), Aiyana (20, US study abroad) or Marta (18, first-year), from
   `PROJECT.md`. Channel: Instagram, TikTok, the website or a partner pack. Do **not** put the persona
   or the channel in the prompt: the tool writes them into the image as text.
3. Fill in the five blanks of the template: Scene, Place, Time of day, People and the light in Mood
   (replace the whole bracket, including the brackets). Check that Scene and People agree on the number
   of people, and that Scene and Place can happen in the same spot. Add the shape at the end of the
   prompt: "Portrait, 4:5" for Instagram, "Vertical, 9:16" for TikTok, "Wide, 3:2" for the website.
4. Paste the prompt into the tool. In ComfyUI, paste it into the `prompt` box and press Run once.
5. Look at the result against the references `ref-02` and `ref-03` (`ref-01` is superseded, do not use it). If something is wrong, change **one line** and run again.
   Runs are limited on the free plan.
6. Save the file in `03 - Deliverables/mp1/images/` and add a row to the README there.
7. Give it to a second person for the review below. Do not review your own image.
8. When approved, add the AI line with the tool and the prompt. The line for ChatGPT is in "Rights and
   disclosure" in `05 - Brand/master-prompt.md`; the line for Z-Image-Turbo is in `05 - Brand/comfyui/README.md`.
   Resizing for each channel is in the formats section of the master prompt (owner: Jenna).

## The prompt
The prompt is the template in `05 - Brand/master-prompt.md`. Copy it from there so there is one
version only. The ComfyUI flow already holds the prompt of the first test.

## How it runs every week
**Draft by Federico, 24 Oct 2026. Pair to confirm.**
- **Who makes the images:** whoever needs one, from any of the twelve, following this playbook. Nobody
  waits for the pair. Images are made when they are needed.
- **Who reviews:** any teammate who did not make the image, with the review list below. They write their
  name and the date in the log. The pair is not the only reviewer, so the process does not stop when
  the pair is busy.
- **What the pair does (Federico and Jenna, owners of the process), every Tuesday and Thursday, in the
  last five minutes of the class** (the slot where `docs/kpi-tree.md` says the numbers are read). The same
  three short jobs each time:
  1. **Nothing is waiting:** every image in the log has a reviewer. If one has none, find a teammate.
  2. **Spot check:** take two or three images at random and check them again with the review list and
     against the references. Did the review work? Does the look still match?
  3. **Keep it up to date:** if the spot check shows a problem, change the template, the references or the
     review list, and move approved images to the gallery.
- **Where it shows:** the log in `03 - Deliverables/mp1/images/README.md` (one row per image: maker,
  reviewer, date, status) and the Asset Gallery building in the city (approved images only, once built).
- **What we count:** images made by someone outside the pair, and minutes it took each of them. Counts,
  not percentages (under 30 people, as in `docs/kpi-tree.md`).

## Who needs it, and how we know it works
**Draft by Federico, 24 Oct 2026.**
- **Named users:** Chiara, the incoming Erasmus student described in `PROJECT.md`, who sees the images in
  posts, the website and partner packs and should always recognise Corners; and, as a daily task, any
  teammate outside the pair who needs an image for a post or an app section and makes it with this
  playbook.
- **What it saves:** a teammate can make and check an image without asking the pair. We note the minutes
  each image took, so after a few weeks we have a real figure, not a guess.
- **Proof by 27 Oct:** at least one teammate outside the pair has followed the playbook alone and the
  result is in the log with their notes.

## Review: the second person checks
- Is there readable text, a logo or a sign anywhere in the image? (It must not.)
- Does the number of people match the brief?
- Is the place believable as Bilbao?
- Does it look like a documentary photo, not an illustration or an advert?
- No recognisable real person?
- Any small printed mark, even unreadable, on packaging, wrappers, bags, shoes or clothes? (It must not.)
- Is the AI line there, with the tool and the prompt?

If any answer is wrong, it goes back. Record who checked and when in `03 - Deliverables/mp1/images/README.md`.

## How you know it worked
**Good:** a photograph, natural colours and warm light, an ordinary moment, nothing readable, and the
persons match the brief. **Bad:** a drawing or painting, writing anywhere in the image, a forced single
colour in the clothes, people looking younger or older than the brief.

## What goes wrong
These happened in the first tests.
1. **The tool writes your names into the image.** The prompt said "Corners", "Chiara, Erasmus" and "app";
   ComfyUI drew a kiosk with a "Corners" screen and garbled names. Keep names and personas out of the
   prompt.
2. **"Do not include" is ignored by Z-Image-Turbo** (cfg 1, empty negative input in the flow). Say what is
   visible instead: "only people and architecture, no signs, no writing".
3. **The prompt contradicted itself.** "Waiting for the metro" and "narrow old-town street", and "three
   students" next to "two students". The tool picks one and ignores the other. Read the prompt aloud
   before running.
4. **A scene with a price board makes the tool draw invented prices.** Keep boards out of the scene; put
   prices in a sourced caption later.
5. **A forced blue accent looked staged** (blue backpacks and jackets). The brand colour goes on top of
   the image, not on the people.
6. **Without "realistic documentary photograph", one image came out as an illustration.** The first line of the template says "realistic
   documentary photograph".
7. **ComfyUI with Z-Image-Turbo got the number of people and a real landmark wrong** (three people for
   "two", a generic bridge for the Zubizuri), even with the positive wording. Check count and place on
   every image, and prefer ChatGPT when they matter.
8. **A small logo-like mark on a sandwich wrapper in `ref-02` passed two human reviews** and was found by an
   AI reader on 26 Oct 2026. Look at packaging and objects at full size, not only at people and signs.
9. **Still open:** the people look 17–19 even when the prompt says "about 22 years old, adults".

## Images for the app sections and the website: Midjourney and DALL·E basics
The app sections (Nearby, Recs, Groups, Guides, Weekends, Programme, Before you leave) and the website
use the **same template**; only Scene, Place, Time and People change. Draft by Federico, 24 Oct 2026.
- **DALL·E** is the image model behind ChatGPT's image tool (and Microsoft Copilot / Designer). You
  paste the filled template as plain text. It understands "no logos". Ask for the size in words
  ("wide, 3:2" or "portrait, 4:5"); you cannot be sure of the exact pixels, so crop afterwards.
- **Midjourney** is a paid tool you use in its own website or Discord. You paste the same text, then
  add parameters at the end: `--ar 4:5` for the shape, `--no text, logos` for what to leave out.
  Check the current plan and its commercial terms before using it: not tried by the team.
- **One section, one image:** write the Scene in one sentence from what the section does (Nearby:
  two students asking a question on a street; Weekends: friends at a station with a small bag).
  Do not draw the app interface: screens produce invented text.
- Keep the check from the review list on every image, whichever tool made it.

## Alternatives considered, and why they lost
1. **Only ChatGPT, no ComfyUI flow.** Faster and understands "do not include". It lost as the *only*
   path because a chat cannot be saved and rerun as a flow, and the mission asks for a saved ComfyUI
   flow. It stays as the main tool for day-to-day images.
2. **Only ComfyUI.** A saved flow anyone can reopen. It lost as the main tool because on the free plan
   we have 5 runs and we used 4 to find a working prompt, and the model ignores negative wording.
3. **A blue accent on the people** (backpacks, jackets) to make images recognisable. It lost because
   it looked staged. The brand colour goes on top of the image (logo, caption, frame) instead.
4. **A fixed city in the template.** It lost because the app covers other cities; Place is free text,
   with a named real place when the image must read as one city.

## Free-plan check (to fill in)
| Who | Tool and plan | Images before the limit | Followed the template? Same look as the references? |
|---|---|---|---|
| Two AI readers (Claude and a logged-out ChatGPT), forwarded by a teammate, 26 Oct 2026 | Not a human test: no ChatGPT account | 0, no image generated | Could not generate. Claude read the playbook and master prompt and listed 9 unclear points, all fixed on 26 Oct. It also found the logo-like mark on the wrapper in `ref-02`. Does **not** count as the human test. |
| | | | |
| Jenna | ChatGPT Plus | 1 generated; limit not reached | Mostly followed the template. Realistic Bilbao scene with two students, natural lighting and recognizable Zubizuri bridge. Book has text-like marks. Reference comparison pending. Not a free-plan test. |

## Who has done this
| Person | When | What they made |
|---|---|---|
| Federico | 18 Oct 2026 | 3 ChatGPT test images, 1 Comfy Cloud test image (`comfy-test-01.png`) |

---
*Drafted by Claude (AI) at Federico's request; steps and failures come from Federico's own test runs.
Owner signs: Federico — 25 Oct 2026 (master prompt, references, ComfyUI flow, playbook, weekly routine, gallery, city plots) · Jenna — 25 Oct 2026 (test image, second-person image reviews, format guidance, Brand House, rights/disclosure research; not a Free-plan test)*
