# Format: Sankey flow diagram (quantitative value-weighted flow)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** — the 9-theme palette tokens
> (Black mandatory), the system-font type scale, rounded panels, whisper shadows,
> `st-ok / st-risk / st-hold` semantics, the shared chip / badge / key-value primitives, the house SVG
> icons, and the self-contained output rules — **and the data-driven contract from
> [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md)**: the body is rendered by `render()` from a single `#report-data`
> JSON instance, every visual carries a real interaction, an in-report `.rc-theme` switcher recolours it
> live, and it fills a PC-wide viewport.
> It **reinvents only the chrome and layout**: where the topology canvas is a *free-form pannable map of
> positioned nodes joined by labelled lines*, the Sankey is a **quantitative flow** — stacked node columns
> read left→right, joined by **filled ribbons whose width is proportional to a numeric value**. Every link
> carries a VALUE; the picture's whole job is to show *how much* flows *where*.
>
> **Default theme: Teal** (`<html data-theme="teal">`; all 9 `[data-theme]` blocks are present per the
> contract, Black included).

## When to use
Reach for this when **the deliverable IS the magnitude of a flow as it splits and merges across stages** —
the reader's question is *"how much value enters, how is it routed/converted at each step, and where does it
finally land?"*, answered by comparing **ribbon widths**, not by reading paragraphs, scanning a table, or
tracing a free-form graph. Typical artefacts:

- a **flow of funds / settlement map** (channels → intake → routing → clearing rails → settled / returned, by ¥);
- a **request-throughput pipeline** (ingress → gateway → services → datastores / sinks, by req/s, with drop-off);
- a **user-journey / conversion funnel that branches** (acquisition source → landing → step → outcome, by sessions);
- an **energy / material / budget balance** (sources → transforms → uses → losses), where conservation matters;
- a **cohort or capital allocation breakdown** (pools → allocations → sub-allocations → results, by amount).

If the reader needs connectivity-and-reachability with no magnitude, use **diagram-topology**; a
yes/no/branch procedure, use **flowchart**; a single-axis funnel with no re-merging, **infographic**; a
ranked table of amounts, **data-register** or **leaderboard**. The Sankey answers *how much flows where* —
its defining encoding is **width ∝ value**, and it is the only format that draws value-weighted ribbons.

