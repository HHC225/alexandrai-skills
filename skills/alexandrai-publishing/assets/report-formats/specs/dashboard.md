# Format: Dashboard (monitoring / operations console)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** — the 8-theme palette tokens,
> system-font type scale, rounded panels, whisper shadows, `st-ok/risk/hold` semantics, and the
> self-contained output rules. It **reinvents only the chrome and layout**: where the long-form report is
> a *page you read top-to-bottom*, the dashboard is a **console you scan**.
>
> **Default theme: Blue** (`<html data-theme="blue">`; `:root` ships Blue here, not Purple).

## When to use
A live or as-of-snapshot **operational view** where numbers lead and prose is almost absent: service /
SLA health, platform & infra monitoring, MLOps pipeline status, release-train health, NOC / on-call
boards, KPI control rooms, throughput / error-rate consoles. Pick this when the reader's question is
*"is everything green right now, and where's the one thing that isn't?"* — answerable in three seconds.
If the reader needs a narrative, an audit trail, or recommendations, use **long-form-report** instead.

## The DISTINCT chrome (this is what makes it a console, not an article)
Three fixed/structural zones — never a top bar + side rails + stacked prose panels.

```
┌──────┬──────────────────────────────────────────────────────────────┐
│      │  KPI BAND  · 4–6 stat tiles, big tnum numbers, delta + spark  │  ← .topbar + .kpi-band
│ NAV  ├──────────────────────────────────────────────────────────────┤
│ RAIL │  WIDGET GRID                                                   │
│      │  ┌─ gauge ─┐ ┌── bar mini-chart ──┐ ┌─ spark/line ─┐          │  ← .widget-grid
│ (icons)  │  ▟      │ │ ▁▃▅▇▅▃            │ │  ╱╲___╱        │          │     of .widget
│      │  └─────────┘ └───────────────────┘ └───────────────┘          │
│      │  ┌── status list (st-ok/risk/hold) ──┐ ┌── data table ──┐     │
│      │  └────────────────────────────────────┘ └────────────────┘     │
└──────┴──────────────────────────────────────────────────────────────┘
```

1. **`.navrail`** — a **fixed slim left icon rail** (`~64px`), full viewport height, `--bg-deep`
   (or `--bg-band` on light variants). A wordmark mark/accent square at top; a vertical stack of
   **icon-only nav buttons** (`.nav-btn`, inline house SVGs) with an active state that paints the brand
   accent (left accent bar + `--navy-bg` wash); a small status/profile dot pinned to the bottom. Tooltips
   on hover are optional. This rail, not a header, is the format's signature.
