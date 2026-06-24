# Format: Infographic (vertical visual-narrative poster)

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 8-theme palette tokens, the
> system-font stacks, rounded panels, whisper-flat elevation, the three semantic states
> (`ok` / `risk` / `hold`), `tnum` numerals, the shared primitives (`.st-badge`, `.chip`, mono tracked
> labels, the `--bg-deep` footer), and the self-contained output rules (§0). **Default theme: Green**
> (`<html data-theme="green">`; `:root` may ship Green here, not Purple).
> What this format reinvents is its **chrome and layout**: there is no top bar, no TOC, no sticky rails,
> no stacked prose sections. **The page is one tall poster, told through graphics.**

---

## One-line difference from long-form
Long-form is a *document you read top-to-bottom* (thin top bar → hero/standfirst → 3-column TOC + prose +
rail → stacked section panels). The infographic is a *single scrolling poster you look at* — oversized
numbers and CSS/SVG-drawn diagrams stacked inside full-bleed coloured bands, with captions instead of
paragraphs. If it reads as paragraphs, it's wrong.

## When to use
When **the message *is* the numbers and the shape of the story**, and the artefact will be glanced at,
screenshotted, or projected rather than read line by line:

- a "**state of X 2026**" / "**by the numbers**" headline summary
- an adoption / conversion **funnel**, a maturity or value **pyramid**, a **process** explainer, a
  continuous-improvement / lifecycle **cycle**
- ESG / sustainability stat sheets, market-sizing one-sheets, programme-impact recaps, survey readouts
- anything where one big number per idea, plus one drawn diagram, beats a page of prose

Reach for a different format if the reader needs an audit trail, narrative argument, or recommendations
(**long-form**), a glanceable live ops view (**dashboard**), or queryable records (**data-register**).

---

## Distinct chrome — a full-bleed banded vertical poster
This format must be **unmistakably an infographic poster**, not an article. Four structural commitments:

1. **Full-bleed coloured bands, not a centred reading column.** The page is a vertical stack of
   `100vw` **`.band`** strips, each edge-to-edge, each with its OWN background — alternating
   `white → --bg-band → a tinted brand band (--navy-bg) → one dark --bg-deep band`. Content inside each
   band is held to a poster measure by an inner **`.band-inner`** (`max-width ≈ 1040px`, centred). The
   alternating bands are the silhouette: scrolling feels like walking down a printed poster, stage by
   stage. There is no header bar and no side rail.

2. **Oversized numbers lead every stage.** Each band opens (or is built around) **huge `tnum` figures**
   (`.bignum`, `64–140px / 800`) — the number is the headline; a single tracked label and one caption
   line support it. Type is scaled UP from the family's dense 13px base (this format, like presentation,
   is a deliberate exception): section kickers are big, captions are `13–15px`, and prose never grows
   past a sentence or two per visual.

3. **The body is CSS/SVG-drawn data primitives, not text.** Every visual is hand-drawn with CSS or inline
   `<svg>` — **no chart libraries, no images** (per §0) so it prints and ports. The vocabulary is a fixed
   set of poster diagrams: a **process flow**, a **funnel**, a **pyramid** *or* a **cycle**, a
   **comparison** block, and **stat bursts**. Each is its own band stage; a single accent-coloured
   diagram dominates the band, framed by generous-but-controlled whitespace.

4. **Vertical rhythm = narrative.** Bands read as an ordered story (hero → process → funnel →
   pyramid/cycle → comparison → close + source), separated by full-bleed colour changes rather than
   panel borders. A thin **`.band-kicker`** (mono, tracked, uppercase, numbered like `01 / THE FUNNEL`)
   names each stage; an optional centred **`.band-rule`** (short brand bar) sits under it.

Big, confident, visual: aim for *poster*, never *page*.

