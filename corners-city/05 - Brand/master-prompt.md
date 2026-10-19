# Master prompt — the Corners look (version 1, ready for first tests)

**Status: DRAFT. Not a decision.** Federico and Jenna accept, change or reject everything here.
Until they sign it, this is not the brand.

**Owner:** Federico · **Reviewer (did not build it):** Jenna, or a classmate outside the pair
· **Last used:** 18 Oct 2026 (ChatGPT Go and Comfy Cloud, 6 test images)

## What this gives you
One block of text you fill in and paste into an image tool, so that different people get images
that look like they come from the same company.

## Step 1 — Fill in the blanks

```
A realistic documentary photograph of everyday student life in a new city.

Scene: [what is happening, in one sentence]
Place: [describe the setting: city, area, what is around]
Time of day: [morning / afternoon / evening]
People: [how many] young people, about 20 years old, dressed for the situation, [doing what]. Nobody recognisable.
Mood: [light that fits the setting, e.g. warm natural light / street lights at night / club lighting], an ordinary moment, nobody posing for the camera.
Colour: natural colours, no dominant colour accent.
Only people and architecture are visible: plain walls and clothes, no screens, no signs, no writing, no logos, no brand marks on clothes or shoes.
```

The **persona** (Chiara, Aiyana or Marta) and the **channel** go in the brief, not in the prompt.

Example, only to show the format (tested 19 Oct 2026, ChatGPT, see the test log):

```
Scene: two students sitting on a bench by a river, one reading a paperback, one eating a sandwich
Place: Bilbao, a riverside promenade with the white Zubizuri pedestrian bridge visible in the distance
Time of day: afternoon
People: two university exchange students, about 20 years old, clean-shaven or light stubble, casual student clothes, one with a backpack. Nobody recognisable.
```

**Place is free text.** Describe the setting in your own words. The pilot is Bilbao, but the app
covers other cities (`PROJECT.md`), so nothing in the template is fixed to one city.
- A **generic** arrival scene only needs a concrete setting ("a riverside promenade with trees and a
  bridge in the distance").
- If the image **must read as one city** (for example a city page), name a real place: the Guggenheim,
  the Zubizuri bridge. With no named place, the tool makes a generic "Spanish city" (one test looked
  like San Sebastián).
- A person who knows the city checks the image before it is approved: tools invent landmarks that
  look real.

## Step 2 — Generate three test images
Use the same template three times. Change only the **Scene** line each time.

## Step 3 — Put them side by side and ask three questions
1. Is the light similar in all three (warm, natural)?
2. Are the colours natural, with nothing forced into one tone?
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
  baby blue `#A8DDFB` (`corners-city/board/theme.css`). The photos carry no colour accent, so
  nothing here depends on the vote. The class still has to settle the brand colour that goes on top
  of the image (logo, caption, frame).
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

## Test log (18 Oct 2026, Comfy Cloud, Z-Image-Turbo text-to-image)
First run used the v1 template, with "Corners", "Chiara, Erasmus" and a "do not include any text"
line. It drew a kiosk with a "Corners" screen and garbled names. Second run, after the changes in
"Mistakes the first tests showed", had no readable text and was a good photograph, but the three
people looked like teenagers, the place was not clearly Bilbao, and two blue backpacks looked staged.

## Test log (19 Oct 2026, ChatGPT Go, template v2.1)
- Cafe scene and park scene with "in their twenties": photographs, natural colours, no readable text,
  two people each. The people looked about 30. The park looked more like San Sebastián than Bilbao.
- Riverside scene with "about 20 years old" and the Zubizuri bridge named in the Place line: the
  people look about 20 and the bridge and river look like Bilbao. A sneaker shows a brand-like logo,
  hence the "no brand marks" line. Both people were men; the personas in the brief are Chiara, Aiyana
  and Marta, so the scene must say who is in it if the persona matters.
- Night club scene: photograph, warm amber light, no dominant colour, no readable text. A crowd was
  drawn around the three people because the Place line said "crowded".
- Lisbon, a young woman and a young man on a steep street with a yellow tram: Lisbon is recognisable,
  no number or writing on the tram. It looks more like a travel advert than a documentary photograph.
- Bench by the river, Bilbao, with "no brand marks on clothes or shoes": plain sneakers, no logo, the
  Zubizuri bridge recognisable. Saved as `references/ref-02`. The club scene is `ref-03`.
- Not yet tested: a second person following the playbook alone.
