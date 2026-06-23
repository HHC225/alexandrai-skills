---
version: beta
name: Dense Institutional Report System
description: >-
  Brand-neutral design system for institutional HTML deliverables, rebuilt around a dense,
  compact, rounded-panel aesthetic with a thin sticky top bar and BOTH-side sticky rails
  (left TOC + right metadata rail). The register is a signed-off institutional publication —
  small and tightly packed, not an airy web dashboard. The look is anchored to a real
  reference report (a Genesis bug-analysis report): 13px body, rounded section panels with
  header bands, a 3-column content grid, system fonts (no web-font dependency), and a single
  swappable brand accent (8 presets — Blue default, plus Purple, Indigo, Teal, Cyan, Green,
  Plum, Slate) extended with a deeper "cleared / approved" accent in the same hue, plus three
  desaturated states (ok / risk / hold). The system is MULTI-FORMAT: a shared visual DNA
  (palette, type, density, rounded shapes, primitives, icons) is inherited by a family of
  STRUCTURALLY DIFFERENT document formats (long-form report, dashboard console, data register,
  kanban board, gantt roadmap, presentation deck, one-pager, portfolio, infographic poster,
  matrix canvas, magazine feature) — each with its own chrome and a matching sample. Ships a
  bespoke SVG icon library (icons/) — never generic "AI" iconography. Organisation / project
  names are supplied at render time via {{ORG}} / {{PROJECT}} placeholders.

colors:
  # Surface / page
  bg:        "#ffffff"   # pure white page
  bg-band:   "#f6f6f8"   # cool light section band (header strips, meta)
  bg-subtle: "#fafafb"   # softer tint for nested / expanded surfaces
  bg-deep:   "#15131a"   # near-black footer / dark code+diff panels
  rule:      "#dcdce2"   # primary 1px border
  rule-soft: "#ebebef"   # secondary hairline divider

  # Ink (text)
  ink:       "#11131a"   # primary text / titles
  ink-mid:   "#33363f"   # body prose
  ink-soft:  "#5a5e68"   # secondary
  ink-faint: "#868b95"   # labels, metadata

  # Brand accent — single swappable brand colour (Blue default; see Brand presets).
  # Token stays named `navy` so a rebrand changes only values, never selectors.
  navy:      "#0b5fd4"
  navy-deep: "#0842a0"   # hover / pressed / internal-mode headings
  navy-bg:   "#e8f1fc"   # tinted chip / link / callout background
  navy-line: "#bcd6f5"   # accent-tinted border for chips / cards

  # "Cleared / approved" accent — deeper low-chroma shade of the SAME hue
  ok:        "#1a4f9c"
  ok-bg:     "#e9f0fa"
  ok-line:   "#b7cdea"

  # Semantic tri-state — CONSTANT across all 8 brand presets
  risk:      "#b3261e"   # blocker / violation — desaturated red
  risk-bg:   "#fbeceb"
  risk-line: "#edc7c4"
  hold:      "#8a6d00"   # pending / conditional — dark amber
  hold-bg:   "#fbf3da"
  hold-line: "#e7d8a4"

typography:
  # System fonts only — no web-font request; instant render, perfect portability.
  font-sans: '-apple-system,"Segoe UI",system-ui,Roboto,"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic UI","Apple SD Gothic Neo","Malgun Gothic","PingFang SC","Microsoft YaHei","Noto Sans CJK JP","Noto Sans CJK KR","Noto Sans CJK SC","Noto Sans JP","Noto Sans KR","Noto Sans SC","Noto Sans",sans-serif'
  font-mono: 'ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace'
  base:        { size: 13px,   line: 1.6,  weight: 400 }   # the signature dense body
  hero-title:  { size: 25px,   line: 1.28, weight: 800, tracking: -0.01em }
  section-h2:  { size: 16px,   line: 1.25, weight: 800, tracking: -0.01em }
  card-title:  { size: 14px,   line: 1.4,  weight: 700 }
  body:        { size: 13px,   line: 1.7 }
  small:       { size: 12px,   line: 1.55 }
  micro-label: { size: 10px,   line: 1.4,  weight: 700, tracking: 0.08em, transform: uppercase, font: mono }
  stat:        { size: 30-48px, weight: 800, feature: '"tnum" 1' }

