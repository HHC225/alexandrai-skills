# Experiment readout — format spec

> A **controlled-experiment (A/B test) results readout**. One screen that answers: *did the variant beat
> control, by how much, and can we trust it?* Built on **[`_FOUNDATION.md`](_FOUNDATION.md)** +
> **[`_DATA_DRIVEN.md`](_DATA_DRIVEN.md)** — read those first. This is **not** a comparison grid: a
> comparison grid scores *N options × M criteria* for a subjective decision; an experiment readout reports
> *one measured outcome* (a control vs its variant(s)) with **uplift %, confidence intervals and a
> significance verdict computed from p-values**. The maths is the point.

## What it inherits (do not reinvent)

- **Palette tokens, type stack, rounded panels, density, semantic states** from `_FOUNDATION.md`. Two-colour
  discipline: the brand accent for structure, `ok / risk / hold` for the three states only.
- **Shared primitives**: `.st-badge` (status pill with dot), the dark hover popover, the
  `2px solid var(--ink)` data-table header, the `--bg-deep` footer, house SVG icons via `.icon`.
- **The data-driven contract**: a single `#report-data` JSON island is the only content source; `render()`
  builds the DOM from it; every control mutates state then re-renders. `<noscript>` fallback; print snapshot.
- **The 9-theme switcher** (`.rc-theme`, Black mandatory) and **PC-wide** layout.

## When to use it

Reach for experiment-readout when the artefact is **the result of a controlled experiment** and the reader
needs a ship / no-ship / keep-running call:

- A/B or A/B/n test readouts (web/app flows, pricing, copy, model/algorithm variants).
- Feature-flag rollout experiments with a control hold-back.
- Any "we changed X for half the users — did the metric move, and is it significant?" report.

**Do not** use it for: multi-option vendor/feature/pricing decisions scored on criteria → **comparison-grid**;
a wall of live KPIs with no control/variant framing → **dashboard**; a metric quality scorecard with no
experiment → **scorecard**; a row-level data explorer → **data-register**.

## How it differs from the long-form report (and comparison-grid)

- **No article frame.** No thin top bar, no both-side sticky rails, no prose TOC. The chrome is a
  **hypothesis header → hero result → metrics table → segment breakdown** stack.
- **One outcome, not a matrix.** Columns are experiment **arms** (control + variants), not options; rows are
  **metrics**, not criteria. There is a single hero metric, not a weighted score over many criteria.
- **The verdict is statistical, not editorial.** It is derived from `pValue < alpha` and the metric's
  preferred direction — never authored prose. comparison-grid earns a "recommendation" from weighted scores;
  this earns a "significant win / regression / inconclusive" from significance testing.

It **reuses comparison-grid's column/cell + dark hover-popover technique** (delegated `data-tip-*` tooltip on
a container that survives re-render) for the per-arm value cells and the table — but in a results layout, not
a matrix.

## Distinct chrome + layout model

A centred page (`max-width:1500px`, 40px gutter), stacked top to bottom:

1. **Hypothesis header (`.xp-head`)** — the signature chrome. Eyebrow + title + standfirst, a wordmark/date
   block carrying the **status pill** (`running → hold`, `shipped → ok`, `inconclusive/stopped → risk`), then
   a tinted **hypothesis strip (`.hypo`)** stating the claim under test, then a **facts row (`.facts`)** of
   key/value boxes (window, arms + split, exposed users, primary metric, α, owner).
2. **Control bar (`.xp-bar`, sticky)** — segment chips, variant show/hide pills, a *highlight-significant*
   toggle, reset, and the theme switcher. Not a search toolbar.
3. **Hero result (`.hero`)** — the primary-metric panel. Left: per-arm **value cards (`.valcard`)** (control +
   each variant, big tnum value, CI line, scaled bar, winner tint). Right: the big **uplift %** with
   direction, **p-value line**, an **uplift confidence-interval visual (`.ci-scale`)** with a zero line, and
   the **verdict block (`.verdict-in`)** toned ok/risk/hold.
4. **Secondary metrics (`.sec` → `table.mtab`)** — one row per non-primary metric: control value, each visible
   variant's value, **uplift**, **p-value**, **significant?** flag. Sortable; click a row to promote it to hero.
5. **Per-segment breakdown (`.segs`)** — an "All users" row plus one row per segment, each showing that
   slice's primary-metric uplift + significance as mini-cards. Click a row to refocus the whole readout.
6. **Footer (`.foot`)** — `--bg-deep` band echoing the live verdict.

## Signature components (class names)

| Component | Class | Role |
|:--|:--|:--|
| Hypothesis header | `.xp-head` / `.hypo` / `.facts` `.fact` | the distinct chrome: claim + lifecycle facts |
| Status pill | `.st-badge` + `.st-ok/.st-risk/.st-hold` | experiment status, tone from `experiment.status` |
| Control bar | `.xp-bar` + `.seg-chip` `.var-pill` `.toggle` | segment / variant / significance controls |
| Hero panel | `.hero` / `.hero-grid` | the primary-metric result, two-pane |
| Arm value card | `.valcard` (`.is-control` / `.is-win`) | one arm's value + CI + scaled bar |
| Uplift readout | `.uplift-num` `.uplift-dir` (`.up/.down/.flat`) | headline uplift % and direction |
| CI visual | `.ci-scale` / `.ci-band` / `.ci-zero` / `.ci-point` | uplift interval around zero (sig vs straddling) |
| Verdict | `.verdict-in` (`.ok/.risk/.hold`) | statistical verdict derived from p vs α |
| Metrics table | `table.mtab` (`.sig-hl`) | secondary metrics; uplift / p / significance per row |
| Significance flag | `.m-sig` (`.yes/.no`) | derived `significant` cell |
| Segment row | `.seg-row` (`.active`) + `.seg-m` | per-slice mini-readout |
| Hover popover | `.cell-tip` | exact value + CI on any value cell/card |

