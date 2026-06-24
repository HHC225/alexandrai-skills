# Shared foundation contract (`_FOUNDATION.md`)

> **Read this before building any format.** This is the *family DNA* every format inherits: palette,
> type, density, shapes, shared primitives, icons, output rules. What a format is FREE to reinvent is
> its **chrome and layout** (header, navigation, grid, page model). What it MUST NOT change is the
> palette tokens, the type stack, the rounded-panel shape language, the status semantics, and the
> self-contained output rules below. The goal: the gallery reads as **one family of clearly-different
> document types** — not one skeleton reskinned.

This contract is distilled from the canonical reference report
`/home/hoheumcho/genesis/bug-analysis-harness/outputs/20260617/20260617_073434_866760_actor-dha-jira-gen2-421067-itb-abscg010c-abscg01/bug_report_20260617073434_jira-gen2-421067-itb-abscg010c-abscg01.html`
(thin top bar, both-side sticky rails, dense 13px body, rounded panels, purple accent). The **long-form
report** format reproduces that look exactly; every other format diverges in structure while keeping
the DNA.

---

## 0. Output rules (apply to EVERY sample and spec)

1. **Self-contained HTML.** Each sample is ONE `.html` file with its CSS in a single inline `<style>`
   block and any icons inline as `<svg>`. **No external requests** — no Google Fonts, no CDN CSS, no
   external images (use CSS/SVG for any graphic). The only allowed external scripts are Mermaid +
   svg-pan-zoom CDNs, and ONLY if the sample actually draws a Mermaid diagram.
2. **System fonts only** (see §2) — instant render, perfect portability, the dense technical register.
3. **Brand-neutral.** Never bake in a real company name. Use the placeholders `{{ORG}}`, `{{PROJECT}}`,
   `{{REPORT_TYPE}}`, `{{DATE}}`, `{{AUTHOR}}` verbatim where an identity would appear. Sample *content*
   (the body data) may be realistic fictional data, but the org/project chrome stays as placeholders.
4. **Theme via one attribute.** Put the full default token block in `:root`, and support
   `<html data-theme="…">` swaps (see §1). Each format is assigned a default theme below so the gallery
   shows the palette range.
5. **Viewport.** `<meta name="viewport" content="width=1280">` (or the width the format is designed at).
   These are desktop / print deliverables, not mobile-reflow web pages.
6. **Print-friendly.** Provide a sane `@media print` (hide sticky chrome, white footer). Presentation
   format prints one slide per page.
7. **No JS dependency for reading.** Core content is readable with JS off. JS only enhances (nav,
   scroll-spy, filter, slide control) and lives in a single inline `<script>` at the end.

---

## 1. Colour tokens — the 9-theme palette (Black mandatory)

Tokens use the **reference's names** (`--navy*` = the swappable brand accent; the name stays fixed so a
rebrand only changes values). `risk` (bordeaux) and `hold` (amber) are **constant across all 8 themes**.
Neutrals and surfaces are constant too. Put this block in `:root`; it is the DEFAULT (Purple).

```css
:root{
  /* surfaces */
  --bg:#fff; --bg-band:#f6f6f8; --bg-subtle:#fafafb; --bg-deep:#15131a;
  --rule:#dcdce2; --rule-soft:#ebebef;
  /* ink */
  --ink:#11131a; --ink-mid:#33363f; --ink-soft:#5a5e68; --ink-faint:#868b95;
  /* brand accent (Purple default) */
  --navy:#a100ff; --navy-deep:#7a00c2; --navy-bg:#f3e8ff; --navy-line:#d9bef5;
  /* cleared / approved — deeper low-chroma shade of the SAME hue as the accent */
  --ok:#5a2f8a; --ok-bg:#efe8f5; --ok-line:#d0b5e0;
  /* semantic states — CONSTANT across all themes */
  --risk:#b3261e; --risk-bg:#fbeceb; --risk-line:#edc7c4;
  --hold:#8a6d00; --hold-bg:#fbf3da; --hold-line:#e7d8a4;
  /* type stacks */
  --mono:ui-monospace,"JetBrains Mono","SFMono-Regular",Menlo,Consolas,monospace;
  --sans:-apple-system,"Segoe UI",system-ui,Roboto,"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic UI","Apple SD Gothic Neo","Malgun Gothic","PingFang SC","Microsoft YaHei","Noto Sans CJK JP","Noto Sans CJK KR","Noto Sans CJK SC","Noto Sans JP","Noto Sans KR","Noto Sans SC","Noto Sans",sans-serif;
}
```

Swap ONLY these 7 values for another theme (everything else, including `risk`/`hold`/neutrals, stays):

