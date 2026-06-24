# Format: Portfolio (case-study showcase)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** — the 8-theme palette tokens,
> system-font type scale, rounded panels, whisper shadows, `st-ok/risk/hold` semantics, the mono
> tracked-label voice, and the self-contained output rules. It **reinvents only the chrome and layout**:
> where the long-form report is a *page you read top-to-bottom*, the portfolio is a **showcase you scroll
> through** — a polished agency / capability page that presents delivered work as a gallery, not as prose.
>
> **Default theme: Cyan** (`<html data-theme="cyan">`; the `:root` block in the sample ships Cyan, with the
> other 7 themes available as `data-theme` overrides).

## When to use
A **client-facing showcase of delivered work**, scored on outcomes: a delivery / capability portfolio, a
reference-case book, a vendor or agency case-study deck, a product or design gallery, a "selected work"
page. Pick this when the reader's question is *"what have they shipped, for whom, and what did it move?"*
and the answer should feel **confident and editorial** — a designed page, not a memo. If the reader needs a
narrative argument, an audit trail, or recommendations, use **long-form-report**; if they need one
engagement told as a story end-to-end, use **magazine**; if it must fit one non-scrolling sheet, use
**one-pager**.

## The DISTINCT chrome (this is what makes it a showcase, not an article)
No thin top bar + both-side sticky TOC rails + stacked prose section panels. Instead, one continuous,
unmistakably-designed scroll:

```
┌───────────────────────────────────────────────────────────────────────┐
│  SLIM BRAND BAR   {{ORG}}  ·  Selected Work        [theme ▾] [Print]    │ ← .showcase-bar (not a nav)
├───────────────────────────────────────────────────────────────────────┤
│  EDITORIAL HERO                                                         │
│   eyebrow · OVERSIZED display headline · standfirst                     │ ← .showcase (hero)
│   ┌ aggregate outcome strip: 4 big tnum figures across the accent band ┐│
│   └──────────────────────────────────────────────────────────────────┘│
├───────────────────────────────────────────────────────────────────────┤
│  CASE GALLERY        (responsive auto-fill grid of rounded cards)       │ ← .gallery
│   ┌── .case-card ──┐ ┌── .case-card ──┐ ┌── .case-card ──┐               │
│   │  ▟ CSS-ART THUMB│ │  ◵ CSS-ART THUMB│ │  ▦ CSS-ART THUMB│  ← .thumb   │
│   │  tag · TITLE    │ │  tag · TITLE    │ │  tag · TITLE    │            │
│   │  role · sector  │ │  role · sector  │ │  role · sector  │            │
│   │  ── outcome row│ │  ── outcome row│ │  ── outcome row│  ← .outcome-row│
│   │  [tag][tag][tag]│ │  [tag][tag][tag]│ │  [tag][tag][tag]│            │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘            │
├───────────────────────────────────────────────────────────────────────┤
│  CLIENT WORDMARK CHIPS   [ACME] [northwind] [Vol·Tek] [Meridian] …      │ ← .logo-chip row
├───────────────────────────────────────────────────────────────────────┤
│  CAPABILITY BAND   what we do · 4–6 icon capability cells on a band     │ ← .capability-band
├───────────────────────────────────────────────────────────────────────┤
│  CONTACT BAND   dark, CTA + wordmark + accent square                    │ ← .contact-band / footer
└───────────────────────────────────────────────────────────────────────┘
```

1. **`.showcase` (editorial hero)** — the headline act, and the format's silhouette. A short tracked-mono
   eyebrow, an **oversized display headline** (the one place body-13 discipline is broken: `38–56px / 800`,
   tight `1.05` leading, one accent word allowed), a one-paragraph standfirst, then a **`.lead-stats`**
   strip of **3–4 aggregate outcome figures** (big tnum numbers) sitting on a soft `--navy-bg` / accent-edged
   band. A faint CSS-art motif (gradient wash or hairline grid built from the palette) may back the hero.
   No TOC, no section numbering, no "Section 01."
2. **`.gallery` of `.case-card`s** — the **hero of the page**: a responsive `auto-fill`/`auto-fit`
   `minmax(300–340px, 1fr)` grid of rounded project cards. Cards read in any order; the grid reflows. Each
   card leads with a **`.thumb`** — an **abstract CSS/SVG-art thumbnail in the palette** (NO `<img>`, no
   raster logos): gradients, geometric shapes, dot-grids, arcs, bars, concentric rings, isometric stacks,
   mono mark — every thumb visibly different. Below the thumb: a mono `.case-tag` (ref · sector), a
   `.case-title`, a `.case-role` line (role / sector / year), an **`.outcome-row`** of measured stats, and a
   row of `.case-tags` pills.