## The DISTINCT chrome (this is what makes it a Sankey, not a topology or a flowchart)
A **full-bleed app shell** built around a single large **flow canvas**: a top **`.sk-toolbar`**, the
edge-to-edge **`.sk-canvas`** (an inline `<svg>` of stacked node bars + bezier ribbons), a right
**`.sk-rail`** detail panel for the selected node, and a bottom **`.sk-legend`** group key. Never a thin top
bar + both-side prose rails + stacked section panels (long-form report). Never a pannable map of free-(x,y)
node cards joined by thin labelled lines (topology). Never decision diamonds and yes/no branches
(flowchart). The silhouette here is **vertical columns of value-sized bars, joined by fat tapering
ribbons** that visibly split and recombine left→right.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ TOOLBAR · {{PROJECT}} Flow of Funds · [¥M] · min-flow ▭▬▬○▬▭ · groups ◉◉◉ · Trace ⛛ · ●▾ │ ← .sk-toolbar
├──────────────────────────────────────────────────────────────────────┬─────────────────────┤
│  CANVAS  (stacked columns, ribbons width ∝ value)                      │  DETAIL RAIL        │ ← .sk-rail
│   col0       col1        col2        col3        col4                   │  ┌───────────────┐  │
│  ▭Mobile╲   ▟Intake▙╲   ▟Route ▙═══▟RTGS ▙══════▟Settled▙              │  │ selected node │  │
│  ▭Web   ╳══▟       ▙ ╳═▟      ▙╲  ▟ACH  ▙══════▟       ▙              │  │ ── INFLOWS    │  │
│  ▭Branch╱   ▟Fraud ▙  ╲▟Review▙ ╲ ▟Card ▙═╗   ▟Pending ▙              │  │  row  val  %  │  │
│  ▭Corp ═════▟       ▙   ╲       ╲ ▟Intl ▙ ╚══▟Returned▙              │  │ ── OUTFLOWS   │  │
│                                                                        │  │ total in/out  │  │
├──────────────────────────────────────────────────────────────────────┴─────────────────────┤
│ LEGEND · ▬ channel  ▬ core  ▬ rail  ▬ held  ▬ returned · ribbon width ∝ value · total ¥6,880M     │ ← .sk-legend
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **`.sk-toolbar`** — a thin top app bar (not a hero/standfirst): a house glyph mark + the diagram title
   (`{{PROJECT}} · Flow of Funds`), a **flow-unit chip** (`units`, e.g. `¥M`), a **`.sk-threshold`
   min-flow range slider** (hide ribbons below the dragged value), a row of **`.sk-grouptoggle` chips**
   (one per `group`, collapse/hide that group's nodes + links), a **`.sk-trace` "Trace path" mode toggle**,
   and the mandatory **`.rc-theme`** dropdown. One line — the canvas carries the meaning.
2. **`.sk-canvas`** — the **hero and the whole deliverable**: a full-bleed inline `<svg>`. Nodes are
   **`.sk-node`** rounded-rect bars stacked in vertical columns (stages) left→right, **bar height ∝ node
   throughput**; links are **`.sk-link`** filled cubic-bezier ribbons, **width ∝ value**, tinted by the
   source node's group at low opacity. Each column shows a total; each node shows its throughput. The
   layout (x by column, y by stacking incident flows, ribbon endpoints + control points) is **computed in
   JS** from `nodes[]` + `links[]` — never hand-placed.
3. **`.sk-rail`** (right) — the **selected-node detail**: an empty-state prompt until a node is hovered or
   clicked, then the node's title + group chip + a **total-in / total-out** pair, then its **inflows** and
   **outflows** as **`.sk-flow-row`** rows (each: counterpart node, value, and **% of node total**, with a
   width-bar echoing the ribbon). This is the quantitative read-out the canvas can't fully spell out.
4. **`.sk-legend`** (bottom) — the **group key**: one swatch+label per `group`, the ribbon-width hint
   (`width ∝ value`), and the **grand-total** readout. Doubles as the colour legend for ribbon tints.

## Signature components (class names to use)
- **`.sk-shell`** — the root full-bleed app shell (`100vw`/`100vh` grid: toolbar row, then
  `canvas | rail`, then legend row).
- **`.sk-toolbar`** › `.sk-mark` (house glyph) + `.sk-titles`; **`.sk-unit`** flow-unit chip;
  **`.sk-threshold`** (a real `<input type="range">` min-flow slider + live `.sk-thr-readout`);
  **`.sk-grouptoggle`** chips (`aria-pressed`, a `.sk-gt-swatch` + label + count); **`.sk-trace`** mode
  toggle (house icon, `aria-pressed`); **`.rc-theme`** › `.rc-theme-sel` (the canonical 9-preset switcher).
- **`.sk-canvas`** (the flow viewport) holding one inline **`svg.sk-flow`** sized to the layout. Inside it:
  - **`.sk-link`** — one filled `<path>` per link, a tapering ribbon whose top and bottom edges are cubic
    beziers; `data-value`, `data-source`, `data-target`; tinted `fill` by the source group at ~`.34`
    opacity. States: **`.is-hot`** (raised opacity + stroke when its endpoints are focused), **`.is-dim`**
    (faded when something else is focused), **`.is-hidden`** (below threshold or a collapsed group).
  - **`.sk-node`** — a `<g>` per node: a rounded **`rect.sk-node-bar`** (height ∝ throughput) with a left
    accent keyed to its group, plus a **`.sk-node-label`** + a mono **`.sk-node-val`** throughput figure.
    States: **`.is-selected`** (brand ring), **`.is-linked`** (an up/down-stream node of the selection,
    kept bright), **`.is-dim`** (faded), **`.is-reach`** (multi-hop, lit in Trace mode), **`.is-hidden`**.
  - **`.sk-col-total`** — a per-column total label above each stack; **`.sk-col-rule`** the column baseline.
- **`.sk-rail`** › `.sk-rail-empty` (prompt) · `.sk-rail-card` › `.sk-rail-head` (title + group `.chip`),
  **`.sk-rail-totals`** (the `total-in` / `total-out` key/value pair), and two **`.sk-flow-list`** blocks
  (inflows, outflows) of **`.sk-flow-row`** (counterpart label + `data`-driven `.sk-flow-bar` + value +
  `%` of node total). Each row is clickable to re-select that counterpart (chained exploration).
- **`.sk-legend`** › `.sk-leg-item` (a `.sk-leg-sw` swatch + group label + count) + `.sk-leg-hint` +
  the **`.sk-leg-total`** grand-total.
- **`.sk-tip`** — a single shared floating tooltip showing **exact value & % of source's outflow** on
  ribbon hover, and value/throughput on node hover.
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`), **`.mini-dot`**, mono **`.chip`**, the
  **key/value** pattern (in the rail totals), inline house **`.icon`** SVGs (`currentColor`), and the
  `--bg-deep` footer/wordmark + accent square (shown in print).

## Data fields summary (see `schemas/sankey-flow.schema.json`)
- **`meta`** — shared chrome block (`org`, `project`, `reportType`, `title`, `subtitle`, `date`, `author`,
  `theme`).
- **`units`** — the unit every value is in (e.g. `req/s`, `¥M`, `sessions`); shown as the toolbar chip and
  appended to every value. Optional **`valueFormat`** `{ prefix?, suffix?, decimals? }` tunes display only.
- **`groups[]`** `{ id, label, tone?("brand|ok|hold|risk|ink") }` — the semantic groups; each drives a
  legend item, a toolbar collapse-toggle, and the **low-opacity tint** of links leaving a node of that group.
  `tone` maps to the accent or the three semantic states only — **never a 4th colour**.
- **`nodes[]`** `{ id, label, column, group?, note? }` — the stations; `column` (0-based) sets the stage /
  x-band; the **bar height is derived** = `max(total inflow, total outflow)`; `group` colours it; `note` is
  a caption in the rail.
- **`links[]`** `{ source, target, value(>0), note? }` — the value-weighted ribbons; `value` drives ribbon
  **width** and every percentage; typically connects a lower column to the next higher one.
- **`legend?`** — optional caption overrides (`ribbonHint`, `totalLabel`).

## Interactions (mandatory, all driven from the data, vanilla JS)
- **Hover a ribbon** → it gets **`.is-hot`** + its two connected nodes highlight, the rest **`.is-dim`**;
  the **`.sk-tip`** tooltip shows the **exact value & % of the source node's total outflow**.
- **Hover / click a node** → it gets **`.is-selected`**, **all** its up- and down-stream ribbons isolate
  (`.is-hot`) and their counterpart nodes stay bright (`.is-linked`), everything else dims; the right
  **`.sk-rail`** fills with that node's inflow / outflow rows (value + % of node total) and total-in /
  total-out. Click empty canvas (or Esc) clears.
- **Min-flow threshold slider** → drag to hide every ribbon whose `value` is below the threshold
  (`.is-hidden`); node throughputs and bar heights **recompute** from the visible links, and a live
  `.sk-thr-readout` shows the cut value. (Smooth ≤150ms.)
- **Group toggle chip** → click to **collapse/hide** that group's nodes **and** their links; the layout
  recomputes (remaining bars restack, totals update). Toggling back restores it.
- **"Trace" mode** → enable, then click a node to **light its entire reachable downstream path**
  (multi-hop, `.is-reach`) — the full set of stages the node's value can still reach — honouring the
  current threshold + group filters.
- **Theme** — `.rc-theme` dropdown sets `data-theme` live; **print** expands to a full, un-dimmed,
  threshold-cleared snapshot and hides every control (slider, toggles, trace, switcher, tooltip).

## Layout / section outline
```
.sk-shell  (100vw × 100vh app shell)
├─ .sk-toolbar    ← mark · {{PROJECT}} · Flow of Funds · .sk-unit · .sk-threshold · .sk-grouptoggle×N · .sk-trace · .rc-theme
├─ .sk-canvas     ← full-bleed inline svg.sk-flow
│     • .sk-col-total ×C        → per-column total above each stack
│     • .sk-link ×L             → filled bezier ribbon, width ∝ value, tinted by source group
│     • .sk-node ×N             → rounded bar (height ∝ throughput) + label + mono value, grouped by column
├─ .sk-rail       ← selected-node detail: head · totals(in/out) · inflows .sk-flow-row* · outflows .sk-flow-row*   [right]
└─ .sk-legend     ← .sk-leg-item per group · ribbon-width hint · grand .sk-leg-total                 [bottom]
(+ print-only footer strip: --bg-deep wordmark + accent square)
```
The reading order is **quantitative and left-to-right** — the eye compares ribbon widths down each column
and follows the fattest flows across stages, then drills one node via the side rail. There is **no TOC, no
prose, no section numbering, no standfirst.**

## Do / Don't
- **Do** make **ribbon width genuinely proportional to `value`** and **bar height proportional to
  throughput** (`max(in,out)`) — a ribbon whose width doesn't track its value is a bug. Compute the whole
  layout in JS from `#report-data`; never hand-place a node or fake a width.
- **Do** keep value **conservation honest** within a node where the data is conservative (a node's inflow
  total and outflow total should reconcile, give or take an explicit loss/hold/return branch) — and show
  both totals in the rail so the reader can check.
- **Do** make the **threshold slider, group toggles, trace mode, and hover/select** all *real* — recompute
  heights / re-stack / re-highlight from the data, never a static overlay.
- **Do** tint ribbons by the **source group** at low opacity so the picture reads, and key every accent to
  the brand or to **`ok / hold / risk`** only — never invent a 4th flow colour.
- **Do** keep nodes **rounded** bars and the canvas flat; whisper shadows only; mono tabular numbers on
  every value and total.
- **Don't** wrap it in the long-form frame, render it as a free-(x,y) **topology map**, or as a **decision
  flowchart** — those are three other formats; the tell here is *value-weighted ribbons in stacked columns*.
- **Don't** let ribbons cross into an unreadable knot — order each column's nodes (and each node's incident
  links) so ribbons stay mostly monotone; nudge `column` assignments so flow reads left→right.
- **Don't** require JS to *read the magnitudes* beyond the accepted data-driven render — ship a `<noscript>`
  notice and a complete, controls-hidden print snapshot.

## How this differs from its neighbours
- vs **diagram-topology**: that is a **pannable map** of free-(x,y) node cards joined by thin labelled
  lines — it answers *connectivity & reachability* and edges have no magnitude. This stacks nodes in
  **value-sized columns** joined by **width-∝-value ribbons** — it answers *how much flows where*.
- vs **flowchart**: that is a **control-flow** diagram (steps, decision diamonds, yes/no branches, swim
  lanes) with no quantities. Here every link is a **number**, and the branches are sized by that number.
- vs **infographic** (funnel): that is a single, narrowing **funnel/pyramid** with one path and no
  re-merging. A Sankey **splits and recombines** across many nodes and columns, each ribbon independently
  weighted.

## Icons
Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically).
Typical categories for this format: data (flow, funnel, trend), finance (transfer-arrows, ledger), process
(handoff, fork-path, merge-path), nav (filter, sort), status. Browse `../icons/index.html`; never use emoji
or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
