# Format: Research paper / journal article

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 9-theme palette tokens
> (Black mandatory), the system-font stacks, the rounded-panel shape language, the three semantic states
> (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.chip`, the mini status dot), the
> inline-SVG icon rules, and the self-contained, **data-driven + interactive + themeable** output
> contract of [`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md) (§1–§5). **Default theme: Indigo.**
> What this format reinvents is its **chrome and layout**: there is **no top bar, no business hero, no
> both-rail sticky report frame, no dashboard tiles**. This is a *typeset academic article on a centred
> "paper page"* — a journal-style title block, a bordered abstract, numbered sections in justified
> serif, inline `[n]` citations, numbered equations, interactive figures, ruled tables, and References.

---

## One-line difference
This is **academic apparatus on a centred PDF-style page**: serif justified prose, an abstract box,
numbered sections/subsections, inline `[n]` citations that hover and jump, numbered equations, captioned
**interactive** figures, booktabs tables, and a References list. The magazine has none of that apparatus,
and the long-form report wears business chrome — this wears the *journal*.

## When to use
A deliverable that must read as a **formal paper / journal article**, where credibility comes from
structure and citation:

- a measurement study, an empirical evaluation, a methods write-up, a technical white paper
- a systems / reliability / latency study, an algorithm or protocol description with results
- an internal research note dressed for external review, a "submission preprint" mock-up
- anything that genuinely needs an **abstract + numbered sections + citations + References**

Reach for a different format when the value is *narrative* (→ magazine), *navigation of a long report*
(→ long-form-report), *a single view* (→ one-pager), or *data lookup / glance* (→ register / dashboard).
If it has no abstract, no `[n]` citations and no References, it is not this format.

---

## Type signature — this format's allowed deviation
The body sets in a **system serif** to evoke a journal. Add and use a `--serif` token (system fonts
only, **no web font**):

```css
--serif: Georgia, "Times New Roman", "Noto Serif CJK JP","Noto Serif CJK KR","Noto Serif",
         "Hiragino Mincho ProN", serif;
```

- **`--serif`** sets the article body, abstract, section prose, figure/table captions body, and
  references — **justified, hyphenated** (`text-align:justify; hyphens:auto;`).
- **`--sans`** keeps the UI chrome: the theme switcher, figure controls (legend, slider, buttons), the
  outline nav, the tracked uppercase mini-labels, table column headers.
- **`--mono`** keeps identifiers: the article id (DOI-like), equation numbers, citation `[n]` markers,
  numeric table columns, axis ticks, tooltip values.

The dense 13px family base still applies to chrome; the serif body may sit at `13.5–14px / 1.7` for
reading rhythm. Do **not** add an external font, and do **not** set headings in a display face — serif
headings, sans/mono labels.

---

## Distinct chrome — a centred journal page
Must be **unmistakably a typeset paper**, not a report. Structural commitments, none of which the
long-form report has:

1. **Centred paper page.** A single column **~820–960px wide** (`.rp-page`) on a neutral grey backdrop
   (`--bg-band`), centred in the 1440 viewport, with a hairline border + whisper shadow so it reads like
   a sheet. Narrow-by-design (like the one-pager) — but the page must **fill its column**; no half-empty
   lines. `<meta name="viewport" content="width=1440">`.
2. **Title block** (`.rp-title` / `.rp-authors` / `.rp-affil`): a large serif **title**; an **author
   line** with superscript affiliation markers (and `*` for the corresponding author); a numbered/lettered
   **affiliations list**; a **corresponding-author** line (name + email); a **date / venue** line; and a
   mono **article id** (DOI-like, e.g. `arXiv:2606.01234` — invented, brand-neutral).
3. **Abstract** in a bordered/tinted box (`.rp-abstract`, `--navy-bg` tint + accent left border),
   immediately followed by a **`Keywords:`** line (`.rp-keywords`).
