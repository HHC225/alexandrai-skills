# Format: Treemap (hierarchical area treemap)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** and the interactive, data-driven,
> themeable, PC-wide contract from [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md) — the 9-theme palette tokens
> (Black mandatory), system-font type scale, rounded panels, whisper shadows, `st-ok / st-risk / st-hold`
> semantics, the shared chip / badge / dot primitives, the house SVG icons, the self-contained output rule,
> the `#report-data` JSON-as-only-source rule, the `.rc-theme` dropdown switcher, and the mandatory-interaction
> rule. It **reinvents only the chrome and layout**: this format is a **packed-area map** — nested rounded
> rectangles whose **area encodes magnitude** and whose **nesting encodes containment**, drilled by zoom.
>
> **Default theme: Indigo** (`<html data-theme="indigo">`; `:root` still ships Purple, the Indigo block overrides).

## When to use
Reach for this when the deliverable's whole point is *"how does a single total **decompose** into parts, and
which parts dominate?"* — answerable by comparing **areas** at a glance, not by reading rows. A treemap packs a
whole hierarchy into one bounded rectangle, so the biggest contributors are literally the biggest tiles, and a
second metric (growth, variance, utilisation) rides on top as **tint**. Typical artefacts:

- **cost / spend allocation** (platform → category → service, sized by monthly spend, tinted by MoM change);
- **portfolio / book composition** (segment → product → instrument, sized by exposure, tinted by P&L);
- **capacity / footprint maps** (cluster → namespace → workload, sized by vCPU, tinted by utilisation);
- **traffic / volume share** (channel → endpoint, sized by req/s, tinted by error rate).

If the reader needs to trace **reporting lines** or **decision branches**, use **org-chart** (drawn connectors).
If the data is a fixed **N×M cell matrix** (every row crossed with every column), use **heatmap-grid**. If it is
a free **many-to-many graph**, use a topology diagram. The treemap is the only format where **area is the
message** and the hierarchy is read by **containment**, not by lines or a grid.

