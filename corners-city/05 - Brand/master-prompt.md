# Master prompt — the Corners look (version 2.1)

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
Time of day: [morning / afternoon / evening / night]
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

### ComfyUI variant (tested once, partly worked)
Z-Image-Turbo ignores "do not include", so the last line is a positive statement. Replace the last
line of the template with:

```
Only people and architecture are visible. Everyone wears plain clothes and plain shoes with no marks. Walls, doors and objects are plain and unwritten.
```

Tested once on 19 Oct 2026 (see the test log): no readable text, but the wrong number of people and a
wrong bridge. Use ChatGPT when the count of people or a real landmark matters.

Ideas to try next on ComfyUI, **untested** (one change at a time): start the prompt with the count
("Exactly two people.") and keep the whole prompt shorter, because this model reads a short, plain
description better than a long list of rules; and describe the bridge by its shape ("one single
white arch with thin vertical cables") instead of its name.

## Steps 2 to 5: only when you create or change the look
These steps are for building or changing the look of the brand (new template, new references). To make
**one everyday image**, do not follow them: use the playbook `04 - Playbooks/brand-imagery.md`.

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
- **Formats and upscale (Owner: Jenna; signed 25 Oct 2026):**
  - Instagram feed: 1080 × 1350 pixels (4:5 ratio).
  - Instagram Stories and Reels: 1080 × 1920 pixels (9:16 ratio).
  - TikTok: 1080 × 1920 pixels (9:16 ratio).
  - Website: use a landscape 16:9 image where appropriate; final dimensions depend on the website layout.
  - Partner pack: use the dimensions requested by the partner.
  - Keep the original AI-generated image saved before resizing.
  - Crop images to fit each format without stretching or distorting people or landmarks.
  - Keep the main subjects visible and avoid cutting off faces.
  - If a larger image is needed, upscale while preserving the original appearance. Review the result for distortions.
  - Record the final image dimensions and intended channel before publishing.
  - **Source check, 24 Oct 2026 (Federico):** the sizes above (Instagram feed 1080 × 1350, 4:5; Stories,
    Reels and TikTok 1080 × 1920, 9:16) match several third-party size guides, for example
    socialbee.com/blog/instagram-image-sizes-and-aspect-ratio and
    contenta-converter.com/blog/social-media-image-sizes-2026.php. No official Instagram or TikTok page
    was read, and one guide notes TikTok photo posts may also use other ratios: check the platform's own
    help page on the day you publish.
  - **Upscale (not tested by the team):** ChatGPT gives about 1536 × 1024, so a 1080 × 1350 portrait
    crop (4:5) from a 3:2 image keeps a height of 1024 px, below 1350: it needs a 1.3x upscale. Options to
    try, one at a time: an upscale step in ComfyUI, or a free open-source upscaling app. Record the tool,
    the original and the result in the log before using the image.
- **Tool and model licence**: name both in the playbook before the first approved image.

## Rights and disclosure
**Status: DRAFT written 24 Oct 2026 by Federico (with Claude). Not legal advice. Jenna to check and sign.**

**The line on every image** (caption, post text or file record):
`AI-generated with [tool and plan], [date]. Prompt: [version of the master prompt and the scene].`
Example: `AI-generated with ChatGPT (Go), 19 Oct 2026. Prompt: master prompt v2.1, bench by the river in Bilbao.`
The line stays with the file in `03 - Deliverables/mp1/images/README.md`, and appears on the image
when it is published.

**Rules for every image**
- Nobody recognisable, and no real person's likeness. People are shown as adults (about 20 years old).
- No third-party logos or brand marks, and no readable text, on clothes, shoes, objects or signs.
- No invented prices, sign boards or claims in the image. A price or fact goes in a caption, from a
  sourced figure with a date.
- A real place is named only if the image really looks like it. Check landmarks: tools invent them.
- An image is published only after a second person has checked it (see the playbook).

**Commercial-use terms: checked against official sources, 25 Oct 2026 (Jenna, assisted by ChatGPT)**

- **OpenAI ChatGPT images:** OpenAI's current individual Terms of Use (effective January 2026; EEA/Swiss version updated 16 Jan 2026) state that, as between the user and OpenAI and to the extent permitted by law, the user owns Output, and OpenAI assigns any rights it has in that Output to the user. There is no separate ban on commercial publication of ordinary generated images in the cited output-ownership clause. The user remains responsible for avoiding infringement and checking accuracy and appropriateness; outputs may be similar to those of other users. The terms also prohibit presenting AI output as human-generated. Ownership under the contract is **not** a guarantee that an image qualifies for copyright protection or is free of third-party rights. Sources: https://openai.com/policies/row-terms-of-use/ and https://openai.com/en-GB/policies/eu-terms-of-use/ (read 25 Oct 2026).
- **Comfy Cloud:** The official Comfy Terms of Service (effective 13 May 2026), section 2, *Customer Data*, says the customer retains all right, title and interest in their Input and the visual Output generated through processing it, as between Comfy and the customer. The terms permit use of Comfy Products for internal business purposes under the selected plan and require compliance with the service's terms, applicable law, and any third-party model/provider conditions. This supports customer ownership of output but does **not** itself guarantee clearance for every commercial advertising use. Source: https://comfy.org/terms-of-service (sections 2–3; read 25 Oct 2026).
- **Model licences:** The saved Z-Image-Turbo flow references an Apache-2.0 model package, as documented by Federico, but commercial publication must still check the licences and conditions of all used model components (including Qwen3-4B and the `ae` VAE) and any Partner Node provider. Do not mark a Comfy image commercially cleared solely from the Cloud ownership clause.
- **Publication rule:** Keep the tool/plan/date/prompt-version AI credit, check for recognisable people and third-party marks, verify factual claims and landmarks, and obtain independent second-person review. Any uncertainty about rights remains an open approval issue; do not publish until resolved.

---
*Drafted by Claude (AI) at Federico's request. Colour and style are proposals, not decisions made
by an agent. Signed by: Federico, 25 Oct 2026 · Reviewed by: Jenna, 25 Oct 2026 (terms research assisted by ChatGPT)*

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

## Test log (19 Oct 2026, Comfy Cloud, Z-Image-Turbo, ComfyUI variant)
Same bench scene as `ref-02`, with the positive last line ("Everyone wears plain clothes and plain
shoes with no marks…").
- **Worked:** no readable text anywhere (books and sandwich wrapper plain), realistic photograph,
  warm natural light, natural colours.
- **Did not work:** three people instead of two, although the prompt said "two" twice. The bridge was
  a generic cable-stayed bridge with a tall white pylon and a skyscraper behind, not the Zubizuri arch.
  People look younger than 20.
- **Conclusion:** the positive wording fixes the text problem. Z-Image-Turbo is less reliable than
  ChatGPT on the number of people and on real landmarks. ChatGPT stays the main tool.

## Test log (26 Oct 2026, ChatGPT free plan, Daniele, with Claude's help)
A teammate outside the pair followed the playbook on the free plan (about 2-3 images before the limit).
The first image had brand marks (North Face logos, Vans shoes, an embroidered word, a readable book
title, banners with writing) and extra landmarks (Guggenheim, Iberdrola Tower). The review list catches
all of these. He then rewrote the prompt in a more explicit form and the second image was clean. A
second person still has to review that image.

### Unbranded block (proposal, tested once, not yet in the template)
Replace the last line of the template and the Place line with these. Tested once on the free plan; run
it again on another scene before it becomes the template (v2.2).

```
Place: [describe the setting: city, area, what is around. If the image must read as a specific city, name one real landmark, described by its shape. Otherwise keep the background to ordinary buildings and nature. No other landmarks.]
...
Everything in the image is plain and unbranded: sweatshirts, jackets and t-shirts in solid colours with no embroidery or prints, plain trousers, plain sneakers in a single solid colour with no side stripes or emblems, plain bags and backpacks with no patches or labels. Lamp posts, railings, walls, benches and street furniture are bare, with nothing attached to them. Any book, cup, wrapper or object is blank. Nothing in the image has writing on it.
```

## Test log (26 Oct 2026, ChatGPT Go, unbranded block, Federico)
Same bench scene as `ref-02`, with the unbranded block. Result (`references/ref-04`): two people, a documentary
photograph, natural light. Checked at full size: no logos, no writing, plain white sneakers, a blank
wrapper and book, a plain black bag, bare lamp post and railings. **The block removed the marks.** But the
bridge described only by its shape came out as a generic arch, not the Zubizuri, so a local would notice.
Next test: name the landmark and add its shape ("the Zubizuri pedestrian bridge in Bilbao") and keep "no
other landmarks".

## Test log (26 Oct 2026, ChatGPT Go, unbranded block + landmark by name and shape, Federico)
Second run of the bench scene. The block again removed the marks: at full size the shoes are plain
(only tiny heel tabs, nothing readable), the wrapper is plain white tissue, no writing on the lamp post
or railings. **But describing the bridge by name and shape gave a generic arch bridge with vertical
hangers again, not the Zubizuri.** Runs that gave only the name ("Zubizuri bridge") came closer
(`ref-02`, `chatgptPIC.png`). **Rule for the Place line: name the landmark, do not describe its
shape,** and add "No other landmarks". Untested combination: unbranded block + name only.
