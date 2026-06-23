# Format: Matrix / canvas (strategy framework canvas)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** — the 8-theme palette tokens,
> system-font type scale, rounded panels, whisper shadows, `st-ok / st-risk / st-hold` semantics, the
> shared chip / badge / key-value primitives, the house SVG icons, and the self-contained output rules.
> It **reinvents only the chrome and layout**: where the long-form report is *prose you read top-to-bottom*,
> the matrix-canvas is a **whiteboard of labelled regions with items placed into them** — a facilitator's
> framework, not a document.
>
> **Default theme: Indigo** (`<html data-theme="indigo">`; `:root` still ships Purple, the Indigo block overrides).

## When to use
Reach for this when **two-dimensional positioning or a fixed strategic frame is the deliverable itself** —
the reader's question is *"where does each thing sit, and what's in each box?"*, answerable by glancing at a
plotted plane, not by reading. Typical artefacts:

- an **effort × impact / value × feasibility** prioritisation 2×2 (initiative dots in four quadrants);
- a **likelihood × impact** risk grid, a **reach × differentiation** competitive map, a BCG-style growth×share;
- a **SWOT** four-pane (Strengths / Weaknesses / Opportunities / Threats);
- a **business-model / lean canvas** (problem · solution · value-prop · channels · revenue · cost …);
- any workshop framework where items are *placed into* regions rather than listed in sequence.

If the reader needs a narrative, an audit trail, a sortable register, or step-by-step recommendations,
use **long-form-report**, **data-register**, or **infographic** instead. The canvas *states a position*; it
does not argue one paragraph by paragraph.

## The DISTINCT chrome (this is what makes it a canvas, not an article)
A flat **workshop board**, never a thin top bar + both-side sticky rails + stacked prose sections.

```
┌───────────────────────────────────────────────────────────────────────────┐
│  CANVAS HEAD  ·  {{PROJECT}} Strategy Canvas · framework chips · legend     │ ← .canvas-head
├───────────────────────────────────────────────────────────────────────────┤
│  FRAME 1 — the 2×2 plane (the hero)                          ▲ Impact       │
│        Quick wins        │        Major bets                 │              │ ← .matrix
│     ┌──────────────┐     │     ┌──────────────┐              │ .quadrant ×4 │
│     │  ● ●   ●      │     │     │   ●     ●     │             │ .plot-item   │
│     ├──────────────┼─────┼─────┼──────────────┤  Effort ▶    │ .axis-x/-y   │
│     │  Fill-ins    │     │     │  Thankless    │              │              │
│     │   ●          │     │     │     ● ●       │              │              │
│     └──────────────┘     │     └──────────────┘              │              │
├───────────────────────────────────────────────────────────────────────────┤
│  FRAME 2 — SWOT             │  FRAME 3 — Lean canvas (6–9 cells)            │
│  ┌─────────┬─────────┐      │  ┌────────┬────────┬────────┐                 │ ← .swot
│  │ Strength│ Weakness│      │  │ Problem│ Soln   │ Value  │                 │   .swot-pane
│  ├─────────┼─────────┤      │  ├────────┼────────┼────────┤                 │ ← .canvas-grid
│  │ Opportun│ Threat  │      │  │ Channel│ Metric │ Cost   │                 │   .canvas-cell
│  └─────────┴─────────┘      │  └────────┴────────┴────────┘                 │
└───────────────────────────────────────────────────────────────────────────┘
```

1. **`.canvas-head`** — a flat board header (not a hero/standfirst): the framework title
   (`{{PROJECT}} · Strategy Canvas`), a row of **framework chips** naming the frames on the board
   (`Effort × Impact`, `SWOT`, `Lean Canvas`), an **as-of `{{DATE}}`** stamp, and a **`.legend`** mapping the
   `st-ok / st-hold / st-risk` dot colours to their meaning (e.g. *Proceed / Watch / Defer*). One or two short
   lines max — the regions carry the meaning, not a paragraph.