spacing:
  page-max-3col:  1720px   # long-form / wide formats (TOC + body + rail)
  page-max-prose: 1180px   # narrower single-column formats
  gutter:         40px     # desktop horizontal padding (24px on mid screens)
  toc-width:      208px    # sticky left rail
  rail-width:     244px    # sticky right metadata rail
  col-gap:        40px     # content grid column gap
  section-gap:    18px     # vertical gap between section panels
  panel-pad:      "13-24px"
  scroll-margin:  84px     # anchor offset under the sticky top bar
  breakpoint-md:  1280px   # below: right rail drops, grid → 2-col
  breakpoint-sm:  1000px   # below: single column

rounded:
  # Rounded-panel shape language (this REPLACES the old "square everywhere" rule).
  panel: 12px   # section panels
  card:  10px   # nested cards, rail card 14px
  chip:  6px    # badges, pills, ref chips
  inset: 5px    # small inset chips, gutters
  node:  2px    # mono numeric chip, icon signature node (rx≈1.2 at 24px)
  dot:   9999px # status dot
---

# Dense Institutional Report System — Design System

This DESIGN.md is the **shared visual identity** for institutional HTML deliverables. It is
brand-neutral — the organisation and project names are supplied at render time
(`{{ORG}}` / `{{PROJECT}}`) and the brand colour is one of eight swappable presets (Blue
default). It was rebuilt to match a real **reference report** (a Genesis bug-analysis report):
a **thin sticky top bar**, a **compact hero**, a **3-column content grid with BOTH side rails
sticky** (left TOC + right metadata rail), **rounded section panels with header bands**, a
**dense 13px body**, and **system fonts**. The register is "small, dense, signed-off
publication" — tightly packed, never an airy web dashboard.

> **The canonical reference.** The look is anchored to
> `bug-analysis-harness/.../bug_report_…_itb-abscg010c-abscg01.html` (Purple preset). The
> **long-form report** format reproduces it exactly; see [`designs/long-form-report.md`](designs/long-form-report.md)
> and the compact build contract in [`designs/_FOUNDATION.md`](designs/_FOUNDATION.md).

## Overview

**Register.** A dense, institutional publication — letterhead-grade, signed-off. Information is
packed tightly (13px body, compact paddings, rounded panels) so a reader sees a lot at once
without the page feeling like a SaaS dashboard. Every numeric claim points at a reference chip.

**Self-contained by default.** These deliverables are forwarded to client reviewers,
executives, and regulators as a **single `.html` file** — CSS inlined in one `<style>`, icons
inlined as `<svg>`, **no external requests** (system fonts, no CDN). The only permitted external
scripts are Mermaid + svg-pan-zoom, and only when a Mermaid diagram is actually drawn.

**Brand discipline.** Two-colour brand system — one swappable accent (`navy`, Blue default) plus
black — extended with a deeper same-hue "cleared / approved" accent (`ok`). Three desaturated
semantic states (`ok` / `risk` bordeaux / `hold` amber) are the only colours that carry meaning;
`risk` + `hold` are constant across all presets. A single non-brand exception exists for
document-type pills in reference lists (see § Colors).

**Multi-format.** This is NOT one skeleton reskinned. A shared DNA (palette, type, density,
rounded shapes, primitives, icons) is inherited by a family of **structurally different document
formats** — each with its own chrome, navigation, and layout (see § Format families). The
long-form report is the anchor; every other format MUST look like a different *kind* of artefact.

**Iconography.** A bespoke SVG icon library lives in [`icons/`](icons/) — monoline, 24-grid,
`currentColor`, themed automatically. **Generic "AI-assistant" icons and emoji are banned**
(see § Iconography and [`icons/SPEC.md`](icons/SPEC.md)).

**Print.** Layouts degrade cleanly to A4 / Letter. `@media print` hides sticky chrome, pads the
hero down, and whitens the footer. The presentation format prints one slide per landscape page.

## Assets & runtime behaviour

