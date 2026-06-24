# Long-form report — format spec (`long-form-report.md`)

> **The canonical anchor.** This is the format the whole system is distilled from
> (`_FOUNDATION.md` was written by reverse-engineering it). It reproduces the reference report
> **exactly**: a thin sticky top bar → a compact hero → a 3-column `208px TOC | 1fr | 244px rail`
> body with **both** side rails sticky → a stack of rounded section panels with header bands → a
> dark split-diff exhibit → a collapsible appendix reference-index. Every other format in the
> gallery is defined as *"a divergence from this frame."* If you are building any other format,
> do NOT copy this chrome (see §9).
>
> Default theme: **Purple** (matches the reference). Read `_FOUNDATION.md` first — this spec only
> adds the chrome, the section flow, and the component contracts on top of the shared DNA.

---

## 1. What it inherits from `_FOUNDATION` (do not re-decide these)

- **Output rules (§0).** ONE self-contained `.html`; CSS in a single inline `<style>`; icons inline
  as `<svg>`; system fonts only; **no external requests**; brand-neutral `{{ORG}}` / `{{PROJECT}}` /
  `{{REPORT_TYPE}}` / `{{DATE}}` / `{{AUTHOR}}` placeholders in the chrome; readable with JS off.
- **The full 8-theme token block** in `:root` (Purple default), `html[data-theme="…"]` overrides.
  Accent = the swappable `--navy*` family; `--risk`/`--hold` and all neutrals are constant.
- **Type (§2):** `13px/1.6` body, `--sans` everywhere except `--mono` for IDs/paths/code/labels;
  the dense 13px base is the signature — do **not** inflate it.
- **Density & shape (§3):** rounded panels (`12px` large, `10–11px` nested, `5–6px` chips), flat
  elevation (whisper shadow only), compact spacing, `--bg-band` header strips / `--bg-subtle`
  insets.
- **Shared primitives (§4):** `.st-badge` (dot+text, `st-ok`/`st-risk`/`st-hold`), mono chips,
  `.ref-chip`, the dark `.diff-split`, the `2px`-rule data table, the key/value grid, the dark
  footer. Reuse these EXACT patterns.
- **Icons:** house SVG set inlined (24×24, `stroke:currentColor`, `1.75`, round caps), sized with
  `.icon{width:1.15em;height:1.15em;vertical-align:-.18em}`. Colour follows `currentColor`.

This format **adds nothing to the palette or type scale**; its job is to be the reference layout.

---

## 2. When to use it

Use the long-form report when the deliverable is a **document meant to be read top-to-bottom and
forwarded**: an audit, an assessment, a postmortem, a due-diligence write-up, a security review, a
data-model review, a root-cause analysis. Anything that is *argument + evidence*: a thesis in the
hero, an ordered chain of sections that builds it, code/data exhibits inline, and an appendix that
lets a reviewer trace every claim back to a source.

**Use a different format when:** the artefact is glanceable not readable (→ dashboard), is a sortable
record (→ data-register), is a plan/board (→ kanban / timeline), is presented from a room (→
presentation), or must fit one view (→ one-pager). If it has a TOC and prose sections, it is this.

---

## 3. The chrome (the reference, exactly)

A single centred column, `max-width:1280px`, `viewport width=1280`. Four bands stacked vertically:

1. **Thin sticky top bar** (`.topbar`, `position:sticky; top:0`). One row: a wordmark
   (`{{ORG}}` + a faint `{{REPORT_TYPE}}` sub-label) on the left; a breadcrumb + generated-timestamp
   on the right. `~10px` vertical padding, `1px` bottom rule, white. It is a *spine label*, not a
   nav bar — no menu, no buttons.
