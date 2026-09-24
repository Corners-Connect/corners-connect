# Corners

The app for students abroad: Erasmus, study abroad and first-years who moved city. One place for what students nearby are saying, recs, groups, guided experiences, budget weekend trips and everything about your programme.

> **Start with [PROJECT.md](PROJECT.md)** — the full reference: where the idea came from, the product,
> the audience with sourced figures, marketing, the numbers we watch, and what's still to be voted.
> This README covers the whole repo; the section detail below is the website.

## What's here

| Path | What it is |
|---|---|
| `PROJECT.md` | The master reference for the whole company. |
| `app/` | The product: onboarding (`onboarding.html`) and the dashboard (`index.html`), plus `photos/`. No build step. |
| `website/` | The public landing page: `index.html`, `styles.css`, `main.js`. No build step. |
| `index.html` | **Find Your Corner** — the six-question survey and the side-by-side city comparison. Single file, Tailwind from a CDN. See [find-your-corner.md](find-your-corner.md). |
| `docs/launch-book.html` | Pitch eight: audience, sourced market figures, channels, calendar, KPIs, risks. **Written for the earlier "groups of eleven" concept and needs updating** for the feature-based product. |
| `docs/audience-research-plan.html` | Research plan (also references the earlier concept and a team of eleven). |

## Website sections

Each section has its own layout and interaction:

| Section | Layout | Interaction |
|---|---|---|
| Hero | Split, phone mockup over the eye wreath | Phone tilts, wreath eyes follow the cursor and blink |
| Why the first weeks | Open, falling curve | Curve draws in on scroll |
| Nearby (anonymous posts) | Copy + live feed | Vote up/down, new posts drop in every few seconds |
| Recs | Horizontal tabs + ranked list | Sliding tab indicator, rows stagger in |
| Groups | Centred cloud | Join / leave, groups float |
| Guides | Full-bleed carousel | Drag or arrow buttons, cards tilt |
| Weekends | Controls + trip list | Budget slider and length re-rank trips from Bilbao |
| Your programme | App-window dashboard | Checklist fills the progress ring |
| Safety | The only light band | Animated gradient |
| Universities | Blue grid band | Bars grow in |
| Join | Centred + city marquee | Rotating gradient border on the form |
| FAQ | Hairlines | Smooth open |
| Footer | Giant wordmark | Light follows the cursor |

All motion switches off under `prefers-reduced-motion`. Scroll reveals apply only to content below the fold at load, so the first screen is always visible.

## Run it

Open any of them in a browser — `website/index.html` for the landing page, `app/onboarding.html` for the
product, `index.html` for Find Your Corner. Or `npx serve .` and pick from there.

The notes below are about the website.

The HTML leaves out the optional `<html>`, `<head>` and `<body>` tags so it can be published as a preview. Add `<!doctype html>` as the first line before deploying to a real host.

## Before launch

- **Everything on the page is example content.** That includes posts, recs, groups, listings and their prices, trip estimates (`TRIPS` in `main.js`), programme dates and report figures, and it's labelled as such on the page.
- **The waitlist form sends nothing.** Connect a backend (Supabase, Formspree, or a Make/n8n webhook) in the "Join" block of `main.js`.
- **Anonymous posting needs a moderation plan** before it goes live (the Safety section promises verified accounts and human review within a day).

## Look

- Ground: near-black `#05060A`, with slow blue, indigo and cyan light behind frosted glass.
- Accent: baby blue `#8FD0FA`, in a gradient from ice `#D6EEFF` to indigo `#6A63FF`.
- Type: Geist for text, Geist Mono for labels, Instrument Serif italic for accent words.
- The eye wreath from pitch 5 is the mark, drawn in code (`drawWreath` in `main.js`).
- Below 40px the mark becomes one eye (the nav logo).
