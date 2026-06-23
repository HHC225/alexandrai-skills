# Format: Financial statement

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 8-theme palette tokens,
> the system-font stack, the dense 13px body, rounded panels, the three semantic states
> (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.ref-chip`, the key/value grid, the
> mini status dot), and the self-contained output rules (§0). It also obeys
> **[`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md)** — `#report-data` JSON is the only content source, the body
> is built by `render()`, an in-report `.rc-theme` switcher recolours it live, every control is driven
> from the data, and it is a PC-wide deliverable. **Default theme: Blue.**
> What this format reinvents is its **chrome and layout**: a formal, ruled, hierarchical accounting
> statement — not an article, not a dashboard, not a queryable grid.

---

## One-line difference from the others
A financial statement is a **formal accounting document** — a statement masthead (entity · statement
type · period · currency · basis), then **ruled line-item rows with indented hierarchy and
subtotal/total rules**, with **right-aligned tabular-number period columns** and a variance column. It
is sober and print-grade. It is the opposite of **data-register** (no toolbar, no search box, no filter
chips, no sortable record grid, no row drawers) and of **dashboard** (no KPI tiles, no icon nav-rail, no
gauges/widgets). The page reads top-to-bottom as a single continuous ledger, the way an annual report's
*Statements* section reads.

## When to use
A deliverable that is fundamentally **money arranged into a standard accounting statement**, where the
structure (sections → line items → subtotals → totals) and the side-by-side period columns carry the
meaning:

- profit & loss / income statement (P&L) across reporting periods
- balance sheet (assets / liabilities / equity) with a balancing total
- cash-flow statement (operating / investing / financing)
- general ledger / trial-balance summary, fee or cost schedules, budget-vs-actual
- any "line items with indentation, subtotals, and period columns" exhibit inside a financial report

Reach for a different format if the deliverable wants to be *watched at a glance* (dashboard), *queried
and filtered as records* (data-register), or *read as narrative* (long-form / magazine). A statement is
none of those: it is **reckoned**, line by line, and it must foot and cross-foot.

---

## Distinct chrome — a formal, ruled statement
This format must be **unmistakably an accounting statement**, the kind a controller signs and a regulator
reads. Four structural commitments:

1. **A centred statement sheet, not an app shell.** The page is a centred `max-width: ~1500–1680px`
   document on a neutral band, evoking a sheet of accounting paper — not a full-bleed `100vw` tool and
   not a 3-column reading layout. A 40px gutter; the statement column fills the rest.
2. **A statement masthead (`.fs-masthead`)**, not a hero and not a KPI band. It states the **reporting
   entity** (`{{ORG}} · {{PROJECT}}`), the **statement title** (e.g. "Statement of Profit or Loss"),
   and a compact **caption row** of accounting facts: *period covered*, *currency & unit*, *basis of
   preparation* (e.g. "Accrual basis · IFRS"), *status* (Draft/Final/Audited). These read as the formal
   header block of a published statement, set in tracked mono labels over mono values.
3. **The statement body is one ruled ledger (`.fs-statement`)** — the hero of the page. A single table
   with: a **2px ink rule under the column header**, **section header rows** (`kind:"header"`, no
   numbers, a brand-tinted band), **indented line-item rows** (`level` → left padding), **subtotal
   rows** with a hairline rule above, **total rows** with a heavy top rule and a *double* bottom rule
   (the accountant's "double underline" closing a total). The **first column is sticky** (the account
   label) and the **`<thead>` is sticky**, so the line description and the period headings never leave
   the screen on a long statement.
