# Format: Flowchart (swimlane process flow)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** — the 9-theme palette tokens
> (Black mandatory), system-font type scale, rounded panels, whisper shadows,
> `st-ok / st-risk / st-hold` semantics, the shared chip / badge / key-value primitives, the house SVG
> icons, and the self-contained output rules — **and the data-driven contract from
> [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md)**: the body is rendered by `render()` from a single
> `#report-data` JSON instance, every visual carries a real interaction, an in-report `.rc-theme`
> switcher recolours it live, and it fills a PC-wide viewport.
> It **reinvents only the chrome and layout**: where the long-form report is *prose you read
> top-to-bottom*, the flowchart is a **structured, ordered BPMN-style process flow** — start/end
> terminals, step boxes and decision diamonds laid out in ordered columns and grouped into horizontal
> swimlanes, wired by routed connectors with arrowheads.
>
> **Default theme: Indigo** (`<html data-theme="indigo">`; all 9 `[data-theme]` blocks present per the
> contract, **including Black**).

## When to use
Reach for this when the deliverable IS **a process with order, branching, and ownership** — the
reader's question is *"what are the steps, in what sequence, who does each, and where does it branch on
a decision?"*, answered by **walking an ordered flow across swimlanes**, not by reading paragraphs or
tracing a free graph. Typical artefacts:

- an **approval / review workflow** (intake → checks → decision → approve/reject/loop-back);
- a **business process** across actors (customer / agent / back-office / core system swimlanes);
- an **incident / on-call runbook flow** (detect → triage → decision → mitigate → resolve);
- a **decision procedure** (a sequence of decision diamonds with labelled Yes/No branches);
- an **onboarding / request lifecycle** with hand-offs between teams or systems.

If the reader needs running narrative, a sortable register, a free *spatial* map of what-talks-to-what,
a time axis with dates, or a tracked checklist, use **long-form-report**, **data-register**,
**diagram-topology**, **timeline-roadmap**, or **runbook-checklist** instead.

## How this differs from diagram-topology (the non-overlap that matters)
They share the *engine* (a pannable/zoomable SVG-connector canvas) but are **opposite document types**:

- **diagram-topology** is a **FREE spatial graph**: every node carries its own `(x, y)`, the author
  places it anywhere, and the meaning is **connectivity / blast-radius** ("what talks to what, what
  fails if this dies"). No order, no lanes, no decisions.
- **flowchart** is a **STRUCTURED ordered flow**: nodes have **no x/y** — they carry `lane` + `col`,
  and the renderer *computes* their position from a **swimlane grid**. The meaning is **sequence,
  ownership, and branching** ("what happens next, who does it, which way does the decision go").
  Shapes are **typed** (terminal / step / **decision diamond** / IO), branches are **labelled Yes/No**.

If a topology canvas grew lanes, columns, decision diamonds and Yes/No branches it would *be* this
format — so this format owns exactly that BPMN structure and topology stays a free graph.

## The DISTINCT chrome (this is what makes it a flowchart, not a topology graph or an article)
A **full-bleed app shell** — a single edge-to-edge **canvas** you pan and zoom — but the canvas is a
**swimlane grid**: stacked horizontal lane bands (each with a left header tab naming its actor/system),
overlaid with a faint **column grid**, and shaped nodes snapped to **(lane, col)**. Framed by a thin top
app bar, a floating zoom **toolbar**, a left **lane panel**, and a right **info panel**. Never a thin
top bar + both-side sticky prose rails + stacked section panels (long-form report). Never **free-floating
(x,y) nodes** with no lanes/order (diagram-topology). The silhouette here is unmistakable: **labelled
lane bands with boxes and diamonds marching left→right, joined by routed elbow connectors with
arrowheads and Yes/No branch chips.**

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ APP BAR · {{PROJECT}} Process Flow · type legend · step-through ◀ 3/9 ▶ · ●●● theme │ ← .fc-bar
├───────────────┬──────────────────────────────────────────────────┬─────────────────┤
│ LANE PANEL    │   CANVAS  (full-bleed, pan = drag, zoom = wheel)   │  INFO PANEL     │
│ ☑ Applicant   │  Applicant│( start )→[capture]┄ ┄ ┄ ┄ →( active )  │  ┌───────────┐  │ ← .info-panel
│   collapse ⌄  │ ──────────┼──────────────────────────────────────  │  │ selected  │  │
│ ☑ Reviewer    │  Reviewer │           [review]→◇approve?─no→[reject] │  │ node card │  │
│ ☑ Core System │ ──────────┼──────────────────────────────────────  │  │ detail    │  │
│               │  System   │ [auto KYC]→◇risk?─yes→[fast]→[open]     │  │ in/out    │  │
│ TYPE LEGEND   │   ┌──────────────┐                                  │  │ edges     │  │
│ ▢ step ◇ dec  │   │ ⊕ ⊖ ⟲  ⛶  100%│ ← .toolbar (zoom in/out/fit/full)│  └───────────┘  │
└───────────────┴──────────────────────────────────────────────────┴─────────────────┘
```

1. **`.fc-bar`** — a thin top app bar (not a hero/standfirst): an eyebrow + the flow title
   (`{{PROJECT}} · Process Flow`), a row of **`.type-legend`** chips (one per node *shape* — start,
   step, decision, IO, end — each a tiny shape swatch + label), the **`.step-through`** control
   (◀ prev / counter `3 / 9` / next ▶ + play), and the mandatory **`.rc-theme`** dot switcher.
2. **`.fc-canvas`** — the **hero and the whole deliverable**: a full-bleed `overflow:hidden` viewport
   holding a transformable **`.fc-world`** (`transform: translate(panX,panY) scale(zoom)`). Inside the
   world, in z-order: the **`.lane-band` grid** (one banded row per lane + left **`.lane-head`** tab),
   a faint **column-rule** overlay, an inline **`<svg class="fc-edges">`** drawing every connector as a
   routed orthogonal path (with an explicit arrowhead **`<marker>`** and an optional mid-path
   **`.edge-label`** / **`.branch-chip`** Yes/No pill), and the shaped **`.fc-node`** elements snapped to
   each node's computed `(lane, col)` position. This — *lanes + ordered columns + shaped nodes + routed
   connectors* — is the format's silhouette.
3. **`.lane-panel`** (left) — a slim panel: a **`.lane-toggles`** group (one chip per lane: a checkbox
   to show/hide the band, plus a **collapse** caret that squashes the band to a thin strip and re-routes
   its connectors), and a **type legend** + **status legend** block.
4. **`.toolbar`** — a small floating cluster pinned to the canvas: **zoom-in / zoom-out / fit (reset) /
   fullscreen** icon buttons + a live **`.zoom-readout`** (e.g. `100%`). House icons only.
5. **`.info-panel`** (right) — the **selected-node detail**: empty-state prompt until a node is clicked,
   then the node's title + type chip + `st-*` badge + lane chip, its **`detail`** prose, and an
   **`.edge-list`** of its incoming/outgoing connectors (each with branch tag + label, clickable to
   re-focus). A node's click also **highlights every path through it** (see Interactions).

## Signature components (class names to use)
- **`.flowchart`** — the root full-bleed app shell (`100vw`/`100vh` grid: bar row, then
  `lane-panel | canvas | info-panel`).
- **`.fc-bar`** › `.fc-title` (with a `.markmini` house glyph), **`.type-legend`** › `.legend-chip`
  (a `.swatch` shape + label), **`.step-through`** › `.stp-btn` (prev / play / next) + `.stp-readout`
  (`3 / 9`), **`.rc-theme`** › `.rc-dot` (the canonical 9-preset switcher, **Black included**).
- **`.fc-canvas`** (the pannable viewport) holding **`.fc-world`** (the transformed layer). Inside it:
  - **`.lane-band`** ×N — a full-width horizontal band per lane (alternating `--bg-subtle`/`--bg`),
    with a sticky-left **`.lane-head`** tab (icon + lane label, rotated/stacked), states **`.is-collapsed`**
    (squashed) and **`.is-hidden`**. A faint **`.col-rule`** overlay marks the columns.
  - **`svg.fc-edges`** — one inline SVG sized to the world; each connector is a **`path.edge`** routed as
    an **orthogonal elbow** (H/V segments, not a free curve) carrying `data-branch` (`yes`/`no`) and an
    explicit **`marker-end="url(#fc-arrow)"`** (a real `<marker>`, **not** context-stroke). A
    **`.branch-chip`** (`<g>` rect+text) labels Yes/No at the decision exit; a **`.edge-label`** pill
    labels other edges. Connectors recolour + thicken (`.hot`) when on a highlighted path and dim
    (`.dim`) otherwise.
  - **`.fc-node`** (positioned by computed `left/top` from lane+col, translate-centred) — a shaped node:
    **`.n-start` / `.n-end`** (rounded-pill terminals), **`.n-step`** (rounded rectangle), **`.n-decision`**
    (a CSS diamond — rotated square or clip-path — with upright label), **`.n-io`** (a skewed
    parallelogram). Each has a leading **`.node-ico`** house glyph, a `.node-label`, and a status accent
    (`.s-ok / .s-risk / .s-hold / .s-neutral`). States: **`.is-selected`** (brand ring),
    **`.on-path`** (kept bright, on a highlighted path), **`.is-dim`** (faded), **`.is-step`** (the
    step-through current node, pulsed + centred).
- **`.toolbar`** › `.tool-btn` (`zoom-in / zoom-out / fit / fullscreen`, each a house icon) + `.zoom-readout`.
- **`.lane-panel`** › `.panel-group` › `.group-label` (mono micro, tracked) + **`.lane-toggles`** of
  **`.lane-chip`** (`aria-pressed` checkbox + label + a `.collapse-btn` caret) + the type/status
  **`.leg-rows`** legend.
- **`.info-panel`** › `.info-empty` (prompt) · `.info-card` › `.info-head` (title + `.st-badge` +
  type/lane `.chip`s) · a `.detail` block · **`.edge-list`** › `.eg` (direction arrow + branch tag +
  target label, clickable to re-focus).
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`), **`.mini-dot`**, mono **`.chip`**,
  the **`.kv`/legend** patterns, inline house **`.icon`** SVGs (`currentColor`), and the `--bg-deep`
  print footer with wordmark + accent square.

