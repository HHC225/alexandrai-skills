# Format: Org-chart / hierarchy (top-down node tree)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** and the interactive, data-driven,
> themeable, PC-wide contract from [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md) — the 8-theme palette tokens,
> system-font type scale, rounded panels, whisper shadows, `st-ok / st-risk / st-hold` semantics, the
> shared chip / badge / dot primitives, the house SVG icons, the self-contained output rule, the
> `#report-data` JSON-as-only-source rule, the `.rc-theme` dot switcher, and the mandatory-interaction rule.
> It **reinvents only the chrome and layout**: where every other format is paper or a board, this one is a
> **living tree** — a root node fanning out into child rows joined by drawn connector lines.
>
> **Default theme: Indigo** (`<html data-theme="indigo">`; `:root` still ships Purple, the Indigo block overrides).

## When to use
Reach for this when the deliverable's whole point is a **strict parent → child hierarchy** and the reader's
question is *"what reports to / decomposes into / branches from what?"* — answerable by tracing lines down
from a single root, not by reading prose or scanning a grid. Typical artefacts:

- a **reporting org chart** (programme → squads → roles, with headcount and RAG status);
- a **work-breakdown structure** (deliverable → workstream → package → task, with % / weight);
- a **taxonomy / classification tree** (domain → category → sub-category);
- a **decision tree** (a root question branching into options and outcomes).

If the relationship is many-to-many, time-phased, or a free graph, use **matrix-canvas**, **timeline-roadmap**,
or a topology diagram instead. **No other format in the gallery is a tree** — this is the only one with a
single root and drawn connectors. Do not reach for it to list things that have no parent.

## The DISTINCT chrome (this is what makes it a tree, not a board or a document)
A **slim toolbar over a full-bleed tree canvas**, never a thin top bar + both-side sticky rails + stacked
prose sections, and never a lane board or a quadrant plane.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TREE TOOLBAR · {{PROJECT}} Org · ⊟ Collapse all ⊞ Expand all ⟲ Reset · 🔍search · ●●● legend · ◷ theme │ ← .tree-toolbar
├──────────────────────────────────────────────────────────────────────────────┤
│                          ┌───────────────┐                                     │
│                          │ ● Root  badge │  ← .node (root)                     │  full-bleed
│                          │   role · meta │                                     │  .tree-canvas
│                          └───────┬───────┘                                     │  (centres;
│            ┌─────────────────────┼─────────────────────┐  ← CSS connectors     │   x-scroll
│      ┌───────────┐         ┌───────────┐         ┌───────────┐                  │   for wide
│      │ ● Child A │         │ ● Child B │ [+3]     │ ● Child C │                  │   trees)
│      └─────┬─────┘         └───────────┘         └─────┬─────┘                  │
│       ┌────┴────┐                                  ┌───┴───┐                    │
│     ┌────┐  ┌────┐                               ┌────┐ ┌────┐                  │
│     │leaf│  │leaf│                               │leaf│ │leaf│                  │
│     └────┘  └────┘                               └────┘ └────┘                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

1. **`.tree-toolbar`** — a single slim sticky bar (NOT a hero/standfirst): a `.markmini` org-chart glyph +
   the `{{PROJECT}}` title + a terse `.subtitle`; a button cluster **⊟ Collapse all · ⊞ Expand all · ⟲ Reset
   focus**; a **`.tree-search`** text box; a **`.legend`** mapping `ok / risk / hold / neutral` dots to their
   meaning; and the standard **`.rc-theme`** dot switcher. One line — the tree carries the meaning.
2. **`.tree-canvas`** — a **full-bleed** surface (`--bg-subtle`, faint dotted texture) the tree is laid out on.
   The tree **centres** horizontally; if it is wider than the viewport the canvas **scrolls horizontally**
   (never cap it at ≤1280px). This is the format's silhouette: cards stacked in generations, joined by lines.
3. **`.tree`** (recursive) — the structure itself. Each generation is a horizontal **`.tree-row`** of
   sibling **`.node`** cards; every parent draws **CSS connector lines** down to its children — a short stub
   below the parent, a horizontal bus spanning the siblings, and a stub up into each child. **No SVG
   library** is required (pure CSS pseudo-element connectors); a light inline-`<svg>` connector layer is an
   acceptable alternative, but the default and the sample use CSS. Collapsing a node hides its subtree **and**
   the connectors beneath it.

## Signature components (class names to use)
- **`.org`** — the root app shell (full-viewport, flat `--bg-band`; toolbar + canvas).
- **`.tree-toolbar`** › `.markmini` (house org-chart svg), `.tt-title` + `.tt-sub`, **`.tt-actions`** (the
  `.btn`s: `data-act="collapse-all" / "expand-all" / "reset"`), **`.tree-search`** (`<input>` + clear), the
  **`.legend`** (`.legend-item` = `.mini-dot` `is-*` + label), and the **`.rc-theme`** switcher.
- **`.tree-canvas`** — the scrollable full-bleed plotting surface; `.tree` centres inside it.
- **`.tree` / `.tree-row` / `.subtree`** — the recursive layout: a node and its `.tree-row` of children,
  each child opening its own `.subtree`. `.subtree.is-collapsed` hides children + connectors (height/opacity
  transition ≤150ms).