3. **`.logo-chip` row → `.capability-band` → `.contact-band`** — supporting showcase furniture below the
   gallery: a row of **client wordmark chips** (styled **text**, never raster logos), then a **capabilities
   band** (icon + label + one line, on a `--bg-band` strip), closing on a **dark contact band** (the footer,
   `--bg-deep`, with a CTA, wordmark, and accent square). This is page furniture, not article appendices.

## Signature components (class names to use)
- **`.showcase-bar`** — slim sticky brand strip: `{{ORG}} · Selected Work` wordmark (accent square) on the
  left, theme `<select>` + Print button on the right. A brand bar, **not** a nav with section links.
- **`.showcase`** — the editorial hero wrapper. `.eyebrow` (mono tracked), `.display` (oversized headline,
  one `<em>` accent word), `.standfirst`, then `.lead-stats`.
- **`.lead-stats` › `.lead-stat`** — aggregate outcome strip on an accent band: each cell = big tnum
  `.lead-num` (`30–44px/800`, `"tnum" 1`) + tracked-mono `.lead-lbl`. Hairline dividers between cells.
- **`.gallery`** — the responsive card grid (`grid-template-columns: repeat(auto-fill, minmax(320px,1fr))`,
  gaps `18–24px`). The signature surface; never a single prose column.
- **`.case-card`** — rounded card (`border-radius:12px`, `1px var(--rule)`, whisper shadow); subtle hover
  lift (`translateY(-2px)` + slightly stronger shadow + accent rule). Holds `.thumb` + `.case-body`.
- **`.thumb`** — **CSS/SVG-art thumbnail** (≈`16/10` aspect, radius inheriting the card top). Built only from
  palette gradients + shapes + inline SVG (`currentColor`/`--navy*`). Variant hooks (`.thumb--rings`,
  `--bars`, `--grid`, `--arc`, `--iso`, `--wave`, `--mark`) make each card distinct. A small mono
  `.thumb-num` index chip may sit in a corner. **No `<img>`, no external/raster assets, no photos.**
- **`.case-body`** — `.case-tag` (mono pill, ref · sector), `.case-title` (`15–17px/800`), `.case-role`
  (mono micro: role · sector · year), the `.outcome-row`, and a `.case-tags` pill row.
- **`.outcome-row` › `.outcome`** — the result line (this is mandatory per card): 2–3 cells, each a big
  tnum `.o-num` (`.ok` for wins, plain otherwise; `--risk`/`--hold` only for honest negatives) + tracked
  `.o-lbl`. Hairline dividers; sits on a faint `--bg-subtle` inset. **Outcomes, not adjectives.**
- **`.logo-chip`** — a **client wordmark chip**: a small rounded `--bg-band` pill rendering the client name
  as **styled text** (mixed weight / tracking / a tiny accent mark), in a `.logo-row` wrap. Never an image.
- **`.capability-band` › `.capability`** — a `--bg-band` strip of 4–6 capability cells: an inline house
  **icon** (`.icon`, `currentColor`) + a `.cap-title` + one `.cap-line`. The "what we do" band.
- **`.contact-band`** — the dark closing band / footer (`--bg-deep`): a short CTA line, contact mono meta,
  and the `{{ORG}}` wordmark + accent square. Doubles as the foundation footer.
- Reused primitives: mono `.tag`/`.chip`, `.st-badge` (`st-ok/risk/hold`) for any status flag, the
  key/value micro-grid, tnum numbers everywhere, house icons inline (`currentColor`).

## Layout / section outline
```
.showcase-bar          ← {{ORG}} · Selected Work wordmark · theme select · Print   (slim, sticky)
.showcase  (hero)      ← eyebrow · oversized .display headline · standfirst
  └ .lead-stats        ← 3–4 aggregate outcome figures on an accent band
.gallery               ← responsive auto-fill grid of .case-card (the page's hero):
     each .case-card =
       .thumb          ← distinct CSS/SVG-art thumbnail (palette only, no <img>)
       .case-body      ← .case-tag · .case-title · .case-role
                         .outcome-row (2–3 tnum outcomes)
                         .case-tags (pill row)
.logo-row              ← .logo-chip client wordmark chips (text, not logos)
.capability-band       ← 4–6 .capability cells (icon + title + line) on --bg-band
.contact-band (footer) ← dark band: CTA + wordmark + accent square
```
Order is editorial/spatial, not a numbered reading order: the eye lands on the hero headline + aggregate
figures, then sweeps the card gallery; the chips, capability band, and contact band close it out. **No TOC,
no section numbers, no standfirst-then-stacked-panels article flow.**

