# Format: Timeline / roadmap

> Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md): the 8-theme palette
> (default **Indigo** here), the dense 13px system-font register, rounded panels, the three
> semantic states (`ok` / `risk` / `hold`), the shared status-badge / chip / data-table
> primitives, and the self-contained single-file output rules (§0). It **diverges on chrome and
> layout**: this is **not** the long-form article frame. It is a **horizontal time canvas — a
> gantt-style planner** that reads left-to-right as a plan, never top-down as prose.

## One-line difference from long-form
Long-form is a vertical *document* you scroll and read; **timeline/roadmap is a horizontal
*plan* you scan across** — a time axis along the top, swimlanes down the side, and bars laid
into a grid. No sticky reading rails, no TOC, no stacked prose section panels.

## When to use
A **forward delivery plan across time** where the audience needs to see *who is doing what,
when, and whether it is on track* in a single picture:

- platform / product delivery roadmaps across quarters or releases;
- programme plans with parallel workstreams (build, data, security, infra, change);
- migration & cutover schedules, BCP/DR rehearsal calendars, release trains, sprint plans;
- any executive "are we on track?" view where **time is the primary axis** and **workstreams
  are the secondary axis**.

Reach for a different format when: there is no time axis (use **dashboard** or **matrix-canvas**);
the work is unscheduled flow by stage (use **kanban-board**); or the deliverable is narrative
analysis (use **long-form-report** / **magazine**).

---

## Distinct chrome + layout model

The whole document is a **planner canvas**, not a column of panels. Three structural pieces define it:

1. **Time axis (top, sticky).** A row of **column headers** — quarters (`Q1 FY26 … Q2 FY27`) or
   sprints/releases — running across the full width. This is the ruler everything aligns to. It
   stays pinned while the lanes scroll. Optional sub-ticks (months/sprints) under each quarter.
2. **Swimlanes (down the left, sticky).** A fixed-width **left rail of lane labels**
   (workstream / team / owner). Each lane is one horizontal track in the grid. The lane rail
   stays pinned while you scroll the bars horizontally on narrow viewports.
3. **Gantt grid (the body).** A CSS **grid** whose columns map 1:1 to the time-axis columns and
   whose rows are the swimlanes. **Bars span columns** (start → end), **milestone diamonds** sit
   on a single column edge, and a **"today" vertical line** cuts through every lane. Faint
   vertical column rules carry the eye down from the axis.

```
┌───────────────────────────────────────────────────────────────────────────┐
│  flat header  ·  {{ORG}} / {{PROJECT}}  ·  roadmap title  ·  legend chips   │  ← header
├──────────────┬───────────┬───────────┬───────────┬───────────┬─────────────┤
│  (lane rail) │  Q1 FY26  │  Q2 FY26  │  Q3 FY26  │  Q4 FY26  │   Q1 FY27   │  ← .time-axis (sticky top)
├──────────────┼───────────┴──────┐    │      ┆today┆          │             │
│ ▦ Platform   │ ▰▰▰▰ build core ▰│    │      ┆     ┆ ◆ GA     │             │  ← .swimlane → .gbar / .milestone
│ ▦ Data       │      ▰▰▰ migrate ▰▰▰▰  │      ┆     ┆          │ ▰▰ backfill │
│ ▦ Security   │           ▰▰ pen-test▰ (risk) ┆     ┆ ◆ audit  │             │
│ ▦ Infra      │ ▰▰ provision ▰  │   ▰▰▰ scale ▰▰▰  ┆     ┆     │             │
│ ▦ Change     │           (hold) ▰▰ enablement ▰▰  ┆     ┆ ◆ go-live        │
├──────────────┴────────────────────────────────────┴─────────────────────────┤
│  phase-band overlay (e.g. "Discovery | Build | Harden | Launch")            │  ← .phase-band
├───────────────────────────────────────────────────────────────────────────┤
│  milestone / gate table  (date · gate · owner · go-no-go state)             │  ← .gate-table
├───────────────────────────────────────────────────────────────────────────┤
│  dark footer wordmark                                                        │  ← shared footer
└───────────────────────────────────────────────────────────────────────────┘
```

Grid mechanics: the body is `display:grid` with `grid-template-columns: var(--lane-w) repeat(N, 1fr)`
(column 1 = lane rail, columns 2…N+1 = the N time periods). A bar that runs Q1→Q3 is placed with
`grid-column: 2 / 5`. Milestones use `grid-column` on a single line and align to the start/end edge.
The today line and phase bands are absolutely-positioned overlays sized in column-fraction units so
they stay locked to the same grid.

---

## Signature components (class names)

- **`.roadmap`** — the planner shell (the time-axis + lane stack as one CSS grid). Owns the
  `--lane-w`, `--track-h`, and `--cols` custom properties everything else reads.
- **`.time-axis`** — sticky top header row. Children `.tick` (one per period: mono UPPERCASE
  label like `Q3 FY26`, brand-tinted, with optional `.tick-sub` month/sprint ticks). 2px brand
  bottom rule. First cell is the empty corner above the lane rail.
- **`.swimlane`** — one lane row. Leading **`.lane-head`** (sticky left): mono lane index +
  icon + name + tiny owner/meta line. The lane track is the remaining grid columns. Alternate
  lanes get `--bg-subtle` zebra. Lane height = `--track-h` (compact, ~46–58px).
