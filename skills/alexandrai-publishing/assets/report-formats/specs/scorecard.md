# Format: Scorecard

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 9-theme palette tokens
> (incl. mandatory **Black**), the system-font stack, the dense 13px body, rounded panels, the three
> semantic states (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.ref-chip`, mono chips,
> the key/value grid), and the self-contained output rules (§0). It is also a **data-driven interactive
> report** per [`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md): the body is rendered from a single `#report-data`
> JSON instance, carries the mandatory 9-dot in-report theme switcher, and every visual has a real
> control. **Default theme: Blue.**

---

## One-line difference from the others
A **periodic assessment scorecard**: assessment **areas** are graded cards/rows, each carrying a **0–100
score**, a **RAG roll-up** from its criteria, a **trend arrow** vs last period, and a **weight** that
sets its contribution to one **overall grade banner** at the top. It answers *"how are we doing this
period, and where?"* — it is **not** a live monitoring console (dashboard: real-time tiles/gauges), and
it is **not** an options×criteria decision matrix (comparison-grid: pick one of several columns). This
is **areas × criteria, graded for a single period**, rolled up to a grade.

## When to use
A recurring **assessment / grading** artefact that scores a few areas and rolls them into one verdict:

- quarterly programme / project health scorecards (delivery, quality, risk, budget, team)
- vendor or supplier performance reviews; SLA / service scorecards per period
- maturity / readiness assessments (security posture, ops readiness, audit readiness)
- balanced-scorecard-style reviews where each area is weighted and trended period over period

Reach for a different format if the deliverable is *live metrics watched at a glance* (dashboard),
*choosing one option from several* (comparison-grid), *many records queried* (data-register), or *read
top-to-bottom as prose* (long-form).

---

## Distinct chrome + layout model
This must read **unmistakably as a graded assessment**, not a console and not a decision matrix. Four
structural commitments:

1. **An overall grade banner leads.** A wide `.sc-overall` banner pairs a large **grade gauge / ring**
   (the rolled-up score, coloured by its scale band) with the **grade label**, the **period**, a
   **period-over-period delta** (`▲▼` vs `prevScore`), and a one-line assessor statement. The banner is
   the headline; everything below substantiates it.
2. **Areas are graded cards, then a graded table.** The primary view is a responsive grid of
   **`.sc-card`** area cards — each a self-contained grade: name + icon, a **score chip** band-coloured,
   a **trend arrow**, a **RAG strip** summarising its criteria, a **weight tag**, and a **contribution
   bar**. A toggle flips the same data to a dense **`.sc-table`** (area · score · RAG · weight ·
   contribution · trend) for a print-friendly ledger read. Cards/rows are the signature — not tiles, not
   columns-per-option.
3. **Criteria live inside an expanded area.** Clicking an area expands a **`.sc-criteria`** panel: each
   criterion is a **RAG-rated line** (`ok`/`risk`/`hold`/`na` dot + label + optional mini score bar),
   with its evidence note on hover. Criteria are detail-on-demand, never the top level.
