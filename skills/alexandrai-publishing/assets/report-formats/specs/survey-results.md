# Format: Survey results (question-by-question results readout)

> **Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md)** and the interactive contract from
> [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md) — the 9-theme palette tokens (Black mandatory), system-font type
> scale, rounded panels, whisper shadows, `st-ok/risk/hold` semantics, tabular numbers, and the
> self-contained, data-driven, themeable output rules. It **reinvents only the chrome and layout**: where
> the dashboard is a *live console you scan* and the data-register is a *sortable record grid you query*,
> the survey-results report is a **results readout you read one question at a time**.
>
> **Default theme: Green** (`<html data-theme="green">`; `:root` ships Green here, not Purple).

## When to use
A **survey / poll / questionnaire results report**: employee engagement & pulse surveys, customer CSAT /
NPS studies, market research, post-event feedback, voting / poll readouts, 360 feedback roll-ups. Pick
this when the deliverable is *"here is what people answered, question by question, with the counts and
percentages, sliceable by segment."* Each question is the unit of attention, and the reader's question is
*"how did people answer this one — and how does that change by department/region/cohort?"*

Choose something else when the data is not a per-question distribution: a **dashboard** for live KPIs you
monitor, a **data-register** for a row-per-record grid you search and sort, an **infographic** for a single
oversized stat narrative, a **comparison-grid** for options × criteria. If two questions could be merged
into one chart on a console, you want the dashboard, not this.