## Data schema

Full field contract: **[`schemas/experiment-readout.schema.json`](schemas/experiment-readout.schema.json)**
(JSON Schema 2020-12, `examples[0]` = the sample's `#report-data`).

## Data fields (summary)

- **`meta`** — shared chrome (org/project/title/date/**theme** default `purple`), `{{…}}` placeholders kept.
- **`experiment`** — `hypothesis`, `status` (running/shipped/inconclusive/stopped), `primaryMetric` (key),
  optional `start`/`end`/`owner`/`platform`, and `alphaPct` (significance threshold, default 5 → p<0.05).
- **`variants[]`** — the arms: `id`, `name`, `isControl` (exactly one), optional `allocationPct`, `users`.
- **`metrics[]`** — every metric: `key`, `label`, optional `unit`/`format` (percent/currency/duration/number)/
  `betterWhen` (high/low), `primary` (one, = hero), `byVariant{ id → {value, ciLow?, ciHigh?} }`, and optional
  precomputed `upliftVsControlPct` / `pValue` / `significant`.
- **`segments[]?`** — audience slices: `key`, `label`, `sharePct?`, and `metrics[]` of per-metric `byVariant`
  overrides (+ optional uplift/p/significant) for that slice.

**The verdict is data-derived.** When `significant` is omitted it is computed as `pValue < alphaPct/100`; when
`upliftVsControlPct` is omitted it is computed from `byVariant` against the control. The sample's `#report-data`
is a valid instance of the schema (it equals `examples[0]`).

## Icons

House SVG set only (`../icons/`, 24×24, `stroke=currentColor`, 1.75, round caps), inlined and sized with
`.icon`. Colour follows `currentColor`, so an icon inside a `risk`/`ok`/`hold` chip recolours automatically.
Never use emoji or generic "AI" glyphs.

| Where | Category | Icons used |
|:--|:--|:--|
| Hero result, primary-metric mark, facts "primary metric" | **data** | `target`, `delta`, `trend-up`, `trend-down`, `metric-up`, `metric-down`, `bar-chart-grouped`, `gauge`, `percent-ring` |
| Status pill + significance flags + verdict | **status** | `verified` (shipped), `clock-pending` (running/inconclusive-hold), `shield-alert` (regression/stopped), `check-circle`, `cross-circle` |
| Hypothesis header, eyebrow, footer mark | **science-rnd** | `hypothesis`, `experiment`, `beaker`, `microscope`, `formula` |
| Control bar, sort, reset, segment people, popover | **nav** + **people** | `filter`, `sort-asc`, `sort-desc`, `search`, `close`, `arrow-right` (nav); `users-team`, `user-check` (segments) |

## Interactions (data-driven, vanilla JS)

| Control | Effect |
|:--|:--|
| **Segment chips** (`.seg-chip`) | **recompute the entire readout** from a slice's `byVariant` numbers; metrics with no override fall back to all-users |
| **Variant pills** (`.var-pill`) | show/hide a variant arm (control is locked / always shown; ≥1 variant kept) |
| **Click a table row** | promote that metric to the **hero** (re-focus the primary metric) |
| **Sortable headers** (`th[data-sort]`) | sort secondary metrics by any value column, uplift, p-value or significance |
| **Highlight-significant toggle** | dim non-significant rows, ring the significant ones (`.mtab.sig-hl`) |
| **Segment row click** | set that slice as the active segment (mirrors the chips) |
| **Hover any value** | dark popover with the **exact value + 95% CI** |
| **Theme dots** + **Reset** | recolour live (9 presets); reset clears segment/hidden/sort/hero |

All recomputation runs over the **active segment and visible variants**, so uplift, p-value display and the
verdict stay consistent with what the reader is looking at. In print: controls hidden, table fully expanded,
significance dimming removed — a static, complete snapshot.

## Do / Don't

**Do**
- Keep the verdict honest: derive significance from `pValue < alpha`; show CIs; let an inconclusive result read
  as inconclusive (`hold`), not a win.
- Mark exactly one `isControl` variant and one `primary` metric; measure every uplift against control.
- Use `betterWhen:"low"` for metrics where smaller is better (latency, refund/contact rate) so a negative
  uplift can correctly read as good.
- Provide `ciLow`/`ciHigh` on the primary metric so the CI visual is meaningful.

**Don't**
- Don't turn this into a comparison grid (options × criteria) or a generic KPI dashboard.
- Don't hand-author the verdict text to overrule the statistics, or hide a guardrail-metric regression.
- Don't invent a 4th status colour, add gradients, or cap the width below the PC-wide layout.
- Don't claim significance without a p-value — render `n/a` and a pending verdict instead.