### Layout outline
```
.poster                               ← full-bleed wrapper, 100vw, vertical stack of bands
├─ .band.band--hero      (white)      ← eyebrow {{ORG}} · {{PROJECT}} · {{REPORT_TYPE}}
│                                       oversized title + 2–3 .stat-burst (big tnum + label + delta)
├─ .band.band--tint   (--navy-bg)     ← 01 · THE PROCESS — horizontal .proc-flow of numbered steps
├─ .band                 (white)      ← 02 · THE FUNNEL  — tapering .funnel of stages w/ % drop-off
├─ .band.band--soft   (--bg-band)     ← 03 · THE PYRAMID / THE CYCLE — layered .pyramid OR ring .cycle
├─ .band.band--deep   (--bg-deep)     ← 04 · THE COMPARISON — dark .compare two-column then/now or A/B
├─ .band                 (white)      ← 05 · THE TAKEAWAY — one .stat-burst + one short .lede line
└─ footer.poster-foot (--bg-deep)     ← wordmark + accent square, mono meta, .source-note footnotes
```
Order is narrative-spatial: the eye falls down the poster, one stage per band. **No TOC, no section
panels, no reading column.**

---

## Signature components (class names)
- **`.poster`** — the full-bleed root (`width:100vw`, vertical flex/stack). Owns the type up-scale.
- **`.band` (+ `.band--hero` / `.band--tint` / `.band--soft` / `.band--deep`)** — a `100vw` full-bleed
  stage with its own background (white / `--navy-bg` tint / `--bg-band` / `--bg-deep` dark). Generous
  vertical padding (`56–96px`). `.band--deep` flips text to light ink (`--bg`/light) — the one inverted
  stage, echoing the family footer.
  - **`.band-inner`** — centred poster measure (`max-width ≈ 1040px`, side gutters); all content lives here.
  - **`.band-kicker`** — mono, tracked `.12em`, uppercase, `--ink-faint` (light on dark bands), numbered
    `01 / THE FUNNEL`. **`.band-head`** — the big stage title (`24–34px/800`). **`.band-rule`** — short
    centred brand bar (`--navy`) under the kicker.
- **`.stat-burst`** — the hero/takeaway atom: a **`.bignum`** (oversized `tnum`, `64–140px/800`, may take
  `.ok/.risk/.hold` to recolour), a `.bignum small` unit, a tracked mono `.burst-label` under it, and an
  optional one-line `.burst-note` + a `.delta.up/.down` (▲/▼ in `ok`/`risk`). Hero band holds 2–3 side by
  side (`.burst-row`).
- **`.proc-flow` › `.proc-step`** — a **horizontal CSS process flow**: numbered nodes (`.proc-n`, a
  brand-filled rounded square/disc with a mono index) joined by **`.proc-arrow`** connectors (CSS/▸ or a
  drawn SVG chevron). Each step = `.proc-t` (title) + `.proc-d` (one caption line). Wraps to rows on
  narrow widths; a coloured baseline ties the run together.
- **`.funnel` › `.funnel-row`** — a **tapering stack**: each row's `width` shrinks down the funnel
  (`style="--w:78%"`), brand-tinted fills deepening or lightening by stage, a stage label + a right-aligned
  mono **`.fn-v`** value, and an optional **`.fn-drop`** (% lost to the next stage) in the gap. Centred,
  symmetric taper — reads as a real funnel, not a bar chart.
- **`.pyramid` › `.pyr-tier`** — a **layered pyramid** of stacked trapezoid/▲ tiers (top narrow → base
  wide via `clip-path` or width steps), each tier a brand shade with a centred label + mono value; use for
  hierarchy / maturity / value tiers. (Provide **either** this **or** the cycle in a given poster.)
- **`.cycle` › `.cycle-node`** — a **continuous cycle**: 3–5 nodes positioned around a ring (CSS
  `position`/transform on a square, or an inline `<svg>` circle) joined by curved **`.cycle-arrow`**
  connectors; centre holds a label/`.bignum`. Use for lifecycle / continuous-improvement loops.
- **`.compare` › `.compare-col`** — a **two-column comparison** (Then ↔ Now, A vs B, Target vs Actual):
  two stacked stat columns with a centred **`.compare-vs`** divider (a "vs" / arrow chip), each column a
  `.bignum` + label + 2–3 mono `.compare-row` figures; a leading `.st-badge` may flag the winner.
  Renders well on the dark `.band--deep` stage.