## Data fields summary (see [`schemas/flowchart.schema.json`](schemas/flowchart.schema.json))
- **`meta`** — shared chrome block (`org`, `project`, `reportType`, `title`, `subtitle`, `date`,
  `author`, `theme`) + optional `orientation` (`lr` default / `tb`).
- **`lanes[]`** `{ id, label, icon? }` — the horizontal swimlanes (actors / roles / systems); order is
  top-to-bottom; each toggleable + collapsible. **A node's vertical band comes entirely from `lane`.**
- **`nodes[]`** `{ id, type("start|step|decision|end|io"), label, lane, col, status?, detail? }` — the
  flow's nodes; **`type`** picks the shape (terminal / step box / **decision diamond** / IO
  parallelogram), **`lane`+`col`** place it on the swimlane grid (no x/y), `status` accents it, `detail`
  fills the info panel.
- **`edges[]`** `{ from, to, label?, branch?("yes|no") }` — the directed connectors (`from`→`to`);
  `branch` tags a decision's exit as the Yes/No path (recoloured + Yes/No chip); `label` is a mid-path pill.
- **`primaryPath?`** — optional ordered node-id list the **step-through** walks (next/prev); if omitted,
  derived by following the first/`yes` edge from the start terminal.
- **`legend?`** — optional override of the type/status legend captions.

## Interactions (mandatory, all driven from the data)
- **Pan** — drag anywhere on empty canvas to translate `.fc-world`; cursor `grab`/`grabbing`.
- **Zoom** — mouse-wheel zooms about the pointer; **`+ / − / fit(reset)`** toolbar buttons; live `.zoom-readout`.
- **Fit / reset** — frames the whole flow; also the `0` key.
- **Fullscreen** — toolbar button toggles the Fullscreen API on `.fc-canvas` (graceful no-op if unsupported).
- **Hover node** — raises the node and reveals its `detail` in a tooltip / the info hint.
- **Click node → highlight ALL paths through it** — selecting a node computes its **upstream ancestors +
  downstream descendants** (BFS both directions over the edge graph), marks every node and connector on
  those paths **`.on-path` / `.hot`**, and **dims everything else** (`.is-dim` / `.dim`). The right
  **`.info-panel`** fills with the node's detail and its in/out edges. Clicking empty canvas / Reset / Esc
  clears it. (This *path-through-a-node* highlight — not topology's *direct-neighbours* highlight — is the
  signature selection behaviour.)
- **Swimlane toggle / collapse** — `.lane-chip` checkboxes show/hide a whole lane (its nodes + touching
  edges drop from the render); the `.collapse-btn` caret squashes a lane to a thin strip and **re-routes**
  its connectors so the flow stays readable.
- **Decision-branch highlight** — hovering / selecting a decision (or its branch chip) accents its
  **Yes** path in the brand accent and its **No** path in `risk`, so the two outcomes read instantly.
- **Step-through** *(primary path walk)* — the `.step-through` control (◀ prev / ▶ next / play) advances
  along `primaryPath`, marking the current node `.is-step`, **centering it** in the canvas, and lighting
  the path travelled so far; the counter shows `n / total`.