2. **Compact hero** (`.hero`). Tracked-uppercase **eyebrow** (mono, accent) → big **title**
   (`24–26 / 800`, `≤72ch`) → a row of **badges** (verdict / category / severity / status, mono
   pills) → a **standfirst** paragraph (`.hero-sum`, `14px/1.8`, `--ink-mid`) stating the thesis in
   2–3 sentences → an optional `.hero-meta` strip (tracked key/value run) above a hairline. Bottom
   `1px` rule separates hero from body.
3. **3-column body** (`.content`): `grid-template-columns:208px minmax(0,1fr) 244px; gap:40px;
   align-items:start`. Left = sticky TOC, centre = the article, right = sticky metadata rail.
4. **Dark footer** (`.footer`, `--bg-deep`): wordmark + accent square left, uppercase mono meta +
   confidentiality line right.

**Responsive collapse** (keep these breakpoints):
`@media(max-width:1280px){ grid → 208px 1fr; .rail{display:none} }` ·
`@media(max-width:1000px){ grid → 1fr; gap:20px }`. Rails drop before the article does.

### Sticky rails + scroll-spy
- **Left TOC** (`.toc`, `position:sticky; top:64px`): a `.toc-label` ("Contents") over a column of
  links, each a `grid: 28px 1fr` of a mono section number `.n` + a title. The active section's link
  gets `.active` (accent text, weight 700) driven by an `IntersectionObserver` (`rootMargin:
  '-96px 0px -70% 0px'`) that watches every `.sec`. **Define the `.toc a.active` rule** — the
  reference JS sets the class but forgot the CSS; you must style it.
- **Right rail** (`.rail`, `position:sticky; top:64px`): one or more `.rail-card`s — a rounded box
  with a banded mono header (`.rail-card-hd`) over a `.rail-facts` definition list (`grid: ~70px
  1fr`, hairline row dividers, mono values). This is the *at-a-glance metadata* (owner, period,
  scope, classification, distribution). It does NOT repeat the article; it indexes it.
- Both rails use `scroll-margin-top` so anchor jumps clear the sticky top bar; sections set
  `scroll-margin-top:84px`.

---

## 4. Signature components (with class names — reuse verbatim)

