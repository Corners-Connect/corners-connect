# corners.

Interactive prototype: find your corner, then compare the cities side by side.

**Open `index.html` in any browser.** No build step, no install, no server.

## What it does

For students who have already decided to go abroad and are choosing *where*.

- **Where you are from** — set once in the header. Drives the currency and your work rights
- **Find your corner** — the six-question survey: language, budget, city type, social vibe,
  climate, and your two non-negotiables
- **Skip it** — go straight to picking cities and comparing them
- **Compare** — up to three cities across nine metrics
- **Sources** — every row carries a tag you can tap for where the value came from

Cities: Lisbon, Barcelona, Bilbao, Bologna, Vienna, Copenhagen.
Currencies: EUR, USD, GBP, DKK, converted at ECB reference rates of 23 September 2026.

## Read this before quoting any number

| Tag | Rows | Source |
|---|---|---|
| `SOURCED` | Monthly budget, Safety rating, Climate and daylight | Numbeo (September 2026); daylight calculated from latitude |
| `MOCK DATA` | Housing, transit walkability, English, social, travel, part-time work | **Invented placeholders** |

**Five of the nine rows are mock.** They stand in until the student survey runs. Do not put
them in a presentation: an empty cell is honest, a wrong number is a claim.

Known limits on the sourced rows:

- **Monthly budget** assumes living alone. Most exchange students share, which cuts the rent
  component substantially, so read it as an upper bound.
- **Transit fares** exclude student discounts, which are large.
- **Safety rating** is Numbeo's perception index, built from what site visitors report, not
  from police statistics. City level only, never individual districts.
- **Part-time work** is orientation, not legal advice. It follows your passport, and your
  country of study is not the same as your nationality. Confirm with the international office.

## Built with

One self-contained HTML file. Tailwind via CDN, Inter, no dependencies.