## The DISTINCT chrome (this is what makes it a results readout, not a console or a grid)
A centred PC-wide page (`~1500px`) with three structural zones — never a fixed icon nav-rail + widget
grid (that's the dashboard), and never a sticky search/sort toolbar over a full-bleed table (that's the
data-register).

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SURVEY HEADER  · eyebrow · title · fieldwork chip                         │  ← .sv-header
│  ┌ N responses ┐ ┌ completion ┐ ┌ NPS gauge ┐ ┌ sentiment meter ┐         │  ← .sv-summary (recomputes)
├──────────────────────────────────────────────────────────────────────────┤
│  SEGMENT SELECTOR  [ All ][ Engineering ][ Sales ][ Ops ]   count↔% bar↔■  │  ← .sv-controls (sticky)
├──────────────────────────────────────────────────────────────────────────┤
│  Q1  ▸ How likely to recommend …            [nps gauge + 0–10 buckets]     │
│  Q2  ▸ Leadership communicates …            [■■■■ stacked Likert bar]      │  ← .q-block ×N
│  Q3  ▸ Which working arrangement …          [▇▅▃ distribution bars]        │     (stacked vertically)
│  Q4  ▸ One thing to change …                ["…" open-quote list]          │
└──────────────────────────────────────────────────────────────────────────┘
```

1. **`.sv-header` + `.sv-summary`** — a compact editorial header (tracked mono eyebrow = `reportType`,
   bold title, fieldwork/date chips) sitting above a **summary strip** of headline tiles: **N responses**,
   **completion rate**, an **NPS gauge** (semicircular SVG arc, reusing the dashboard gauge technique), and
   a **sentiment meter** (a 100% three-part bar: positive `ok` / neutral / negative `risk`). The summary
   recomputes when the segment changes. This *strip of survey headline numbers* — not a console KPI band,
   not a table toolbar — is the format's opening signature.
2. **`.sv-controls`** — a **sticky segment selector**: a row of `.seg-chip` buttons (one per respondent
   cut, with each segment's `n`), plus global view toggles (**count ↔ %**, **bar ↔ stacked** where apt,
   **sort by count**). Selecting a segment re-derives every distribution and the summary from each option's
   `bySegment` map. This selector *is* the interaction spine — it changes the whole page at once.
3. **`.q-results` › `.q-block`** — the body is a **vertical stack of per-question result blocks**, one
   block per question, read top to bottom. Each `.q-block` has a `.q-head` (number badge `Q3`, optional
   category eyebrow, the full question wording, a type chip, an expand caret) and a `.q-body` whose layout
   is chosen by the question `type`. Blocks are *not* tiles that span a grid and *not* table rows — they
   are full-width result panels you read in order.

## Signature components (class names to use)
- **`.sv-page`** — the centred page container (`max-width ~1500px`, 40px gutter).
- **`.sv-header`** — eyebrow (`reportType`, mono tracked) + `.sv-title` + fieldwork/date `.chip`s.
- **`.sv-summary` › `.sum-tile`** — headline tiles: `.sum-num` (big tnum) for responses & completion; the
  **`.nps-gauge`** (semicircular SVG arc, score in the centre, colour `risk→hold→ok`); the
  **`.sentiment-meter`** (a `.smeter` 100% bar split into `ok`/neutral/`risk` widths with a legend).
- **`.sv-controls` › `.seg-chip` / `.seg-chip.on`** — the **segment selector** pills (label + `n`); plus
  **`.view-toggle`** segmented buttons for count↔% and bar↔stacked, and a **`.sort-toggle`**.
- **`.q-block`** › **`.q-head`** (`.q-num` badge, `.q-cat` eyebrow chip, `.q-text`, `.q-type` chip, expand
  caret) + **`.q-body`**. One of these block bodies per `type`:
  - **`.dist-bars`** (`single` / `multi`) — a list of **`.dist-row`**: label · horizontal `.dist-track`
    with a `.dist-fill` (width = share) · trailing **count + %**. Brand accent fill, or `ok/hold/risk`
    when an option carries a `tone`. The data-driven distribution bar list is the workhorse component.
  - **`.likert-stack`** (`likert`) — a single **100% stacked horizontal bar** of ordered scale segments
    (`.lk-seg`, worst→best, coloured on a `risk → hold → ok` ramp) with a top-/bottom-box favourable
    summary and a segment legend. Hover a segment → its label, count and %.
  - **`.nps-gauge` + `.nps-buckets`** (`nps`) — the semicircular score gauge plus three bucket bars
    (**detractors 0–6** `risk` / **passives 7–8** `hold` / **promoters 9–10** `ok`) with counts and %.
  - **`.rating-meter`** (`rating`) — a mean-score meter over a numeric scale (`scaleMax`) with the mean as
    a big tnum and a filled track; per-point distribution optional.
  - **`.stat-figure`** (`stat`) — a single big `tnum` figure + unit + caption (toned), for headline metrics.
  - **`.quote-list` › `.quote`** (`open`) — a list of verbatim responses, each a `.quote` card with a
    leading `quote` icon / tone marker, the text, and a non-identifying `.q-attr` attribution.
- **`.crosstab`** — the **expanded view**: a compact `.dtable` cross-tab (options × segments, counts and
  %, column totals) revealed when a `.q-block` is expanded. Uses the foundation table primitive.
- Reused primitives: `.st-badge` / `.mini-dot` (tone markers), mono `.chip` (category / type), the
  semicircular **gauge** + the shared floating **`.chart-tip`** tooltip + tooltip technique from
  `sample/dashboard_sample.html`, the `--bg-deep` footer strip, and the canonical 9-dot `.rc-theme` switcher.

## Layout / section outline
```
.sv-page
├─ .sv-header           ← eyebrow (reportType) · .sv-title · fieldwork/date chips · .rc-theme switcher
├─ .sv-summary          ← .sum-tile ×4: Responses · Completion · NPS gauge · Sentiment meter  (recompute on segment)
├─ .sv-controls         ← .seg-chip segment selector  +  count↔% · bar↔stacked · sort-by-count toggles   (sticky)
└─ .q-results           ← vertical stack of .q-block, one per question, e.g.:
     • nps     block  — .nps-gauge + .nps-buckets (detractors/passives/promoters)
     • likert  block  — .likert-stack (100% stacked scale) + favourable summary
     • single  block  — .dist-bars (distribution rows, count + %)
     • multi   block  — .dist-bars (sums > 100%; sortable by count)
     • rating  block  — .rating-meter (mean over scaleMax)
     • open    block  — .quote-list of verbatims
   each block: expand caret → .crosstab (options × segments cross-tab table)