| Component | Class(es) | Contract |
|:--|:--|:--|
| **Top bar** | `.topbar` / `.topbar-inner` / `.logo` `.crumb` `.topbar-gen` | sticky spine label; wordmark + breadcrumb + timestamp. |
| **Hero** | `.hero` / `.hero-eyebrow` `.hero-title` `.hero-badges .badge` `.hero-sum` `.hero-meta` | eyebrow→title→badges→standfirst→meta. Badge variants `.badge-verdict` / `.badge-cat` / `.badge-sev` recolour to `risk`/accent/`hold`. |
| **TOC** | `.toc` / `.toc-label` / `.toc-nav` / `.toc a` `.n` / `.toc a.active` | sticky scroll-spy index. Number + title rows. |
| **Rail card** | `.rail` / `.rail-card` / `.rail-card-hd` / `.rail-facts dt,dd` / `.rail-screen` | sticky metadata box; banded header + key/value list; `.rail-screen` = mono accent token chip. |
| **Section panel** | `.sec` / `.sec-head` / `.sec-num` / `.sec-head h2` / `.sec-head-links` | rounded `12px` panel; banded header with a mono section-number chip, an H2, and right-aligned link icons. All non-head children are inset `24px`. |
| **Key/value grid** | `table.incident-info` (or `.kv-grid`) | `repeat(4,1fr)` rounded grid; tiny uppercase keys over mono values; hairline cell dividers. Collapses to 2-col on narrow. |
| **Phenomenon / rows** | `.phenomenon` / `.phen-row` / `.phen-k` `.phen-v` | labelled fact rows inside a rounded inset; risk-coloured keys for deviation rows. |
| **Cause chain** | `ol.cause-chain` / `.chain-num` `.chain-line` / `.chain-headline` `.chain-detail` / `.chain-evref` | numbered vertical stepper; accent square number, connector line, headline + detail, mono evidence-ref chips that link into the appendix. |
| **Fix / finding card** | `.fix-card-grid` / `.fc-head` `.fc-priority` `.fc-where` / `.fc-label` `.fc-text` / `.fc-tldr-list` | bordered card: priority pill + mono location, labelled prose blocks, a 3-line summary list, then a diff. |
| **Dark split-diff** | `.diff-split` / `.diff-header` (`.diff-h-left`/`.diff-h-right`) / `.diff-grid` / `.diff-cell` (`.diff-ctx`/`.diff-add`/`.diff-del`/`.diff-empty`) / `.diff-gutter` `.diff-marker` `.diff-code` | the canonical code-change exhibit: black header, two columns, red `−` / green `+` rows, hatched empty rows. The ONE place (besides the footer) that inverts to dark. |
| **Findings accordion** | `details.finding-row` / `summary` / `.find-id` (`.fi-type` `.fi-code`) / `.find-title` / `.find-meta` / `.find-caret` / `.find-body` | collapsible `<details>` rows; banded summary with a type tag + mono id + title + a `.st-badge` confidence + caret; expanded body holds prose and a mono evidence card. Readable with JS off. |
| **Data / lateral table** | `table.lat-table` (or any) | shared data-table primitive: `2px` ink header rule, mono uppercase `9.5px` heads, hairline rows, `--bg-subtle` hover, top-aligned. |
| **Collapsible section** | `details.sec.sec-fold` / `summary.sec-head` / `.sec-fold-hint` `.sec-fold-caret` | supplement / appendix sections that ship collapsed; auto-open when an in-page anchor targets inside them (JS). |
| **Appendix reference-index** | `details.sec.sec-fold#appendix` / `table.reference-index` / `code.id` / `.evi-link-icon` | the evidence ledger: every `EV-*` id, its type, its source locator (mono), a précis, and an external-source link badge. Cause-chain & findings chips deep-link to its rows (`id="ev-…"`). |
| **Evidence link badge** | `.evi-link-icon` (+ `--gitlab` `--newrelic` `--logging` etc.) | small square mono badge linking out to the source system. |
| **Status badge** | `.st-badge` `.st-ok` `.st-risk` `.st-hold` | shared primitive — dot + text. |
| **Footer** | `.footer` / `.foot-inner` / `.brand-dk` / `.foot-meta` | dark band; wordmark + accent square; uppercase mono meta + confidentiality. |

---

## 5. Section flow (the canonical order)

Hero (thesis) → then 6–8 numbered `.sec` panels, each one move in the argument:

```
Top bar
Hero ........................ eyebrow · title · badges · standfirst · meta
00  Engagement / context .... key/value grid (scope, period, owner, classification)
01  Summary of findings ..... phenomenon rows + a cause-chain (the spine of the argument)
02  Analysis / remediation .. fix/finding cards, each ending in a dark split-diff exhibit
03  Detailed findings ....... findings accordion (<details> rows, ≤ a handful, deep-linked)
04  Key metrics / evidence .. key/value grid + a data table
05  Residual risk ........... id'd risk list
   Supplement (folded) ...... lateral / horizontal-spread table  ← collapsed by default
   Appendix (folded) ........ reference-index ledger              ← collapsed by default
Footer
```

Numbers are sequential; supplement/appendix carry word labels ("補足"/"Appendix"), not numbers. The
hero states the conclusion **first**; the sections justify it; the appendix lets a reviewer audit it.

---

## 6. Colour & voice discipline (on top of `_FOUNDATION §1`)

- Accent (`--navy*`) only for structure: section numbers, the active TOC link, chips, links, the
  cause-chain numbers, the `--bg-deep` footer square. Body ink is `--ink-mid`.
- Exactly three semantic states. Verdict badge → `--risk` when "non-conformant", `--ok` when
  "conformant", `--hold` when "needs review". Never a fourth.