**Self-contained, always.** Every deliverable is one `.html` with its CSS in a single inline
`<style>`, icons inlined as `<svg>`, and behaviour in one inline `<script>` — **no external
requests** (system fonts; no CDN), exactly like the reference report and every `sample/` exemplar.
There is no shared linked stylesheet; each report carries only what it needs. (The old linked
`assets/report.css` + `report.js` + `inline.py` workflow was **removed** — it served the previous
square / letterhead look, which this spec replaces. Data-driven formats embed their content as a
`#report-data` JSON block + an inline render/runtime script; see `designs/_DATA_DRIVEN.md`.)

The brand colour is selected with one attribute on `<html>`: omit for **Blue** (default), or set
`data-theme="purple|indigo|teal|cyan|green|plum|slate|black"` (see § Brand presets). Put the full
default token block in `:root`; add each preset as an `html[data-theme="…"]{ … }` override.

Runtime is **progressive enhancement** — content reads with JS off; JS only adds TOC scroll-spy,
`<details>` accordions, sortable/filterable tables, slide navigation (presentation), and theme
switching. All controls hide in `@media print`.

## Branding & naming

Ships with **no company name, logo, or product baked in**. Every identity slot is a fill-in
placeholder substituted at render time:

| Placeholder | Appears in | Example |
|:--|:--|:--|
| `{{ORG}}` | top-bar wordmark, footer brand | `Acme Consulting` |
| `{{PROJECT}}` | title, breadcrumb, body references | `Payments Platform` |
| `{{REPORT_TYPE}}` | top-bar sub-label, eyebrow, footer | `Incident Analysis`, `Roadmap` |
| `{{DATE}}` / `{{AUTHOR}}` | hero / footer meta | `2026-06-22`, `Delivery Office` |

Rules: a model generating a report MUST (a) use names the user supplied, (b) ask for them, or
(c) leave the literal `{{ORG}}` / `{{PROJECT}}` placeholders in place — and MUST NOT invent a real
company's brand. Branding is **text-only** (uppercase wordmark + a brand-accent square in the
footer); no raster/SVG logo slot.

## Colors

Pure-white surfaces, near-black ink, one brand accent for structural signals, three desaturated
states for meaning. Token names follow the reference (`--navy*` = swappable accent).

- **Brand accent (`--navy`, Blue `#0b5fd4`)** — section numbers, eyebrow accents, chip text, TOC
  active state, link default, rail/section header accents, the brand square in the footer.
