# Format: Data register / matrix

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 8-theme palette tokens,
> the system-font stack, the dense 13px body, rounded panels, the three semantic states
> (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.ref-chip`, the 2px-ink-rule data table,
> the key/value grid), and the self-contained output rules (§0). **Default theme: Slate.**
> What this format reinvents is its **chrome and layout**: there is no hero, no standfirst, no
> table-of-contents, no stacked prose sections. **The table IS the page.**

---

## One-line difference from long-form
Long-form is a *document you read top-to-bottom* (hero → TOC → stacked section panels); the data-register
is an *application you query* — a sticky toolbar driving a single full-bleed sortable/filterable grid whose
rows open into detail drawers. Prose is near-zero.

## When to use
A managed **catalogue built for lookup, filter, sort, and drill-down** — never for narrative reading:

- risk / control register, RAID log, control matrix (SOC2 / ISO 27001)
- requirements or test-case inventory, defect / ticket register
- dependency & licence inventory, data-governance catalogue / data dictionary
- asset, vendor, SLA, or access-rights registers — anything that is fundamentally *rows of records*

Reach for a different format if the deliverable wants to be *read* (long-form), *watched at a glance*
(dashboard), or *worked* as a board (kanban).

---

## Distinct chrome — an enterprise data-grid application
This format must be **unmistakably a data-table tool** (Airtable / a SQL-results grid), not an article.
Three structural commitments:

1. **A full-bleed application shell**, not a centred reading column. The page is `100vw`, edge-to-edge,
   with the grid filling the entire viewport width. A thin **app bar** (`.register-bar`) carries the
   `{{ORG}} · {{PROJECT}}` wordmark, the `{{REPORT_TYPE}}` register title, and a live **result count**.
2. **A sticky toolbar** (`.toolbar`) pinned directly above the grid: a **search input** (`.search`), a row
   of **status filter chips** (`.filter-chip`), a **column-toggle** menu (`.col-toggle`), and **sort
   controls**. It stays fixed while the body scrolls — the controls never leave the screen.
3. **The grid is the hero.** One dense `.grid-table`: a 2px ink header rule, hairline `--rule-soft` row
   dividers, `--bg-subtle` zebra + hover, `tnum` numeric columns, `.st-badge` status cells, **sticky
   `<thead>`** so headers persist on scroll, and a **leading disclosure column** whose row opens an inline
   **detail drawer** (`.row-detail`). Optionally a **left facet rail** (`.facet`) for category filtering.

Density is the point: aim for **20–30 visible rows**, compact 8–10px vertical cell padding, no airy gaps.

### Layout outline
```
.register                         ← full-bleed app shell, 100vw, flex column, fills viewport
├─ .register-bar (sticky, top)    ← wordmark · {{REPORT_TYPE}} register title · live result count · theme dot
├─ .toolbar (sticky, under bar)   ← .search  ·  .filter-chip×N (status facets)  ·  .col-toggle  ·  .sort-ctl
└─ .register-body (flex row, scrolls)
   ├─ .facet (left rail, optional)   ← grouped checkbox facets: category / owner / domain  (+ "clear all")
   └─ .grid-wrap (flex 1, scroll-x/y)
      └─ table.grid-table            ← sticky thead, dense rows; THIS fills the width
         ├─ thead  (2px ink rule, mono uppercase 10px labels, .sortable th with sort caret)
         └─ tbody
            ├─ tr.grid-row[data-status][data-cat]   ← one record; .disclosure cell toggles…
            └─ tr.row-detail                         ← drawer: key/value grid + .ref-chip refs + notes
   (status bar at very bottom: “N of M rows · F filtered” — the spreadsheet footer feel)
```

---

## Signature components (class names)
- **`.register`** — the full-bleed app shell (`width:100vw`, flex column, `height:100vh` scroll context).
- **`.register-bar`** — slim sticky app bar: wordmark + register title + **live `.result-count`** chip +
  theme indicator. Whisper shadow on scroll. This *replaces* the long-form hero entirely.
- **`.toolbar`** — sticky control strip under the bar (`position:sticky; top:<bar-height>`), `--bg-band`,
  hairline bottom rule. Holds every control below.
  - **`.search`** — text input (mono placeholder, leading search icon) that live-filters rows by any cell.
  - **`.filter-chip[data-status]`** — toggleable status facet pills (`All / OK / Risk / Hold`); active chip
    inverts to the brand accent (or recolours to its `ok/risk/hold` state). Reuses the family chip shape.
  - **`.col-toggle`** — a column-visibility menu (`<details>` popover of checkboxes) to show/hide columns.
  - **`.sort-ctl`** — explicit sort dropdown *and/or* clickable `.sortable` `<th>` with an `.sort-caret`
    that flips asc/desc. At least one column must be click-sortable.
- **`.facet`** — optional left rail of grouped checkbox filters (category / owner / domain) with counts,
  plus a **“Clear all”** action. Collapsible; on print it is hidden.
- **`.grid-table`** — the dense register table (inherits the foundation data-table primitive):
  - `thead` is **sticky**, 2px `var(--ink)` bottom rule, mono uppercase `10px` `--ink-faint` labels.
  - `tbody` rows: hairline `--rule-soft` dividers, `--bg-subtle` zebra (`:nth-child(even)`) + hover.
  - numeric columns use `.num` (`text-align:right; font-feature-settings:"tnum" 1; font-family:--mono`).
  - status cells use **`.st-badge` + `.st-ok` / `.st-risk` / `.st-hold`** (dot + text, never colour alone).
  - first column is a **`.disclosure`** toggle (chevron rotates when open).
- **`.row-detail`** — the inline **detail drawer**: a `tr` spanning all columns whose cell holds a
  `--bg-subtle` panel with a **key/value grid** (`.kv`), **`.ref-chip`** reference links, and a short note.
  Toggle with native `<details>` semantics or a tiny inline-JS class flip; **must work with JS off** for
  reading (use `<details>`/`<summary>` so the drawer still opens without script).
- **`.result-count`** — mono pill in the bar showing the live visible/total row count.

Reuse the family primitives verbatim: `.st-badge`, `.ref-chip`, the key/value grid, the mini status dot.
Inline house SVG icons (`search`, `filter`, `sort-asc/desc`, `chevron-right`, `check`) per `../icons/SPEC.md`.

---

## Do / Don't
- **Do** make ONE table the hero — full-bleed, dense (20–30 rows), with **working** filter + sort + drill-down.
- **Do** keep `<thead>` and the toolbar **sticky** so controls and headers never scroll away.
- **Do** top-align multi-line cells and put long content into the drawer, not the row.
- **Do** keep the live result count honest as filters/search change.
- **Do** fill **every** row's `detail` richly — a `heading`, 2 `notes` (Finding + Required action), a 4–6-row `kv` grid, and `refs`. The drawer is this format's core value; a thin or empty detail wastes the drill-down and the row may as well not open.
- **Don't** wrap the register in a hero, standfirst, TOC, or stacked prose sections — that is long-form.
- **Don't** centre the content in a reading column or cap it at article width; the grid spans the viewport.
- **Don't** split one register into many small tables when a single sortable/filterable grid serves.
- **Don't** invent a 4th status colour or use emoji icons; obey the foundation palette + house icon set.
- **Don't** ship rows with empty or partial `detail`. A missing `kv` array used to render as a hollow bordered box on the right of the drawer; the template now collapses gracefully (single column / muted line), but the *point* is rich drill-down — populate all four sub-fields.

## Exemplar
`sample/data_register_sample.html` — a third-party **risk & control register** (Slate theme): sticky app
bar + toolbar (live search, status chips, column-toggle), a left facet rail, a full-bleed dense sortable
grid (~24 rows), and per-row detail drawers with key/value + reference chips.

## Data schema

Full field contract: [`schemas/data-register.schema.json`](schemas/data-register.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome — `org`, `project`, `reportType`, `title`, `date`, `theme` (default `"slate"`). Optional: `subtitle`, `author`. |
| `columns` | array | Grid column definitions. Each column: `key`, `label`, `type` (`text`\|`num`\|`date`\|`status`). Optional: `sortable` (default true), `hidden`, `width`. |
| `rows` | array | Register records. Each row: `id`, `status` (`ok`\|`hold`\|`risk`), plus one value per column `key`. Optional: `detail` object for the drill-down drawer. |

**Optional top-level fields:** `facets[]` — left rail filter groups. Each facet: `key`, `label`, `options[]` (`value`, optional `label`).

**Row `detail` object:** `heading` (string), `notes[]` (`lead` + `text`), `kv[]` (`k` + `v`), `refs[]` (`label`, optional `icon` + `href`). Schema-optional, but **populate all four for every row** — the drawer is the format's core value, and a partial `detail` renders a sparse drawer (an empty `kv` no longer draws a hollow box, it simply collapses).

## Icons

Icons are drawn inline from the house icon set at [`../icons/`](../icons/) per `../icons/SPEC.md`. Data-register-relevant categories:

- **`data`** — catalogue, table, grid, data-flow
- **`status`** — shield (SOC2/ISO), check (accepted), octagon (at-risk)
- **`nav`** — search, sort-asc/desc, chevron-right (disclosure), link/external
- **`legal-governance`** — document/contract, audit trail, ref-chip anchor

Use `currentColor` so icons recolour automatically across all 9 brand themes.