## The DISTINCT chrome (this is what makes it a treemap, not a heatmap or a tree)
A **full-bleed app shell**: a control toolbar over a large packed-rectangle canvas with a right summary rail —
never a thin top bar + both-side prose rails, never drawn node connectors, never a fixed cell matrix.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Root › Core Platform › Compute   ·  colour by [MoM change ▾]  ·  depth ◷───●── 3  · ◷theme │ ← .tm-crumbs (+ controls)
├──────────────────────────────────────────────────────────────┬───────────────────────────┤
│  ┌───────────────┬──────────┬───────┐                          │  FOCUS: Compute           │ ← .tm-rail
│  │ Instance grp  │ Server-  │ Batch │   ← squarified tiles,     │  $322,000 · 41% of parent │
│  │ $184k  57%    │ less     │ $42k  │     sized by value,       │  MoM +14.2%               │
│  │   +11.0%      │ $96k 30% │  −8%  │     tinted by colour      │ ───────────────────────── │
│  ├───────────────┴────┬─────┴───────┤     metric; parent tiles  │  RANKED CHILDREN          │
│  │ (nested children    │  …          │     show nested children  │  ▸ Instance grp $184k 57% │ ← .tm-childrow
│  │  to chosen depth)   │             │     down to the depth     │  ▸ Serverless   $96k  30% │   (click → zoom)
│  └─────────────────────┴─────────────┘     slider                 │  ▸ Batch        $42k  13% │
└────────────────────────────────────────────────────────────────┴───────────────────────────┘
```

1. **`.tm-crumbs`** — a **breadcrumb trail** (`Root › Branch › … `, each crumb clickable to ascend to that
   ancestor) is the format's signature locator; beside it sit a **"colour by" `<select>`** (size metric · the
   secondary colour metric · flat category tint), a **depth slider** (`1..N` nested levels), and the standard
   **`.rc-theme`** dropdown. One slim bar — the map carries the meaning.
2. **`.tm-map`** — a large bounded canvas holding the current focus node's children laid out by a **squarified
   treemap algorithm computed in JS** (rows chosen to minimise tile aspect ratio, so tiles stay near-square and
   comparable). Each tile is a **rounded rect** (`.tm-tile`) with a label, the size value, and its **share-%**
   of the parent, tinted by the chosen colour metric. Parent tiles nest their own children inward down to the
   chosen depth. This packed-rectangle silhouette is the format — never a bar chart, never a grid of equal cells.
3. **`.tm-rail`** — a right mini-panel: a **focused-node summary** (label, absolute value, share of grand total,
   colour-metric reading, note) over a **ranked child list** (`.tm-childrow` rows, largest first, each a click
   target that zooms into that child). The rail is the textual twin of the map.

## Signature components (class names to use)
- **`.tm-shell`** — the root app shell (full-viewport, flat `--bg-band`; toolbar + map + rail grid).
- **`.tm-crumbs`** — the breadcrumb trail; each `.tm-crumb` is a button (`data-id`) with a `›` separator; the
  last crumb is `.is-current` (non-clickable). Lives in the toolbar with the **`.tm-controls`** cluster: the
  **`.tm-colorby`** `<select>`, the **`.tm-depth`** `<input type="range">` + its read-out, and the `.rc-theme`.
- **`.tm-map`** — the squarified plotting surface (`position:relative`, fixed aspect box, `--bg-subtle`). Holds
  absolutely-positioned tiles laid out from computed `{x,y,w,h}` rectangles (percent of the map box).
- **`.tm-tile`** — one rounded tile (radius 9–10; nested tiles radius 7). Holds:
  - **`.tm-tile-label`** (sans, 12–13/700, truncating) + **`.tm-tile-val`** (mono) + **`.tm-tile-share`** (mono,
    `--ink-faint`), all suppressed automatically when the tile is too small to fit them.
  - a **tint** driven by the colour metric: a diverging `ok↔neutral↔risk` wash, a sequential accent ramp, or a
    flat category tint — applied as an inline `background` (mixed from palette tokens) so it re-themes.
  - **`.is-parent`** tiles render a header strip (`.tm-tile-head`) and an **inset** holding their nested
    children; **`.is-leaf`** tiles are solid. Hover → a subtle **lift** + accent ring; the active focus path
    tiles read as zoomable (`cursor:zoom-in`).
- **`.tm-rail`** — the right summary panel: a **`.tm-focus`** card (eyebrow + big value + share + colour chip +
  note) over a **`.tm-childlist`** of **`.tm-childrow`** rows. Each row = a **`.tm-swatch`** (the child's tint) +
  label + value + `.tm-bar` mini share bar + share-%; clicking a row **zooms** to that child.
- **`.tm-legend`** — a compact colour-scale legend in the rail (a diverging/sequential ramp with min·mid·max
  ticks, or category swatches), re-rendered when the "colour by" metric changes.
- **`.tm-tip`** — a single shared floating tooltip: on tile hover it shows the **exact value**, the **share of
  its parent**, and the **colour-metric value** (the three facts the map compresses).
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`) for the colour-metric chip, **`.mini-dot`**,
  mono **`.chip`**, the house **`.icon`** SVGs (`currentColor`: a treemap/grid glyph, chevrons, sliders, search),
  and the `--bg-deep` **footer** strip with wordmark + accent square.

## Data fields summary (full contract in [`schemas/treemap.schema.json`](schemas/treemap.schema.json))
- **`meta`** — shared chrome: `org`, `project`, `reportType`, `title`, `subtitle?`, `date?`, `author?`, `theme`
  (default `indigo`).
- **`sizeMetric`** — `{ label, unit, unitPosition? }`: the metric driving **area**. Every leaf carries it as
  `value`; an internal node's value defaults to the **sum of its children** (rolled up by the renderer).
- **`colorMetric`** — `{ label, unit?, type:"diverging|sequential|category", thresholds?{min,mid,max,goodHigh},
  scale?[{id,label,role}] }`: the secondary metric driving **tint**, plus its scale.
- **`root`** — the single top node (the initial focus). A **node** = `{ id (unique), label, value? (required on
  leaves), color? (number for diverging/sequential, category-id string for category), note?, children?[] }`,
  recursing via `children`. Sample is depth 4, ~30 nodes. **`#report-data` MUST be a valid instance of this schema.**