4. **A scale legend, not a search toolbar.** A slim sticky **`.sc-bar`** carries the controls (sort,
   RAG filter, weighted/raw toggle, period-compare, expand-all, theme switcher) and a **band legend**
   (the scale's grade bands as coloured chips). No global search box, no facet rail, no result count, no
   full-bleed `100vw` app shell.

There is **no** left icon nav-rail (dashboard), **no** option header cards (comparison-grid), **no**
record drawer (data-register), **no** prose TOC + side rails (long-form). Use a **centred** container
(`max-width:~1500px`, 40px gutter).

## Signature components (class names)
- **Overall banner** — `.sc-overall` with a `.sc-gauge` (conic-gradient score ring drawn in CSS, band
  tone), `.sc-grade` (large grade label), `.sc-period`, `.sc-delta` (`▲`/`▼`/`▬` vs previous period),
  and `.sc-statement` prose. A `.sc-recompute` note flags any divergence between the assessor score and
  the live weighted/raw roll-up from `areas`.
- **Area card** — `.sc-card` (`border-radius:12px`) with `.sc-card-head` (icon + `.sc-name`), a
  band-toned `.score-chip` (the 0–100 score), a `.sc-trend` arrow, a `.rag-strip` (one pip per criterion
  in `ok`/`risk`/`hold`/`na`), a `.w-tag` weight pill, and a `.contrib-bar` (weighted contribution to the
  overall). Selected/expanded card gets `.is-open`.
- **Score chip / band tone** — `.score-chip` recoloured by the matched scale band via `.tone-ok` /
  `.tone-risk` / `.tone-hold` / `.tone-brand`; the same band tones colour the gauge and legend.
- **RAG strip & dots** — `.rag-strip` of `.rag-dot` (`.rag-ok` / `.rag-risk` / `.rag-hold` / `.rag-na`)
  built from the `_FOUNDATION` mini-status-dot; this is what the RAG filter targets.
- **Criteria panel** — `.sc-criteria` (expanded, on `--bg-subtle`) listing `.crit-row`s: a leading
  `.rag-dot`, `.crit-label`, an optional `.crit-bar` mini score, and a `.crit-note` on hover.
- **Trend arrow** — `.sc-trend` `.tr-up` / `.tr-down` / `.tr-flat` (house `trend-up` / `trend-down` /
  arrow icons; up=`ok`, down=`risk`, flat=neutral).
- **Scale legend** — `.sc-legend` row of band chips (label + range), each tinted by tone; doubles as a
  reading key for every score chip and the gauge.
- **Score bar / contribution** — `.contrib-bar` (weighted share of the overall) and `.crit-bar`
  (criterion sub-score) reuse the foundation track+fill pattern, brand-filled.
- **Control bar** — `.sc-bar`: a **Sort** `<select>` (by score / weight / name), **RAG filter** chips,
  a **Weighted ⇄ Raw** toggle, a **Period compare** toggle, an **Expand all** button, a **Cards ⇄ Table**
  view toggle, and the standard 9-dot **`.rc-theme`** switcher (Black included).
- Reused foundation primitives: `.st-badge`, `.ref-chip`, mono chips, the data table, the dark footer
  wordmark.

## Section / flow outline
1. **Masthead** (`.sc-masthead`) — eyebrow (`{{REPORT_TYPE}}`), title, standfirst, `{{ORG}} · {{PROJECT}}`
   wordmark + `{{DATE}}`. Compact, not a hero with rails.
2. **Overall banner** (`.sc-overall`) — grade gauge + grade + period + Δ + statement; the headline verdict.
3. **Control bar** (sticky) — sort · RAG filter · weighted/raw · period compare · expand-all · view toggle
   · scale legend · theme switcher.
4. **Area grade view** — the `.sc-card` grid (default) or the `.sc-table` ledger (toggled); each area
   expands to its `.sc-criteria`.
5. **Footer** — dark band, mono meta, brand wordmark + accent square.

## Data fields (summary — full contract in `schemas/scorecard.schema.json`)
`meta` (shared chrome + `theme`, default `blue`) · `scale` `{min,max,bands[]{label,min,max?,tone}}`
(the grade bands every score buckets into) · `areas[]`
`{id,name,icon?,summary?,weight,score,prevScore?,trend:"up|down|flat",criteria[]{label,rating:"ok|risk|hold|na",score?,note?}}` ·
`overall` `{grade,score,period,prevScore?,prevPeriod?,statement?}`. The sample's `#report-data` is a
valid instance.

## Interactions (MANDATORY — all driven from the data, vanilla JS)
- **Sort areas** — a select reorders the cards/rows by **score**, **weight**, or **name** (asc/desc); the
  contribution bars and ledger reflow.
- **Filter by RAG rating** — chips (`ok` / `risk` / `hold`) show only areas whose criteria include that
  rating; the overall roll-up note updates to the filtered-visible set.
- **Expand area → criteria** — clicking a card/row reveals its `.sc-criteria` panel; **Expand all** opens
  every area for a complete print snapshot.
- **Weighted ⇄ Raw score** — toggles the overall roll-up (and each contribution bar) between the
  weight-normalised total `Σ(weight·score)/Σweight` and the plain mean of area scores; the banner
  recomputes from the data either way.
- **Period compare** — when on, every score chip and the banner show the **delta vs `prevScore`** with a
  `▲`/`▼` and the previous figure; off hides the deltas for a clean current-period read.
- **Hover criterion → note** — hovering a `.crit-row` (or RAG pip) surfaces its evidence `note`.
- **Theme switcher** — the standard 9-dot `.rc-theme` (Black mandatory) recolours live; initial theme =
  `meta.theme`.

In **print**, expand every area's criteria, force the cards view (or both), drop hover/selection tint to
hairlines, render a complete static snapshot, and hide the control bar and theme switcher.

## Layout outline (build order)
1. Tokens + all 9 `[data-theme]` blocks (incl. `black`) → `.sc-*` layout → primitives → `@media print`.
2. `#report-data` JSON (valid instance) → `<noscript>` notice → hidden `.wrap` built by `render()`.
3. Masthead text from `meta` → overall banner (gauge + grade + Δ + statement, recomputed roll-up).
4. Control bar (sort / RAG filter / weighted-raw / period-compare / expand-all / view toggle / legend /
   theme) → area card grid + table ledger → per-area criteria panels.
5. Wire interactions (mutate state → re-render or show/hide); init theme from `meta.theme`.

## Do / Don't
- **Do** lead with the **overall grade banner** rolled up from the areas, and make the roll-up recompute
  live when columns are filtered or the weighted/raw toggle flips — the verdict must be earned from data.
- **Do** keep **areas as graded cards/rows** and **criteria as expand-on-demand RAG lines**; band-colour
  every score chip and the gauge from `scale.bands`.
- **Do** drive every control from the JSON (sort/filter/toggle actually re-derive the visible set and the
  roll-up). Use `tnum` on every score, weight, and delta.
- **Don't** build a live console of tiles/gauges with a left icon rail — that is the dashboard.
- **Don't** lay areas out as option header **columns** with a *Recommended* ribbon — that is the
  comparison-grid (options×criteria), and copying it collapses the two formats together.
- **Don't** add a search box, facet rail, record drawer, or result-count app bar (data-register), and
  **don't** wrap it in the long-form frame (top bar + two sticky rails + stacked prose sections).
- **Don't** invent a 4th semantic colour or go full-bleed `100vw`; centre at ~1500px.

## Data schema
Full field contract: [`schemas/scorecard.schema.json`](schemas/scorecard.schema.json) (JSON Schema draft
2020-12, with `description` on every field and a realistic `examples[0]`).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome — `org`, `project`, `reportType`, `title`, `date`, `theme` (default `"blue"`, incl. `"black"`). Optional: `subtitle`, `author`. |
| `scale` | object | The 0–100 scale + grade bands. `min`, `max`, `bands[]` each `{label, min, max?, tone}` (`ok`/`risk`/`hold`/`brand`). Bands colour every score chip, the gauge and the legend. |
| `areas` | array | The assessment areas (graded cards/rows). Each: `id`, `name`, `weight`, `score`, `trend` (`up`/`down`/`flat`), `criteria[]` `{label, rating (ok/risk/hold/na)}`. Optional: `summary`, `icon`, `prevScore`, per-criterion `score`/`note`. |
| `overall` | object | The grade banner — `grade`, `score`, `period`. Optional: `prevScore`, `prevPeriod`, `statement`. The template also recomputes a weighted/raw roll-up from `areas` and flags divergence. |

**Optional fields:** `meta.subtitle`, `meta.author`; `scale.bands[].max`; `area.summary`, `area.icon`,
`area.prevScore`; `criterion.score`, `criterion.note`; `overall.prevScore`, `overall.prevPeriod`,
`overall.statement`.

## Icons
Icons are drawn inline from the house icon set at [`../icons/`](../icons/) per
[`../icons/SPEC.md`](../icons/SPEC.md) — 24×24, `fill:none`, `stroke:currentColor`, `stroke-width:1.75`,
round caps/joins. Use `currentColor` so icons recolour automatically inside `ok` / `risk` / `hold`
contexts and across all 9 brand themes. Scorecard-relevant categories:

- **`status`** — check-circle, warning-triangle, shield-check, flag, dot-ok / dot-risk / dot-hold (RAG
  ratings, band tones, the overall verdict mark).
- **`data`** — gauge, trend-up, trend-down, bar-chart, target, delta, percent-ring (the score gauge,
  trend arrows, contribution/criterion bars).
- **`editorial`** — note, key-point, insight, callout, asterisk (assessor summaries, evidence notes,
  the scale-legend key).
- **`process`** — gate-check, milestone, phase, checklist, cycle (period framing, area grouping, the
  graded-criteria list).

Never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