- The only dark surfaces are the footer and code/diff panels. No gradients on text.
- Tracked-uppercase mono labels (`--ink-faint`) are the eyebrow/label voice throughout.

---

## 7. JavaScript (single inline `<script>`, enhancement only)

1. **Scroll-spy:** `IntersectionObserver` over `.sec`, toggling `.active` on the matching `.toc a`
   (`rootMargin:'-96px 0px -70% 0px'`).
2. **Auto-open folded sections:** when a click or `hashchange` targets an id inside a
   `details.sec-fold`, walk up opening every `<details>`, then `scrollIntoView`.

Everything else is static. With JS off: nav links still jump, `<details>` still open on click.

---

## 8. Do / Don't

**Do**
- Keep the body at 13px and the layout tight — density is the brand.
- Lead the hero with the verdict/thesis; let sections justify it.
- Make every evidence chip in the body deep-link to an appendix row, and back.
- Keep both rails sticky; define `.toc a.active`; set `scroll-margin-top` on sections.
- Keep the diff the only inline dark panel besides the footer.

**Don't**
- Don't inflate type, add drop-shadows, or use more than the whisper elevation.
- Don't introduce a 4th status colour or put gradients on text.
- Don't let the right rail restate the article — it indexes, it doesn't narrate.
- Don't bake in a real org name — `{{ORG}}` / `{{PROJECT}}` stay literal in the chrome.
- Don't require JS to read the document.

---

## Data schema

Schema file: [`schemas/long-form-report.schema.json`](schemas/long-form-report.schema.json)

Required top-level fields: `meta`, `hero`, `tocSections`, `sections`, `railFacts`, `references`

| Field | Type | Notes |
|:--|:--|:--|
| `meta` | object | `org`, `project`, `reportType`, `title`, `date`, `theme` required; `subtitle`, `author` optional |
| `hero` | object | `eyebrow`, `title`, `standfirst` required; `badges[]` and `metaItems[]` optional |
| `tocSections` | array | Each entry: `id`, `num`, `title` — drives the left-rail TOC scroll-spy |
| `sections` | array | Each entry: `id`, `num`, `title`, `blocks[]` required; `folded`, `iconCategory` optional |
| `railFacts` | array | Each entry: `label`, `facts[]{key,value}` — renders the sticky right-rail cards |
| `findings` | array | Optional — detailed finding rows for the findings-accordion section |
| `references` | array | Evidence ledger entries for the collapsible Appendix (`id`, `type`, `where`, `brief` required) |

---

## Icons

Icon SVGs are located in [`../icons/`](../icons/) per the house SVG spec (24×24, `stroke:currentColor`, `stroke-width:1.75`, round caps).

Icon categories used in this format: **document**, **status**, **editorial**, **source**, **code**, **data**

---

## 9. How every OTHER format must differ from this frame

This frame = **thin top bar + compact hero + 3-col both-rail sticky layout + stacked rounded section
panels + TOC scroll-spy + appendix**. It is the *only* format allowed to wear it. Every other format
must invent the chrome its artefact actually needs and drop this one: a **dashboard** is an
icon-rail console of widget tiles (no article, no TOC); a **data-register** is a full-bleed sortable
grid under a filter toolbar; a **kanban-board** is horizontal lanes of cards; a **timeline-roadmap**
is a horizontal time canvas with swimlanes; a **presentation** is full-viewport snap slides; a
**one-pager** is a single non-scrolling A4; a **portfolio** is a case-card gallery; an
**infographic** is a vertical poster of oversized numbers and CSS diagrams; a **matrix-canvas** is a
2×2 / SWOT framework; a **magazine** is justified multi-column editorial. They share this format's
**DNA** (palette tokens, 13px type, rounded panels, three states, primitives, self-contained output)
and nothing of its **skeleton**. If another format starts looking like a TOC-plus-sections document,
it has drifted into this lane and is wrong.