## Interactions (MANDATORY — all driven from the data / DOM, vanilla JS, ≤150ms)
- **Zoom into a tile** — click any tile to make it the **new focus root**: the squarified layout is recomputed
  for its children, a breadcrumb is pushed, and the rail re-summarises it. (A leaf tile flashes its tooltip.)
- **Breadcrumb ascend** — click any crumb (`Root › … `) to pop back up to that ancestor; the layout and rail
  recompute for that node. The current node is the non-clickable last crumb.
- **Colour by** — the `<select>` recolours every tile live between the **size metric**, the **secondary colour
  metric** (diverging or sequential), and **flat category** tint; the rail legend re-renders to match.
- **Depth** — the slider renders **1..N nested levels**: at depth 1 only the focus node's direct children show;
  higher depths nest each parent's children inward (squarified within the parent's rectangle).
- **Hover a tile** — the shared **`.tm-tip`** shows the **exact value**, **share of parent**, and the
  **colour-metric reading** for that tile; the matching rail row highlights.
- **Ranked child row click** — clicking a `.tm-childrow` in the rail zooms to that child (the rail's twin of a
  tile click).
- **Print** — `@media print` renders a **static snapshot** of the current focus + map at the chosen depth, with
  all tooltips resolved and the toolbar (breadcrumb controls, selects, slider, `.rc-theme`) hidden.

## Layout / section outline
```
.tm-shell
├─ .tm-crumbs (toolbar)   ← Root › … breadcrumb · colour-by select · depth slider · .rc-theme
├─ .tm-stage
│   ├─ .tm-map            ← full squarified packing of the focus node's children (nested to depth)
│   │     └─ .tm-tile×N   ← rounded tiles {x,y,w,h} sized by value, tinted by colour metric; parents nest children
│   └─ .tm-rail           ← .tm-focus summary · .tm-legend · .tm-childlist (.tm-childrow, click → zoom)
└─ footer strip           ← --bg-deep, mono meta, wordmark + accent square
```
The reading order is **area-first**: the eye lands on the largest tile, reads the tint, then drills. There is
**no TOC, no prose, no section numbering, no reading column**.

## Do / Don't
- **Do** implement a **real squarified layout in JS** (rows chosen to minimise aspect ratio); leaf `value` drives
  area, an internal node's value = the **sum of its children**. Equal-size or naïvely-sliced tiles are a bug.
- **Do** build the whole map from `#report-data` via `render()`; never hard-code tiles in the body.
- **Do** keep tint mapped to **`ok / risk / hold / neutral` + the brand accent only** — diverging scales pivot
  ok↔risk, sequential ramps the accent, categories reuse those roles. Never invent a 5th colour.
- **Do** show **exact value + share-of-parent + colour value** on hover — the three facts area+tint compress.
- **Do** suppress a tile's text when the tile is **too small to hold it** (keep the map clean), but keep the
  value reachable via the tooltip and the rail.
- **Do** let **zoom + breadcrumb** carry navigation, and keep the map a **single bounded rectangle** — never let
  it become a scrolling list of bars.
- **Don't** wrap it in the long-form frame (top bar + both rails + prose), draw **org-chart connector lines**, or
  render a **fixed N×M heatmap matrix** — those are other formats.
- **Don't** render the hierarchy as an indented list or a stacked bar; it must be a **packed 2-D area map**.
- **Don't** add a hero standfirst or running body copy — this is a map you drill, not a read.

## How this differs from the other formats
The **org-chart** is a **tree** of cards joined by drawn connectors — you trace lines to read parent→child. The
**heatmap-grid** is a **fixed N×M matrix** of equal cells graded by one value — you scan a lattice. The
**timeline-roadmap** is a horizontal time axis with swimlane bars. The **treemap** is the only format where
**area = magnitude** and **containment = hierarchy**: one bounded rectangle packs the whole breakdown, a second
metric rides as tint, and the reader **zooms** (tile click) and **ascends** (breadcrumb) through levels — fully
**interactive** (zoom, breadcrumb, colour-by, depth, hover) and **data-driven** (the whole map is built from
`#report-data` by a JS squarified layout).

## Icons
Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically). Typical
categories for this format: data (treemap / grid / chart), nav (chevrons, sliders, search, expand), status.
Browse `../icons/index.html`; never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