4. **Right-aligned tabular-number period columns + a variance column.** Every period is its own
   right-aligned `tnum` column; the optional **variance column** (`.fs-var`) compares two periods and
   can flip between **absolute** and **%**, with **negative values** rendered in `--risk` (and, in
   accountant's convention, parenthesised). Below the body, a slim **`.fs-footnotes`** block carries
   numbered notes referenced by line items.

Density is sober, not cramped: ~8–10px vertical cell padding, generous right padding on number columns,
hairline `--rule-soft` dividers between items, heavier ink rules reserved for subtotals/totals only.

### Layout outline
```
.fs-page                              ← centred sheet, max-width ~1500–1680px, neutral band behind
├─ .fs-topbar (sticky, slim)          ← {{ORG}} · {{PROJECT}} wordmark · .rc-theme switcher · print hint
├─ .fs-masthead                       ← entity, statement title, and the accounting caption row…
│  ├─ .fs-title                        ← e.g. "Statement of Profit or Loss"
│  └─ .fs-caption (key/value grid)     ← Period · Currency/Unit · Basis · Status (mono labels + values)
├─ .fs-controls (sticky band)         ← the statement's controls (NOT a search toolbar):
│  ├─ .fs-coltoggle                     ← per-period show/hide toggles (one chip per period)
│  ├─ .fs-vartoggle                     ← variance: show/hide · % ⇄ absolute
│  ├─ .fs-commonsize                    ← common-size %: each line as % of revenue/total (toggle)
│  ├─ .fs-negtoggle                     ← highlight negative values (toggle)
│  └─ .fs-expandall                     ← expand / collapse all subtotal groups
└─ .fs-sheet (scrolls)
   └─ table.fs-statement               ← sticky thead, sticky first col; THIS is the page
      ├─ thead   (2px ink rule, mono uppercase labels, period columns right-aligned, variance last)
      └─ tbody
         ├─ tr.fs-row.fs-header[data-gid]      ← section header (Revenue / Cost of sales / …), collapses its group
         ├─ tr.fs-row.fs-item[data-level][data-parent]  ← a line item, indented by level
         ├─ tr.fs-row.fs-subtotal              ← subtotal (rule above; e.g. Gross profit)
         └─ tr.fs-row.fs-total                 ← total (heavy rule above + double rule below; e.g. Net income)
   └─ .fs-footnotes                    ← numbered notes (¹ ² ³) referenced by line items
   └─ .fs-signoff (optional)           ← "Prepared by / Reviewed by / {{DATE}}" mono block — the signed feel
   .fs-footer (--bg-deep band)         ← wordmark + accent square + mono meta
```

---

## Signature components (class names)
- **`.fs-page`** — the centred statement sheet (`max-width:~1500–1680px; margin-inline:auto`) on a
  `--bg-band` surround. This *replaces* both the long-form 3-col frame and the register's full-bleed
  shell. No nav-rail, no toolbar.
- **`.fs-masthead`** — the formal header block: entity wordmark, `.fs-title` statement name, and the
  `.fs-caption` accounting facts. Set on `--bg-subtle` with a hairline bottom rule; the title is the
  largest type on the page (24–26 / 800), the caption is mono key/value.
- **`.fs-caption`** — a compact **key/value grid** (reuses the family primitive): `Period covered`,
  `Reporting currency` + `Figures in` (unit, e.g. "thousands"), `Basis of preparation`, `Statement
  status` (a `.st-badge`: Draft = `hold`, Final/Audited = `ok`). Tiny tracked uppercase mono keys.
- **`.fs-controls`** — a sticky control band (NOT a search toolbar): the statement's mandatory controls,
  built from family chips/toggles. Distinct from data-register because there is **no free-text search,
  no record filtering, no sort** — these controls reshape how the *figures* are presented, not which
  *records* survive a query.
  - **`.fs-colperiod[data-period]`** — one toggle chip per period; click hides/shows that period column.
    Active = brand accent; hidden = muted/struck. (≥2 periods must stay visible.)
  - **`.fs-vartoggle`** — variance control: a show/hide switch plus a **% ⇄ absolute** segmented toggle.
    Hidden by default-off is allowed; default is **on, absolute**.
  - **`.fs-commonsize`** — "common-size %" toggle: re-expresses each line as a percentage of a chosen
    base line (revenue for P&L; total assets for a balance sheet), shown inline beside or instead of the
    currency figure. A second segmented control picks *value · common-size · both*.
  - **`.fs-negtoggle`** — "highlight negatives" toggle: when on, negative figures render in `--risk` and
    parenthesised `(1,234)`; when off, a neutral leading minus. (Default **on**.)
  - **`.fs-expandall`** / per-header **`.fs-disclosure`** — expand/collapse subtotal groups via the
    `level` hierarchy; a header row's chevron rotates and hides/shows its child `data-parent` rows while
    keeping the subtotal visible.
- **`.fs-statement`** — the ruled ledger table (extends the foundation data-table, but tuned for
  accounting, not record-listing):
  - `thead` **sticky**, 2px `var(--ink)` bottom rule; **period columns right-aligned**, mono uppercase
    `10px` `--ink-faint` labels; variance column last, separated by a thin left rule.
  - **first column sticky** (`.fs-label`) so the account description stays put on horizontal scroll.
  - **`.fs-header`** — section header row: brand-tinted `--navy-bg` band, `--navy-deep` bold label, no
    figures; doubles as the group collapser.
  - **`.fs-item`** — a line item; `data-level` drives left padding (`level 0..n` → indent). Hairline
    `--rule-soft` divider. Optional `note` shows a superscript marker; `emphasis:true` bolds the row.
  - **`.fs-subtotal`** — subtotal row: a `1px var(--ink-soft)` rule **above**, semibold label + figures.
  - **`.fs-total`** — total row: a `2px var(--ink)` rule above **and a double rule below** (the
    accountant's double-underline, via a `box-shadow`/`border` pair), heaviest weight on the page.
  - **`.fs-num`** — numeric cell: `text-align:right; font-variant-numeric:tabular-nums; font-feature-settings:"tnum" 1;`
    mono, with comfortable right padding. **All numbers on the page are tnum.**
  - **`.fs-neg`** — negative figure styling (red + parentheses) when "highlight negatives" is on.
  - **`.fs-var`** — variance cell: signed delta with a tiny `trend-up`/`trend-down` glyph; positive in
    `--ok`, negative in `--risk`; toggles between absolute and `%`.
- **`.fs-footnotes`** — numbered notes block under the statement; each note `id` is referenced from a
  line item's superscript. Mono numerals, `--ink-soft` text.
- **`.fs-signoff`** *(optional)* — a small "Prepared by / Reviewed by / Date {{DATE}}" mono block giving
  the signed-document feel; hidden detail, printed.

Reuse the family primitives verbatim: `.st-badge` (statement status), `.ref-chip` (note references), the
key/value grid (`.fs-caption`), the mini status dot. Inline house SVG icons (`ledger`, `balance-scale`,
`coin-yen`/`coins-stack`, `trend-up`, `trend-down`, `chevron-down`, `percent-interest`) per
`../icons/SPEC.md` — never emoji.

---

## Data fields summary
`#report-data` is a valid instance of [`schemas/financial-statement.schema.json`](./schemas/financial-statement.schema.json):

- **`meta`** — shared block (`org`, `project`, `reportType`, `title`, `subtitle`, `date`, `author`,
  `theme`). `theme` defaults to `"blue"`.
- **`statementType`** — `"pl" | "balance" | "cashflow"` (drives the title vocabulary + common-size base).
- **`currency`** — `{ code:"USD", symbol:"$", unit:"thousands", basis:"Accrual · IFRS", status:"draft|final|audited" }`.
- **`periods[]`** — ordered columns: `{ key, label }` (e.g. `{"key":"fy26","label":"FY2026"}`). Newest first.
- **`lines[]`** — the statement rows, in display order:
  `{ id, label, level (0..n indent), kind:"item|subtotal|total|header", values:{ periodKey→number },
     parent?, note?, emphasis? }`. `header`/`subtotal`/`total` carry the ruling; `level` drives indent;
  `parent` ties an item to its collapsible section header.
- **`variance`** *(optional)* — `{ basePeriod, comparePeriod, defaultMode:"abs|pct", show:true }`:
  which two period keys the variance column compares and how it starts.
- **`commonSize`** *(optional)* — `{ baseLineId, label }`: the line every figure is divided by under the
  common-size toggle (e.g. total revenue / total assets).

The sample `#report-data` is a realistic fictional **P&L across three periods (FY2024 / FY2025 /
FY2026)** with sections (Revenue, Cost of sales, Gross profit subtotal, Operating expenses, Operating
income, Net finance, Income before tax, Tax, Net income total) and a variance column.

## Interactions (all mandatory, all data-driven)
| Control | Behaviour |
|:--|:--|
| **Period column show/hide** (`.fs-colperiod`) | toggle each period column in/out; layout reflows; ≥2 stay on |
| **Expand / collapse groups** (`.fs-disclosure`, `.fs-expandall`) | collapse a section's items under its header via the `level`/`parent` hierarchy; subtotal stays visible |
| **Variance show/hide + % ⇄ absolute** (`.fs-vartoggle`) | toggle the variance column; switch between signed absolute and signed % between the two configured periods |
| **Highlight negatives** (`.fs-negtoggle`) | recolour negative figures `--risk` and parenthesise them; off → neutral minus |
| **Common-size %** (`.fs-commonsize`) *(bonus, implemented)* | re-express each line as % of the base line (revenue/total); modes *value · common-size · both* |

All interactions filter/recompute from `#report-data` and re-render (or show/hide) — never faked.
Transitions ≤150ms. **Sticky `<thead>` + sticky first column** throughout. In **print**, everything
expands to a complete static snapshot, all configured period columns show, the controls and theme
switcher hide, and the sticky chrome flattens to normal flow.

---

## Do / Don't
- **Do** make ONE ruled statement the hero — masthead → ledger → footnotes — that foots and cross-foots.
- **Do** right-align every figure, set it in `tnum` mono, and keep the first column + header **sticky**.
- **Do** use real accounting ruling: hairline dividers for items, a rule above subtotals, a heavy rule +
  double underline on totals; section-header bands for groups.
- **Do** parenthesise negatives and colour them `--risk` when "highlight negatives" is on.
- **Don't** add a search box, sortable record columns, filter-status chips, or row drawers — that is the
  **data-register**, and this must not resemble it.
- **Don't** use KPI stat-tiles, gauges, a left icon nav-rail, or a widget grid — that is the
  **dashboard**.
- **Don't** centre-align or left-align numeric columns, mix proportional digits, or drop the tnum.
- **Don't** wrap it in the long-form hero/TOC/rail frame; the statement is a self-contained sheet.
- **Don't** invent a 4th status colour or use emoji icons; obey the foundation palette + house icon set.

## Exemplar
`sample/financial_statement_sample.html` — a fictional consolidated **Statement of Profit or Loss** (Blue
theme) across FY2024 / FY2025 / FY2026: a statement masthead with the accounting caption row, a sticky
control band (period toggles, variance %⇄abs, common-size, highlight-negatives, expand/collapse), and one
ruled ledger with indented sections, subtotal/total rules, a variance column, and numbered footnotes —
all rendered from `#report-data` and live-themeable.