2. **`.matrix`** — the **hero**: a single rounded plane divided into a **2×2 of `.quadrant` regions** by a
   crisp centre cross-hair. Two **labelled axes** (`.axis-x` along the bottom, `.axis-y` up the left, each with
   a low/high pole label and a tracked-mono axis title) frame it. Each quadrant carries a `.quad-head`
   (corner label like *Quick wins* / *Major bets* / *Fill-ins* / *Thankless tasks*) and a translucent tri-state
   wash. **`.plot-item`** dots/cards are **absolutely positioned** inside the plane by data
   (`style="--x:72%;--y:18%"`), each a `st-*`-coloured node with a number and a short label. This plotted
   plane — items floating in labelled space — is the format's unmistakable silhouette.
3. **`.swot` + `.canvas-grid`** — supporting frames below the hero, side by side: a **`.swot`** four-pane grid
   (`.swot-pane.is-s / .is-w / .is-o / .is-t`, each tinted, with an icon, a heading, and a short bullet list),
   and a **`.canvas-grid`** business-model / lean canvas of **6–9 `.canvas-cell`s** (CSS grid with a couple of
   tall/wide spans via `--col`/`--row`), each cell a tiny mono label + a few terse points. These are *boards of
   cells*, not tables and not prose.

## Signature components (class names to use)
- **`.canvas`** — the root board wrapper (max-width, flat `--bg`, generous internal gaps between frames).
- **`.canvas-head`** › `.canvas-title`, `.frame-chip` (mono pill naming each frame), `.asof` stamp, **`.legend`** › `.legend-item` (a `.mini-dot` `st-*` + label).
- **`.matrix`** — the 2×2 plane panel (rounded 12px, `position:relative`). Holds:
  - **`.matrix-plane`** — the inner plotting area with the centre cross-hair (a 1px `--rule` H and V line) and faint quarter gridlines.
  - **`.quadrant`** (`.q-tl / .q-tr / .q-bl / .q-br`) — the four labelled regions, each with a translucent `st-*` wash and a corner **`.quad-head`** (`.quad-name` + tiny `.quad-sub` caption).
  - **`.axis-y`** (up the left) + **`.axis-x`** (along the bottom) — each a tracked-mono `.axis-title` plus `.axis-lo` / `.axis-hi` pole labels; small arrowheads at the high end.
  - **`.plot-item`** (`style="--x:..;--y:.."`, absolutely positioned, translate-centred) — a `st-*` **`.plot-dot`** (squared-node or circle) carrying its ref number, with a `.plot-label` chip beside it. Variant **`.plot-item--card`** = a small rounded mini-card instead of a bare dot for headline items. Optional **`.plot-bubble`** sizes the dot by a third metric.