| Theme | `--navy` | `--navy-deep` | `--navy-bg` | `--navy-line` | `--ok` | `--ok-bg` | `--ok-line` |
|:--|:--|:--|:--|:--|:--|:--|:--|
| **Blue** | `#0b5fd4` | `#0842a0` | `#e8f1fc` | `#bcd6f5` | `#1a4f9c` | `#e9f0fa` | `#b7cdea` |
| **Purple** *(default)* | `#a100ff` | `#7a00c2` | `#f3e8ff` | `#d9bef5` | `#5a2f8a` | `#efe8f5` | `#d0b5e0` |
| **Indigo** | `#4338ca` | `#312c92` | `#ebebfb` | `#c7c3f0` | `#3730a3` | `#ebeaf7` | `#c5c2ea` |
| **Teal** | `#0e7c86` | `#095861` | `#e0f3f4` | `#a9dade` | `#0f5d54` | `#e3f3ef` | `#b3ddd4` |
| **Cyan** | `#0891b2` | `#0e6f88` | `#e2f4f9` | `#abdde9` | `#0e6b7a` | `#e4f3f4` | `#b0dde2` |
| **Green** | `#1f7a44` | `#155730` | `#e6f4ea` | `#b3dcc1` | `#2f6b3c` | `#e9f3ea` | `#bedcc4` |
| **Plum** | `#a21d6e` | `#7c1450` | `#fbe8f2` | `#e8b9d4` | `#6d2356` | `#f6e8f0` | `#e3bcd5` |
| **Slate** | `#3f4f63` | `#29384b` | `#eef1f5` | `#c2ccd8` | `#34495e` | `#eef1f5` | `#c2ccd8` |
| **Black** *(mandatory — always selectable)* | `#000000` | `#000000` | `#f1f1f3` | `#d6d6db` | `#3f3f46` | `#f1f1f3` | `#cfcfd6` |

Implement themes as `html[data-theme="blue"]{ --navy:#0b5fd4; … }` overrides. Default `:root` = Purple.

**Colour discipline:** brand accent for structural signals (numbers, rules, chips, links, active nav)
only; body ink is `--ink-mid`; three semantic states only (`ok`/`risk`/`hold`) — never invent a 4th.
No gradients on text. `--bg-deep` (near-black) only for footer + dark code/diff panels.

---

## 2. Typography (system fonts, dense)

- `--sans` for everything except code; `--mono` for IDs, paths, code, numeric chips, tracked labels.
- **Base:** `body{ font:13px/1.6 var(--sans); color:var(--ink); }`. The dense 13px base is the family's
  signature — do not inflate body copy.
- **Scale (guidance, px):** page/hero title `24–26 / 800`; section H2 `15–17 / 800`; card title `13–15 / 700`;
  body `13`; small/meta `11.5–12.5`; micro label `9.5–10.5` (mono, tracked `.06–.12em`, UPPERCASE);
  big stat `30–48 / 800` (mono or sans, `font-feature-settings:"tnum" 1`).
- Tabular numbers (`"tnum" 1`) on every stat / count / numeric table column.
- Tracked uppercase mono labels (`--ink-faint`) are the eyebrow/label voice across all formats.
- **Presentation format** is the one exception that scales type UP (slide titles 30–48px, body ≥18px),
  because it is read from across a room — but it keeps the same stacks, palette, and shapes.

---

## 3. Density & shape

- **Rounded panels** are the new shape language (this REPLACES the old "square everywhere" rule):
  large panels/cards `border-radius:12px`; nested cards `10–11px`; chips/badges/pills `5–6px`; small
  inset `4–5px`; status dot `50%`. Borders are `1px solid var(--rule)`; soft dividers `var(--rule-soft)`.
- **Elevation:** flat. At most a whisper shadow `0 1px 2px rgba(17,19,26,.045)` on white panels and
  `0 1px 3px rgba(17,19,26,.05)` on sticky rails. No heavy drop-shadows, no neumorphism.
- **Spacing:** compact. Panel padding `13–24px`; grid gaps `14–40px`; section bottom margin `16–22px`.
  The reference packs content tightly — aim for "small & dense," never airy.
- **Bands:** `--bg-band` marks meta / header strips; `--bg-subtle` marks nested/expanded surfaces.

---

## 4. Shared primitives (reuse these EXACT patterns so the family coheres)

These are the family's common vocabulary. Reuse them inside whatever chrome your format invents.

- **Status badge** — `.st-badge` pill (`1px` border, radius 6) with a leading `::before` dot;
  variants `.st-ok` / `.st-risk` / `.st-hold` recolour dot + text. Always dot + text together.
- **Chip / tag** — small mono pill on `--navy-bg` with `--navy-deep` text, radius 5–6, for refs/IDs.
- **Reference chip / link** — `.ref-chip` mono on `--navy-bg`; hover inverts to `--navy`/white.
- **Mono code / dark panel** — `--bg-deep` background, light text, `--mono`, radius 10. The dark
  side-by-side **diff** (`.diff-split`: black header, red/green add/del rows) is the canonical code-change
  exhibit. Only the footer + code/diff panels invert to dark.