- **Brand deep (`--navy-deep`)** — hover/pressed, AND internal-mode headings (the "you are in
  internal content" tell).
- **Brand tint (`--navy-bg`) / line (`--navy-line`)** — chip / callout backgrounds and
  accent-tinted borders. Never a full-card background.
- **Cleared accent (`--ok`)** — "protected / approved / ready"; a deeper same-hue shade so the
  page stays two-colour. Bar-marks, key-point dashes, high-confidence badges.
- **Risk bordeaux (`--risk` `#b3261e`)** — blocker / violation / contradiction. Not fire-truck red.
- **Hold amber (`--hold` `#8a6d00`)** — pending / conditional / watch. Not highlighter yellow.
- **Ink scale** (`#11131a → #868b95`) — titles use `--ink`; body prose `--ink-mid`; labels `--ink-faint`.
- **Surfaces** — white default; `--bg-band` for header/meta strips; `--bg-subtle` for nested /
  expanded; `--bg-deep` near-black for footer + dark code/diff panels only.

### State mapping

| Semantic | Typical outcomes |
|:--|:--|
| `ok` | approved, cleared, ready, gate passed, conforming, within SLA |
| `risk` | blocker, violation, contradicts-source, bug, breach, out-of-SLA |
| `hold` | pending, conditional, follow-up, provisional, reproduction-required |

A reader sees exactly three meanings. Do NOT invent a fourth state colour; use a brand-tinted
`category-badge-info` or a grey `status-badge-neutral` if a fourth tier is genuinely needed.

### Source-type exception

The `src-*` family (regulator-red / press-blue / rca-green / news-grey) is the **single** allowed
exception to the two-colour rule, used ONLY on source-type pills in a reference list, where readers
scan reference *types* at a glance. It never bleeds into prose, cards, buttons, or headings. (Pair
it with the `source-*` icons in [`icons/`](icons/).)

## Brand palette presets

The accent is swappable. Nine presets ship and **Black is mandatory (always selectable in the in-report switcher)**; **Blue is the default**. Swap ONLY these 7 values for
another theme — everything else (neutrals, `risk`, `hold`) is constant, and no selector hard-codes
a hex.

| Preset | `--navy` | `--navy-deep` | `--navy-bg` | `--navy-line` | `--ok` | `--ok-bg` | `--ok-line` | Register |
|:--|:--|:--|:--|:--|:--|:--|:--|:--|
| **Blue** *(default)* | `#0b5fd4` | `#0842a0` | `#e8f1fc` | `#bcd6f5` | `#1a4f9c` | `#e9f0fa` | `#b7cdea` | Enterprise IT / engineering |
| **Purple** | `#a100ff` | `#7a00c2` | `#f3e8ff` | `#d9bef5` | `#5a2f8a` | `#efe8f5` | `#d0b5e0` | Consulting / Genesis |
| **Indigo** | `#4338ca` | `#312c92` | `#ebebfb` | `#c7c3f0` | `#3730a3` | `#ebeaf7` | `#c5c2ea` | Software / product |
| **Teal** | `#0e7c86` | `#095861` | `#e0f3f4` | `#a9dade` | `#0f5d54` | `#e3f3ef` | `#b3ddd4` | Data / cloud |
| **Cyan** | `#0891b2` | `#0e6f88` | `#e2f4f9` | `#abdde9` | `#0e6b7a` | `#e4f3f4` | `#b0dde2` | Telco / infra |
| **Green** | `#1f7a44` | `#155730` | `#e6f4ea` | `#b3dcc1` | `#2f6b3c` | `#e9f3ea` | `#bedcc4` | Fintech / sustainability |
| **Plum** | `#a21d6e` | `#7c1450` | `#fbe8f2` | `#e8b9d4` | `#6d2356` | `#f6e8f0` | `#e3bcd5` | Premium / brand-led |
| **Slate** | `#3f4f63` | `#29384b` | `#eef1f5` | `#c2ccd8` | `#34495e` | `#eef1f5` | `#c2ccd8` | Neutral / monochrome |
| **Black** *(mandatory)* | `#000000` | `#000000` | `#f1f1f3` | `#d6d6db` | `#3f3f46` | `#f1f1f3` | `#cfcfd6` | Mono / ink |

Also swap brand-derived hexes NOT driven by a CSS variable: Mermaid `themeVariables` and any
`rgba()` highlight overlays (see § Diagrams). Avoid an off-list red or amber brand (collides with
`risk` / `hold`); the `ok` accent MUST be a deeper same-hue shade of `navy`.

## Typography

**System fonts, no web-font request.** `--sans` (`-apple-system, "Segoe UI", "Hiragino Kaku Gothic
ProN", "Noto Sans JP", sans-serif`) for everything except code; `--mono` (`ui-monospace, "JetBrains
Mono", …`) for IDs, paths, code, numeric chips, and tracked labels. Mixed JP/Latin paragraphs stay
coherent via the Noto fallback.

The scale is **compressed and dense** — the signature of this system:

- Body is **13px / 1.6** — do not inflate it. Density comes from the tight base + compact spacing.
- Hero title 25 / 800; section H2 16 / 800; card title 14 / 700; small 12; micro mono label 10 /
  700 / uppercase / 0.08em tracking.
- Stats 30–48 / 800 with `font-feature-settings: "tnum" 1` (tabular numbers) — **mandatory** on every
  stat, count, and numeric table column.
- Tracked uppercase mono labels (`--ink-faint`) are the eyebrow/label voice everywhere.

The **presentation** format is the one exception that scales type UP (slide titles 30–48px, body
≥18px) for across-the-room reading, while keeping the same stacks, palette, and shapes.

## Layout

The long-form anchor is a **centred 3-column grid** inside a thin chrome:

```
topbar (thin, sticky)                                   ← 10px / 40px padding, 1px bottom rule
hero (compact)                                          ← 30 / 40 / 22 padding; eyebrow→title→badges→standfirst
content  =  [ TOC 208px ] [ main 1fr ] [ rail 244px ]   ← 40px col-gap, max-width 1720px
             sticky          scrolls       sticky
footer (dark)
```

- **Thin sticky top bar** — `position:sticky; top:0`, 1px bottom rule, `10px 40px` padding. Uppercase
  `{{ORG}}` wordmark left; breadcrumb + generated-date right. Pure white, never tinted.
- **Compact hero** — single-column, `30 / 40 / 22` padding, 1px bottom rule. Order: eyebrow (mono,
  tracked) → title (25/800, no `text-wrap:balance`) → badge row (verdict + type + ticket + meta
  chips) → standfirst (14px). No side card.
- **3-column content grid** — `208px | minmax(0,1fr) | 244px`, 40px gap, `max-width:1720px`. **The
  sticky left TOC AND the sticky right metadata rail are the signature** — both `position:sticky;
  top:64px`, both visible while the body scrolls. The reference's "incident info" card is the rail's
  archetype. Below `breakpoint-md` (1280px) the right rail drops and the grid becomes
  `208px | 1fr`; below `breakpoint-sm` (1000px) it is a single column and the TOC collapses.
- **Section panels** — each `section` is a **rounded panel** (`border-radius:12px`, 1px rule, whisper
  shadow) with a **header band** (`.sec-head`: `bg-band`, a brand-accent `sec-num` chip + H2 +
  optional right-aligned links). Body padded `~20-24px`. Stacked with an 18px gap.
- **Anchor offset** — every `section` and TOC target sets `scroll-margin-top: ~84px` so a TOC click
  doesn't slip the heading behind the sticky top bar.

Non-long-form formats invent their own chrome (a console nav-rail, a board bar, a slide deck, a
print sheet …) — see § Format families. The 3-column both-rail frame is specific to the long-form
report and MUST NOT be copied onto a format that isn't long-form.

## Density & elevation

**Flat, with at most a whisper of shadow.** Hierarchy is carried by:

1. **1px `--rule` borders on rounded white panels** — the default container.
2. **`bg-band` strips** — section header bands, meta rows, table headers, accordion-summary hover.
3. **`bg-subtle` tint** — nested / expanded surfaces (open accordion body, internal-table header).
4. **Dark inversion (`bg-deep`)** — footer + code/diff panels only. Never a third dark surface.
5. **Whisper shadow** — `0 1px 2px rgba(17,19,26,.045)` on panels, `0 1px 3px rgba(17,19,26,.05)` on
   sticky rails. No heavy drop-shadows, no neumorphism, no glow.
6. **Structural rules** — a brand-accent or ink rule (1.5–2px) under table headers and beneath the
   eyebrow bar-mark; otherwise plain 1px `rule`.

Spacing is compact: panel padding `13–24px`, grid gaps `14–40px`, section gap `18px`. Aim for
"small & dense"; never airy.

## Shapes

**Rounded panels** are the shape language (this **reverses** the previous "square everywhere" rule,
to match the reference). Tokens: panels `12px`, nested cards `10–11px` (rail card `14px`),
chips / badges / pills `5–6px`, small insets `4–5px`, mono numeric chip `2px`, status dot `50%`.
Borders are 1px `--rule`; soft dividers `--rule-soft`. Keep radii in this range — oversized
(>16px) radii read as consumer-app bubbles and break the institutional register.

## Iconography

A bespoke SVG icon library lives in **[`icons/`](icons/)** (see [`icons/SPEC.md`](icons/SPEC.md)).
It is the ONLY sanctioned icon source.

- **Style.** Monoline, `viewBox="0 0 24 24"`, `fill:none`, `stroke:currentColor`,
  `stroke-width:1.75`, round caps/joins; geometry inside a 2px margin. Signature detail: data-nodes
  are small **rounded squares** (`rx≈1.2`, `fill:currentColor`), not circles.
- **Theming.** Colour is `currentColor`, so an icon inherits the active brand (or a `risk` chip's
  bordeaux) automatically — set `color` on the icon or its parent.
- **Usage.** Inline the `<svg>` into self-contained HTML and size with one class:
  `.icon{width:1.15em;height:1.15em;vertical-align:-.18em}` (+ `.icon-sm`/`.icon-lg`). Browse and
  copy from `icons/index.html`; look up by keyword in `icons/manifest.json`.
- **Categories (26, ~678 icons).** annotation · arrows · bug-qa · code · commerce · communication ·
  data · device · document · editorial · finance · infra · legal-governance · logistics ·
  maps-location · math-units · media · nav · people · process · security · source · status ·
  sustainability · time · ui-controls.
- **BAN.** No emoji and no generic "AI-assistant" icons (sparkle/twinkle, lightbulb-idea, rocket,
  robot, brain, gear-as-settings, speech-bubble-dots, etc.). Pick the concrete domain form instead.
  This is a hard rule — see `icons/SPEC.md` § BAN LIST.

## Format families

The core spec above is the **shared DNA**. What differs between deliverables is the **format** —
and formats are **structurally distinct document types**, not one frame reskinned. Each format has
its own satellite spec under **[`designs/`](designs/README.md)** and a matching self-contained
sample under `sample/`. The build contract every format obeys is
[`designs/_FOUNDATION.md`](designs/_FOUNDATION.md).

| Format | Distinct identity (chrome differs, not just content) | Spec |
|:--|:--|:--|
| **Long-form report** *(anchor)* | thin top bar + compact hero + 3-col both-rail (TOC + metadata rail) + rounded section panels | [`designs/long-form-report.md`](designs/long-form-report.md) |
| **Dashboard** | monitoring console: fixed left icon nav-rail + top KPI band + widget/tile grid | [`designs/dashboard.md`](designs/dashboard.md) |
| **Data register** | data-grid app: sticky toolbar (search/filter/sort) + full-bleed dense table + row drawer | [`designs/data-register.md`](designs/data-register.md) |
| **Kanban board** | board: horizontal lane columns + compact cards + WIP cues | [`designs/kanban-board.md`](designs/kanban-board.md) |
| **Timeline / roadmap** | horizontal time canvas: time axis + swimlanes + gantt bars + milestones | [`designs/timeline-roadmap.md`](designs/timeline-roadmap.md) |
| **Presentation (HTML PPT)** | full-viewport 16:9 slides, scroll-snap, keyboard nav, 1 slide/page print | [`designs/slide-deck.md`](designs/slide-deck.md) |
| **One-pager** | single non-scrolling A4/Letter sheet; SCR spine; everything in one view | [`designs/one-pager.md`](designs/one-pager.md) |
| **Portfolio** | showcase: editorial hero + project-card gallery (CSS-art thumbs) + outcomes | [`designs/portfolio.md`](designs/portfolio.md) |
| **Infographic** | vertical visual poster: oversized stats + CSS process/funnel/pyramid/cycle + full-bleed bands | [`designs/infographic.md`](designs/infographic.md) |
| **Matrix / canvas** | framework canvas: axis-labelled 2×2 + SWOT + business-model grid | [`designs/matrix-canvas.md`](designs/matrix-canvas.md) |
| **Magazine** | editorial feature: title spread + multi-column flow + drop-cap + pull-quotes + figures | [`designs/magazine.md`](designs/magazine.md) |
| **Comparison grid** | decision / feature / pricing matrix: option columns × criteria rows, ✓/✗/rating cells | [`designs/comparison-grid.md`](designs/comparison-grid.md) |
| **Financial statement** | formal P&L / balance sheet / cash flow / ledger — ruled, hierarchical, period columns | [`designs/financial-statement.md`](designs/financial-statement.md) |
| **Org chart / hierarchy** | top-down node tree (org / taxonomy / WBS): drawn connectors, collapse, pan / zoom | [`designs/org-chart.md`](designs/org-chart.md) |
| **Calendar / schedule** | month / week / resource day-cell grid of events | [`designs/calendar-schedule.md`](designs/calendar-schedule.md) |
| **Runbook / checklist** | operational step-by-step procedure / SOP with checkable steps | [`designs/runbook-checklist.md`](designs/runbook-checklist.md) |
| **Diagram / topology** | spatial system / network / data-flow map: positioned nodes + labelled edges, pan / zoom | [`designs/diagram-topology.md`](designs/diagram-topology.md) |
| **Scorecard** | periodic assessment scorecard: areas × criteria graded (RAG + score + weight) under one overall grade | [`designs/scorecard.md`](designs/scorecard.md) |
| **Incident timeline** | chronological postmortem event log: vertical time rail + phase markers + live MTTR | [`designs/incident-timeline.md`](designs/incident-timeline.md) |
| **Heatmap grid** | dense N×M graded colour matrix (risk likelihood×impact / correlation / activity) | [`designs/heatmap-grid.md`](designs/heatmap-grid.md) |
| **Flowchart** | structured BPMN-style process flow: swimlanes + steps + decision diamonds + routed connectors | [`designs/flowchart.md`](designs/flowchart.md) |
| **Survey results** | question-by-question poll results: distributions, Likert, NPS, sentiment, segments | [`designs/survey-results.md`](designs/survey-results.md) |
| **Leaderboard** | ranked entities: podium + value bars + tier bands + movement vs previous | [`designs/leaderboard.md`](designs/leaderboard.md) |
| **Changelog** | reverse-chronological release feed: version sections + typed change chips | [`designs/changelog.md`](designs/changelog.md) |
| **Knowledge base** | FAQ / help centre: category sidebar + searchable Q&A accordion | [`designs/knowledge-base.md`](designs/knowledge-base.md) |
| **Experiment readout** | A/B test result: control vs variants, uplift %, CI, significance, segments | [`designs/experiment-readout.md`](designs/experiment-readout.md) |
| **Geo-region** | regional breakdown: tile-grid choropleth + ranked list + region detail | [`designs/geo-region.md`](designs/geo-region.md) |
| **Sankey flow** | value-weighted flow ribbons between stacked node columns (flow-of-funds / throughput) | [`designs/sankey-flow.md`](designs/sankey-flow.md) |
| **Treemap** | hierarchical squarified area map sized by value; drill-down by zoom + breadcrumb | [`designs/treemap.md`](designs/treemap.md) |
| **Diff / code review** | IDE/PR 3-pane: changed-file tree + both-gutter diff + inline review threads + verdict | [`designs/diff-review.md`](designs/diff-review.md) |
| **Waterfall / bridge** | opening → +/- step bars → closing floating-bar variance bridge + connectors | [`designs/waterfall.md`](designs/waterfall.md) |
| **Test report** | CI test-run console: result donut + suite tree + case grid + failure drill | [`designs/test-report.md`](designs/test-report.md) |
| **Status page** | uptime history: derived status banner + per-component day-bar strips + incident feed | [`designs/status-page.md`](designs/status-page.md) |
| **Bracket** | knockout tournament: round columns converging via connectors to a champion | [`designs/bracket.md`](designs/bracket.md) |
| **Research paper** | formal academic article: centred serif page + abstract + numbered sections + `[n]` citations → references + equations + interactive figures | [`designs/research-paper.md`](designs/research-paper.md) |

**Rule:** when generating a deliverable, read this core spec for the DNA, then read the ONE satellite
spec for the format and build to its chrome. If two formats end up looking alike, one is wrong —
push them apart. See [`designs/README.md`](designs/README.md) for the router and how to add a format.

### Long-form archetypes

Within the long-form report, five content archetypes share the same chrome but differ in section
order and signature components: **Executive Brief**, **Deep Analysis / Audit** (the reference's
shape — findings, root-cause, code/diff, citations, metadata rail), **Scorecard**, **Register**,
**Plan / Timeline**. Pick the archetype whose dominant content shape matches the deliverable. (For
a deliverable whose dominant shape is a board / grid / deck / canvas, use the matching *format*
above instead — not a long-form archetype.)

## Diagrams (Mermaid integration)

For architecture / process / decision / state diagrams, render with **Mermaid (≥ v10)** so the
diagram stays editable and inside the brand palette. Wrap every diagram in the toolbar + fixed-body
shell (`.diagram` → `.diagram-toolbar` with pan/zoom/fullscreen buttons → `.diagram-body` →
`.mermaid`) so a reader can zoom/pan; a bare `<div class="mermaid">` is not compliant. Mermaid is
auto-initialised from the live preset colours. Nodes may now use the rounded-panel radius (the
previous `rx:0` square-node override is dropped, to match the rounded look). Use these `classDef`
fills (swap the hexes per active preset):

| Class purpose | classDef (Blue default) |
|:--|:--|
| Input / boundary | `fill:#f6f6f8,stroke:#33363f,color:#11131a` |
| Pipeline step (brand) | `fill:#e8f1fc,stroke:#0b5fd4,color:#11131a` |
| Emphasised step | `fill:#e8f1fc,stroke:#0b5fd4,color:#11131a,stroke-width:3px` |
| QA / risk node | `fill:#fbeceb,stroke:#b3261e,color:#b3261e` |
| Output — ok | `fill:#e9f0fa,stroke:#1a4f9c,color:#1a4f9c,stroke-width:2px` |
| Output — risk | `fill:#fbeceb,stroke:#b3261e,color:#b3261e,stroke-width:2px` |
| Output — hold | `fill:#fbf3da,stroke:#8a6d00,color:#8a6d00,stroke-width:2px` |

Do NOT use Mermaid for tabular data (use a table) or simple two-column comparisons (use a comparison
panel). The same tri-state mapping applies — no teal "info" / orange "in-progress" tiers.

For a static, tightly-packed **layered architecture** exhibit, the CSS `.arch-grid` / `.arch-pro`
tile-grid pattern is still available (rows of equal-weight tiles in 1/3/4/6-column bands, state-
mapped fills, dark layer headers, CSS connectors). Use Mermaid when the topology branches; use the
arch-grid when it's a stack of equal-rank tiles compared side-by-side.

## Do's and Don'ts

### Do

- **Do** render the **sticky left TOC** on long-form reports, with the visible section highlighted
  (scroll-spy); and the **sticky right metadata rail** for incident / audit shapes. Both rails are
  the long-form signature.
- **Do** keep the body **dense** (13px, compact paddings, rounded panels). Density is the point.
- **Do** make each non-long-form format a **structurally different document type** — its own chrome,
  not the article frame with new content.
- **Do** ship every deliverable **self-contained** (inline CSS + inline `<svg>` icons + system
  fonts, no external requests).
- **Do** cite reference IDs inline as a `ref-chip` next to every numeric claim.
- **Do** activate `"tnum" 1` on every stat / count / numeric column.
- **Do** render semantic states as the full dot + tinted-bg + coloured-border triple.
- **Do** use icons only from [`icons/`](icons/), inlined, coloured via `currentColor`.
- **Do** keep the internal-mode block distinct (3px ink top border, `navy-deep` headings) when a
  template supports a client / internal split.

### Don't

- **Don't** copy the long-form 3-column both-rail frame onto a format that isn't long-form. A
  dashboard, board, deck, or canvas has its own chrome.
- **Don't** use **emoji or generic "AI" icons** (sparkle, lightbulb, rocket, robot, gear-as-settings,
  speech-bubble-dots …). Use the bespoke `icons/` set. This is load-bearing for the register.
- **Don't** use **gradient text** (`background-clip:text`) anywhere. The brand is flat colours.
- **Don't** introduce a **fourth semantic state colour**. Tri-state (`ok` / `risk` / `hold`) is
  load-bearing; use a brand-tinted info or grey neutral for a fourth tier.
- **Don't** use `--navy` for body ink (it is a structural signal); body is `--ink-mid`, titles `--ink`.
- **Don't** use `--navy-deep` in client-mode except link-hover (it is the internal-mode tell).
- **Don't** extend the `src-*` colour family beyond source-type pills in a reference list.
- **Don't** hard-code hex in a template; reference `var(--…)` so one `:root` swap rebrands the page.
- **Don't** render more than two dark (`bg-deep`) panels per page (footer + code/diff only).
- **Don't** inflate the 13px body or balloon panel radii past ~16px — both break the dense
  institutional register.
- **Don't** depend on JS for readability; core content must read with JS off and print cleanly.