## Do / Don't
- **Do** give **every** card a real **`.outcome-row`** with `"tnum" 1` figures — outcomes, never just a
  description; **Do** make every `.thumb` a **distinct CSS/SVG-art** composition from the palette.
- **Do** let the **oversized hero headline + card gallery** be the first things seen — that silhouette *is*
  the format; keep cards rounded, dense, whisper-shadowed, with a restrained hover lift.
- **Do** render client identities as **`.logo-chip` wordmark text** and map any status to `ok/hold/risk` only.
- **Don't** use any `<img>`, raster logo, stock photo, or external asset — thumbs and marks are CSS/SVG only.
- **Don't** paste long essays into a card, add a TOC / section numbering, or wrap this in the long-form's
  top-bar-plus-two-sticky-rails-plus-stacked-prose chrome — that makes it an article, not a showcase.
- **Don't** inflate body copy; only the hero `.display` headline (and the big stat numbers) break the 13px
  base.

## How this differs from the long-form report
The long-form report is a **document you read** (thin top bar → hero/standfirst → 3-column TOC + prose +
fact rail → stacked numbered section panels). The portfolio is a **showcase you scroll** — an editorial hero
with an oversized headline and an aggregate outcome strip, a responsive gallery of outcome-scored case cards
with CSS-art thumbnails, client wordmark chips, and a capability band, closing on a dark contact band: a
polished agency page, with no reading order and almost no running prose.

## Exemplar
`sample/portfolio_sample.html`.

---

## Data schema

Schema file: [`schemas/portfolio.schema.json`](schemas/portfolio.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome: `org`, `project`, `reportType`, `title`, `date`, `theme` (required); `subtitle`, `author` (optional). Default `theme`: `"cyan"`. |
| `hero` | object | Editorial hero: `headline` (oversized display text), `standfirst` (1-paragraph body), `leadStats[]` (2–4 aggregate outcome figures). `eyebrow` optional. |
| `cases` | array | Gallery cards (`.case-card`). Each card requires `id`, `title`, `role`, and `outcomes[]` (≥1 measured result). |

**Optional top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `logos` | array | Client wordmark chips (`.logo-chip`). Each entry: `name` (required), `style` (`bold \| italic \| tracked \| mixed`). |
| `capabilities` | array | Capability band cells (2–6). Each cell: `icon`, `label` (required); `description` optional. |
| `contact` | object | Dark contact footer. Fields: `ctaEyebrow`, `ctaHeadline`, `ctaBody`, `email`, `documentLink`, `footerLine` — all optional. |

**Per-case-card fields:**

| Field | Required | Description |
|:--|:--|:--|
| `id` | yes | Stable slug used as the thumb index chip. |
| `title` | yes | Case/project title (`.case-title`). |
| `role` | yes | Role · sector · year mono line (`.case-role`). |
| `outcomes[]` | yes | 1–3 measured result cells. Each: `value`, `label` (required); `unit`, `tone` (`ok \| risk \| hold`) optional. |
| `sectorTag` | no | Mono pill above the title (`ref · sector`). |
| `description` | no | 1–2 sentence summary (`.case-desc`). |
| `thumbKind` | no | CSS-art thumbnail variant: `rings \| bars \| grid \| arc \| iso \| wave \| mark`. |
| `tags[]` | no | Technology/method pills at the card bottom. |
| `status` | no | Card-level status badge: `ok \| hold \| risk`. |

---

## Icons

Icon assets: [`../icons/`](../icons/) — inline SVG, `currentColor`, system.

Recommended categories for portfolio content:

| Category | Use |
|:--|:--|
| `editorial` | Hero eyebrow marks, section dividers, wordmark accent squares |
| `data` | Capability band cells (charts, analytics, data platform capabilities) |
| `people` | Capability cells (team, org, HR-related capabilities) |
| `commerce` | Capability cells (banking, payments, financial product capabilities) |

Browse available icons: [`../icons/index.html`](../icons/index.html) or [`../icons/manifest.json`](../icons/manifest.json).
