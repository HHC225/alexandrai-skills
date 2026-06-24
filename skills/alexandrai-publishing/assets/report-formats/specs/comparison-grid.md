# Format: Comparison grid

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 8-theme palette tokens,
> the system-font stack, the dense 13px body, rounded panels, the three semantic states
> (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.ref-chip`, mono chips, the key/value
> grid), and the self-contained output rules (§0). It is also a **data-driven interactive report** per
> [`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md): the body is rendered from a single `#report-data` JSON instance,
> carries the mandatory in-report theme switcher, and every visual has a real control.
> **Default theme: Teal.**

---

## One-line difference from the others
A **comparison matrix**: the things being compared are **columns** (header cards across the top with
name, tagline, price, badges and a *Recommended* ribbon); the criteria are **grouped rows** down the
left; each cell holds a **✓ / ✗ / value / number / star-rating**. It is the *transpose* of the
data-register — where the register is many records as rows queried by a toolbar, the comparison grid is
a *handful of options as columns* read across a row at a time. It is **not** a filterable record grid
(data-register) and **not** a 2×2 plot (matrix-canvas) and **not** a stacked article (long-form).

## When to use
A **decision artefact** that puts a small set of options side by side so a reader can pick one:

- vendor / platform / tooling evaluation scorecards
- product or pricing-tier comparison ("Standard vs Pro vs Enterprise")
- build-vs-buy or solution-option shortlists; RFP response matrices
- feature parity matrices between two or more systems

Reach for a different format if the deliverable is *many rows queried* (data-register), *positioned on
two axes* (matrix-canvas), *a SWOT / canvas* (matrix-canvas), or *read top-to-bottom as prose*
(long-form / magazine).

---

## Distinct chrome — a premium comparison page
This format must read **unmistakably as a side-by-side comparison**, like a polished pricing page — not
a database tool and not an article. Three structural commitments:

1. **Options are columns; the first column is a sticky criteria rail.** A `<table class="cmp">` whose
   **`<thead>` is a row of header cards** (`.opt-head`) — one per option — and whose left column
   (`.crit`) carries the criterion labels. Both the header row and the left rail are **sticky** so the
   reader never loses the option names or the row they are scanning. This column-per-option layout is the
   signature; do **not** lay options out as rows.
2. **Header cards sell each option.** Each `.opt-head` stacks: option **name**, optional **tagline**,
   a large **price + unit**, a row of **badge** pills, and — for the chosen option — a **`.ribbon`**
   ("Recommended") plus a tinted, brand-bordered column. A header includes a **column on/off** toggle and
   (when the option is numeric-comparable) participates in sorting.
3. **Criteria are grouped, banded rows.** Rows are split into **groups** (`.grp-band` heading rows:
   "Capabilities", "Operations", "Commercials") that are **collapsible**. The compare controls live in a
   slim sticky **`.cmp-bar`** above the table — not an enterprise toolbar with search/facets.

There is **no** left facet rail, **no** global search box, **no** row-expand drawer, **no** result count,
**no** full-bleed `100vw` app shell. Use a **centred** container (`max-width:~1600px`, 40px gutter); if
there are many options the table scrolls horizontally inside that frame while the criteria rail stays pinned.

## Signature components (class names)
- **Comparison table** — `table.cmp`; sticky `thead`; sticky first column `.crit` / `th.crit-corner`.
- **Option header card** — `.opt-head` with `.opt-name`, `.opt-tag`, `.opt-price` (+ `.opt-unit`),
  `.opt-badges` (`.badge`, tones `.badge-ok/-risk/-hold` else brand), `.ribbon`, and a `.col-toggle` eye
  button. The recommended/highlighted column gets `.is-rec` / `.is-hl` (tinted `--navy-bg`, brand border).
- **Group band row** — `.grp-band` (full-width banded `<tr>`) with an icon, group name, a per-group
  collapse chevron, and a live "n criteria" count.
