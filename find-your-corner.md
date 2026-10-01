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
| `SOURCED` | Monthly budget, Safety rating, Climate and daylight, Travel connectivity | Numbeo (September 2026); airport passenger statistics; 1991–2020 climate normals; daylight calculated from latitude |
| `MOCK DATA` | Housing, transit walkability, English, social, part-time work | **Invented placeholders** |

**Four of the nine rows are mock,** plus the walkability note on the transit row. They stand
in until the student survey runs. Do not put them in a presentation: an empty cell is honest,
a wrong number is a claim.

Known limits on the sourced rows:

- **Monthly budget** is broken out in the cell into living costs, room and total, and the
  source drawer carries a price list (restaurant meal, transport pass, utilities, internet,
  gym, cappuccino, beer) for the cities you are comparing. **Those prices deliberately do not
  add up to the budget.** Numbeo does not publish how its basket is weighted, so adding named
  items on top of the lump sum would repeat the double-count bug that made the budget 25
  percent too high. They are there to give the number a feel, not to reconstruct it.
- **Monthly budget** is Numbeo living costs excluding rent, plus a room in a shared flat. The
  room is derived from a three-bedroom flat outside the centre divided by three, because no
  source publishes room prices for all six cities on the same basis. Cross-checked against
  HousingAnywhere room prices for Spain, where it comes out 4 percent low for Bilbao and 14
  percent low for Barcelona, so it is conservative rather than inflated. It still runs above
  the 800 to 1,200 euro range student guides quote for Spain, because Numbeo prices a general
  adult basket including restaurants and leisure, not a frugal student.
- **Transit fares** exclude student discounts, which are large. The pass is shown as its own
  row and is **not** added to the monthly budget, because Numbeo already includes it in the
  living-costs basket.
- **Safety rating** is Numbeo's perception index, built from what site visitors report, not
  from police statistics. City level only, never individual districts.
- **Part-time work** is orientation, not legal advice. It follows your passport, and your
  country of study is not the same as your nationality. Confirm with the international office.
- **Travel connectivity** is annual airport passengers, a proxy for how many places you can
  reach directly. It does not include rail, which makes it unfair to Bologna (Italian
  high-speed network) and Copenhagen (Oresund link). Copenhagen and Bologna figures are 2024,
  the rest 2025, because their 2025 totals are not published yet.
- **Climate** shows the January daily high, because January is the coldest month of an autumn
  semester. Rainfall is an annual total and does not show how it falls: Bilbao gets more than
  twice Barcelona's rain across far more days. Celsius only.

## Built with

One self-contained HTML file. Tailwind via CDN, Inter, no dependencies.
