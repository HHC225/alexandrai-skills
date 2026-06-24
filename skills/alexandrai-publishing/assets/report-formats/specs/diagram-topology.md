# Format: Diagram / topology canvas (spatial system & data-flow map)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** — the 8-theme palette tokens,
> system-font type scale, rounded panels, whisper shadows, `st-ok / st-risk / st-hold` semantics, the
> shared chip / badge / key-value primitives, the house SVG icons, and the self-contained output rules —
> **and the data-driven contract from [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md)**: the body is rendered by
> `render()` from a single `#report-data` JSON instance, every visual carries a real interaction, an
> in-report `.rc-theme` switcher recolours it live, and it fills a PC-wide viewport.
> It **reinvents only the chrome and layout**: where the long-form report is *prose you read top-to-bottom*,
> the topology canvas is a **pannable, zoomable stage of positioned nodes joined by labelled edges** — a
> spatial map of a system you explore, not a document and not a packed tile grid.
>
> **Default theme: Purple** (`<html data-theme="purple">`; `:root` already ships Purple, so no override
> is strictly needed, but all 8 `[data-theme]` blocks are present per the contract).

## When to use
Reach for this when **the deliverable IS the shape of a system in space** — the reader's question is
*"what talks to what, through which layer, and what happens if this one node fails?"*, answered by tracing
edges across a map, not by reading paragraphs or scanning a table. Typical artefacts:

- a **microservice / service-mesh topology** (gateways → services → datastores, sync vs async calls);
- a **data-flow / event-streaming map** (producers → Kafka topics → consumers → sinks);
- a **network / infrastructure diagram** (edge → LB → app tier → DB tier → external deps), zoned by layer;
- a **dependency / blast-radius graph** (which upstreams a change touches, which downstreams it can break);
- an **integration landscape** (internal systems + third-party endpoints + the links between them).

If the reader needs a narrative, an audit trail, a sortable register, a 2-D *positioning* judgement, or a
packed catalogue of components, use **long-form-report**, **data-register**, **matrix-canvas** (a 2×2
plane), or **dashboard** instead. The topology canvas answers *connectivity and reachability*, not ranking
and not at-a-glance KPIs.

