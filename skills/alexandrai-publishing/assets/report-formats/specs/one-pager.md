# Format: One-pager

> Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md) — palette tokens, the dense
> 13px system-font register, rounded-panel shape language, the three semantic states
> (`ok`/`risk`/`hold`), the shared primitives, and the **self-contained output rules (§0)**. What this
> format reinvents is its **chrome and page model**: there is no scroll, no nav, no TOC — the entire
> deliverable is **one fixed page sized to A4/Letter** that prints as a single sheet.
>
> **Default theme: Plum** (`<html data-theme="plum">` or Plum values in `:root`).

---

## One-line difference from long-form

The long-form report is a *scrolling document* (sticky top bar + both-side rails + stacked section
panels, read top-to-bottom over many screens). The **one-pager is a single printed brief** — a
fixed-size sheet where every zone is visible at once and nothing scrolls; you read it like a sheet of
paper on a desk, not a web page.

## When to use

When the deliverable must **fit on exactly one page and lead with the conclusion**: an executive
decision brief, a funding/ investment ask, a weekly project-status snapshot, a go/no-go memo, a
one-page company or programme profile. Use it when the audience will scan the whole thing in 30
seconds and the answer must be on the sheet — not buried three sections down.

**Reach for a different format when:** the content needs sections, evidence appendices, or scrolls
past one sheet → that's the **long-form report**. A metric wall that updates live → **dashboard**. A
deck read across a room → **presentation**.

---

## Distinct chrome & layout model

A **fixed-dimension sheet**, not a flowing column. The page is a centred `.sheet` exactly one
A4 (or Letter) page tall; content is packed into a **dense multi-zone CSS grid** that fills the sheet
edge-to-edge. The reading spine is **SCR — Situation → Complication → Resolution** — the classic
exec-memo argument shape — flanked by a KPI strip, one CSS/SVG mini-visual, an ask/recommendation
box, and a short risk list.

```
.page  (grey backdrop, centres the sheet, becomes white in print)
└─ .sheet  (210×297mm A4 — or Letter; fixed height, NEVER scrolls)
   ├─ .masthead            ── compact: kicker + title (left) · verdict + date chips (right) · hairline rule
   ├─ .lede                ── one-sentence bottom-line-up-front recommendation (lead with the answer)
   ├─ .kpi-strip           ── 4 KPI cells, big tnum stat + micro label + delta, hairline dividers
   ├─ .grid-main  (2 cols) ──┐
   │   ├─ .scr             ──┤ the spine: three stacked .scr-row (S / C / R), each step-numbered
   │   └─ .visual          ──┘ ONE CSS/SVG mini-chart or 2×2 matrix (no library)
   ├─ .ask-box  (accent)   ── the decision requested / recommendation — 2px brand top rule, fills width
   ├─ .mini-risk           ── compact risk list, each line a label + st-* badge + one-line mitigation
   └─ .sheet-foot          ── thin meta footer: confidentiality · owner · date · {{ORG}} wordmark
```

Layout is built with CSS grid so the zones tile a fixed sheet:

```css
.sheet{ display:grid; grid-template-rows:auto auto auto 1fr auto auto auto;
        gap:7mm; padding:13mm 14mm 9mm; }
.grid-main{ display:grid; grid-template-columns:1.55fr 1fr; gap:7mm; }
```

The `1fr` row (the `.grid-main` band) absorbs slack so the sheet always reads as one balanced page
regardless of small content changes.

---

## Print sizing approach (the heart of this format)

The sheet IS a page. Size it in millimetres and lock the page box:

```css
@page{ size:A4; margin:0; }              /* or  size:Letter;  — switch the .sheet dims to match */
.sheet{ width:210mm; height:297mm; }     /* Letter: 215.9mm × 279.4mm */

@media screen{
  .page{ background:var(--bg-band); padding:24px; min-height:100vh; }
  .sheet{ margin:0 auto; background:var(--bg);
          box-shadow:0 1px 2px rgba(17,19,26,.045), 0 8px 30px rgba(17,19,26,.10); }
}
@media print{
  .page{ background:#fff; padding:0; }
  .sheet{ box-shadow:none; margin:0; }
  .no-print{ display:none !important; }              /* theme picker / print button */
  html,body{ background:#fff; }
}
```

- **One sheet, one page.** Everything lives inside the single `.sheet`; never let content overflow it.
  If you're running out of room, cut words — not pages. The whole point is one sheet.
- The internal `@page margin:0` keeps the printer from adding a second margin on top of the
  sheet's own `13–14mm` padding (which is the real margin you see).
- A faint screen-only drop-shadow makes the sheet read as a piece of paper floating on a grey desk;
  print drops the shadow and the grey backdrop.
- Offer A4 by default; document the Letter swap (change `@page size` and the two `.sheet` dims).

---

## Signature components (with class names)

