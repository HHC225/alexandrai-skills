# Format: Kanban board

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 8-theme palette tokens,
> the system-font type stack, the dense 13px register, rounded panels, the three semantic states
> (`ok`/`risk`/`hold`), the shared primitives, the house icon set, and the self-contained output rules.
> What this format **reinvents is its chrome and layout**: it is a *work board*, not a document.
>
> **Default theme: Teal** (`<html data-theme="teal">` is the baseline; ship the full Teal block in
> `:root` so the file renders Teal with no attribute, and keep the other 7 themes as `data-theme` swaps).

## One-line difference from long-form

The long-form report is a **read top-to-bottom** (sticky top bar → hero → 3-column article with both
rails → stacked section panels). The kanban board is a **scan-left-to-right work surface**: a slim board
bar over a horizontally-scrolling row of fixed-width **lane columns**, each a vertical stack of compact
cards. There is **no hero, no TOC, no prose flow, no reading-progress bar** — the lanes *are* the page.

## When to use

Pick the board when the story is **"where does each item sit in a flow, and what's stuck."** Items move
through ordered **stages** and you want the distribution and the blockers visible at a glance:

- delivery / defect triage boards (Backlog → Triage → In progress → Review → Done), bug or incident queues;
- sprint / engineering work (To do / Doing / Blocked / In review / Done) with WIP limits and aging cues;
- release-readiness by gate, migration cutover task walls, onboarding/case pipelines, portfolio kanban.

**Don't** use it when items have no stage (use the **data-register** grid), when numbers lead the story
(use the **dashboard**), or when time/scheduling is the point (use the **timeline-roadmap**). If you find
yourself writing paragraphs, you picked the wrong format.

## Distinct chrome — the board bar

A **slim sticky top bar** (`.board-bar`, ~52px, `--bg-band`, hairline bottom rule, whisper shadow) — NOT
the long-form hero. Left to right:

- `.board-title` — board name (`{{ORG}} · {{PROJECT}}`) with a small board glyph; a `.board-sub` mono
  eyebrow (e.g. sprint / date) underneath or inline.
- `.board-count` — a mono chip with the **total card count** ("32 cards").
- `.filter-bar` — a row of `.fchip` filter pills (All / Mine / Blocked / By label …); the active one is
  `.fchip.is-on` (filled brand). These read as *controls*, not nav links.
- `.board-meta` — right-aligned mono micro-labels (updated {{DATE}} · {{AUTHOR}}) and optional avatars.

Below the bar sits the board surface. No side rails. The chrome should feel like a Jira/Trello board
header strip, immediately telling the reader "this is a live work board."

## Distinct layout — horizontal lanes + cards

```
.board-bar  (sticky)  ── title · total count · filter chips · meta ───────────────►
────────────────────────────────────────────────────────────────────────────────
.board  (overflow-x:auto; the only horizontal scroll on the page)
  .swimlane?  (optional grouping band: e.g. "Mobile app" / "Core banking")
  .lane-row  (display:flex; gap 14–16px)
     ┌ .lane ─────────┐ ┌ .lane ─────────┐ ┌ .lane (.lane--cap) ┐ ┌ .lane ┐ ┌ .lane ┐
     │ .lane-head     │ │ .lane-head     │ │ .lane-head  · .wip │ │  …    │ │  …    │
     │   .lane-name   │ │   .lane-count  │ │   .wip[.is-over]   │ │       │ │       │
     │ .lane-body ────│ │ ───────────────│ │ ───────────────────│ │       │ │       │
     │   .kcard       │ │   .kcard       │ │   .kcard.is-blocked │ │       │ │       │
     │   .kcard       │ │   .kcard       │ │   .kcard            │ │       │ │       │
     │   .kcard …     │ │   …            │ │   …                 │ │       │ │       │
     └────────────────┘ └────────────────┘ └────────────────────┘ └───────┘ └───────┘
        Backlog            In progress         Review (WIP 3/3)       Blocked    Done
```

- **5 lanes** by default (Backlog / In progress / Review / Blocked / Done is a good defect/delivery set);
  cap at ~6 on screen — beyond that the horizontal scroll carries the rest. Each lane is **fixed width**
  (`min-width:300px; flex:0 0 300px`) so the row scrolls rather than squashing.
- **Lane = `--bg-subtle` column**, radius 12, hairline border, internal padding ~10px. A **sticky
  `.lane-head`** stays put while `.lane-body` scrolls vertically if a stack is long.
- **`.lane-body`** is a vertical flex stack, gap ~10px. Long lanes get their own `overflow-y:auto`.

## Signature components (class names)

- **`.board`** — the scroll viewport (`overflow-x:auto`, `scroll-snap-type:x proximity` optional).
- **`.lane`** — a stage column. Variants: `.lane--cap` (a lane carrying a WIP limit), `.lane--done`
  (subtle de-emphasis for the terminal lane).
- **`.lane-head`** — sticky lane header: `.lane-dot` (status hue) + `.lane-name` + `.lane-count` (mono
  chip) + optional `.wip`. Give the head a 2px top accent in the lane's hue to colour-code the stage.
- **`.wip`** — WIP / capacity cue, mono pill "2 / 3". `.wip.is-over` flips to `risk` (over limit). A
  thin `.lane-cap-bar > span` under the head visualises fill (width = data, `ok`→`hold`→`risk`).