4. **Numbered sections & subsections** (`.rp-sec` with `.rp-secnum`): serif headings prefixed `1`, `1.1`,
   `2` …; justified serif body paragraphs. A **1-column ⇄ 2-column** body toggle (academic touch) sets
   the section prose into two columns.
5. **Inline numbered citations** (`.rp-cite`): `[1]`, `[2,3]` linking to References; **hover → tooltip
   with the reference text**; **click → scroll + highlight** the reference.
6. **Numbered equations** (`.rp-eq` / `.rp-eqnum`): centred, rendered with HTML/Unicode `sup`/`sub`
   (**never** KaTeX/MathJax/any math CDN), with a right-aligned `(n)`.
7. **Figures** (`.rp-fig` / `.rp-figcap`): `Figure N. <caption>`, each an **interactive chart**
   (line / scatter / bar) drawn from data — hover tooltip with exact values, a legend that toggles series,
   and **≥1 figure with a parameter control** (a slider that re-plots a model overlay, or a show/hide
   data-table toggle under the chart).
8. **Tables** (`.rp-table`): `Table N. <caption>`, **booktabs-style** (thick top rule, header mid-rule,
   thick bottom rule, no vertical rules), optionally **sortable** numeric columns.
9. **Floating "Contents" outline** (`.rp-nav`): a small numbered section list with **scroll-spy** active
   highlight + **click-to-jump**; hidden in print.
10. **References** (`.rp-refs` / `.rp-ref`): a numbered list — authors · title · venue · year (+ optional
    link); each entry is a citation target and highlights when its `[n]` is clicked.

---

## Signature components (class names)
Use these so the family coheres and the format stays recognisable:

| Class | Role |
|:--|:--|
| `.rp-page` | the centred paper sheet (the whole article column) |
| `.rp-title` | large serif paper title |
| `.rp-authors` | author line with superscript affiliation markers + corresponding `*` |
| `.rp-affil` | affiliations list + corresponding-author + venue/date + article id masthead |
| `.rp-abstract` | bordered/tinted abstract box |
| `.rp-keywords` | `Keywords:` line under the abstract |
| `.rp-sec` / `.rp-secnum` | numbered section/subsection block + its number badge |
| `.rp-fig` / `.rp-figcap` | figure wrapper (interactive chart) + `Figure N.` caption |
| `.rp-eq` / `.rp-eqnum` | centred equation + right-aligned `(n)` |
| `.rp-table` | booktabs-style ruled table |
| `.rp-cite` | inline citation link `[n]` (hover tooltip + click-scroll) |
| `.rp-refs` / `.rp-ref` | References list + a single reference entry (citation target) |
| `.rp-nav` | floating numbered Contents outline (scroll-spy) |

Reused family primitives: `.st-badge` (figure state), `.chip` (keyword / id chips), the shared floating
`.chart-tip` tooltip (`.ct-h` / `.ct-row`), the inline-SVG icon set.

---

## Section / flow outline
1. **Floating outline nav** (`.rp-nav`, fixed, left of the page) — numbered sections, scroll-spy.
2. **Theme switcher** (`.rc-theme`) — top-right of the page, the mandatory 9-preset dropdown (incl Black).
3. **Title block** — title → authors → affiliations → corresponding author → venue/date → article id.
4. **Abstract** box → **Keywords** line.
5. **Numbered sections** — serif headings + justified prose, interleaving equations, figures, tables,
   lists; subsections render `n.m`.
6. **References** — numbered list at the end (the citation targets).

## Data fields (summary — full contract in `schemas/research-paper.schema.json`)
- **`meta`** — shared chrome object (`org`/`project`/`reportType`/`title`/`subtitle`/`date`/`author`/
  `theme`); `theme` sets the initial accent.
- **`paper`** — `title`; `authors[]{name, affil:[ids], corresponding?, email?}`;
  `affiliations[]{id, name}`; `date?`; `venue?`; `articleId?`; `abstract`; `keywords[]`.