| Component | Class | What it is |
|:--|:--|:--|
| **Page backdrop** | `.page` | Grey desk that centres the sheet on screen; white in print. |
| **The sheet** | `.sheet` | The fixed A4/Letter page; a 7-row CSS grid. Nothing else scrolls. |
| **Masthead** | `.masthead`, `.mast-kicker`, `.mast-title`, `.mast-chips` | Compact header band: tracked mono kicker + 24–26px title left; **verdict pill** + mono **date chip** right; closed by a 2px ink hairline. |
| **Verdict pill** | `.verdict` + `.v-go` / `.v-hold` / `.v-risk` | The one-word call (PROCEED / HOLD / AT RISK), recoloured by semantic state. |
| **Lede** | `.lede` | BLUF — one bold sentence stating the recommendation up front. |
| **KPI strip** | `.kpi-strip`, `.kpi`, `.kpi .n` (tnum), `.kpi .lbl`, `.kpi .delta` | A single row of 4 metric cells with hairline dividers; big mono `tnum` numbers, micro uppercase label, ▲/▼ delta in `ok`/`risk`. |
| **SCR spine** | `.scr`, `.scr-row`, `.scr-step`, `.scr-head`, `.scr-body` | Three stacked rows — Situation / Complication / Resolution — each with a numbered step token and an icon; the document's argument backbone. |
| **Mini visual** | `.visual` containing `.bars` (CSS bars) **or** `.matrix` (2×2) | Exactly ONE CSS/SVG-drawn exhibit — a mini bar/trend chart or a 2×2 matrix. No charting library. |
| **Ask box** | `.ask-box` (`.accent`) | The decision-requested / recommendation block; 2px brand top rule, brand-tinted, spans full width — the call to action. |
| **Mini risk list** | `.mini-risk`, `.risk-item`, `.risk-label`, `.risk-fix` | Compact 2–4 line risk list; each line pairs a label, an `.st-badge` state, and a one-line mitigation. |
| **Sheet footer** | `.sheet-foot`, `.wordmark` | Thin meta line: confidentiality · owner · date + `{{ORG}}` wordmark with accent square. |

**Reused family primitives:** `.st-badge` (`.st-ok`/`.st-risk`/`.st-hold`) with leading dot; mono
**chips** on `--navy-bg`; the **key/value** mini-grid for decision metadata; tracked uppercase mono
eyebrow/labels; inline `.icon` SVGs from the house set (`document-report`, `check-circle`,
`shield-check`, `bar-chart`, `chevron-right`). All numbers carry `font-feature-settings:"tnum" 1`.

---

## Section / flow outline

1. **Masthead** — kicker (`{{REPORT_TYPE}}`), title (`{{PROJECT}} — …`), verdict pill + date chip.
2. **Lede** — the recommendation in one sentence (answer first).
3. **KPI strip** — the four numbers that justify the call.
4. **SCR spine + mini visual** — *Situation* (where we are) → *Complication* (why act now) →
   *Resolution* (the plan), beside one CSS/SVG exhibit.
5. **Ask box** — the explicit decision requested today.
6. **Mini risk list** — the 2–4 residual risks with state badges + mitigations.
7. **Sheet footer** — confidentiality / owner / date / wordmark.

---

## Do / Don't

- **Do** make it fit ONE sheet, full stop — design at the page size and cut copy until it fits.
- **Do** lead with the conclusion (verdict pill + lede) before any supporting detail.
- **Do** keep prose telegraphic — fragments and one-liners, not paragraphs; this is a brief.
- **Do** keep exactly **one** mini visual and **one** ask box; the page's power is its restraint.
- **Don't** add a TOC, sticky nav, reading-progress bar, or anything that implies scrolling.
- **Don't** let the sheet scroll or spill onto a second page — if it needs sections or an appendix,
  it's a **long-form report**, not a one-pager.
- **Don't** inflate type or whitespace; honour the dense 13px register and the millimetre grid.
- **Don't** invent a fourth status colour or pull in a chart library — CSS/SVG only, per §0.

## Data schema

Schema file: [`schemas/one-pager.schema.json`](schemas/one-pager.schema.json)

Required top-level fields: `meta`, `verdict`, `bluf`, `scr`, `kpis`, `visual`, `ask`, `risks`

| Field | Type | Notes |
|:--|:--|:--|
| `meta` | object | `org`, `project`, `reportType`, `title`, `date`, `theme` required; default theme `plum` |
| `verdict` | object | `label`, `state` required (`ok`/`hold`/`risk`); `decideBy` optional — renders as the masthead pill |
| `bluf` | string | One bold sentence bottom-line-up-front — the .lede band content |
| `scr` | object | `situation.text`, `complication.text`, `resolution.text` — the three SCR spine rows |
| `kpis` | array | Exactly 4 items: `label`, `value` required; `unit`, `delta`, `deltaDirection` optional |
| `visual` | object | `kind` (`bars`/`matrix`), `title` required; `data[]`, `legend[]` optional — ONE exhibit beside SCR |
| `ask` | object | `text` required; `metaItems[]` optional — renders as the full-width ask-box |
| `risks` | array | 1–4 items: `label`, `severity`, `mitigation` required; `severityLabel` optional |

---

## Icons

Icon SVGs are located in [`../icons/`](../icons/) per the house SVG spec (24×24, `stroke:currentColor`, `stroke-width:1.75`, round caps).

Icon categories used in this format: **editorial**, **status**, **data**, **finance**

---

## Exemplar

`sample/one_pager_sample.html` — a fictional Plum-themed programme **decision brief** that fills one
A4 sheet: masthead with PROCEED verdict, BLUF lede, 4-cell KPI strip, an SCR spine beside a CSS bar
mini-visual, an accent ask box, and a three-line risk list with `st-*` badges. Fully self-contained
(inline `<style>` + inline `<svg>`, system fonts, no external requests); prints to a single page.