- **`.kcard`** — the compact card: radius 11, `--bg` (#fff), hairline border, whisper shadow
  `0 1px 2px rgba(17,19,26,.045)`; hover lifts to `0 2px 6px`. **Colour-coded edge:** a 3px
  **`.kcard` left border** in the state hue (the family's "no stripe → use a left edge" affordance here
  is explicit and intended). Optional top tag instead via `.kcard-tag`.
- **`.kcard-tag`** — a top-of-card status tag pill (`.st-ok` / `.st-risk` / `.st-hold`) reusing the
  shared status-badge dot+text; sits in the card's top row beside the id chip.
- **`.kc-id`** — mono id chip on `--navy-bg` (`DEF-2241`), the shared chip primitive.
- **`.kc-title`** — 13–14px / 650 card title, max ~2 lines (`-webkit-line-clamp`).
- **`.kc-meta`** — bottom row of `.mchip` meta chips: due date (clock icon), story points, label tags;
  a `.mchip.is-due` turns `hold`/`risk` when overdue. Tiny mono, `--ink-soft`.
- **`.avatar`** — assignee initials disc (24px, brand-tinted), `.avatar-stack` overlaps several.
- **`.is-blocked`** — a card flagged blocked: `risk` left edge + a `.block-flag` row (ban/flag icon +
  "Blocked: …" reason) on `--risk-bg`. Must be **unmistakable** at a glance.
- **`.aging`** — optional aging dot/pill on cards idle too long (`hold` then `risk`).
- **`.swimlane`** — optional horizontal grouping: a `.swimlane-label` band (mono, `--bg-band`) above its
  own `.lane-row`, so the same stages repeat per group (e.g. "Mobile" vs "Core banking").
- **`.add-card`** — a dashed "+ Add card" affordance at a lane foot, to read as a live tool (decorative).

All of these **reuse the foundation primitives** (status badge dot+text, mono id chip on `--navy-bg`,
key/value micro-labels, the whisper shadow, rounded radii). Nothing here invents a new colour or shape
language — only a new *arrangement*.

## Colour & state discipline

- Lane head accents and card left edges map to the **stage's meaning**, but card-level state is always
  one of the **three semantic tokens**: `ok` (on track / done), `hold` (watch / aging / at-WIP),
  `risk` (blocked / overdue / over-WIP). Never invent a fourth.
- Brand accent (`--navy*`) is for structural chrome only: id chips, active filter pill, avatars, counts,
  the board glyph. Body text stays `--ink-mid`. No gradients on text.
- Keep elevation flat — whisper shadow only; the *density of cards* carries the energy, not drop-shadows.

## Layout outline (build order)

1. `<head>`: `meta viewport width=1280`, inline `<style>`, system fonts, full Teal `:root` + 7
   `data-theme` overrides. No external requests.
2. `.board-bar` (sticky): title + total count + filter chips + right meta.
3. `.board` viewport → optionally one `.swimlane` band → `.lane-row` with **5 lanes**.
4. Each `.lane`: sticky `.lane-head` (dot + name + count + `.wip` where relevant + `.lane-cap-bar`),
   then `.lane-body` with **3–6 `.kcard`s**; include at least one `.is-blocked` card and one `.aging`.
5. `@media print`: unstick the board bar and lane heads, allow lanes to wrap (`flex-wrap:wrap`) so the
   board prints as tiled columns; white footer band.
6. Optional inline `<script>` (≤ a few lines) only to make filter chips toggle a `.is-on` class /
   hide cards — **content must read fully with JS off**.

## Do / Don't

- **Do** make it look like a board on first glance: fixed-width lanes, a real horizontal scrollbar,
  dense rounded cards, sticky lane heads, counts + WIP on every lane.
- **Do** colour-code the card **left edge** (or a top `.kcard-tag`) to the tri-state, and flag blocked
  cards loudly with a reason row.
- **Do** keep cards scannable: id chip + ≤2-line title + assignee avatar + 2–4 meta chips. That's it.
- **Don't** wrap this in the long-form chrome — no sticky side rails, no TOC, no hero, no standfirst.
- **Don't** write paragraphs inside a card or anywhere on the board; **don't** exceed ~6 visible lanes
  before relying on scroll; **don't** add a fourth state colour or any gradient/heavy shadow.

## Exemplar

`sample/kanban_board_sample.html` — a fictional delivery/defect board: 5 lanes (Backlog · Triage ·
In progress · Review · Done) with per-lane counts + WIP limits, compact cards (id chip, status tag,
assignee avatar, due/points/label meta), a visibly flagged **blocked** card, an aging cue, and an
optional swimlane split (Mobile vs Core banking). Teal default with live `data-theme` swaps.

## Data schema

Full field contract: [`schemas/kanban-board.schema.json`](schemas/kanban-board.schema.json)
(JSON Schema draft 2020-12, includes a realistic `examples[0]` instance).

**Required top-level fields:** `meta`, `lanes`, `cards`

| Field | Required | Description |
|:--|:--|:--|
| `meta` | yes | Shared chrome: org, project, reportType, title, date, theme (default `teal`) |
| `lanes[]` | yes | Ordered stage columns. Each lane: `id`, `name`; optional `wipLimit`, `isDone` |
| `swimlanes[]` | no | Optional horizontal grouping bands. Each: `id`, `name` |
| `cards[]` | yes | Work items. Each card: `id`, `title`, `lane`, `status` (`ok`/`risk`/`hold`); optional `swimlane`, `cardType`, `assignee`, `tags[]`, `due`, `points`, `blocked`, `blockReason`, `prRef` |

## Icons

Icons are inline SVG from [`../icons/`](../icons/) — no external requests.

Relevant icon categories for this format:

- **process** — board glyph in the `.board-mark`; lane-head accent dots
- **status** — `.kcard-tag` (Story / Defect / Chore / Done check); `.is-blocked` ban/flag icon; aging cues
- **people** — `.avatar` assignee initials discs; `.board-meta` author avatars
- **time** — due-date clock `.mchip` on cards; `is-due` overdue cue; `.board-sub` sprint date
