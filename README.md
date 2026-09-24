# corners.

Interactive prototype: pick the city for your semester abroad.

**Open `index.html` in any browser.** No build step, no install, no server.

## What it does

For students who have already decided to go abroad and are choosing *where*.

- **Which city fits you** — four questions, returns a shortlist of three
- **Compare** — up to three cities side by side, eight rows
- **Search** — by city or country; a miss offers "Request this city"
- **Sources** — every row has a tag you can tap to see where the value came from

Cities: Lisbon, Barcelona, Bilbao, Bologna, Vienna, Copenhagen.

## Read this before quoting any number

The comparison mixes two kinds of data, and the interface labels which is which.

| Tag | Meaning |
|---|---|
| `ESTIMATED` / `CALCULATED` | Real, sourced. Living costs, rent and transport from Numbeo (September 2026); daylight calculated from latitude |
| `MOCK DATA` | **Invented placeholders.** Finding a room, language, international students, getting home |

Four of the eight rows are mock. They stand in until the student survey runs. **Do not put
them in a presentation** — an empty cell is honest, a wrong number is a claim.

Two known limits on the real rows: rent is for a whole one-bedroom flat rather than a room in
a shared flat, so it overstates student costs; transport fares exclude student discounts,
which are large.

## Built with

One self-contained HTML file. Tailwind via CDN, Inter, no dependencies.
