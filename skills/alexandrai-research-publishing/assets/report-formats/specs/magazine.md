# Format: Magazine / editorial feature

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 8-theme palette tokens,
> the system-font stack, the rounded-panel shape language, the three semantic states
> (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.ref-chip`, the mini status dot, the
> key/value grid for a fact box), and the self-contained output rules (§0). **Default theme: Slate.**
> What this format reinvents is its **chrome and layout**: there is **no top bar, no table-of-contents,
> no both-rail sticky frame, no stacked section panels, no dashboard tiles**. This is a *print feature*
> set in a centred measure — a title spread, then multi-column justified prose typeset like a long read.

---

## One-line difference from long-form
Long-form is an *instrument you navigate* (sticky top bar → hero badges → TOC + fact rail → stacked
panels → split-diff). The magazine is a *story you read*: a dramatic full-width title spread opens it,
then the body flows through **CSS columns** with a **drop-cap**, **pull-quotes** that break the measure,
and **figure spreads** — chrome that says *print magazine*, not *report*.

## When to use
Long-form prose where the **writing carries the value** and the reader settles in to *read*, not scan:

- an engineering-culture / transformation feature, a "how we rebuilt X" narrative essay
- a thought-leadership or point-of-view piece, a market-landscape *story* (not a data deck)
- an annual-review essay, a founder's letter, a profile / interview write-up, a retrospective long-read
- the front-of-book feature in an internal magazine or a customer publication

Reach for a different format when the deliverable is fundamentally **data**: a register (lookup),
a dashboard (glance), a one-pager (one view), a deck (room). If it has a TOC and section panels, it is
long-form, not this. The magazine deliberately sacrifices scannability for *reading rhythm*.

---

## Distinct chrome — a print-magazine feature
This format must be **unmistakably an editorial feature** — it should read like a spread torn from a
well-set magazine. Five structural commitments, none of which the long-form report has:

1. **A full-width title spread**, not a top bar + hero-badge strip. `.title-spread` is a tall opening
   band (often the deep-ink surface, edge-to-edge) carrying, in order: a **kicker** (tracked mono
   eyebrow + a hairline rule), a **large display headline** (`clamp()`-scaled, `38–88px`, tight
   leading, the one place type goes big), a **deck / standfirst** (`18–22px` serif-feel intro), and a
   **byline** line (author · role · date · read-time). No status badges, no KPI chips up top.
2. **A centred reading measure**, not a 3-rail grid. The article lives in `.feature` capped at
   `~1080px` and the running text at a true **reading measure** (~62–72 characters). The page is one
   column of *flow*, not a dashboard of panels — wide elements (`.title-spread`, `.figure.full`,
   `.pullquote.wide`) **break out** of the measure; everything else sits inside it.
3. **Multi-column justified body via CSS `columns`**, not single-column report prose. `.cols` sets
   `column-count:2` (3 on very wide viewports), `column-gap:~40px`, a hairline `column-rule`,
   `text-align:justify` + `hyphens:auto`. This is the format's spine — text *flows* between columns.
4. **A drop-cap opener and pull-quotes that break the columns.** The lead paragraph gets a `.dropcap`
   (a 3-line `float:left` initial in the brand accent). One or more **`.pullquote`** elements use
   `column-span:all` to span the full measure and interrupt the flow — the editorial breathing space.
5. **Figure spreads and a folio.** `.figure` holds **CSS/SVG art only** (no raster) with a numbered
   `figcaption`; `.figure.full` breaks the measure for a dramatic spread. The piece closes on an
   **`.endmark`** (a filled square ▮ after the last line) and a **`.folio`** footer — publication,
   issue/section, page number — the running-foot of a printed page, not the dark report footer.

Density still applies *within* the chrome: tight 13px captions/byline, mono tracked labels, rounded
shapes, the two-colour discipline. The body itself sets at a comfortable **16–17px reading size** (a
deliberate exception to the 13px base — long-read copy must breathe), in the `--sans` stack.

### Layout outline
```
<article class="feature">                ← centred reading measure (~1080px), one column of flow
├─ header.title-spread (full-width)      ← the opening spread — breaks out to the page edges
│  ├─ .kicker        ← tracked mono eyebrow + hairline rule + section ("{{PROJECT}} · FEATURE")
│  ├─ h1.headline    ← large display headline, clamp-scaled (the ONE big-type moment)
│  ├─ p.deck         ← deck / standfirst (the intro paragraph, larger, lighter)
│  └─ .byline        ← {{AUTHOR}} · role  ·  {{DATE}}  ·  N-min read   (+ optional .kicker tag)
│
├─ .cols (CSS columns, justified, hyphenated)    ← THE BODY FLOW
│  ├─ p.lead > .dropcap …                ← drop-cap opening paragraph
│  ├─ p … p …                            ← running body, flowing across columns
│  ├─ h2.runin  (run-in subhead)         ← small tracked head, inline-ish, breaks the prose
│  ├─ blockquote.pullquote (span:all)    ← pull-quote #1 — interrupts the columns
│  ├─ p … p …
│  ├─ figure.figure[.full] (span:all)    ← figure spread: CSS/SVG art + numbered figcaption
│  ├─ blockquote.pullquote.wide (span:all)
│  └─ p … (last paragraph) .endmark      ← closes with the ▮ end-mark
│
├─ aside.sidebar (optional, span:all)    ← a tinted "box-out" / key-points card inside the flow
└─ footer.folio (full-width)             ← running foot: {{ORG}} wordmark · issue/section · "Page 1"
```

---

## Signature components (class names)
- **`.feature`** — the article container: centred, capped `~1080px`, the single column of flow that
  everything sits in. Wide components break out of it; running text stays at reading measure inside it.
- **`.title-spread`** — the opening spread. Full-width band (typically `--bg-deep` with light ink, or a
  tinted `--navy-bg`), generous vertical padding. Replaces the long-form top bar + hero entirely.
  - **`.kicker`** — the tracked uppercase mono eyebrow (`--ink-faint` / accent on dark), often with a
    short hairline rule before it. The editorial "section / rubric" voice.
  - **`.headline`** — the display headline: `font:800 clamp(38px,6vw,88px)/1.04 var(--sans)`,
    `letter-spacing:-.02em`. The **one** place the family lets type go large. Keep it to a line or three.
  - **`.deck`** (standfirst) — the intro paragraph under the headline: `18–22px`, `--ink-soft` (or a
    bright tint on dark), looser leading. Sets up the piece in 1–3 sentences.
  - **`.byline`** — the credit line: `{{AUTHOR}}` + role · `{{DATE}}` · read-time, mono-tracked meta,
    hairline-separated. May carry a small `.ref-chip` for the issue.
- **`.cols`** — the multi-column flow: `column-count:2` (→3 ≥1200px), `column-gap:~40px`,
  `column-rule:1px solid var(--rule-soft)`, `text-align:justify`, `hyphens:auto`. The body's spine.
  Paragraphs flow; `orphans/widows:2`. Wide children use `column-span:all`.
- **`.dropcap`** — the lead initial: `float:left`, `font-size:~3.2em`, `line-height:.82`, brand accent
  (`--navy-deep`), `font-weight:800`, small right/bottom margin. Only on the **first** body paragraph.
- **`.pullquote`** — a quote pulled large from the body to break the measure: `column-span:all`,
  `font:600 22–30px/1.25 var(--sans)`, accent-coloured, with a **leading accent rule or large quote
  glyph**, generous vertical margin. Optional `.pullquote.wide` breaks past the measure. Use 1–3 for
  rhythm — they are the editorial pause, not decoration. A small attribution line is optional.
- **`.figure`** — a captioned exhibit holding **CSS/SVG art only** (an SVG diagram, a CSS-drawn chart,
  a typographic plate — never a raster image). `.figure.full` / `.figure.wide` breaks out for a spread.
  - **`figcaption`** — numbered, mono-tracked label (`FIG. 1`) + a sentence of caption, `--ink-soft`,
    hairline rule above. Captions are 12–13px and do real explanatory work.
- **`.runin`** — a run-in subhead: a small `800` tracked head (`13–15px`, often the accent colour,
  `display:run-in`-style or a tight `<h2>` with minimal top margin) that segments the prose **without**
  the heavy header bands of a report. No numbering, no panel — just a typographic break.
- **`.lead`** — the opening paragraph wrapper (carries the `.dropcap`); may set a slightly larger size
  or small-caps first words for the classic feature opener.
- **`.endmark`** — the closing mark: a small filled square (▮ / a 6px accent block) appended after the
  final word, the printed "end of story" glyph.
- **`.folio`** — the running-foot footer: full-width, hairline top rule, `{{ORG}}` wordmark + accent
  square, issue/section ("{{PROJECT}} · No. 04"), and a page number ("Page 1"). The magazine's folio —
  **not** the dark report footer band (though it may invert on the closing spread for drama).
- **`.sidebar` / box-out** (optional) — a tinted `--bg-subtle` / `--navy-bg` card set inside the flow
  (`column-span:all`) for a key-points list or a short "by the numbers" aside. Reuse the family
  key/value grid or a `.st-badge` list here; keep it clearly secondary to the running prose.

Reuse the family primitives verbatim where they appear: `.ref-chip` (for an issue/source tag in the
byline or a figure credit), the **key/value grid** (inside a box-out), the **mini status dot**, and
inline **house SVG icons** (`quote`, `bookmark`, `arrow-right`, `clock`) per `../icons/SPEC.md` — drawn
to the 24×24 / `stroke-width:1.75` / round-cap spec. **Never** emoji.

---

## Do / Don't
- **Do** open with a dramatic full-width title spread (kicker → big headline → deck → byline) and let it
  break out to the page edges — it is the cover of the piece.
- **Do** flow the body through CSS `columns`, justified + hyphenated, with a drop-cap lead and a
  hairline column rule. Keep running text at a true reading measure (~62–72 chars).
- **Do** use 1–3 pull-quotes (`column-span:all`) and at least one figure spread to set the reading
  rhythm; close on the `.endmark` and a folio foot.
- **Do** let body copy breathe at 16–17px — the one place the family relaxes the 13px base.
- **Don't** add a sticky top bar, a table-of-contents, both-side rails, or stacked section panels with
  header bands — that is the long-form report, and the whole point is to *not* look like one.
- **Don't** turn it into a dashboard/register: no KPI tile grid, no sortable data table, no widget rail.
- **Don't** use raster images or external fonts/CDNs; all art is CSS/SVG and all type is system fonts.
- **Don't** invent a 4th status colour or break the two-colour accent discipline; pull-quotes, drop-cap,
  kicker, rules, and the end-mark all draw from the single brand accent.

## Data schema

Schema file: [`schemas/magazine.schema.json`](schemas/magazine.schema.json)

Required top-level fields: `meta`, `body`, `folio`

| Field | Type | Notes |
|:--|:--|:--|
| `meta` | object | `org`, `project`, `kicker`, `headline`, `deck`, `byline`, `date`, `theme` required; default theme `slate` |
| `meta.byline` | object | `author`, `date` required; `role`, `readTime`, `issueRef` optional |
| `body` | array | Ordered content blocks; each has a `type` discriminant: `para`, `subhead`, `pullquote`, `figure`, `sidebar` |
| `body[].para` | object | `text` required; `dropcap:true` on the lead paragraph only |
| `body[].subhead` | object | `text` required; `num` optional — run-in heading with no heavy panel band |
| `body[].pullquote` | object | `quote` required; `attribution`, `wide` optional — uses `column-span:all` |
| `body[].figure` | object | `num`, `caption` required; `captionHeadline`, `full`, `artDescription` optional — CSS/SVG art only |
| `body[].sidebar` | object | `heading` required; `kvItems[]`, `badges[]` optional — tinted box-out |
| `folio` | object | `publication` required; `issue`, `section`, `pageLabel` optional — the running folio foot |

---

## Icons

Icon SVGs are located in [`../icons/`](../icons/) per the house SVG spec (24×24, `stroke:currentColor`, `stroke-width:1.75`, round caps).

Icon categories used in this format: **editorial**, **document**, **people**

---

## Exemplar
`sample/magazine_sample.html` — an engineering-culture feature, *"The Quiet Rewrite"* (Slate theme):
a full-width dark title spread (kicker · big display headline · deck · byline + read-time), a two-column
justified body with a drop-cap opener, run-in subheads, two pull-quotes breaking the measure, a full-width
figure spread with a CSS/SVG illustration + numbered caption, a tinted box-out, an end-mark, and a folio
footer. No top bar, no TOC, no panels — a long read, typeset like print.