- **`.source-note`** — small mono footnote(s) in the footer band crediting fictional data sources / methods
  (`Source: … · {{DATE}}`). Reuses the family footer voice.
- Reused primitives: **`.st-badge`** (`.st-ok/.st-risk/.st-hold`, dot + text), mono **`.chip`** for tags/refs,
  the **`--bg-deep` footer** with wordmark + accent square, the mini status dot. Inline house SVG icons
  (`arrow-right`, `chevron-right`, `bar-chart`, `check-circle`, `cycle`/`funnel`) per `../icons/SPEC.md`,
  sized with `.icon` (`currentColor`, so they recolour inside `ok/risk/hold` contexts).

---

## Do / Don't
- **Do** make **full-bleed alternating bands** the silhouette — white / tint / soft / one dark — so the
  poster reads as stages, not stacked cards.
- **Do** let **one oversized `tnum` number** own each stage and keep prose to a caption sentence.
- **Do** draw **every visual in pure CSS/SVG** (no chart libs, no images) so it prints and ports (§0).
- **Do** scale type UP and keep whitespace generous **but controlled** — confident, not sprawling.
- **Do** map every fill, arrow, badge, and burst to the brand accent or `ok / hold / risk` only.
- **Don't** wrap the poster in a top bar, side rail, TOC, or stacked prose sections — that is long-form.
- **Don't** centre everything in a narrow reading column or write paragraphs; bands are full-bleed, copy is captions.
- **Don't** use emoji or pictographs (BAN list) — only the house marks and the diagram primitives above.
- **Don't** invent a 4th status colour, add gradients to text, or reach for a charting library.

## Exemplar
`sample/infographic_sample.html` — **"The State of Digital Onboarding 2026"** (Green theme): a hero with
3 oversized stat bursts, a 4-step `.proc-flow`, a 5-stage `.funnel` with drop-off, a value `.pyramid`, a
dark `.band--deep` Then-vs-Now `.compare`, a closing takeaway burst, and a `.source-note` footnote — all
inside full-bleed alternating bands.

## Data schema

Full field contract: [`schemas/infographic.schema.json`](schemas/infographic.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome — `org`, `project`, `reportType`, `title`, `date`, `theme` (default `"green"`). Optional: `subtitle`, `author`, `chips[]` (hero eyebrow pills). |
| `bands` | array | Ordered poster bands. Each band: `id`, `kind` (`hero`\|`stat`\|`process`\|`funnel`\|`pyramid`\|`cycle`\|`compare`\|`takeaway`). Optional: `bg` (`white`\|`tint`\|`soft`\|`deep`), `kicker`, `heading`, `subtext`, `items[]`, `stats[]`. |

**Optional top-level fields:** `source.notes[]` — footer source / methodology footnote lines.

**Band `items[]` shape by kind:** `process` → `{n, title, desc, stat}`; `funnel` → `{label, sublabel, value, widthPct}` interleaved with `{dropLabel}` separators; `pyramid` → `{label, sublabel, value}`; `cycle` → `{label, desc}`; `compare` → two objects `{tag, bignum, unit, caption, rows[], state?}`.

**Band `stats[]` (hero/stat/takeaway):** `{bignum, unit, label}`. Optional: `note`, `delta`, `deltaDir` (`up`\|`down`), `state` (`ok`\|`hold`\|`risk`).

## Icons

Icons are drawn inline from the house icon set at [`../icons/`](../icons/) per `../icons/SPEC.md`. Infographic-relevant categories:

- **`data`** — bar-chart, funnel, arrow-right (proc-flow connectors)
- **`math-units`** — percentage, currency, numeric units for stat bursts
- **`status`** — check-circle (ok), warning (hold/risk), delta arrows (up/down)
- **`science-rnd`** — cycle/loop, pyramid/layers, process-step nodes

Use `currentColor` so icons recolour automatically inside `ok` / `hold` / `risk` contexts and across all 9 brand themes.
