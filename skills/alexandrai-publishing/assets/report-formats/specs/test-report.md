# Format: Test report (test-execution runner console)

Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md) (9-theme palette incl. Black, dense
13px system-font type, rounded panels, `st-*` status badges, mono labels, dark code panel) and the
[`_DATA_DRIVEN.md`](_DATA_DRIVEN.md) contract (single self-contained HTML, content only in
`#report-data`, `render()` on `DOMContentLoaded`, mandatory `.rc-theme` switcher, every visual carries a
real control, PC-wide). What it reinvents is the **chrome**: a CI test-runner console, not a document.

Default theme: **Green**. `<html lang="en" data-theme="green">`; `render()` re-applies `meta.theme`.

## When to use

Reach for this when the artefact is the **result of running a test suite** — a CI/regression/E2E run you
want a human to triage: which cases passed, which failed, which are flaky, how the run compares to the
previous one, and *why* a given case failed (message + stack + steps). It answers "is the build green,
and if not, what broke?"

Do **not** use it to *grade* areas on a rubric (that is the **scorecard** — it has letter grades and
gauges) or to browse an arbitrary records table (that is the **data-register**). This format is keyed to
the pass/fail/skip/flaky vocabulary and a suite→case run matrix.

## The DISTINCT chrome (this is what makes it a runner console, not an article)

A **full-width app shell** in three zones — there is no thin top bar + double sticky rail, no prose, no
TOC, no section panels stacked down a column.

- **Top summary band (`.tr-summary`)** spanning full width: a **run selector** (`Run #1042 ▾`) that
  switches the active run, an **environment chip**, a **result donut (`.tr-donut`)** drawing
  passed/failed/skipped/flaky as SVG arcs, a big **pass-rate %**, and a key/value strip of totals,
  total duration, and started / finished times. Every number is computed from the active run.
- **Left suite tree (`.tr-tree`)**: collapsible suites → subsuites. Each suite row (`.tr-suite`) shows a
  slim **pass/fail/skip stacked mini-bar** + counts, and rolls up its descendants. Clicking a suite
  scopes the case table to it. An "All" root shows the whole run.
- **Center case table (`.tr-table`)** for the selected suite: columns = **status badge**, case name,
  duration, owner, a **last-N-runs sparkline (`.tr-spark`)** (tiny ok/risk/neutral squares of recent
  runs), tags. Above it: **status-filter chips** (passed/failed/skipped/flaky/all with live counts),
  a **search** box, and **sortable** columns (status / duration / name).
- **Failure-detail panel (`.tr-detail`)**: a case row expands to reveal the failure message, a **stack
  trace in a dark mono block**, **per-step status** rows, and **attachment refs** (names only — no
  external files are ever fetched).

## Signature components (class names to use)

- `.tr-shell` — the full-width app shell (summary band on top; tree + table below).
- `.tr-summary` — top run summary band; `.tr-run-sel` run selector, `.tr-env` env chip.
- `.tr-donut` — SVG result donut (4 arcs); hovering a segment shows its **count + %**. Center holds the
  big pass-rate %. Re-draws when the run changes.
- `.tr-tree` / `.tr-suite` — collapsible suite tree; each `.tr-suite` carries `.tr-minibar` (the slim
  pass/fail/skip stack) + counts; caret toggles children; active suite highlighted.
- `.tr-table` / `.tr-case` — the case grid and its rows; `.tr-filters` (status chips + search + sort).
- `.tr-spark` — the per-case last-N-runs square sparkline (ok / risk / neutral; tooltip per square).
- `.tr-detail` — the expandable failure panel (message, mono `.tr-stack`, `.tr-steps`, attachment chips).
- Reuses foundation `st-badge` (`st-ok` pass / `st-risk` fail / `st-hold` flaky / neutral skip), `chip`,
  `mlabel`, the dark code panel, and the key/value strip.

## Layout / section outline

1. `<noscript>` notice (content is data-driven).
2. `.tr-summary` — run selector · env chip · donut + pass-rate · totals / duration / start-finish strip.
3. `.tr-shell` body grid: **left** `.tr-tree`; **center** `.tr-filters` + `.tr-table` of `.tr-case` rows,
   each able to expand into `.tr-detail`.
4. Dark footer strip (wordmark + accent square), `.rc-theme` switcher in the band (hidden in print).

## Interactions (all data-driven, vanilla JS)

- **Run selector** switches the active run → summary, donut, pass-rate, every case status + duration and
  the sparkline emphasis re-render (ship ≥2 runs).
- **Suite-tree click** filters the case table to that suite, rolling up its descendants; caret
  collapses/expands subsuites.
- **Status-filter chips** (passed/failed/skipped/flaky/all) filter the visible cases; counts are live.
- **Search** by case name; **sortable** columns (status / duration / name, asc↔desc).
- **Row expand** → `.tr-detail` failure panel.
- **Donut hover** → tooltip with that segment's exact count + %.

Suite roll-ups, the donut, totals and pass-rate are **computed from `cases[].results[activeRunId]`** —
never hard-coded.

## Data schema

`designs/schemas/test-report.schema.json`. Top level: `meta` (shared), `runs[]`
`{id,label,env,branch,trigger,startedAt,finishedAt,durationMs}`, `activeRunId`, `suites[]`
`{id,name,parentId?}` (a flat node list → tree), and `cases[]`
`{id,suiteId,name,owner,tags[],history[],results{}}`. Per-run outcomes live in
`cases[].results[runId] = {status:pass|fail|skip|flaky, durationMs, retries?, failure?{message,stack,
steps[]{name,status},attachments[]{name,kind}}}`. The sample's `#report-data` is a valid instance.

## Do / Don't

- **Do** compute the donut, pass-rate, totals and every suite roll-up from the active run's case results.
- **Do** keep four statuses only — pass=`--ok`, fail=`--risk`, skip=neutral/`--ink-faint`,
  flaky=`--hold`; structure/links in `var(--navy)`; body ink `var(--ink-mid)`.
- **Do** show exact values on hover (donut segments, sparkline squares) — never approximate.
- **Don't** wrap this in the long-form report frame (top bar + double rails + prose sections).
- **Don't** add letter grades or rubric gauges (that's the scorecard) or a generic records grid (that's
  the data-register).
- **Don't** fetch attachments — render their names as inert chips; no external requests at all.

## How this differs from the long-form report

The long-form report is an **article**: sticky top bar, both-side sticky rails, stacked rounded section
panels, prose flow. This is a **CI runner console**: a full-width summary band over a suite-tree + case
grid, driven by run switching, status filtering, sort, search and per-row failure drill-down. No
narrative, no TOC, no rails.

## Icons

Inline monoline SVGs per [`../icons/SPEC.md`](../icons/SPEC.md) (`viewBox 0 0 24 24`, `fill:none`,
`stroke:currentColor`, `stroke-width:1.75`, round caps, no `width`/`height` on `<svg>`). Use
domain-forward marks: `flask-test` / `test-checklist` for the suite tree, `check`/`cross`/`retry` for
status, `stack-trace` / `attachment` in the failure panel, `chevron-right` for tree carets, `search`,
`filter`, `sort-asc`/`sort-desc`. BANNED: AI sparkle / lightbulb / rocket / brain, all emoji.
