# Format: Heatmap grid (graded N×M value matrix)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** and the data-driven contract from
> [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md) — the 9-theme palette tokens (Black mandatory), system-font type
> scale, rounded panels, whisper shadows, `st-ok / st-risk / st-hold` semantics, the shared chip / badge /
> key-value primitives, the house SVG icons, the embedded-JSON render model, the in-report `.rc-theme`
> switcher, and the self-contained output rules. It **reinvents only the chrome and layout**: this is a
> **heatmap matrix** — a dense grid of cells coloured by value, with axis labels, a colour-scale legend,
> and marginal totals.
>
> **Default theme: Teal** (`<html data-theme="teal">`; `:root` still ships Purple, the Teal block overrides).

## When to use
Reach for this when the deliverable is **"how does one value vary across two dimensions, read cell-by-cell?"**
— a graded field where the *colour pattern* is the insight. Typical artefacts:

- a **risk heatmap** — likelihood × impact / severity (the classic 5×5 or workstream × severity grid);
- a **correlation matrix** — metrics × metrics, factors × factors (often a square rows≡cols matrix);
- an **activity / calendar heatmap** — day × week, hour × day, channel × period intensity;
- any **N×M graded table** — utilisation, coverage %, defect density, conversion by segment × step.

Three **modes** ship in one grid: `risk` (typically banded into `ok/hold/risk` zones), `correlation`
(single-hue intensity), and `activity` (single-hue intensity). The mode picks the framing and legend
caption; bands make a mode semantic.

If the reader needs to position a handful of items on **two free axes** (a 2×2 plane with plotted dots),
use **matrix-canvas** — that is a *positioning plane*, not a graded grid. If they need a sortable,
searchable, row-expanding register of records, use **data-register**. If they need to compare a few
options column-by-column on listed criteria, use **comparison-grid**. The heatmap *colours a field*;
it does not plot points, list records, or argue a case.

## The DISTINCT chrome (this is what makes it a heatmap, not a 2×2 canvas or a table)
A flat **analysis board** whose hero is a coloured grid — never a thin top bar + both-side sticky rails +
stacked prose sections, and never a plotting plane with a centre cross-hair.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEAD  ·  {{PROJECT}} Heatmap · mode chips · scale legend (ramp / bands)        │ ← .hm-head
├──────────────────────────────────────────────────────────────────────────────┤
│  TOOLBAR · Threshold ▭▭▭━○  · Sort [rows ▾] · Values [Value|% of max] · Reset   │ ← .hm-toolbar
├──────────────────────────────────────────────────────────────────────────────┤
│              Impact severity  →                                       Total     │ ← .ax-x-title / .tot-cap
│   W   ┌────────┬────────┬────────┬────────┬────────┐  ┌──────┐                  │
│   o   │ Neglig │ Minor  │ Moder  │ Major  │ Severe │  │      │                  │ ← .col-head
│ ▲ r   ├────────┼────────┼────────┼────────┼────────┤  ├──────┤                  │
│ │ k   │  ░░ 2  │  ▒ 6   │  ▓ 12  │  █ 20  │  █ 25  │  │  65  │ ← Core           │ ← .cell (graded) · .row-tot
│ │ s   │  ░░ 3  │  ▒ 5   │  ▒ 10  │  ▓ 16  │  ▓ 15  │  │  49  │ ← Payments       │
│ │ t   │   …     …        …        …        …       │  │  …   │                  │
│ │ r   └────────┴────────┴────────┴────────┴────────┘  └──────┘                  │
│   m   ┌────────┬────────┬────────┬────────┬────────┐  ┌──────┐                  │
│       │   15   │   30   │   60   │   92   │  105   │  │ 302  │  ← column totals  │ ← .col-tot / grand
└──────────────────────────────────────────────────────────────────────────────┘
```

1. **`.hm-head`** — a flat board header: the eyebrow + title (`{{PROJECT}} · Heatmap Grid`), a one-line
   `.hm-standfirst` saying what the grid measures, a row of **`.mode-chip`s** (Risk / Correlation /
   Activity, the active one lit), an **as-of `{{DATE}}`** stamp, the `.rc-theme` dots, and the
   **`.scale-legend`** — a continuous colour **`.scale-ramp`** (palest tint → fullest colour with low/high
   end labels) and, when the scale is banded, **`.scale-bands`** swatches mapping each band to its
   `ok/hold/risk` tone.
2. **`.hm-toolbar`** — the data-driven control strip: a **threshold `input[type=range]`** that dims cells
   below the cutoff, a **Sort** select (rows/cols by total, asc/desc), a **Value ↔ % of max** segmented
   toggle, and a **Reset view** ghost-button. Controls re-render the grid from the data; they never fake it.
3. **`.hm-grid`** — the **hero**: a single CSS-grid matrix. Top edge = the **x-axis title** (`.ax-x-title`
   with a → arrow) over a row of **`.col-head`** column labels (`2px` ink bottom rule). Left edge = the
   rotated **y-axis title** (`.ax-y-title`) beside **`.row-head`** row labels (`2px` ink right rule). The
   body is a field of **`.cell`s**, each a rounded tile **coloured by its value** — single-hue accent ramp
   (tint `--navy-bg` → full `--navy`) for unbanded scales, or a wash of the band's `ok/hold/risk` tone when
   bands apply. Missing intersections render as a hatched **`.cell.is-empty`**. The right column and bottom
   row carry **marginal totals** (`.row-tot` / `.col-tot` + a grand-total corner), each with a faint accent
   under-bar so the margins read as a summary. This graded, axis-framed, totalled grid is the format's
   unmistakable silhouette.

## Signature components (class names to use)
- **`.heatmap`** — the root board wrapper (centred, `max-width:~1500px`, 40px gutter; the grid scrolls
  horizontally inside `.grid-scroll` when large).
- **`.hm-head`** › `.hm-title` (+ `.markmini` heatmap mark), `.hm-standfirst`, **`.mode-chip`** (`.is-active`),
  `.asof`, `.rc-theme`, **`.scale-legend`** › `.scale-ramp` (`.sr-bar` gradient + `.sr-end` labels) and
  `.scale-bands` › `.band-item` (`.band-sw.is-ok/.is-hold/.is-risk` + caption).
- **`.hm-toolbar`** › `.tool` groups: `input[type=range].thresh` + `.thresh-val`; `select.tool-sel` (sort);
  `.seg` segmented toggle (Value / % of max); `.ghost-btn#resetBtn`. Each `.tool-label` carries a house icon.