- **`.swot`** › four **`.swot-pane`** (`.is-s` strength / `.is-w` weakness / `.is-o` opportunity / `.is-t` threat) — each `.swot-head` (house icon + tracked label + count) over a tight `.swot-list` of `.swot-point`s. S/O lean `ok`, W/T lean `risk`/`hold`.
- **`.canvas-grid`** › **`.canvas-cell`** (`style="--col:2;--row:2"` for spans) — a business-model / lean canvas; each cell = `.cell-label` (mono micro, tracked) + `.cell-body` terse points, hairline `--rule-soft` dividers between cells, a couple of emphasis cells washed `--navy-bg`.
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`), **`.mini-dot`**, mono **`.chip`** / `.ref-chip`, the key/value mini-grid, inline house **`.icon`** SVGs (`currentColor`), and the `--bg-deep` **footer** strip with wordmark + accent square.

## Layout / section outline
```
.canvas
├─ .canvas-head        ← {{PROJECT}} · Strategy Canvas · frame chips · as-of {{DATE}} · legend (ok/hold/risk)
├─ .matrix  (hero)     ← labelled 2×2 plane:
│     • .axis-y  Impact (Low→High)        • .axis-x  Effort (Low→High)
│     • 4 × .quadrant (Quick wins / Major bets / Fill-ins / Thankless) with tri-state wash + .quad-head
│     • 6–10 × .plot-item plotted by --x/--y, st-* dots/cards, numbered, with .plot-label
├─ .frame-row          ← two supporting frames side by side:
│     • .swot          4-pane (S / W / O / T), each with icon + count + bullet list
│     • .canvas-grid   6–9 .canvas-cell lean/business-model canvas (a few spanning cells)
└─ footer strip        ← --bg-deep, mono meta, wordmark + accent square
```
Order is **spatial, not narrative** — the eye lands on the plotted 2×2, then sweeps to the SWOT and the
canvas grid. There is **no TOC, no reading order, no section numbering, no standfirst**.

## Do / Don't
- **Do** label **both axes** (title + low/high poles) and head **every** quadrant and cell — an unlabelled region is a bug.
- **Do** **plot** items by data with absolute positioning over a CSS-grid/relative plane; let the framework lead the page.
- **Do** keep every dot, wash, badge, and pane mapped to **`ok / hold / risk` only** — never invent a 4th cell colour.
- **Do** keep panels **rounded** (12px planes, 10–11px cells) with whisper shadows and a crisp centre cross-hair.
- **Do** keep text **terse** inside regions — labels, chips, and ≤1-line points; the placement is the message.
- **Don't** bury the matrix below paragraphs, render it as a data table, or stack frames as full-width prose sections.
- **Don't** add a hero standfirst, a prose intro, a TOC, or running body copy — this is a board, not a read.
- **Don't** let plotted items collide into an unreadable pile; nudge `--x/--y` so dots stay legible.

## How this differs from the long-form report
The long-form report is a **document you read** (thin top bar → hero/standfirst → 3-column TOC + prose + rail →
stacked section panels). The matrix-canvas is a **framework you scan**: a flat board whose hero is a 2×2 plane
with **labelled axes and items plotted into quadrants**, backed by a SWOT four-pane and a multi-cell canvas grid —
big labelled regions with things placed in them, and virtually no prose or reading order.

## Data schema

Full field contract: [`schemas/matrix-canvas.schema.json`](schemas/matrix-canvas.schema.json)
(JSON Schema draft 2020-12, includes a realistic `examples[0]` instance).

**Required top-level fields:** `meta`, `matrix`

| Field | Required | Description |
|:--|:--|:--|
| `meta` | yes | Shared chrome: org, project, reportType, title, date, theme (default `indigo`) |
| `matrix` | yes | Hero 2×2 plane. Required sub-fields: `axisX` (`title`,`lowLabel`,`highLabel`), `axisY` (same), `quadrants[]` (4 entries with `key`,`label`; optional `sublabel`,`wash`), `items[]` (each: `id`,`label`,`x`,`y`,`status`) |
| `matrix.items[].x` / `.y` | yes | Position 0–100 (x: left=0/right=100; y: bottom=0/top=100). Optional `card`, `meta`, `flip` per item |
| `swot` | no | Four-pane SWOT. Optional sub-fields: `title`, `subtitle`, `strengths[]`, `weaknesses[]`, `opportunities[]`, `threats[]` |
| `canvas` | no | Lean/business-model canvas grid. Required sub-field: `cells[]`. Each cell: `key`, `title`, `items[]`; optional `span`, `rowSpan`, `accent` |

## Icons

Icons are inline SVG from [`../icons/`](../icons/) — no external requests.

Relevant icon categories for this format:

- **process** — `.canvas-title` board mark; `.frame-head` frame icons (lean canvas grid icon)
- **status** — `.swot-head` icons for S/W/O/T panes (check-shield, warning, opportunity-spark, threat-shield)
- **shapes** — `.plot-dot` squared node; `.crosshair-v`/`.crosshair-h` centre cross-hair; axis arrow-heads
- **data** — `.cell-label` icons inside lean canvas cells (problem circle, solution code, channels fork, metrics bar-chart, revenue coin, cost bank)
