# C-06 · C-07 · Make an on-brand Corners image

**Status: DRAFT v1.** Run once by the author (18 Oct 2026). Not yet run by a second person, so the
steps below are not proven. Steps follow `05 - Brand/master-prompt.md`, which is itself a proposal.

**Owner:** Federico · **Apprentice:** (a classmate outside the pair, not chosen yet) · **Last used:** 18 Oct 2026

## What you get at the end
One image of Bilbao student life, checked by a second person, labelled as AI-made with its tool and
prompt written next to it, and recorded in `03 - Deliverables/mp1/images/`.

## Before you start
- **A tool.** Either of these worked on 18 Oct 2026:
  - **ChatGPT** (image generation, plan "Go"). Reads the whole template, including "do not include".
  - **ComfyUI on Comfy Cloud** (comfy.org/cloud, sign in with Google, free plan: 5 runs). Open
    `05 - Brand/comfyui/corners.json`. It uses Z-Image-Turbo, which **ignores "do not include"**.
- `05 - Brand/master-prompt.md` (the template and its rules) and `05 - Brand/references/`.
- The licence line for the tool you use. For Z-Image-Turbo: Apache 2.0, see `05 - Brand/comfyui/README.md`.
  Check ChatGPT's terms for commercial use before an image is approved. **Not checked yet.**

## The steps
1. Open `05 - Brand/master-prompt.md` and copy the template.
2. Decide the persona (Chiara, Aiyana or Marta) and the channel. Write them in the brief, **not** in the
   prompt: the tool writes them into the image as text.
3. Fill in Scene, Place, Time of day and People. Check that Scene and People agree on the number of
   people, and that Scene and Place can happen in the same spot.
4. Paste the prompt into the tool. In ComfyUI, paste it into the `prompt` box and press Run once.
5. Look at the result against the references. If something is wrong, change **one line** and run again.
   Runs are limited on the free plan.
6. Save the file in `03 - Deliverables/mp1/images/` and add a row to the README there.
7. Give it to a second person for the review below. Do not review your own image.
8. When approved, add the AI line with the tool and the prompt (credit line in `05 - Brand/comfyui/README.md`).
   Resizing for each channel is in the formats section of the master prompt (owner: Jenna).

## The prompt
The prompt is the template in `05 - Brand/master-prompt.md`. Copy it from there so there is one
version only. The ComfyUI flow already holds the prompt of the first test.

## Review: the second person checks
- Is there readable text, a logo or a sign anywhere in the image? (It must not.)
- Does the number of people match the brief?
- Is the place believable as Bilbao?
- Does it look like a documentary photo, not an illustration or an advert?
- No recognisable real person?
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
6. **Without a Style line, one image came out as an illustration.** The template says "realistic
   documentary photograph".
7. **Still open:** the people look 17–19 even when the prompt says "about 22 years old, adults".

## Who has done this
| Person | When | What they made |
|---|---|---|
| Federico | 18 Oct 2026 | 3 ChatGPT test images, 1 Comfy Cloud test image (`comfy-test-01.png`) |

---
*Drafted by Claude (AI) at Federico's request; steps and failures come from Federico's own test runs.
Owner signs: ______*