- **`.gbar`** — a gantt bar. **Dense, rounded** (`border-radius:8px`, height ~22–26px), tinted
  fill on the lane track, label text inside (truncates), placed with `grid-column:start/end`.
  Status variants recolour fill + border via the family states: `.st-ok` (on track, brand/ok),
  `.st-risk` (bordeaux), `.st-hold` (amber). Optional `.gbar--ghost` (planned/future, hairline
  dashed) and a `.gbar__pct` progress sliver. Bars may stack two-deep in a lane.
- **`.milestone`** — a **diamond** marker (rotated 10px square, brand fill, white pip) sitting on
  a column edge with a short mono caption (`◆ GA`, `◆ Go-live`). State-coloured like bars; a
  `.milestone--gate` variant is hollow for go/no-go gates.
- **`.today-line`** — a single **vertical brand line** with a top flag/pill (`TODAY · {{DATE}}`)
  spanning all lanes; absolutely positioned at the current date's column fraction.
- **`.phase-band`** — a horizontal **overlay band** under (or over) the grid grouping periods
  into named phases (`Discovery → Build → Harden → Launch`), each a soft tinted block with a mono
  label; communicates programme shape above the per-lane detail.
- **`.legend`** — inline key (status dot + label chips: *On track / At risk / On hold / Milestone
  / Gate / Planned*), placed in the header so the canvas reads without a caption hunt.
- **`.gate-table`** — the shared **data-table** primitive below the canvas: milestone/gate ledger
  (date · gate · owner · dependency · go/no-go `.st-badge`). This carries the prose/detail the
  bars can't, keeping the canvas itself clean.

Reused family primitives: `.st-badge` (+`.st-ok/.st-risk/.st-hold`) for states, mono **chips**
for refs/IDs, the **data-table** rules for the gate ledger, the **dark footer**, and the house
inline **SVG icons** (e.g. `milestone`, `flag`, `roadmap`, `gate-check`, `swimlane`) sized with
`.icon`.

---

## Layout outline (build order)

```
flat header           ← {{ORG}} / {{PROJECT}} wordmark · roadmap title · {{DATE}} · legend chips
roadmap canvas
  ├─ time-axis        ← sticky quarter/sprint columns (the ruler)
  ├─ swimlane × 4–5   ← workstream lanes, each holding gbars + milestones
  ├─ today-line       ← vertical "now" marker overlay
  └─ phase-band       ← phase grouping overlay (Discovery/Build/Harden/Launch)
gate-table            ← milestone & go/no-go gate ledger (data-table)
footer                ← dark wordmark band
```

---

## Do / Don't

- **Do** make time the horizontal axis and workstreams the vertical axis — the canvas must read
  left-to-right as a schedule at a glance, not top-down as text.
- **Do** keep the time-axis sticky-top and the lane rail sticky-left so the ruler and labels stay
  visible while scanning a wide plan.
- **Do** state-colour every bar and milestone (`ok`/`risk`/`hold`), show one clear **today** line,
  and include a **legend** so colour reads instantly.
- **Do** keep bars **dense and rounded**, snap them to grid columns, and let the **gate-table**
  below carry detail the bars can't.
- **Don't** wrap this in the long-form chrome (sticky TOC rail, right facts rail, stacked prose
  panels) — that is a different document type.
- **Don't** turn it into a vertical milestone *list* (that's just prose with dots) or a kanban
  board (stage flow, no time axis). If there's no time ruler across the top, it isn't this format.
- **Don't** invent a 4th status colour or use gradients on bars/text; obey the family palette.

## Exemplar
[`../sample/timeline_roadmap_sample.html`](../sample/timeline_roadmap_sample.html) — a platform
delivery roadmap across 6 quarters with 5 swimlanes, gantt bars, milestone diamonds, a today
line, phase bands, a legend, and a gate ledger (Indigo theme, with `data-theme` swaps).

## Data schema

Full field contract: [`schemas/timeline-roadmap.schema.json`](schemas/timeline-roadmap.schema.json)
(JSON Schema draft 2020-12, includes a realistic `examples[0]` instance).

**Required top-level fields:** `meta`, `periods`, `swimlanes`, `bars`

| Field | Required | Description |
|:--|:--|:--|
| `meta` | yes | Shared chrome: org, project, reportType, title, date, theme (default `indigo`) |
| `periods[]` | yes | Ordered time-axis columns. Each: `key`, `label`; optional `sublabel` |
| `swimlanes[]` | yes | Workstream rows. Each: `id`, `name`; optional `owner`, `index`, `icon` |
| `bars[]` | yes | Gantt bars. Each: `lane`, `startPeriod`, `endPeriod`, `status` (`ok`/`risk`/`hold`/`planned`), `label`; optional `progress`, `solid`, `row` |
| `milestones[]` | no | Diamond markers. Each: `lane`, `period`, `label`; optional `status`, `atEnd`, `row` |
| `gates[]` | no | Go/no-go gate entries in the ledger. Each: `period`, `label`, `lane`; optional `targetDate`, `sublabel`, `dependency`, `status`, `statusLabel` |
| `today` | no | Today vertical line: `period`, `fraction` (0.0–1.0 within that column) |
| `phases[]` | no | Phase-band overlay strips. Each: `startPeriod`, `endPeriod`, `name`; optional `sublabel`, `alt` |

## Icons

Icons are inline SVG from [`../icons/`](../icons/) — no external requests.

Relevant icon categories for this format:

- **process** — lane-head workstream icons (platform node-network, infra server-rack)
- **time** — `.today-line` flag; `.tick` time-axis headers; phase-band date ranges; footer as-of stamp
- **status** — `.st-badge` chips in the gate ledger (Passed / At risk / Conditional / Planned); milestone diamond states
- **people** — lane `.ln-meta` owner labels; gate ledger workstream chips