## The DISTINCT chrome (this is what makes it a topology canvas, not an article or a grid)
A **full-bleed app shell** — a single edge-to-edge **stage** you pan and zoom — framed by a thin top app
bar, a floating zoom **toolbar**, a left **layer / type panel**, and a right **info panel**. Never a thin
top bar + both-side sticky prose rails + stacked section panels (that is the long-form report). Never a
packed grid of equal tiles (that is the arch-grid). Never a 2×2 quadrant plane with axes (that is the
matrix-canvas). The silhouette here is **nodes floating at (x,y) joined by drawn, labelled lines**.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ APP BAR · {{PROJECT}} Topology · type legend chips · as-of {{DATE}} · ●●● .rc-theme │ ← .topo-bar
├───────────────┬──────────────────────────────────────────────────┬─────────────────┤
│ LAYER PANEL   │   STAGE  (full-bleed, pan = drag, zoom = wheel)    │  INFO PANEL     │
│ ☑ Edge        │        ┌─────┐  sync   ┌─────┐                     │  ┌───────────┐  │ ← .info-panel
│ ☑ Services    │        │ API ●──────▶  │ Auth│                     │  │ selected  │  │
│ ☑ Data        │        └──┬──┘         └─────┘                     │  │ node card │  │
│               │           │ async                                  │  │ meta k/v  │  │
│ TYPE FILTER   │        ┌──▼──┐  data   ┌─────┐                     │  │ neighbours│  │
│ ☑ gateway     │        │Queue├───────▶ │ DB  │                     │  └───────────┘  │
│ ☑ service     │        └─────┘         └─────┘                     │                 │
│ ☑ datastore   │   ┌──────────────┐                                 │                 │
│ ☑ external    │   │ ⊕ ⊖ ⟲  ⛶  100%│ ← .toolbar (zoom in/out/reset/full) │             │
└───────────────┴──────────────────────────────────────────────────┴─────────────────┘
```

1. **`.topo-bar`** — a thin top app bar (not a hero/standfirst): an eyebrow + the map title
   (`{{PROJECT}} · System Topology`), a row of **`.type-legend`** chips (one per `nodeType`, each a tiny
   shape swatch + label, doubling as the colour/shape key), the **as-of `{{DATE}}`** stamp, and the
   mandatory **`.rc-theme`** dot switcher. One line — the map carries the meaning.
2. **`.stage`** — the **hero and the whole deliverable**: a full-bleed `overflow:hidden` viewport holding a
   transformable **`.stage-world`** (`transform: translate(panX,panY) scale(zoom)`). Inside the world,
   an **inline `<svg class="edges">`** draws every edge as a path (with an arrowhead `<marker>` and a
   mid-path **`.edge-label`** pill), and **absolutely-positioned HTML `.node` cards** sit at each node's
   `(x,y)`. Dragging the stage pans; the wheel (and the toolbar) zooms about the cursor. This — cards
   floating in pannable space, wired by drawn labelled lines — is the format's unmistakable silhouette.
3. **`.layer-panel`** (left) — a slim floating panel with two control groups: **`.layer-toggles`**
   (one checkbox-chip per `layer`, show/hide a whole band of the system) and **`.type-filter`** (one
   chip per `nodeType`, filter nodes by kind). Both re-render the stage from the data.
4. **`.toolbar`** — a small floating control cluster pinned to the stage: **zoom-in / zoom-out / reset
   (fit) / fullscreen** icon buttons + a live **`.zoom-readout`** (e.g. `100%`). House icons only.
5. **`.info-panel`** (right) — the **selected-node detail**: empty-state prompt until a node is clicked,
   then the node's title + `st-*` badge + type/layer chips + a **key/value `.kv-grid`** of its `meta`, and
   a **`.neighbour-list`** of its directly-connected nodes (each with the connecting edge's `kind` + label).

## Signature components (class names to use)
- **`.topo`** — the root full-bleed app shell (`100vw`/`100vh` grid: bar row, then `panel | stage | panel`).
- **`.topo-bar`** › `.topo-title` (with a `.markmini` house glyph), **`.type-legend`** › `.legend-chip`
  (a `.swatch` shape + label), `.asof` stamp, **`.rc-theme`** › `.rc-dot` (the canonical 8-preset switcher).
- **`.stage`** (the pannable viewport) holding **`.stage-world`** (the transformed layer). Inside it:
  - **`svg.edges`** — one inline SVG sized to the world; each edge is a **`path.edge`** carrying
    `data-kind` (`sync` solid arrow / `async` dashed arrow / `data` thick / `dep` dotted) and an
    **`.edge-label`** (a `<g>` with a rounded `<rect>` + `<text>`, hidden until hover or relevant). Edges
    recolour to the brand accent (or `risk`) and thicken when their endpoints are highlighted.
  - **`.node`** (`style="left:…;top:…"`, translate-centred) — a small rounded **node card**: a leading
    **`.node-ico`** house glyph keyed to its `nodeType`, a `.node-label`, a tiny `.node-type` caption, and
    a **`.node-status`** dot (`is-ok / is-risk / is-hold / is-neutral`). States: **`.is-selected`** (brand
    ring), **`.is-neighbour`** (kept bright), **`.is-dim`** (faded when something else is focused).
- **`.toolbar`** › `.tool-btn` (`zoom-in / zoom-out / fit / fullscreen`, each a house icon) + `.zoom-readout`.
- **`.layer-panel`** › `.panel-group` › `.group-label` (mono micro, tracked) + **`.layer-toggles`** /
  **`.type-filter`** of **`.toggle-chip`** (`aria-pressed`, a `.dot`/`.swatch` + label + optional count).
- **`.info-panel`** › `.info-empty` (prompt) · `.info-card` › `.info-head` (title + `.st-badge`),
  `.info-chips` (type / layer `.chip`s), **`.kv-grid`** › `.kv` (`.k` mono micro / `.v`), and
  **`.neighbour-list`** › `.nb` (direction arrow + edge `kind` tag + neighbour label, clickable to re-focus).
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`), **`.mini-dot`**, mono **`.chip`** /
  `.ref-chip`, the **`.kv-grid`** key/value pattern, inline house **`.icon`** SVGs (`currentColor`), and the
  `--bg-deep` footer strip with wordmark + accent square (collapsed into the bar in the live view, shown in print).

## Data fields summary (see `schemas/diagram-topology.schema.json`)
- **`meta`** — shared chrome block (`org`, `project`, `reportType`, `title`, `subtitle`, `date`, `author`,
  `theme`) + optional `canvas` (`{w,h}`, the px size of the world; coordinates may be normalized 0..100 or px).
- **`layers[]`** `{ key, label }` — the bands of the system (e.g. *Edge / Services / Data*), toggleable.
- **`nodeTypes[]`** `{ key, label, icon?, shape? }` — the node kinds (gateway, service, datastore, external…),
  each driving a legend chip, an icon, and the type filter.
- **`nodes[]`** `{ id, label, type, layer?, x, y, status?("ok|risk|hold|neutral"), meta? }` — the positioned
  nodes; `x/y` place the card on the canvas; `status` colours its dot; `meta` is a free key/value map shown
  in the info panel.
- **`edges[]`** `{ from, to, label?, kind?("sync|async|data|dep") }` — the directed links (`from`→`to`),
  `kind` styles the line (solid / dashed / thick / dotted), `label` is the mid-path pill.