- **`sections[]`** — recursive `{id, number, heading, blocks[], children?[]}`. A **block** is one of:
  - `{type:"para", html}` — justified serif paragraph; **citation marker** `[[cite:refId]]` (grouped
    `[[cite:r1,r3]]`) is rewritten to a `.rp-cite` link.
  - `{type:"equation", number, html}` — centred HTML/Unicode equation, right-aligned `(number)`.
  - `{type:"figure", id, number, caption, chart}` — `chart:{kind:"line|scatter|bar", xLabel, yLabel,
    categories?, series:[{name, color?, points?|values?}], control?:{kind:"slider|datatable", …}}`.
  - `{type:"table", id, number, caption, columns[], rows[]}` — booktabs table; numeric columns sortable.
  - `{type:"list", ordered?, items[]}`.
- **`references[]`** — `{id, authors, title, venue?, year, url?}`; `id` is the `[[cite:id]]` / click target.

**Citation marker syntax:** inside any `para.html` / list item, write `[[cite:refId]]` for a single cite
or `[[cite:r1,r3]]` for a group; the renderer rewrites it to `[n]` / `[n,m]` linking the matching
`references[].id` (numbering follows references order).

## Interactions (all data-driven, vanilla JS, ≤150ms)
- **Figure chart** — hover **tooltip** with exact `(x, y)` / value; clickable **legend** toggles each
  series; **≥1 figure** carries a **slider** that recomputes a model overlay live, and **≥1** a
  **show/hide data-table** toggle exposing the underlying values.
- **Citation `[n]`** — hover shows a tooltip with the full reference; click **scrolls to** and
  **highlights** that reference.
- **Outline nav** — click-to-jump; **scroll-spy** marks the active section.
- **Body layout** — a **1-column ⇄ 2-column** toggle re-flows the section prose (academic style).
- **Theme** — the mandatory `.rc-theme` 9-preset dropdown (incl Black) recolours live.
- **Print** — `@media print` hides the switcher, the floating outline, and all figure controls; expands
  the data-table; the page prints as a clean static article (full width of the sheet).

## How it differs (do not collapse into these)
- **magazine** = editorial feature: title spread, drop-cap, pull-quotes, multi-column editorial flow,
  byline/standfirst. **No** abstract, **no** numbered sections, **no** `[n]` citations, **no** equations,
  **no** References apparatus. The paper is academic apparatus + serif justified + centred PDF page.
- **long-form-report** = thin sticky top bar + both sticky rails + dense 13px business report with
  stacked section panels and a split-diff. The paper has **no** business chrome — just a centred serif
  sheet with a floating outline.
- **experiment-readout / scorecard** = data-deck panels for a single experiment. The paper is *prose-led*
  with citations and References, not a metrics panel grid.

## Do / Don't
**Do**
- Set the body, abstract, section prose, captions and references in **`--serif`**, justified + hyphenated.
- Keep UI chrome (switcher, controls, nav, labels) in **`--sans`**; identifiers/equations/ticks in `--mono`.
- Number sections, equations, figures and tables; make every figure a **real interactive chart** with a
  hover tooltip showing **exact** values and a working legend toggle.
- Render math with HTML `sup`/`sub` + Unicode (×, ·, ≈, α, Σ, √, ≤, ≥, ∞ …).
- Use `var(--navy)` for structural signals: section numbers, citation links, figure accents, active nav.

**Don't**
- Don't load a web font, a math CDN (KaTeX/MathJax), or any external image/script.
- Don't widen the page to a full-bleed app shell — it is a centred sheet (but it must fill its column).
- Don't fake a figure interaction, hard-code body content in HTML (build it from `#report-data`), or use
  emoji / AI-sparkle icons.
- Don't introduce a 4th semantic colour, gradients on text, or business chrome (top bar / KPI tiles).