- **Cells** — `.cell` variants by `kind`:
  - `bool` → `.mk-yes` (brand/`ok` check), `.mk-no` (faint cross), `.mk-part` (`hold` half-circle) using the house `check` / `cross` icons.
  - `text` → `.cell-text` (mono value + optional `.cell-note`).
  - `number` → `.cell-num` (tabular mono value + `unit`); the best value in the row gets `.is-best`.
  - `rating` → `.stars` (0–5 squared-node pips, filled in brand).
- **Best-in-row marker** — `.is-best` chip/outline that flags the leading cell for numeric & rating rows.
- **Compare bar** — `.cmp-bar`: group-filter chips (`.filter-chip`), a **Differences only** toggle, a
  **Sort by** `<select>`, a **Reset** button, and the standard **`.rc-theme`** swatch switcher.
- **Verdict panel** — `.verdict` rounded panel below the table: an endorsing `.st-badge`, headline, prose,
  and a `.ref-chip` jump to the winning column.
- Reused foundation primitives: `.st-badge`, `.ref-chip`, mono chips, the dark footer wordmark.

## Section / flow outline
1. **Masthead** (`.cmp-masthead`) — eyebrow (`{{REPORT_TYPE}}`), title, standfirst, `{{ORG}} · {{PROJECT}}`
   wordmark + `{{DATE}}`. Compact, not a hero with rails.
2. **Compare bar** (sticky) — group filter chips · differences-only · sort-by · reset · theme switcher.
3. **The matrix** — sticky header cards row → grouped, banded criterion rows → cells. The recommended
   column is highlighted on load.
4. **Verdict** (optional) — closing recommendation panel.
5. **Footer** — dark band, mono meta, brand wordmark + accent square.

## Interactions (mandatory, vanilla JS, driven from the data)
- **Toggle option columns on/off** — the eye button in each header card (and a chip per option) hides /
  shows that column; the matrix re-lays out; sort/best recompute over visible columns only.
- **Collapse / filter criteria groups** — each `.grp-band` chevron collapses its rows; compare-bar chips
  show/hide whole groups.
- **Sort options by a chosen numeric / rating criterion** — the **Sort by** select reorders the *columns*
  by the picked row's value (respecting `betterWhen`); the recommended column can be pinned first.
- **Highlight the recommended column** — on by default; a control toggles the emphasis.
- **Differences only** — hides every row where all *visible* options share the same value (bonus).
- **Hover row highlight** — hovering any criterion row tints the whole row across columns.
- **Theme switcher** — the standard `.rc-theme` dots recolour live; initial theme = `meta.theme`.

In **print**, expand all groups and columns, drop the highlight emphasis to a hairline, render a complete
static snapshot, and hide the compare bar / toggles / theme switcher.

## Data fields (see `schemas/comparison-grid.schema.json`)
`meta` (shared chrome + `theme`) · `options[]` `{id,name,tagline?,price?,unit?,badges[]?,recommended?}` ·
`criteriaGroups[]` `{id,name,icon?,criteria[]{key,label,hint?,unit?,kind:"bool|text|number|rating",betterWhen?,weight?}}` · (set `weight` > 0 on scorable criteria to drive the **Weighted score** overall row) ·
`cells` (`optionId → {criterionKey → value}`, value shaped by `kind`; object form `{value,note}` allowed) ·
optional `verdict` `{winnerId?,headline?,text}`. The sample's `#report-data` is a valid instance.

## Do / Don't
- **Do** keep options as **columns** and criteria as **grouped rows**; sticky both the header cards and
  the left criteria rail.
- **Do** sell each option in its header card (price, badges, the *Recommended* ribbon) — this is what
  makes it a comparison page, not a spreadsheet.
- **Do** drive every control from the JSON: toggling a column actually removes it from sort/best/diff math.
- **Don't** add a search box, facet rail, row-expand drawers, or a result-count app bar — that is the
  data-register, and copying it collapses the two formats together.
- **Don't** plot options on axes or draw quadrants — that is matrix-canvas.
- **Don't** go full-bleed `100vw`; centre at ~1600px. Don't invent a 4th semantic colour for cells.
- **Don't** wrap it in the long-form frame (top bar + two sticky rails + stacked prose sections).

## Icons

Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically). Typical categories for this format: status, data, nav, editorial. Browse `../icons/index.html`; never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
