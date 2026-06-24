# Format: Leaderboard

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 9-theme palette tokens,
> the system-font stack, the dense 13px body, rounded panels, the three semantic states
> (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.ref-chip`, mono chips, the key/value
> grid), and the self-contained output rules (§0). It is also a **data-driven interactive report** per
> [`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md): the body is rendered from a single `#report-data` JSON instance,
> carries the mandatory in-report theme switcher (9 dots, **Black** mandatory), every visual has a real
> control, and it is **PC-wide** (`viewport 1440`). **Default theme: Cyan.**

---

## One-line difference from the others
A **ranked leaderboard** — a standings table where the **rank itself is the message**: each competitor
is a ranked row (`#1`, `#2`, …) carrying a name, a **value bar** scaled to the leader, a **tier band**
(Gold / Contender / …), a **movement arrow** (▲▼ / — vs the previous period) and secondary stats, with
the **top three lifted onto a podium**. Re-rank by switching the **metric**. It is **not** a generic
sortable record grid (data-register — that is many records queried by a toolbar, with no podium, no tier
bands, and rank is just one of many columns); **not** an areas × criteria graded **scorecard** (that
rolls weighted areas into one overall grade — it does not order competitors by a single number); and
**not** an option × criteria **comparison grid**.

## When to use
A **competitive ranking** deliverable — when the reader's first question is *"who is on top, who moved,
and which band are they in?"*:

- team / squad / vendor / region performance standings for a period
- top-N rankings (highest revenue, fastest resolution, lowest defect rate, best NPS)
- benchmark league tables; SLA / KPI rankings; contributor or partner leagues
- any "race" where position, movement vs last period, and tier banding carry the meaning

Reach for a different format if the deliverable is *many rows queried and expanded* (data-register), a
*single overall grade rolled up from weighted areas* (scorecard), *a few options compared on criteria*
(comparison-grid), or *positioned on two axes* (matrix-canvas).

---

## Distinct chrome — a podium + a ranked-bar standings board
This format must read **unmistakably as a leaderboard**, like a league table or a game standings screen —
not a database table and not an article. Three structural commitments:

1. **A podium tops the board.** A `.podium` block lifts the **top three** entries onto silver / gold /
   bronze plinths — **#1 centre and tallest**, #2 left, #3 right — each plinth a `.plinth` card showing
   the rank medal, the crest/icon, the name, the headline value and the movement chip. This top-3
   emphasis is the signature; the podium re-animates whenever the metric or sort changes.
2. **Entries are ranked rows with a value bar — not table cells.** Below the podium, a stack of
   `.lb-row` rows (NOT a `<table>` grid). Each row reads left→right: **`.rank`** badge (`#4`…, tinted by
   tier), the **`.lb-name`** (with optional `.lb-detail` sub-line and crest), the **`.bar`** — a
   horizontal value bar (`.bar-fill` width = value ÷ leader value, tnum value label riding the end), a
   **`.tier-chip`** band label, the **`.move`** movement arrow + places delta, and a strip of secondary
   **`.stat`** chips. The bar-as-rank is what makes it a leaderboard, not a register.
3. **Controls are a standings bar, not an enterprise toolbar.** A slim sticky **`.lb-bar`** carries the
   **metric selector** (re-ranks + recolours), **tier filter chips**, a **search** box (highlights /
   focuses an entry), a **sort direction** affordance, and the standard **`.rc-theme`** swatch switcher.

There is **no** left facet rail, **no** result-count app bar, **no** row-expand drawer, **no**
`<table>` grid, **no** full-bleed `100vw` data-grid shell. Use a **centred** container
(`max-width:~1400px`, 40px gutter) — wide enough for the bars to breathe.