2. **`.topbar` + `.kpi-band`** — a thin top strip (console title `{{PROJECT}} · Ops Console`, live "as of
   {{DATE}}" clock, environment chip, refresh/range control as static chrome) sitting directly above the
   **KPI band**: a single row of **4–6 stat tiles** (`.kpi-tile`). Each tile = tracked uppercase mono
   label + one **big tnum number** (`30–40px/800`) + a `.delta` (▲/▼ with `ok/risk` colour) and an
   optional inline `.spark`. The band is the at-a-glance headline — no standfirst, no intro paragraph.
3. **`.widget-grid`** — the body is a **CSS-grid of rounded widget panels** (`repeat(12, 1fr)`, each
   widget spans N columns via `--span`), **not** stacked full-width article sections. Widgets tile and can
   span 3/4/6/8/12 cols; they read in any order. Dense gaps (`14–18px`), `border-radius:12px`, whisper
   shadow. Every widget has a compact `.widget-head` (tiny mono label + optional menu/legend) and a
   `.widget-body`.

## Signature components (class names to use)
- **`.console`** — the root grid: `grid-template-columns: var(--rail) 1fr;` wrapping `.navrail` + `.main`.
- **`.navrail` › `.nav-btn` / `.nav-btn.is-active`** — icon-only fixed left nav (inline SVG, `currentColor`).
- **`.topbar`** — slim title/clock/env-chip strip; **`.env-chip`**, **`.live-dot`** (pulsing `ok` dot is fine, CSS-only).
- **`.kpi-band` › `.kpi-tile`** — `.kpi-label` (mono micro), `.kpi-num` (big tnum), `.delta.up/.down`, inline `.spark`.
- **`.widget-grid` › `.widget`** (`style="--span:4"`) › `.widget-head` (`.w-title` + `.w-meta`/legend) + `.widget-body`.
- **`.gauge`** — a **CSS/SVG semicircular or ring gauge** (SVG `stroke-dasharray` arc on a track), centre
  shows a tnum value + unit; arc colour maps to `ok/hold/risk`. (Donut variant `.gauge--ring`.)
- **`.spark`** — a **mini line / area chart** as an inline `<svg>` `polyline`/`path` (no axes, no library);
  used both inside KPI tiles and as a standalone trend widget. Optional last-point squared node + area fill.
- **`.barmini`** — a **mini bar chart**: a row of `.bar` columns whose `height` is data (`style="--h:74%"`),
  coloured by tri-state; thin baseline; tiny x-labels. (Horizontal variant `.bar-row` = label · track · value.)
- **`.statlist` › `.stat-row`** — a **status list**: leading `.st-badge`(`.st-ok/.st-risk/.st-hold`),
  service/target name, a value, and a trailing micro figure (latency, count). Scannable rows, hairline dividers.
- **`.dtable`** — a **compact data table** (foundation table primitive): `2px` ink header rule, mono
  `9.5–10px` uppercase headers, `1px var(--rule-soft)` row dividers, `--bg-subtle` zebra, tnum numeric
  columns, inline `.st-badge` / `.mini-dot` for per-row state. Kept short (top-N), not a full register.
- Reused primitives: `.st-badge`, `.mini-dot`, mono `.chip`, key/value mini-grid, `--bg-deep` footer strip.

## Layout / section outline
```
.console
├─ .navrail            ← mark · icon nav stack · bottom status dot   (fixed, full height)
└─ .main
   ├─ .topbar          ← {{PROJECT}} · Ops Console · live clock · env-chip · range control
   ├─ .kpi-band        ← 4–6 .kpi-tile  (the headline numbers + deltas + sparks)
   └─ .widget-grid     ← tiled rounded .widget panels, e.g.:
        • .gauge widget        (span 3)  — SLA / availability / utilisation dial
        • .barmini widget      (span 5)  — throughput or latency-by-service bars
        • .spark widget        (span 4)  — error-rate / requests trend line
        • .statlist widget     (span 5)  — service health list w/ st-ok/risk/hold
        • .dtable widget       (span 7)  — top incidents / recent deploys / slow endpoints
        • small .kpi-style mini widgets / ring gauges to fill the grid
   └─ footer strip      ← --bg-deep, mono meta, wordmark + accent square
```
Order is spatial, not narrative — a reader's eye lands on the KPI band, then sweeps the grid. There is
**no TOC, no reading order, no section numbering.**

## Do / Don't
- **Do** activate `"tnum" 1` on every number; keep **all charts pure CSS/SVG** (no chart libs) so they print.
- **Do** make the **left icon rail + KPI band** the first thing seen — that silhouette *is* the format.
- **Do** map every gauge arc, bar, badge, and dot to `ok / hold / risk` only — never invent a 4th colour.
- **Do** keep widgets **dense and rounded** with whisper shadows; let them tile and span, not stack.
- **Don't** add a standfirst, prose intro, body paragraphs, a TOC, or long commentary — this is not an article.
- **Don't** put a wide top header banner across the page; the *navigation* lives in the left rail.
- **Don't** let any single widget go full-page-tall or paragraph-heavy; a widget is a glanceable tile.

## How this differs from the long-form report
The long-form report is a **document you read** (thin top bar → hero/standfirst → 3-column TOC + prose +
rail → stacked section panels); the dashboard is a **console you monitor** — a fixed left icon nav-rail,
a top KPI band, and a tiled widget grid of gauges/charts/status, with virtually no prose and no reading order.

## Data schema

Full field contract: [`schemas/dashboard.schema.json`](schemas/dashboard.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome — `org`, `project`, `reportType`, `title`, `date`, `theme` (default `"blue"`). Optional: `subtitle`, `author`, `environment`. |
| `navItems` | array | Left-rail icon buttons. Each item: `id`, `label`, `icon` (category key), optional `active:true`. |
| `kpis` | array | KPI band tiles (2–8). Each tile: `label`, `value`. Optional: `unit`, `delta`, `trend` (`up`/`down`/`flat`), `state` (`ok`/`hold`/`risk`/`neutral`), `sloLabel`, `spark` (0–100 normalised points), `icon`. |
| `widgets` | array | Widget grid panels. Each widget: `id`, `type` (`gauge`\|`barchart`\|`linechart`\|`spark`\|`statlist`\|`table`), `title`, `span` (2–12 cols). Optional: `meta`, `data` (shape varies by type). |

**Optional top-level fields:** `statusList[]` — service health rows (`label`, `status`, optional `value`/`meta`).

## Icons

Icons are drawn inline from the house icon set at [`../icons/`](../icons/) per `../icons/SPEC.md`. Dashboard-relevant categories:

- **`data`** — charts, metrics, bar/line indicators
- **`status`** — health shields, incident octagon, check-circle
- **`nav`** — home, back, settings/sliders
- **`infra`** — server, cluster, deploy/upload, node
- **`time`** — clock, schedule, history/calendar

Use `currentColor` so icons recolour automatically inside `ok` / `hold` / `risk` contexts and across all 9 brand themes.