- **`.node`** — the compact rounded card (radius 11, whisper shadow). Holds:
  - **`.node-dot`** — a `7–8px` status dot (`is-ok / is-risk / is-hold / is-neutral`) at the card's lead.
  - **`.node-name`** (13–14 / 700) + optional **`.node-role`** (11.5, `--ink-soft`).
  - optional **`.node-badge`** (tracked-mono pill, `--navy-bg`) and **`.node-meta`** (mono metric chip).
  - **`.node-toggle`** — a chevron affordance shown only on parents; rotates on collapse and carries a
    **`.kid-count`** bubble (`+3`) when the node is collapsed so hidden children stay visible at a glance.
  - hover → a subtle **lift** (`translateY(-1px)` + slightly stronger shadow); `.is-match` (search hit)
    rings the card in the accent; `.is-dim` (focus mode) drops the card to low opacity.
- **Connectors** — drawn with pseudo-elements on `.subtree` / `.tree-row` / `.node` (a `--rule`-coloured
  vertical stub down from the parent, a horizontal sibling bus, an up-stub into each child; single-child
  collapses to one straight line). A `.node.is-path` (focus ancestor/descendant) recolours its connectors
  to the accent.
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`), **`.mini-dot`**, mono **`.chip`**, the
  house **`.icon`** SVGs (`currentColor`, squared-node org-chart / chevron / search / expand glyphs), and the
  `--bg-deep` **footer** strip with wordmark + accent square.

## Data fields summary (full contract in [`schemas/org-chart.schema.json`](schemas/org-chart.schema.json))
- **`meta`** — shared chrome: `org`, `project`, `reportType`, `title`, `subtitle?`, `date?`, `author?`,
  `theme` (default `indigo`).
- **`orientation?`** — `"vertical"` (default, top-down) or `"horizontal"` (left-to-right).
- **`legend?`** — array of `{ status:"ok|risk|hold|neutral", label }`; falls back to a default legend if absent.
- **`root`** — the single top node. A **node** = `{ id (unique), name, role?, meta? (short), status?
  ("ok|risk|hold|neutral"), badge?, collapsed?, children?[] }`, recursing via `children`. Sample tree is
  depth 4, 17 nodes. **`#report-data` MUST be a valid instance of this schema.**

## Interactions (MANDATORY — all driven from the data / DOM, vanilla JS, ≤150ms)
- **Collapse / expand a node** — click a parent card (or its `.node-toggle`) to hide/show its subtree; the
  connectors beneath update, and a `+N` `.kid-count` shows how many children are hidden.
- **Focus subtree / reset** — click a node to **focus**: everything except that node's **ancestors + its whole
  subtree** dims (`.is-dim`), and the kept path is highlighted (`.is-path` connectors recolour); a **⟲ Reset**
  button (and clicking the focused node again) clears it.
- **Expand-all / Collapse-all** — toolbar buttons expand or collapse every node in one click.
- **Search (bonus, included)** — typing in `.tree-search` rings every node whose name/role matches
  (`.is-match`), auto-expands ancestors so matches are visible, and dims non-matches; clearing restores.
- **Hover** — node lifts subtly.
- **Print** — `@media print` renders a **fully-expanded** static snapshot: all subtrees open, focus/dim/match
  cleared, every connector drawn, and the toolbar (buttons, search, `.rc-theme`) hidden.

## Layout / section outline
```
.org
├─ .tree-toolbar      ← markmini · {{PROJECT}} title + subtitle · [⊟ ⊞ ⟲] · search · legend(ok/risk/hold/neutral) · .rc-theme
├─ .tree-canvas       ← full-bleed, centred, x-scroll when wide
│    └─ .tree (root)  ← .node(root)
│         └─ .tree-row  → .subtree per child → .node + nested .tree-row …   (CSS connectors between generations)
└─ footer strip       ← --bg-deep, mono meta, wordmark + accent square
```
The reading order is **structural, top-down**: the eye lands on the root and follows the lines outward.
There is **no TOC, no prose, no section numbering, no reading column**.

## Do / Don't
- **Do** keep a **single root** and draw **real connector lines** between every parent and child — an
  orphaned card or a missing line is a bug.
- **Do** build the whole tree from `#report-data` via `render()`; never hard-code nodes in the body.
- **Do** keep every dot, ring, and badge mapped to **`ok / risk / hold / neutral` only** — never invent a 5th state.
- **Do** keep cards **compact and rounded** (radius 11, whisper shadow) with a subtle hover lift; let the
  **lines and levels** carry the structure, not heavy boxes.
- **Do** let the canvas **scroll horizontally** for wide trees and keep the tree **centred** — never cram or cap at ≤1280px.
- **Do** show a **`+N` count** on collapsed parents so hidden depth is never silently lost.
- **Don't** wrap it in the long-form frame (top bar + both rails + prose sections), a kanban lane board, a
  matrix quadrant plane, or a gantt time axis — those are other formats.
- **Don't** render the hierarchy as an indented bullet list or a table; it must be a **drawn 2-D tree**.
- **Don't** add a hero standfirst, running body copy, or a narrative — this is a structure you trace, not a read.

## How this differs from the other formats
The **long-form report** is prose you read top-to-bottom; the **matrix-canvas** is a flat board of labelled
regions with items *placed* into them; the **timeline-roadmap** is a horizontal time axis with swimlane bars;
the **kanban-board** is vertical lanes of cards. The **org-chart** is the only **tree**: one root, generations
of sibling cards, and **drawn connector lines** expressing strict parent→child containment — and it is
**interactive** (collapse/expand, focus/reset, expand-all, search) and **data-driven** (the whole tree is built
from `#report-data`).

## Icons

Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically). Typical categories for this format: people, process, status, nav. Browse `../icons/index.html`; never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
