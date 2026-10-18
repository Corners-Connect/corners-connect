# Master prompt — the Corners look (version 1, ready for first tests)

**Status: DRAFT. Not a decision.** Federico and Jenna accept, change or reject everything here.
Until they sign it, this is not the brand.

**Owner:** Federico · **Reviewer (did not build it):** Jenna, or a classmate outside the pair
· **Last used:** 18 Oct 2026 (first test, 4 images)

## What this gives you
One block of text you fill in and paste into an image tool, so that different people get images
that look like they come from the same company.

## Step 1 — Fill in the five blanks

```
Create an image for Corners, a student app for people who just arrived in a new city.

Scene: [what is happening, in one sentence]
Place: Bilbao, [which street or area]
Time of day: [morning / afternoon / evening]
People: [how many, doing what]. Nobody recognisable, no brand logos.
Who it is for: [Chiara, Erasmus / Aiyana, US study abroad / Marta, first-year]
Style: realistic documentary photograph, not an illustration or painting.
Mood: warm natural light, an ordinary moment, nobody posing for the camera.
Colour: natural colours with one strong blue accent (#1D4ED8).
Do not include: any text, menu boards, price signs, stock-photo smiles, logos.
```

Example, only to show the format:

```
Scene: two students looking at a map on a phone outside a bakery
Place: Bilbao, a narrow street in the old town
Time of day: morning
People: two students in their twenties, one holding a phone
```

### Rules for the blanks (from `PROJECT.md` and `docs/kpi-tree.md`)
- **A place, a time, a price.** The scene must be something a student could do in Bilbao at a real
  time. If you cannot say where and when, it is a stock image: rewrite it.
- **Never** the words "community" or "vibes", in the prompt or in any caption.
- **70 / 25 / 5.** 70% the product showing itself, 25% the idea, 5% the twelve of us. Say which one
  the image is in the brief. The "twelve of us" images use real photos with consent, not AI.
- **Nobody here is local.** Show newcomers, not locals posing as students.

### One image, several readings
The same image has to work as an Instagram post, a TikTok cover and a website block. Keep the subject
in the middle third of the frame and leave empty space at the top and bottom, so it can be cropped to
4:5 and 9:16 without losing the point.

## Step 2 — Generate three test images
Use the same template three times. Change only the **Scene** line each time.

## Step 3 — Put them side by side and ask three questions
1. Is the light similar in all three (warm, natural)?
2. Is there one clear blue accent in each?
3. Do they feel like an ordinary moment, not an advert?

## Step 4 — Fix the template if the answer is no
Change **one line** of the template, generate again, and compare. Do not change several lines at once,
or you will not know which one helped.

## Step 5 — Keep the best image
Save it as the first reference image in `05 - Brand/references/`. Record the tool and the exact
prompt next to it. It must be marked as AI-made.

## Later (not for the first tests)
- **Caption on the image**: a short line giving a place, a time and a price, which must be true and
  have a source. Add it only after the look works.
- **Colour decision**: the class voted chocolate brown and baby blue (pitch 5). The website uses
  `#1D4ED8` (`website/styles.css`, `--primary`); the Corners City board uses chocolate `#5A422F` and
  baby blue `#A8DDFB` (`corners-city/board/theme.css`). This template uses the website blue, so the
  class has to amend the pitch-5 vote before it becomes the brand. Until then it is a test colour.
- **Formats and upscale**: sizes per channel (Instagram, TikTok, website, partner pack). Owner: Jenna.
- **Tool and model licence**: name both in the playbook before the first approved image.

## Rights and disclosure
Every image carries a line saying it is AI-generated, with tool and prompt cited. No recognisable
real person and no third-party logos.

---
*Drafted by Claude (AI) at Federico's request. Colour and style are proposals, not decisions made
by an agent. Signed by: ______ (Federico) · Reviewed by: ______*

## Test log (18 Oct 2026, ChatGPT Go, image generation)
Same template, only the Scene line changed. Findings:
- Without the **Style** line, one of three images came out as an illustration, not a photograph.
  Adding the Style line fixed it.
- A scene that mentions a price board makes the tool draw invented prices. Keep boards and prices out
  of the scene and out of the image; prices go in a caption, from a sourced fact.
- Kept as first reference: `references/ref-01-metro-zubizuri.png` (three students at the metro,
  Zubizuri bridge behind).
