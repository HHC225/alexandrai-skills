# Format: Bracket (tournament knockout)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** and the interactive, data-driven,
> themeable, PC-wide contract from [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md) — the 9-theme palette tokens
> (Black mandatory), the system-font type scale, rounded panels, whisper shadows, the
> `st-ok / st-risk / st-hold` semantics, the shared chip / badge / dot primitives, the house SVG icons,
> the self-contained output rule, the `#report-data` JSON-as-only-source rule, the `.rc-theme` dropdown
> switcher, and the mandatory-interaction rule. It **reinvents only the chrome and layout**: where the
> org-chart is a top-down tree and the leaderboard is a flat ranking, this one is a **knockout dependency
> graph that converges left → right to a single champion** — rounds laid out as columns, match cards with
> seeds and scores, drawn connector elbows, and pick-to-advance.
>
> **Default theme: Plum** (`<html data-theme="plum">`; `:root` still ships Purple, the Plum block overrides).

## One-line difference from the others
A **tournament bracket** — knockout rounds drawn as **columns converging left→right to one champion**,
each match a card of two competitor rows (seed, name, score) with the **winner highlighted** and the
**loser dimmed**, **connector elbows** wiring each winner into its next-round match, and a **pick-a-winner**
control that advances undecided matches live. It is **not** an org-chart (a single root fanning *out*
top-down into children — the bracket runs the other way, many competitors *converging in* to one winner),
and **not** a leaderboard (a flat ranked standings table — a bracket is a path-dependent elimination graph,
not an ordering).

## When to use
Reach for this when the deliverable is a **single-elimination (or double-elimination) knockout** and the
reader's question is *"who beat whom, who advances, and who is the champion?"* — answerable by tracing
winners rightward, not by reading a ranking or a tree. Typical artefacts:

- a **vendor bake-off** / RFP shoot-out narrowed round by round to one selected vendor;
- a **design / architecture competition** or **internal hackathon** played as a cup;
- an **A/B/n option tournament** (candidate options paired off, winners advancing on a score);
- a **sports-style cup** (Round of 16 → QF → SF → Final).

If the deliverable is a *standings ordered by one number* use **leaderboard**; a *parent→child hierarchy*
use **org-chart**; *options graded on weighted criteria* use **comparison-grid** or **scorecard**. **No
other format is a bracket** — this is the only one with rounds-as-columns, match cards, and winner
connectors converging to a champion slot.

## The DISTINCT chrome (this is what makes it a bracket, not a board, tree, or document)
A **slim top toolbar over a full-bleed, pannable / zoomable bracket canvas** — never a thin top bar +
both-side sticky rails + stacked prose sections, never a lane board, never a top-down tree.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ⛬ {{PROJECT}} Cup · SINGLE-ELIM · [Round ▾] · [Highlight competitor ▾] · ⟲ Reset · +/− · ◷ theme │ ← .bk-toolbar
├──────────────────────────────────────────────────────────────────────────┬─────────────┤
│  ROUND OF 16     QUARTERFINALS     SEMIFINALS     FINAL                    │  MATCH      │ ← .bk-side
│  ┌──────────┐                                                             │  ┌────────┐ │   (detail
│  │① Nimbus 87│┐                                                           │  │ seeds  │ │    panel)
│  │⑯ Beacon 54│┘── ┌──────────┐                                            │  │ score  │ │
│  └──────────┘     │① Nimbus  │┐                                           │  │ status │ │
│  ┌──────────┐  ┌──│⑧ Vela    │┘── ┌──────────┐         ┌──────────┐       │  │ venue  │ │
│  │⑧ Vela 71 │┘  │ └──────────┘    │① Nimbus  │┐        │ ◆ CHAMP  │       │  │ time   │ │
│  │⑨ Forge 66│   │                 │④ Atlas   │┘──┐  ┌──│  Nimbus  │       │  └────────┘ │
│  └──────────┘   …connector elbows (SVG, computed)  │  │ └──────────┘ ← .bk-champion      │
└──────────────────────────────────────────────────────────────────────────┴─────────────┘
        rounds = columns, converging LEFT → RIGHT to one champion slot at the far right
