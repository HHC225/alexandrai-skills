# Format: Waterfall (bridge variance chart)

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 9-theme palette tokens
> (Black mandatory), the system-font stack, the dense 13px body, rounded panels, the three semantic
> states (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.chip`, the key/value grid, the
> mini status dot), and the self-contained output rules (§0). It also obeys
> **[`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md)** — `#report-data` JSON is the only content source, the body
> is built by `render()` on `DOMContentLoaded`, an in-report `.rc-theme` dropdown recolours it live
> across all 9 presets, every visual carries ≥1 real data-driven control, and it is a PC-wide
> deliverable. **Default theme: Blue.**
> What this format reinvents is its **chrome and layout**: a single opening→closing **bridge of floating
> bars** — not a statement, not a dashboard, not a generic bar chart.

---

## One-line difference from the others
A waterfall is a **bridge variance chart**: one **opening total**, a sequence of signed **+/-
contributions**, and one **closing total**, drawn as **floating bars linked by connector lines**. It
explains *how a number changed* — the bridge from A to B — not a ledger of line items and not a
watched-at-a-glance console. It is the opposite of **financial-statement** (NO side-by-side period
columns, NO ruled indented hierarchy, NO subtotal/double-rule ledger — the meaning is carried by *bar
height and float*, not by ruled rows) and of **dashboard** (NO KPI tile band, NO icon nav-rail, NO
gauges/widgets). It is also distinct from a plain **bar chart**: every middle bar *floats* off the
previous running total, and the eye reads a continuous staircase from opening to closing.

## When to use
A deliverable whose whole job is to **decompose a change** into its additive parts:

- a revenue / cost / margin **bridge** between two periods, or budget-vs-actual ("what moved the number")
- a **headcount bridge** (opening → hires − attrition − transfers → closing)
- a **latency- or error-budget bridge** (budget → each contributor's spend → remaining)
- cash-flow walk (opening cash → operating ± investing ± financing → closing cash)
- price/volume/mix variance, waterfall of cost savings, a funnel expressed as drop-offs

Reach for a different format if the deliverable wants side-by-side period columns and subtotals that must
foot and cross-foot (**financial-statement**), flows that split and recombine between many nodes
(**sankey-flow**), or a number watched live (**dashboard**). A waterfall has exactly **one** running
total threading **one** opening to **one** closing.

---

## Distinct chrome — a centred analysis page built around one bridge
This must be **unmistakably a bridge chart**, the kind that opens a variance review. Four structural
commitments:

1. **A centred analysis page (`.wf-page`), not an app shell.** Centred `max-width: ~1500px` on a neutral
   band with a 40px gutter — a single focused exhibit, not a full-bleed tool and not a 3-column reading
   layout. A slim sticky topbar carries `{{ORG}} · {{PROJECT}}`, the `.rc-theme` switcher, and a print
   hint.
2. **A headline strip (`.wf-headline`), not a hero and not a KPI band.** Three anchored facts read left
   to right: **opening** (label + value), the **net delta** as a big *signed* stat (`.wf-net`, coloured
   `ok` if up / `risk` if down, with a `▲`/`▼` and the signed amount + % of opening), and **closing**
   (label + value). The bridge title and unit sit above. This frames the question before the chart
   answers it.
3. **The waterfall chart (`.wf-chart`) is the hero of the page.** A single SVG plot:
   - a **value axis** down the left with **gridlines** and tick labels in the report's unit;
   - the **first and last bars are SOLID totals** (`.is-total`, brand `--navy`) **anchored to the
     baseline**;
   - every **middle step is a FLOATING bar** (`.wf-bar.is-up` in `--ok` / `.wf-bar.is-down` in `--risk`)
     that starts at the previous running total and spans its signed delta;
   - **optional subtotal bars** (`.is-subtotal`, solid `--navy`, anchored to the baseline) mark a
     checkpoint running total mid-bridge;
   - thin **connector lines** (`.wf-connector`) join the top of each bar to the start of the next, so the
     staircase reads continuously;
   - each bar is labelled with its **signed delta** (and, for totals/subtotals, its absolute value);
   - an optional **running-total line overlay** (`.wf-runline`) traces the cumulative path across bars.
4. **The bridge table (`.wf-table`) below restates the bridge as numbers.** A sortable table — **step ·
   type · delta · running total · % of opening** — with negative deltas in `--risk` (parenthesised in
   accountant style), totals/subtotals emphasised. **Rows sync-highlight with bars on hover** (hover a
   bar → its row lights; hover a row → its bar lights), so chart and table are one object.

Colour discipline (per `_FOUNDATION` §1): brand `--navy` is structure — totals/subtotals, axis, the
running-total line, active controls. Up-steps are `--ok`, down-steps are `--risk`; collapsed "Other" is a
neutral grey. Body ink is `--ink-mid`. No fourth semantic colour.

### Layout outline
```
.wf-page                                ← centred analysis page, max-width ~1500px, neutral band behind
├─ .wf-topbar (sticky, slim)            ← {{ORG}} · {{PROJECT}} wordmark · unit chip · .rc-theme switcher · print hint
├─ .wf-headline                         ← the framing strip…
│  ├─ .wf-head-title                      ← bridge title + subtitle + unit
│  └─ .wf-head-stats                      ← .wf-anchor (opening) · .wf-net (big signed Δ, ok/risk) · .wf-anchor (closing)
├─ .wf-controls (sticky band)           ← the bridge's controls (NOT a search toolbar):
│  ├─ .wf-toggle  (running-total line)    ← overlay the cumulative path on the chart
│  ├─ .wf-mode    (absolute ⇄ % of opening)← rescale all bars + labels
│  ├─ .wf-sort    (as entered ⇄ by magnitude)← re-layout the bridge
│  └─ .wf-collapse(threshold slider)      ← merge steps with |Δ| below threshold into one grey "Other"
├─ .wf-chart                            ← the hero: inline SVG plot
│  ├─ value axis + .wf-grid gridlines + unit ticks
│  ├─ .wf-bar.is-total      (opening / closing — solid --navy, baseline-anchored)
│  ├─ .wf-bar.is-up / .is-down (floating steps — --ok / --risk)
│  ├─ .wf-bar.is-subtotal   (checkpoint — solid --navy, baseline-anchored)
│  ├─ .wf-bar.is-other      (collapsed minor steps — neutral grey)
│  ├─ .wf-connector ×N      (thin links between consecutive bars)
│  ├─ .wf-runline           (optional running-total overlay polyline + nodes)
│  └─ bar Δ labels (signed)
└─ .wf-table                            ← sortable bridge table; rows sync-highlight with bars
   thead: Step · Type · Δ · Running total · % of opening      (sortable)
   tbody: tr.wf-trow[data-step] (one per bar; .is-total / .is-subtotal emphasised; negative Δ in --risk)
└─ footer (.wf-foot)                     ← dark band, wordmark, generated date, source (read-only)
```

## Signature components (class names)
- **`.wf-page`** — the centred analysis canvas (max-width ~1500px, 40px gutter).
- **`.wf-headline` / `.wf-anchor` / `.wf-net`** — the opening · signed-net · closing framing strip; `.wf-net`
  recolours `ok`/`risk` by direction.
- **`.wf-chart`** — the SVG bridge plot (axis, gridlines, bars, connectors, optional run-line).
- **`.wf-bar`** with modifiers **`.is-up` / `.is-down` / `.is-total` / `.is-subtotal` / `.is-other`** — the
  floating and anchored bars; up `--ok`, down `--risk`, totals/subtotals solid `--navy`, collapsed grey.
- **`.wf-connector`** — the thin line linking each bar to the next (the staircase thread).
- **`.wf-runline`** — the optional cumulative running-total overlay.
- **`.wf-table` / `.wf-trow`** — the sortable bridge table; rows sync-highlight with bars.
- Reused from `_FOUNDATION`: `.st-badge` (type/direction chips), `.chip` (unit), key/value framing, the
  shared floating `.chart-tip` tooltip, the dark footer.

## Interactions (all data-driven, vanilla JS, recompute from `steps[]`)
Every interaction **recomputes the whole bridge** — bar `y`/heights, running totals, connectors, and table
running-total/% columns — from the `steps[]` array; nothing is faked.

| Control | What it does |
|:--|:--|
| **Running-total line** toggle (`.wf-toggle`) | Overlays/hides the cumulative `.wf-runline` path across the bars. |
| **Absolute ⇄ % of opening** mode (`.wf-mode`) | Rescales every bar height, axis, and label between raw units and percent of the opening value. |
| **Collapse minor steps** threshold slider (`.wf-collapse`) | Steps with `|delta|` below the live threshold merge into one neutral grey **"Other"** step (`.is-other`); the bridge re-lays-out and the table collapses the merged rows into one. |
| **Sort steps** (`.wf-sort`) | `as entered` ⇄ `by magnitude` (descending `|delta|`); subtotals stay pinned to their narrative position; the bridge and table re-layout. |
| **Hover a bar** → tooltip + sync | The shared `.chart-tip` shows **step label · signed Δ · running total · % of opening**; the bar's table row highlights. **Hover a row** → its bar highlights (bidirectional). |
| **Sortable table columns** | Click a header to sort the table by step / Δ / running total / %. |

Assertion: closing is computed as `opening + Σ(type:"delta")`; if `closing.value` is supplied and differs,
the renderer surfaces a visible **foot-mismatch** flag (a `risk` badge) rather than hiding the error.

## Print
`@media print` expands to a complete static snapshot: the controls bar and switcher are hidden, the chart
renders at its current state, the bridge table shows all rows, the footer goes white-on-ink. No
horizontal scroll bars; everything fits the page.

## Do / Don't
- **Do** keep it a single opening→closing bridge with one running total; let bar height and float carry
  the meaning.
- **Do** colour up-steps `--ok`, down-steps `--risk`, totals/subtotals solid `--navy`, collapsed "Other"
  grey; keep connectors thin and quiet.
- **Do** make the net delta the emotional headline (signed, `ok`/`risk`) and make every figure exact in
  the tooltip.
- **Don't** add side-by-side period columns, indented ledger hierarchy, or subtotal/double-rules — that is
  **financial-statement**.
- **Don't** add a KPI tile band, an icon nav-rail, or gauges — that is **dashboard**.
- **Don't** draw flows that split and recombine across many nodes — that is **sankey-flow**.
- **Don't** let any bar sit unanchored ambiguously: totals/subtotals anchor to the baseline; only deltas
  float, and each floats off the *previous* running total.