- **`.hm-frame`** › `.hm-frame-head` (icon + `h2` + `.fh-sub` + a `.st-badge` cell count) over `.grid-scroll`.
- **`.hm-grid`** — the matrix (CSS grid; `grid-template` built by the renderer):
  - **`.ax-x-title`** (top, spans the data columns, → arrow) + **`.ax-y-title`** (left, rotated vertical).
  - **`.col-head`** (column labels, `2px` ink bottom rule; clickable → sort that axis) + **`.row-head`**
    (row labels with a `.rh-n` index, `2px` ink right rule; clickable → sort).
  - **`.cell`** — the graded tile: `--cell-bg`/`--cell-fg`/`--cell-line` set per value by the renderer; the
    cell shows its number (or `% of max`). States: `.is-empty` (hatched, no data), `.is-below` (dimmed by
    the threshold), `.is-hi` / `.is-cross` (hover scale + row/column cross-highlight).
  - **`.row-tot`** / **`.col-tot`** + grand-total corner — marginal sums with a `--tw`-scaled accent under-bar.
- **`.cell-pop`** — the hover/drill **detail popover** (`position:fixed`, clamped to the viewport): the
  `row × col` cross-label, the axis names, the big value, a `% of max` chip + optional band chip, and the
  cell's `detail` note. Click a cell to **pin** it (`.pinned`, with a close button); Esc unpins.
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`), **`.mini-dot`**, mono **`.chip`**, inline
  house **`.icon`** SVGs (`currentColor`), the `--bg-deep` **footer** strip with wordmark + accent square,
  and the `<noscript>` notice.

## Layout / section outline
```
.heatmap
├─ .hm-head          ← {{PROJECT}} · Heatmap · standfirst · mode chips · as-of · theme dots · scale legend
├─ .hm-toolbar       ← threshold slider · sort select · value↔% toggle · reset
├─ .hm-frame (hero)  ← the graded N×M grid:
│     • .ax-x-title (top, →)              • .ax-y-title (left, rotated)
│     • .col-head row  +  .row-head column (both clickable to sort)
│     • field of .cell tiles, coloured by value (accent ramp OR ok/hold/risk band wash)
│     • .row-tot column + .col-tot row + grand-total corner (marginal sums)
│     • .cell-pop detail popover (hover preview / click to pin)
└─ footer strip      ← --bg-deep, mono meta, wordmark + accent square
```
Order is **a single field, not a narrative** — the eye lands on the colour pattern, then reads the hot
cells, the margins, and the legend. There is **no TOC, no reading order, no section numbering**.

## Interactions (mandatory, vanilla JS, driven from the data)
- **Cell hover → detail popover** — hovering any cell highlights it, cross-highlights its row + column
  headers/cells, and shows the `.cell-pop` (row × col, value, `% of max`, band, note).
- **Click cell → drill / pin** — clicking pins the popover open (with a close button) so the detail stays;
  clicking again or Esc unpins.
- **Threshold slider** — dims every cell whose value is below the cutoff (`.is-below`), so the hot field
  stands out; a live note reports how many cells remain at or above the cutoff.
- **Sort rows / columns by total** — the Sort select (or clicking a row/column header) reorders the grid by
  marginal total, ascending or descending; totals and colours recompute over the new order.
- **Value ↔ normalised (%)** — a segmented toggle switches every cell and margin between the raw value and
  its `% of max` on the scale (totals shown as a share of the grand total).
- **Legend reflects the scale** — the colour ramp / band swatches are built from `scale` (ends, unit,
  bands), and recolour live with the **`.rc-theme`** switcher; initial theme = `meta.theme`.

In **print**, drop the threshold dimming (show the full field), render a complete static snapshot, and
hide the toolbar / popover / theme switcher.

## Do / Don't
- **Do** label **both axes** (x across the top with an arrow, y rotated down the left) and head **every**
  row and column — an unlabelled axis or row is a bug.
- **Do** colour cells by **value on the scale** — single-hue accent ramp (tint → full `--navy`) for
  intensity, or the `ok/hold/risk` band wash where a band is semantic.
- **Do** show **marginal totals** (row + column + grand) and let the colour pattern, not prose, carry the
  message; keep cell text to the number / percentage only.
- **Do** keep tiles **rounded** with a 2–3px grid gap and `2px` ink axis rules; use `"tnum" 1` on every cell
  and total so numbers align.
- **Do** drive every control from the JSON — threshold, sort, and the value↔% toggle actually re-render the
  grid and recompute totals.
- **Don't** use a **rainbow / multi-hue** ramp, or invent a 4th semantic colour — intensity is one hue;
  semantics are `ok/hold/risk` only.
- **Don't** plot items on two free axes, draw a centre cross-hair, or render quadrant labels — that is
  **matrix-canvas**, a different format.
- **Don't** turn it into a searchable, row-expanding record list (**data-register**) or a per-option
  comparison (**comparison-grid**); the heatmap colours a field, it does not list records.
- **Don't** wrap it in the long-form frame (top bar + two sticky rails + stacked prose sections), and don't
  cap a wide grid at ≤1280px — let it fill ~1500px and scroll horizontally if large.

## How this differs from the long-form report and matrix-canvas
The **long-form report** is a *document you read* (thin top bar → hero/standfirst → 3-column TOC + prose +
rail → stacked section panels). The **matrix-canvas** is a *positioning plane* — a 2×2 with labelled free
axes, a centre cross-hair, and a handful of items plotted as dots/cards into quadrants. The **heatmap-grid**
is a *graded field you scan*: a dense N×M matrix of discrete row/column intersections, each cell coloured by
its value, framed by categorical axis labels, summarised by marginal totals — read cell-by-cell, not
position-by-position.

## Data schema

Full field contract: [`schemas/heatmap-grid.schema.json`](schemas/heatmap-grid.schema.json)
(JSON Schema draft 2020-12, includes a realistic 5×6 risk likelihood × impact `examples[0]` instance).

**Required top-level fields:** `meta`, `mode`, `rows`, `cols`, `cells`, `scale`, `axisLabels`

| Field | Required | Description |
|:--|:--|:--|
| `meta` | yes | Shared chrome: org, project, reportType, title, date, theme (default `teal`; `black` always selectable) |
| `mode` | yes | `risk` \| `correlation` \| `activity` — picks the framing + legend caption (bands make it semantic) |
| `axisLabels` | yes | `x` (column-axis title, shown across the top) + `y` (row-axis title, rotated down the left) |
| `rows` | yes | Grid rows (Y), each `{ key, label }` (+ optional `sublabel`); order = top→bottom |
| `cols` | yes | Grid columns (X), each `{ key, label }` (+ optional `sublabel`); order = left→right |
| `cells` | yes | Graded cells, each `{ row, col, value }` (+ optional `label`, `detail`). Missing pairs / `value:null` render hatched-empty |
| `scale` | yes | `{ min, max }` (+ optional `unit`, `bands[]{min,tone[,label]}`). Bands → `ok/hold/risk` wash + banded legend; no bands → single-hue accent ramp |

## Icons

Icons are inline SVG from [`../icons/`](../icons/) — no external requests, `currentColor` so they recolour
inside `ok / hold / risk` contexts and across all 9 brand themes (see [`../icons/SPEC.md`](../icons/SPEC.md)).
Never use emoji or generic "AI" icons.

Relevant icon categories for this format:

- **data** — the `.hm-title` / `.hm-frame-head` heatmap mark, the correlation-mode scatter chip, plus
  bar-chart / distribution marks for the legend.
- **status** — the risk-mode warning-octagon mode chip; `st-ok/.st-hold/.st-risk` band semantics and the
  cell-count `.st-badge`.
- **math-units** — the threshold-slider sliders icon, the value↔% (exchange/arrows) toggle icon, and the
  `% of max` / scale-unit captions in the legend and detail popover.
- **nav** — the x-axis `→` arrow-head, sort (sort-asc / sort-desc) controls, chevrons, and the popover close.