## Signature components (class names)
- **Podium** — `.podium` with three `.plinth` cards (`.plinth.p1/.p2/.p3`, #1 tallest & centre); each
  has a `.medal` (rank + tier tone), `.crest` icon, `.plinth-name`, `.plinth-val` (big tnum), and a
  `.move` chip. A `.podium-base` ground line ties them together.
- **Ranked row** — `.lb-row` (`.is-top3` on the first three, `.is-hit` when matched by search). Holds:
  - **`.rank`** — squared rank badge, recoloured by the row's tier tone (`--tone`).
  - **`.lb-name`** — name + optional `.lb-detail` sub-line + optional `.crest` mark.
  - **`.bar`** — track + `.bar-fill` (width from the value) + `.bar-val` (tnum label, unit suffix).
  - **`.tier-chip`** — the tier band pill (`.t-ok / .t-hold / .t-risk / .t-brand`).
  - **`.move`** — movement vs previous period: `.move-up` (▲, `ok`), `.move-down` (▼, `risk`),
    `.move-flat` (—), `.move-new` ("NEW") with the places-moved count from `prevRank`.
  - **`.stats`** — secondary `.stat` chips (mono `k`/`v`), shown inline and in the hover detail.
- **Tier legend / bands** — `.tier-legend` swatches; rows are grouped under thin `.tier-divider`
  rules when grouped-by-tier is on.
- **Metric selector** — `.metric-sel` (a `<select>` or segmented control) listing `metrics[]`; changing
  it re-ranks, rescales every bar, recolours, and reassigns tiers from the chosen metric.
- **Standings bar** — `.lb-bar`: metric selector · tier filter chips (`.filter-chip`) · search box ·
  sort-direction toggle · `.rc-theme` switcher.
- **Hover detail** — `.lb-pop` / row `:hover` panel surfacing the full stat line, prev value/rank and
  delta for the hovered entry.
- Reused foundation primitives: `.st-badge` (tones), `.ref-chip`, mono chips, the dark footer wordmark,
  the key/value grid inside the hover detail.

## Section / flow outline
1. **Masthead** (`.lb-masthead`) — eyebrow (`{{REPORT_TYPE}}`), title, standfirst, `{{ORG}} · {{PROJECT}}`
   wordmark + period / `{{DATE}}`. Compact, not a hero with rails.
2. **Standings bar** (sticky) — metric selector · tier chips · search · sort direction · theme switcher.
3. **Podium** — the top three on plinths, #1 centre.
4. **The board** — the ranked `.lb-row` stack (ranks #1…#N, or #4…#N below the podium), bars scaled to
   the leader, tier chips, movement arrows, secondary stats.
5. **Footer** — dark band, mono meta (period · prev period · count), brand wordmark + accent square.

## Interactions (mandatory, vanilla JS, driven from the data)
- **Switch metric → re-rank + recolour** — the metric selector reads `metrics[]`; choosing one resorts
  every entry by that metric (respecting `betterWhen` high/low), **rescales every bar** to the new
  leader, **reassigns tiers**, rebuilds the podium, and updates the value labels/units — all from the
  data, not faked.
- **Sort / re-rank** — toggle the sort direction (best-first ↔ worst-first); ranks renumber and the
  podium follows the top three.
- **Filter by tier** — tier filter chips show only entries in the selected band(s); the podium reflects
  the visible leaders; an empty state shows when nothing matches.
- **Search → highlight / focus an entry** — typing matches name/detail; matched rows get `.is-hit`
  emphasis and scroll into view; non-matches dim (bonus).
- **Hover row → detail** — hovering a row reveals its full secondary-stat line plus the previous
  value/rank and the computed delta.
- **Movement vs previous** — each row's ▲▼/— and places-moved are computed from `prev` / `prevRank` in
  the data; entries with no `prevRank` show **NEW**.
- **Theme switcher** — the standard `.rc-theme` dots recolour live; initial theme = `meta.theme`.

In **print**, expand to a complete static snapshot at the current (or default) metric — full podium and
full ranked list, all stats visible — and hide the standings bar / theme switcher / hover popovers.

## Data fields (see `schemas/leaderboard.schema.json`)
`meta` (shared chrome + `theme`, `period`, `prevPeriod`) ·
`metric` `{key,label,unit?,betterWhen:"high|low"}` (the default ranking number) ·
`metrics[]?` (switchable metrics; same shape; include `metric`) ·
`tiers[]` `{label,min,tone?}` (best→worst bands) ·
`entries[]` `{id,name,detail?,icon?,value,prev?,prevRank?,stats?{…secondary + other-metric values}}`.
Every non-default metric's value lives under `entries[].stats[key]`. The sample's `#report-data` is a
valid instance.

## Do / Don't
- **Do** make **rank + value-bar + tier + movement** the visual centre, and lift the **top three onto a
  podium** — that podium is what reads as a leaderboard at a glance.
- **Do** drive the re-rank from the JSON: switching the metric actually resorts, rescales the bars, and
  reassigns tiers from that metric (honouring `betterWhen`).
- **Do** show movement vs the previous period (▲▼/—, places moved) from `prev` / `prevRank`; mark
  entries with no history **NEW**.
- **Don't** render the board as a `<table>` data-grid with a facet rail, a result-count app bar and
  row-expand drawers — that is the **data-register**, and copying it collapses the two formats together.
- **Don't** roll the entries into a single weighted overall grade with per-area criteria — that is the
  **scorecard**. The leaderboard orders competitors by one number at a time.
- **Don't** lay entries out as compared columns — that is the **comparison-grid**.
- **Don't** go full-bleed `100vw`; centre at ~1400px. Don't invent a 4th semantic colour for tiers.
- **Don't** wrap it in the long-form frame (top bar + two sticky rails + stacked prose sections).

## Icons

Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically).
Typical categories for this format: **data** (bar-chart, trend-up, trend-down, metric-up, metric-down,
delta, target, gauge), **status** (flag, verified, stamp-approved, dot-ok/-risk/-hold), **people**
(users-team, user, owner, group), **nav** (sort-asc, sort-desc, search, filter, chevron-up/-down,
arrow-up/-down). Browse `../icons/index.html`; never use emoji or generic "AI" icons (see
[`../icons/SPEC.md`](../icons/SPEC.md)) — a trophy/medal is drawn as a domain mark, not an emoji.