- **Theme** — `.rc-theme` dots set `data-theme` live (9 presets, **Black included**); **print** expands
  to a full, un-dimmed fit-to-page flow with every node/edge shown and all controls hidden.

## Layout / section outline
```
.flowchart  (100vw × 100vh app shell)
├─ .fc-bar        ← eyebrow · {{PROJECT}} · Process Flow · .type-legend · .step-through · .rc-theme
├─ .lane-panel    ← LANES (toggle + collapse chips) + TYPE legend + STATUS legend        [left]
├─ .fc-canvas     ← full-bleed pannable/zoomable viewport
│     └─ .fc-world   (transform: translate + scale)
│           • .lane-band ×N  → banded row per lane + .lane-head tab + .col-rule overlay
│           • svg.fc-edges   → path.edge[data-branch] (routed elbow) + arrowhead <marker> + .branch-chip
│           • .fc-node ×N    → snapped to (lane,col): start/step/decision/io/end shapes + status accent
│     └─ .toolbar       ← ⊕ ⊖ ⟲ ⛶ + .zoom-readout                                       [pinned]
└─ .info-panel    ← selected-node card: type/lane chips · .st-badge · .detail · .edge-list  [right]
(+ print-only footer strip: --bg-deep wordmark + accent square)
```
The reading order is **the flow itself** — left→right along columns, top→bottom across lanes, branching
at diamonds. There is **no TOC, no prose body, no section numbering, no standfirst.**

## Do / Don't
- **Do** place **every** node by **`(lane, col)`** and let the renderer compute pixels from the swimlane
  grid — a node with a hard-coded x/y, or with no lane, is a bug. Build it all from `#report-data`.
- **Do** route **every** edge as a real **orthogonal elbow** connector with an **explicit `<marker>`
  arrowhead** (never `context-stroke`, which silently renders nothing where unsupported and kills
  directionality), and give every decision exit a **Yes/No `branch`**.
- **Do** shape nodes by **`type`** (terminal pill / step box / **decision diamond** / IO parallelogram)
  so the flow is legible at a glance, and key node **icons** to the house set (`currentColor`).
- **Do** make **pan + zoom + fit** real, make **click → highlight all paths through the node** actually
  compute upstream+downstream and dim the rest, and make **collapse** re-route connectors — never fake it.
- **Do** keep every status accent mapped to **`ok / hold / risk` (+ neutral)** only — never invent a 4th.
- **Do** keep step boxes **rounded** (10–11px) and the canvas flat with faint lane bands + column rules;
  whisper shadows only.
- **Don't** position nodes by free `(x,y)` or omit lanes/columns — that is **diagram-topology**, a
  different format. The whole point here is the *ordered swimlane structure*.
- **Don't** wrap it in the long-form frame (top bar + both prose rails + stacked panels) or render it as
  a packed tile grid — those are other formats.
- **Don't** let connectors cross into an unreadable knot; nudge `col` (and lane order) so elbows and
  branch chips stay legible.
- **Don't** require JS to *read the structure* beyond the accepted data-driven render — ship a
  `<noscript>` notice and a complete, controls-hidden print snapshot.

## Data schema
The field contract lives in [`schemas/flowchart.schema.json`](schemas/flowchart.schema.json) (JSON
Schema draft 2020-12). The sample's `#report-data` is a valid instance and is the canonical example
(`examples[0]`): a realistic account-opening approval flow across **3 lanes** (Applicant / Reviewer /
Core Banking System) with **~13 nodes** — start/end terminals, step boxes, two decision diamonds with
Yes/No branches, an IO node and a loop-back. When a user asks to output a process as `flowchart`, an
LLM fills exactly these fields and the template renders it deterministically.

## Icons
Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes flow automatically).
Typical categories for this format:
- **process** — `node-start`, `node-end`, `decision-diamond`, `gate-check`, `flow-arrow`,
  `process-flow`, `step-sequence`, `swimlane`, `fork-path`, `merge-path`, `handoff`, `cycle`,
  `approval-gate`, `sign-off`.
- **status** — `check`, `cross`, `clock-pending`, `warning-triangle`, `info-circle`,
  `stamp-approved`, `stamp-rejected` (for node status accents + the legend).
- **nav** — `search`, `filter`, `fullscreen`, `chevron-left`, `chevron-right`, `arrow-right`,
  `expand`, `collapse`, `plus`, `minus`, `close` (toolbar, lane collapse, step-through).
- **code** — `microservice`, `database`, `terminal`, `api`, `endpoint` (for system-lane / IO nodes when
  the actor is a service or datastore).

Browse `../icons/index.html`; never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