```

1. **`.bk-toolbar`** — one slim sticky bar (NOT a hero/standfirst): a `.bk-mark` cup/award glyph + the
   `{{PROJECT}}` title + a terse `.bk-sub`; a **single|double-elimination indicator** chip; a **round
   filter / zoom-to-round** `<select>`; a **"highlight a competitor's path"** `<select>` listing every
   competitor; a **⟲ Reset** button (restores the data state — undoes picks, clears highlight/filter); a
   **zoom** cluster (**+ / −**, percent readout); and the standard **`.rc-theme`** dropdown. One line — the
   canvas carries the meaning.
2. **`.bk-canvas`** — a **full-bleed** plotting surface (`--bg-subtle`, faint dotted texture) that **pans
   by drag** and **zooms** (wheel + buttons). Inside it a transformed **`.bk-stage`** holds the rounds. The
   bracket is wide by design; the canvas is the viewport, the stage is translated/scaled. Never cap at
   ≤1280px — this is a `viewport width=1440`, full-bleed format.
3. **`.bk-round`** — each round is a **column** (`.bk-round` with a `.bk-round-head` label + count). Match
   cards in a column are spaced so that **each adjacent pair converges into one card** in the next column
   (next-round slot = `floor(slot/2)`); later columns have fewer, taller-spaced cards. The vertical centre
   of a next-round card sits at the midpoint of the two cards that feed it.
4. **`.bk-match`** — the match card: two competitor rows (**`.bk-side`** each = `.bk-seed` chip + name +
   `.bk-score`). The winner row gets **`.is-winner`** (accent text + a left accent rail + a check), the
   loser **`.is-loser`** (dimmed to `--ink-faint`). A `.bk-status` dot marks done / live / scheduled.
   `scheduled` cards (undecided) carry a **`.bk-pick`** control (pick a side to advance).
5. **`.bk-connector`** — a single inline **`<svg>` overlay** sized to the stage, holding one computed
   **`<path>` elbow per match→feedsInto edge** (a stub right from the winner side, a vertical run, a stub
   into the next card). Paths are **recomputed at render time and on every layout / zoom change** from the
   live card positions — never hard-coded pixels in the data. A highlighted path recolours its edges to the
   accent.
6. **`.bk-champion`** — a distinct card at the far right (a **`.bk-rail` / champion slot**) showing the
   computed champion (final's winner) with the cup glyph; empty/"TBD" until the final resolves.
7. **`.bk-side` (detail panel)** — a right-hand mini-panel surfacing the selected match: both competitors
   (seed, name, detail), the score, the status badge, scheduled time and venue, and any note.

## Signature components (class names to use)
- **`.bk-shell`** — the root app shell (full-viewport, flat `--bg-band`; toolbar + canvas + side panel).
- **`.bk-toolbar`** › `.bk-mark` (house cup/award svg), `.bk-title` + `.bk-sub`, the **`.bk-elim`** indicator
  chip, `.bk-roundsel` (round filter / zoom-to-round), `.bk-pathsel` (highlight-competitor), the
  `.bk-zoom` cluster (`data-zoom="in|out|reset"` + `.bk-zoom-val`), `data-act="reset"`, and **`.rc-theme`**.
- **`.bk-canvas` / `.bk-stage`** — the pan/zoom viewport and its transformed inner stage; connector `<svg>`
  lives inside `.bk-stage` behind the cards.
- **`.bk-round` / `.bk-round-head` / `.bk-round-col`** — a round column, its header label + match count, and
  the vertical stack of cards. `.bk-round.is-dim` (round filter) drops other rounds back.
- **`.bk-match`** — the match card (radius 11, whisper shadow). Holds two **`.bk-side`** rows
  (`.is-winner` / `.is-loser` / `.is-empty`), each with **`.bk-seed`** (squared seed chip), name, and
  **`.bk-score`** (tnum). A **`.bk-status`** dot (`is-done` / `is-live` / `is-scheduled`); `.is-live` cards
  get a soft pulse. `.bk-match.is-sel` rings the selected card; `.bk-match.is-path` lights a card on the
  highlighted competitor's road; `.bk-match.is-dim` recedes off-path/off-round cards.
- **`.bk-pick`** — on `scheduled` cards: two small buttons ("advance A" / "advance B") that seed the
  competitor into the next-round match LIVE and redraw connectors.
- **`.bk-connector`** — the inline `<svg>` elbow layer (one `.bk-edge` path per feeds-into; `.is-path` /
  `.is-dim` recolour). Geometry computed from card rects each render.
- **`.bk-champion` / `.bk-rail`** — the champion slot at the far right (cup glyph, name, "from the Final").
- **`.bk-side` panel** — the selected-match detail (`.bk-detail` rows; key/value grid for time/venue;
  `.st-badge` for status). An empty state prompts "Select a match".
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold` mapped to done/live/scheduled tones as
  appropriate), **`.mini-dot`**, mono **`.chip`** (seed/round chips), the house **`.icon`** SVGs
  (`currentColor`: a monoline **cup/award**, chevrons, search/filter, plus/minus, check), and the
  `--bg-deep` **footer** strip with wordmark + accent square.

## Data fields summary (full contract in [`schemas/bracket.schema.json`](schemas/bracket.schema.json))
- **`meta`** — shared chrome: `org`, `project`, `reportType`, `title`, `subtitle?`, `date?`, `author?`,
  `theme` (default `plum`).
- **`format`** — `"single"` (default) or `"double"`. Double adds a lower / consolation band: rounds carry
  `bracket:"lower"` and the renderer lays them beneath the upper bracket. The sample is single-elim, but the
  schema + renderer must not break for double.
- **`scoreUnit?`** — short label for what a score means (e.g. `pts`), shown in tooltips / detail.
- **`rounds[]`** — `{ id, name, order, bracket? }`, ordered first round (`order:0`, left-most) → final
  (right-most). Each round = one column.