- **Data table** — `2px solid var(--ink)` header bottom rule, `1px var(--rule-soft)` row dividers,
  uppercase mono `9.5–10px` headers (`--ink-faint`), `--bg-subtle` zebra/hover, top-aligned cells.
- **Key/value grid** — compact `repeat(N,1fr)` boxes with hairline dividers; mono values; tiny
  uppercase keys. (Reference §00 incident grid and right-rail facts both use this.)
- **Footer** — `--bg-deep` band, light text, uppercase mono meta, brand wordmark + accent square.
- **Mini status dot** — `7–8px` circle in `ok/risk/hold` for inline state.

**Icons** — use the house SVG set (`../icons/`), inlined. Style: 24×24 viewBox, `fill:none`,
`stroke:currentColor`, `stroke-width:1.75`, round caps/joins (see `../icons/SPEC.md`). Colour follows
`currentColor`, so an icon in a `risk` chip turns bordeaux automatically. Size with
`.icon{width:1.15em;height:1.15em;vertical-align:-.18em}`. **Never** use emoji or generic "AI" icons.
While the full library is being generated you may inline icons copied from `../icons/_exemplars/` or
draw new ones to that spec.

---

## 5. The distinctness mandate — each format is a DIFFERENT document type

Every format MUST be immediately recognisable as a different *kind* of artefact. Do **not** wrap a
format in the long-form report's chrome (thin top bar + both-side sticky rails + stacked section
panels) unless you ARE the long-form report. Invent the chrome the format actually needs.

| Format | Distinct identity (chrome + layout that MUST differ) | Default theme |
|:--|:--|:--|
| **long-form-report** | the reference EXACTLY: thin sticky top bar → compact hero (eyebrow/title/badges/standfirst) → 3-col `208px TOC | 1fr | 244px rail`, both rails sticky → stacked rounded section panels with header bands → dark split-diff → appendix. | Purple |
| **dashboard** | a **monitoring console**: fixed slim left **icon nav-rail** + top KPI band; body is a **tile/widget grid** (stat tiles, gauges, bar/line mini-charts, status lists). NO article flow, NO prose TOC. Reads at a glance. | Blue |
| **data-register** | a **data-grid application**: sticky toolbar (search + filter chips + column/sort controls) over a **full-bleed dense sortable table**; row → expandable detail drawer. Feels like an enterprise table tool. | Slate |
| **kanban-board** | a **board**: horizontal **lane columns** with header counts; vertical stacks of compact cards; horizontal scroll; WIP/aging cues. Feels like a Jira board, not a document. | Teal |
| **timeline-roadmap** | a **horizontal time canvas**: a time axis (quarters/sprints) across the top, **swimlanes** down the side, gantt-style bars + milestone diamonds spanning columns. A planner, not prose. | Indigo |
| **presentation** | **full-viewport 16:9 slides**, scroll-snap, keyboard `←/→`, slide counter + progress; ONE idea per slide; large type. Prints 1 slide/page (landscape). A deck, not a page. (This is the **HTML PPT**.) | Purple |
| **one-pager** | a **single non-scrolling page** sized to A4/Letter: no nav, no scroll; a tight executive grid (situation→complication→resolution + KPI strip + one visual). Everything fits in one view. | Plum |
| **portfolio** | a **showcase**: big editorial hero, then a **gallery of project/case cards** (CSS-art thumbnails), outcome stat rows, client logos as wordmark chips. Feels like an agency site, on one page. | Cyan |
| **infographic** | a **vertical visual narrative poster**: oversized numbers, sequential **process / funnel / pyramid / cycle** diagrams (CSS-drawn), minimal prose, full-bleed coloured bands between stages. | Green |
| **matrix-canvas** | a **framework canvas**: a 2×2 quadrant matrix (with axis labels + plotted items), and/or a SWOT four-pane / business-model-canvas grid. A whiteboard framework, not an article. | Indigo |
| **magazine** | an **editorial feature**: multi-column justified text flow, drop-cap opener, pull-quotes, figure spreads with captions, byline/standfirst, run-in heads. A long read, typeset like print. | Slate |

If two formats end up looking similar, one of them is wrong — push them further apart.

---

## 6. Deliverables per format (for the build agents)

1. **Rewrite `designs/<format>.md`** into a complete, opinionated spec: what it inherits from this
   foundation, **when to use it**, its distinct chrome + layout model, its **signature components**
   (with class names), a section/flow outline, and a short Do/Don't. State plainly how it differs from
   the long-form report. Do NOT copy the long-form frame.
2. **Build `sample/<format>_sample.html`** — a self-contained exemplar (per §0) with realistic fictional
   content, the assigned default theme, and at least one of every signature component the spec names.
3. Do **NOT** edit `designs/README.md`, `../DESIGN.md`, this file, `../icons/**`, or any other format's
   files — the orchestrator wires those up to avoid collisions.

Keep the two-colour brand discipline, the three semantic states, rounded panels, system fonts, and the
self-contained rule. Diverge on everything structural.
