# Concept map: brand imagery (draft)

**Status: DRAFT for Federico and Jenna to correct and sign.** One page: the idea in the centre, the six
things it depends on, so a stranger can explain it from this page alone.

## The centre
**Every Corners image looks like it comes from one company, even when different people make it.**

## The six things around it
```
                  Voice
          (a place, a time, a price;
           never "community" or "vibes")
                     |
 Formats ---- Master prompt ---- ComfyUI flow
 (4:5, 9:16,   (the template,      (the saved recipe,
  site, pack)   rules, test log)    Z-Image-Turbo)
                     |
         References ---- Brand
        (fixed images     (mark, colour,
         the look must     rules; colour is
         resemble)         still to settle)
```

| Piece | What it is | Where it lives | Owner |
|---|---|---|---|
| Voice | How a Corners image speaks: ordinary moment, a real place, nobody posing | `05 - Brand/master-prompt.md` | Federico |
| Master prompt | The template with blanks and the rules for filling them | `05 - Brand/master-prompt.md` | Federico |
| ComfyUI flow | The saved recipe to rerun the template | `05 - Brand/comfyui/` | Federico |
| References | Images a new image has to resemble | `05 - Brand/references/` | Federico |
| Formats | Image sizes for Instagram, TikTok, website and partner packs, including cropping and upscaling guidelines | `05 - Brand/master-prompt.md` (Formats and upscale section) | Jenna |
| Brand | The rules page in the city (Brand House) | `board/brand-house.html` | Jenna |

## How it runs (links to the other pages)
- **Make:** `04 - Playbooks/brand-imagery.md`
- **Check:** the review list in the same playbook; the checker is not the maker.
- **Weekly use:** section "How it runs every week" in the same playbook (who, Tuesday and Thursday, where it shows).
- **Where the files are:** the file structure below, on `main` after the pull request.

## File structure
```
corners-city/
  03 - Deliverables/mp1/images/
      README.md                      log of every image: maker, reviewer, date, status
      comfy-test-01.png              test image made with the ComfyUI flow (not approved)
      chatgptPIC.png                 approved image made by Jenna
  04 - Playbooks/
      brand-imagery.md               how to make, review and keep images (the manual)
  05 - Brand/
      master-prompt.md               the template, its rules, the test log, rights and disclosure
      brand-imagery-concept-map.md   this page
      comfyui/corners.json           the saved ComfyUI flow
      comfyui/README.md              nodes, models, licence, known limits
      references/                    ref-01 (superseded), ref-02, ref-03 and their log
  board/
      brand-house.html               Brand House page (plot-13)
      asset-gallery.html             Asset Gallery page (plot-14), with asset-gallery.css
      city-assets/gallery-ref-0*.webp   images shown in the gallery
      city-data.js                   the two plots and their entries
```

## Handover
**Updated 25 Oct 2026. Pair to confirm.**
- **Federico built:** master prompt and its test log, the references, the ComfyUI flow and its README,
  the playbook (steps, review list, weekly routine, failures, alternatives), this map, the two plots,
  the Asset Gallery, the rights draft and the Midjourney/DALL·E basics.
- **Jenna built:** the review of `comfy-test-01.png`, the second-person reviews of `ref-02` and `ref-03`,
  the formats and upscale guidelines, the research on the OpenAI and Comfy terms of use, the Brand House
  page (and its link to the city), and a test image with ChatGPT Plus (`chatgptPIC.png`).
- **Done by 25 Oct:** three approved images in the log and the gallery (`ref-02`, `ref-03`,
  `chatgptPIC.png`); playbook and master prompt signed by both.
- **Still open on 25 Oct:** the test by a teammate outside the pair (free ChatGPT account); the
  signatures on this map; the merge of the pull request (#16) into `main`. After the merge, change the
  links in `brand-house.html` from the branch `mp1/brand-imagery` to `main`.
- **If one of the two is away:** the other can run everything with the playbook. The master prompt and
  the references are the only files that need a brand decision; leave them as they are until both agree.

## Test of this page
Give it to someone outside the pair: can they explain the piece from this page alone?

---
*Drafted by Claude (AI) at Federico's request. Signed by: ______ (Federico) · Jenna, 25 Oct 2026*