- **`matches[]`** — `{ id, roundId, slot, a, b, winner?, status, feedsInto?, time?, venue?, note? }`, where a
  **side** = `{ seed?, name?, score?, detail? }` (empty side = awaiting an upstream winner). `slot` (0-based,
  top-to-bottom) drives vertical placement so pairs converge (`feedsInto` slot = `floor(slot/2)`). `winner`
  is `"a"|"b"`; `status` is `done|live|scheduled`. The **champion is COMPUTED** from the final's winner — it
  is not a data field. **`#report-data` MUST be a valid instance of this schema.**

## Interactions (MANDATORY — all driven from the data / DOM, vanilla JS, ≤150ms)
- **Click a match → detail panel + highlight** — clicking any `.bk-match` fills the `.bk-side` panel
  (competitors, score, status, time, venue, note) and rings the card (`.is-sel`).
- **Highlight a competitor's path** — the `.bk-pathsel` select lists every competitor; choosing one lights
  **every match on their road to the final** (`.is-path`) and recolours those connector edges to the accent;
  if they won the final, the champion slot lights too. Non-path cards/edges dim. Re-selecting "—" clears.
- **Pick a winner → advance live** — on each `scheduled` match the `.bk-pick` buttons advance the chosen
  side: the competitor is **seeded into the next-round match** (`a` or `b` by slot parity along
  `feedsInto`), that card re-renders, the **connectors recompute**, and the change can cascade toward the
  champion. The **⟲ Reset** button restores the original data state (undoing all picks).
- **Pan (drag) & zoom (+/− / wheel)** — dragging the canvas pans the stage; the zoom buttons and the mouse
  wheel scale it (clamped), with a live percent readout. Connector geometry **recomputes on every transform
  / layout change** — never hard-coded.
- **Round filter / zoom-to-round** — the `.bk-roundsel` dims (or focuses) all but the chosen round so a
  single column reads clearly; "All rounds" restores.
- **Hover tooltips** — hovering a competitor row or a connector shows the **exact** seed, name and score (and
  `scoreUnit`); never faked.
- **Theme switcher** — the standard `.rc-theme` dropdown recolours live; initial theme = `meta.theme`.

In **print**, render a **complete static snapshot** of the full bracket at the data state (stage reset to
fit, all rounds visible, champion drawn, every connector drawn) and **hide** the toolbar controls, the
pick/zoom affordances, the side panel's interactive bits, and the `.rc-theme` switcher.

## Layout / section outline
```
.bk-shell
├─ .bk-toolbar     ← .bk-mark · {{PROJECT}} title + sub · SINGLE|DOUBLE chip · round filter · highlight-competitor · ⟲ reset · +/− zoom · .rc-theme
├─ .bk-canvas      ← full-bleed, pan + zoom
│   └─ .bk-stage   ← transformed; holds the connector <svg> + the round columns + champion slot
│        ├─ .bk-connector (svg)   ← computed elbow paths, drawn behind the cards
│        ├─ .bk-round × N         ← columns left→right: R16 → QF → SF → Final
│        │     └─ .bk-match …      ← two .bk-side rows (winner/loser), status dot, pick control
│        └─ .bk-champion          ← far-right champion slot (cup glyph, computed winner)
├─ .bk-side        ← selected-match detail panel (competitors · score · status · time · venue · note)
└─ footer strip    ← --bg-deep, mono meta, wordmark + accent square
```
The reading order is **left → right by round**: the eye lands on the first round and follows winners along
the connectors to the champion. There is **no TOC, no prose, no section numbering, no reading column**.

## Do / Don't
- **Do** lay rounds out as **columns converging left→right** and draw a **real connector elbow** from every
  match's winner into its `feedsInto` match — a missing edge or a floating card is a bug.
- **Do** **compute** the champion from the final's winner and **compute** connector geometry from live card
  positions at render time; never store pixel positions or the champion in the data.
- **Do** highlight the **winner** row with the accent and **dim the loser** to `--ink-faint`; keep done /
  live / scheduled mapped to the status dot only.
- **Do** make pick-a-winner actually mutate working state (seed the next round, redraw connectors) and make
  **⟲ Reset** restore the original data — never fake the advance.
- **Do** keep the canvas **pannable + zoomable** and full-bleed; recompute connectors on every transform.
- **Do** keep the renderer safe for `format:"double"` (lower-bracket band) even though the sample is single.
- **Don't** render it as a **top-down tree** (org-chart) or a **flat ranking** (leaderboard) — convergence to
  a champion, match cards, and seeds/scores are the bracket's identity.
- **Don't** wrap it in the long-form frame (top bar + both rails + prose sections), a kanban lane board, a
  matrix quadrant, or a gantt time axis.
- **Don't** use a trophy **emoji** — draw a monoline cup/award icon. Don't invent a 4th semantic colour.

## Icons
Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically). Typical
categories for this format: **process** (flow-arrow, fork-path, merge-path, gate-check, milestone),
**status** (check, check-circle, flag, dot-ok/-risk/-hold), **nav** (chevron-right, chevron-down, search,
filter, plus, minus, arrow-right), **data** (target). The champion mark is a **monoline cup / award** drawn
to [`../icons/SPEC.md`](../icons/SPEC.md) — never an emoji or a generic "AI" glyph.