└─ footer strip         ← --bg-deep, mono meta, wordmark + accent square; base size + source line
```
Order is the questionnaire order — top to bottom, one question at a time. There is **no widget grid, no
record table, no search box.**

## Interactions (data-driven, vanilla JS, no libraries)
Every visual has ≥1 real control that re-derives what is shown from the data:
- **Segment filter** — `.seg-chip` selection recomputes **every** distribution bar, Likert stack, NPS
  gauge/buckets, rating meter, and the whole summary strip from each option's `bySegment[key]` counts (and
  that segment's `n` as the denominator). The default/baseline segment is `all`.
- **Count ↔ %** — global toggle switches every trailing figure and bar scaling between raw counts and
  percentages of the active segment's base.
- **Bar ↔ stacked** — where applicable (Likert), toggles between the 100% stacked scale bar and an
  unstacked per-option distribution.
- **Sort options by count** — re-orders the options within `single` / `multi` blocks by descending count
  (toggle back to natural order). Likert/NPS keep scale order.
- **Expand question → cross-tab** — the expand caret reveals a `.crosstab` table (options × segments, with
  counts and %, and column totals) for the full breakdown.
- **Hover a bar / segment** — the shared floating `.chart-tip` shows the option label with its **exact
  count and %** for the active segment.
- In **print**: expand nothing destructive — render the baseline (`all`) distributions as a static, complete
  snapshot in count+%, and hide the segment chips, view toggles, and theme switcher.

## Do / Don't
- **Do** show **both a count and a percentage** on every option; activate `"tnum" 1` on every number.
- **Do** keep all charts **pure CSS/SVG** (distribution bars, stacked Likert, semicircular gauge) so they
  print; reuse the dashboard sample's gauge + tooltip technique rather than inventing a new one.
- **Do** recompute distributions and the summary **from the data** (`bySegment`) on every segment change —
  never fake the segment cut with a hard-coded second chart.
- **Do** map every tone to `ok / hold / risk` only (favourable / neutral / unfavourable, promoter / passive
  / detractor). Single/multi distribution bars may use the plain brand accent.
- **Do** keep one question per `.q-block`, read top-to-bottom in questionnaire order.
- **Don't** wrap this in the dashboard's fixed icon nav-rail + widget grid, or the data-register's sticky
  search toolbar + full-bleed sortable table — those are different formats.
- **Don't** turn the page into a single mega-chart or a record grid; the unit is the **question block**.
- **Don't** invent a 4th semantic colour or add prose sections, a TOC, or a narrative intro — this is a
  results readout, not an article.

## How this differs from the dashboard and the data-register
The **dashboard** is a live operations console (fixed left icon nav-rail, top KPI band, a 12-col grid of
gauge/chart/status *widgets* you scan at a glance, virtually no labels-as-questions). The **data-register**
is a data-grid application (sticky search/filter/sort toolbar over a full-bleed, dense, sortable
*row-per-record table* with an expanding detail drawer). The **survey-results** report shares their
primitives (gauge, bars, tooltip, table) but its chrome is a centred page whose body is a **vertical stack
of per-question result blocks** governed by a **segment selector** — you read it one question at a time and
slice it by cohort, you do not monitor it or query rows.

## Data schema

Full field contract: [`schemas/survey-results.schema.json`](schemas/survey-results.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome — `org`, `project`, `reportType`, `title`, `date`, `theme` (default `"green"`). Optional: `subtitle`, `author`, `fieldwork`. |
| `summary` | object | Headline numbers for the summary strip. Required `responses`; optional `invited`, `completionRate`, `nps`, `sentiment{positive,neutral,negative}`. The baseline ("All respondents") figures; recomputed live per segment. |
| `segments` | array | The segment selector. Each: `key`, `label`, optional `n`. First entry SHOULD be the `all` baseline whose key matches every option's `bySegment` keys. |
| `questions` | array | Ordered question result blocks. Each: `id`, `text`, `type` (`single`\|`multi`\|`likert`\|`nps`\|`rating`\|`open`\|`stat`). Optional: `category`, `scaleMax`, `options[]{label,count,tone?,bySegment?}`, `stat{value,unit?,caption?,tone?}`, `quotes[]{text,attribution?,tone?}`, `note`. |

## Icons

Icons are drawn inline from the house icon set at [`../icons/`](../icons/) per `../icons/SPEC.md`, sized with
`.icon{width:1.15em;height:1.15em}` and coloured via `currentColor` (so a marker inside an `ok`/`hold`/`risk`
context recolours automatically, and every icon follows the active brand theme). Survey-results-relevant
categories:

- **`data`** — distribution / bar-chart, gauge, percent-ring, donut, target (questions, NPS, rating meters)
- **`status`** — check-circle, warning-triangle, dot-ok / dot-hold / dot-risk (sentiment, promoter/detractor tones)
- **`people`** — users-team, persona, group, respondent / segment markers (segment selector, response counts)
- **`editorial`** — quote, key-point, insight, note, list-bullet (open-response quote list, analyst notes)

Never use emoji (no thumbs / smiley / star ratings as glyphs) or generic "AI" marks — draw the
domain-specific house icon instead.