- **`legend?`** — optional override of the kind/status legend captions.

## Interactions (mandatory, all driven from the data)
- **Pan** — drag anywhere on empty stage to translate `.stage-world`; cursor `grab`/`grabbing`.
- **Zoom** — mouse-wheel zooms about the pointer; **`+ / − / reset(fit)`** toolbar buttons; live `.zoom-readout`.
- **Fullscreen** — toolbar button toggles the Fullscreen API on `.stage` (graceful no-op if unsupported).
- **Layer toggle** — `.layer-toggles` chips show/hide whole layers; hidden-layer nodes and any edge touching
  them are removed from the render.
- **Node-type filter** — `.type-filter` chips include/exclude node kinds; same re-render rule for edges.
- **Select a node** — click a `.node` → it gets `.is-selected`, its **direct neighbours** stay bright
  (`.is-neighbour`), the **connecting edges** highlight (recolour + thicken + reveal label), and **everything
  else dims** (`.is-dim`); the right **`.info-panel`** fills with that node's badge/chips/`meta`/neighbours.
  Clicking empty stage (or a Reset/Esc) clears the focus.
- **Hover edge** — reveals/raises that edge's **`.edge-label`** tooltip and accents the line.
- **Re-focus from panel** — clicking a neighbour in the info panel selects *that* node (chained exploration).
- **Theme** — `.rc-theme` dots set `data-theme` live; **print** expands to a full, un-dimmed fit-to-page
  diagram and hides every control (toolbar, panels' interactive chrome, switcher).

## Layout / section outline
```
.topo  (100vw × 100vh app shell)
├─ .topo-bar      ← eyebrow · {{PROJECT}} · System Topology · .type-legend chips · as-of {{DATE}} · .rc-theme
├─ .layer-panel   ← LAYERS (toggle chips) + NODE TYPES (filter chips)            [left, floating]
├─ .stage         ← full-bleed pannable/zoomable viewport
│     └─ .stage-world   (transform: translate + scale)
│           • svg.edges     → path.edge[data-kind] + .edge-label per edge
│           • .node ×N      → positioned by x/y, icon + label + type + status dot
│     └─ .toolbar       ← ⊕ ⊖ ⟲ ⛶ + .zoom-readout                              [pinned to stage]
└─ .info-panel    ← selected-node card: badge · chips · .kv-grid(meta) · .neighbour-list   [right]
(+ print-only footer strip: --bg-deep wordmark + accent square)
```
The reading order is **spatial, not narrative** — the eye lands on the map, follows edges between nodes,
and drills into one node via the side panel. There is **no TOC, no reading order, no section numbering,
no standfirst, no running body copy.**

## Do / Don't
- **Do** position **every** node by `(x,y)` and draw **every** edge as a real labelled line — an edge with
  no path, or a node with no coordinates, is a bug. Build it all from `#report-data`, never hard-coded.
- **Do** make **pan + zoom + reset** real (transform the world), and make selection actually **highlight
  neighbours + connecting edges and dim the rest** — never fake the dim with a static screenshot.
- **Do** key node **icons to `nodeType`** (house SVGs, `currentColor`) and edge **style to `kind`**
  (sync solid / async dashed / data thick / dep dotted), so the legend is honest.
- **Do** keep every status dot and risk accent mapped to **`ok / hold / risk` (+ neutral)** only — never invent a 4th state colour.
- **Do** keep nodes **rounded** cards (10–11px) and the stage flat with a faint dot-grid; whisper shadows only.
- **Don't** wrap it in the long-form frame (top bar + both prose rails + stacked panels), render it as a
  packed equal-tile **arch-grid**, or as a **2×2 axis matrix** — those are three other formats.
- **Don't** let nodes/edges collide into an unreadable knot; nudge `x/y` so labels and lines stay legible.
- **Don't** require JS to *read the structure* beyond the accepted data-driven render — ship a `<noscript>`
  notice and a complete, controls-hidden print snapshot.

## How this differs from its neighbours
- vs **long-form-report**: that is a document you read (top bar → hero/standfirst → 3-col TOC + prose + rail
  → stacked panels). This is a **map you explore** — a pannable/zoomable stage of positioned nodes and drawn
  edges, with toolbar + layer/type/info panels and zero prose.
- vs the **arch-grid** (packed tile grid): that lays components out in a dense, evenly-spaced **grid of
  equal cards**. This places nodes at **free (x,y) coordinates** and the point is the **edges between them**.
- vs **matrix-canvas**: that is a **2×2 quadrant plane with labelled axes** where position *means* a score on
  two dimensions. Here position is just **layout** — meaning lives in the **connections**, not in the axes
  (there are none).

## Icons

Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically). Typical categories for this format: infra, code, process, status, nav. Browse `../icons/index.html`; never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
