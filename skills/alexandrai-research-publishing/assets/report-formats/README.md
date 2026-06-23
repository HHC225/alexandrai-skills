# Format families — satellite design specs (router)

The core spec **[`../DESIGN.md`](../DESIGN.md)** defines the shared visual **DNA** — the 8-theme
palette, system-font type, the dense 13px register, rounded panels, the status semantics, the
shared primitives, and the bespoke icon set in [`../icons/`](../icons/). **Every format inherits
that DNA.** What changes between formats is the **chrome and layout** — and in this system the
formats are **structurally different document types**, NOT one frame with the content swapped.

The compact, machine-readable build contract every format obeys is **[`_FOUNDATION.md`](_FOUNDATION.md)**
(token block for all 8 themes, type/density/shape rules, shared primitives, the self-contained
output rules, and the per-format distinctness mandate).

## How to use this

1. **Read [`../DESIGN.md`](../DESIGN.md)** — the DNA (colour, type, density, rounded shapes, icons, runtime).
2. **Read [`_FOUNDATION.md`](_FOUNDATION.md)** — the build contract (exact tokens + output rules + the
   table of each format's distinct identity).
3. **Pick the format** below whose *document type* matches the deliverable.
4. **Read that one satellite spec** and build the body to **its own chrome** — do not reuse the
   long-form report frame unless you are building the long-form report.
5. **Ship self-contained**: one `.html`, inline `<style>` + inline `<svg>` icons, system fonts, no
   external requests (see `_FOUNDATION.md` §0). Every `sample/*_sample.html` below is built this way.

## Format catalogue

Each format is a different *kind* of artefact with its own chrome, plus a matching self-contained
sample. Default themes are spread across the palette so the gallery shows the range.

| Format | Distinct identity (chrome differs, not just content) | Spec | Sample | Theme |
|:---|:---|:---|:---|:---|
| **Long-form report** *(anchor)* | thin top bar + compact hero + 3-col both-rail (sticky TOC + metadata rail) + rounded section panels + dark diff | [`long-form-report.md`](long-form-report.md) | `sample/long_form_report_sample.html` | Purple |
| **Dashboard** | monitoring console: fixed left icon nav-rail + top KPI band + widget/tile grid | [`dashboard.md`](dashboard.md) | `sample/dashboard_sample.html` | Blue |
| **Data register** | data-grid app: sticky toolbar (search/filter/sort) + full-bleed dense table + row drawer | [`data-register.md`](data-register.md) | `sample/data_register_sample.html` | Slate |
| **Kanban board** | board: horizontal lane columns + compact cards + WIP cues + swimlanes | [`kanban-board.md`](kanban-board.md) | `sample/kanban_board_sample.html` | Teal |
| **Timeline / roadmap** | horizontal time canvas: time axis + swimlanes + gantt bars + milestone diamonds | [`timeline-roadmap.md`](timeline-roadmap.md) | `sample/timeline_roadmap_sample.html` | Indigo |
| **Presentation (HTML PPT)** | full-viewport 16:9 slides, scroll-snap, keyboard nav, 1 slide/page print | [`slide-deck.md`](slide-deck.md) | `sample/presentation_deck_sample.html` | Purple |
| **One-pager** | single non-scrolling A4/Letter sheet; SCR spine; everything in one view | [`one-pager.md`](one-pager.md) | `sample/one_pager_sample.html` | Plum |
| **Portfolio** | showcase: editorial hero + project-card gallery (CSS-art thumbs) + outcome stats | [`portfolio.md`](portfolio.md) | `sample/portfolio_sample.html` | Cyan |
| **Infographic** | vertical visual poster: oversized stats + CSS process/funnel/pyramid + full-bleed bands | [`infographic.md`](infographic.md) | `sample/infographic_sample.html` | Green |
| **Matrix / canvas** | framework canvas: axis-labelled 2×2 + SWOT + business-model grid | [`matrix-canvas.md`](matrix-canvas.md) | `sample/matrix_canvas_sample.html` | Indigo |
| **Magazine** | editorial feature: title spread + multi-column flow + drop-cap + pull-quotes + figures | [`magazine.md`](magazine.md) | `sample/magazine_sample.html` | Slate |
| **Comparison grid** | decision / feature / pricing matrix: option columns × criteria rows, ✓/✗/rating cells | [`comparison-grid.md`](comparison-grid.md) | `sample/comparison_grid_sample.html` | Teal |
| **Financial statement** | formal P&L / balance sheet / cash flow / ledger — ruled, hierarchical, period columns | [`financial-statement.md`](financial-statement.md) | `sample/financial_statement_sample.html` | Blue |
| **Org chart / hierarchy** | top-down node tree + drawn connectors + collapse + pan / zoom | [`org-chart.md`](org-chart.md) | `sample/org_chart_sample.html` | Indigo |
| **Calendar / schedule** | month / week / resource day-cell grid of events | [`calendar-schedule.md`](calendar-schedule.md) | `sample/calendar_schedule_sample.html` | Green |
| **Runbook / checklist** | operational step-by-step SOP with checkable steps | [`runbook-checklist.md`](runbook-checklist.md) | `sample/runbook_checklist_sample.html` | Cyan |
| **Diagram / topology** | spatial system / network map: nodes + labelled edges + pan / zoom | [`diagram-topology.md`](diagram-topology.md) | `sample/diagram_topology_sample.html` | Purple |
| **Scorecard** | areas × criteria graded (RAG/score/weight) → overall grade | [`scorecard.md`](scorecard.md) | `sample/scorecard_sample.html` | Blue |
| **Incident timeline** | vertical postmortem event log + phase markers + MTTR | [`incident-timeline.md`](incident-timeline.md) | `sample/incident_timeline_sample.html` | Plum |
| **Heatmap grid** | dense N×M graded colour matrix (risk/correlation/activity) | [`heatmap-grid.md`](heatmap-grid.md) | `sample/heatmap_grid_sample.html` | Teal |
| **Flowchart** | BPMN-style process flow: swimlanes + decisions + routed connectors | [`flowchart.md`](flowchart.md) | `sample/flowchart_sample.html` | Indigo |
| **Survey results** | per-question distributions, Likert, NPS, sentiment, segments | [`survey-results.md`](survey-results.md) | `sample/survey_results_sample.html` | Green |
| **Leaderboard** | podium + ranked value bars + tiers + movement | [`leaderboard.md`](leaderboard.md) | `sample/leaderboard_sample.html` | Cyan |
| **Changelog** | reverse-chron release feed + typed change chips + jump rail | [`changelog.md`](changelog.md) | `sample/changelog_sample.html` | Slate |
| **Knowledge base** | category sidebar + searchable Q&A accordion | [`knowledge-base.md`](knowledge-base.md) | `sample/knowledge_base_sample.html` | Blue |
| **Experiment readout** | A/B: control vs variants, uplift %, CI, significance, segments | [`experiment-readout.md`](experiment-readout.md) | `sample/experiment_readout_sample.html` | Purple |
| **Geo-region** | tile-grid choropleth + ranked list + region detail | [`geo-region.md`](geo-region.md) | `sample/geo_region_sample.html` | Teal |
| **Sankey flow** | value-weighted flow ribbons between stacked node columns (flow-of-funds / throughput) | [`sankey-flow.md`](sankey-flow.md) | `sample/sankey_flow_sample.html` | Teal |
| **Treemap** | hierarchical squarified area map sized by value; drill-down by zoom + breadcrumb | [`treemap.md`](treemap.md) | `sample/treemap_sample.html` | Indigo |
| **Diff / code review** | IDE/PR 3-pane: changed-file tree + both-gutter diff + inline review threads + verdict | [`diff-review.md`](diff-review.md) | `sample/diff_review_sample.html` | Slate |
| **Waterfall / bridge** | opening → +/- step bars → closing floating-bar variance bridge + connectors | [`waterfall.md`](waterfall.md) | `sample/waterfall_sample.html` | Blue |
| **Test report** | CI test-run console: result donut + suite tree + case grid + failure drill | [`test-report.md`](test-report.md) | `sample/test_report_sample.html` | Green |
| **Status page** | uptime history: derived status banner + per-component day-bar strips + incident feed | [`status-page.md`](status-page.md) | `sample/status_page_sample.html` | Cyan |
| **Bracket** | knockout tournament: round columns converging via connectors to a champion | [`bracket.md`](bracket.md) | `sample/bracket_sample.html` | Plum |
| **Research paper** | formal academic article: centred serif page + abstract + numbered sections + `[n]` citations → references + equations + interactive figures | [`research-paper.md`](research-paper.md) | `sample/research_paper_sample.html` | Indigo |

> If two formats end up looking alike, one is wrong — push them apart. The whole point is that a
> reader can tell the *document type* at a glance, before reading a word.

## Adding a new format

1. Create `designs/<format>.md` — state what it inherits from `_FOUNDATION.md`, when to use it, its
   **distinct chrome + layout**, its signature component classes, a flow outline, and a Do/Don't.
2. Build one self-contained `sample/<format>_sample.html` exemplar (inline CSS + inline SVG icons,
   system fonts, no external requests) demonstrating every signature component.
3. Register it in the catalogue table above and in `../DESIGN.md` § Format families.

## Samples — one per format, not topic variants

`sample/` holds exactly **one self-contained sample per format** (the 35 `*_sample.html` listed
above) — each a structurally different document type. The earlier same-format topic reports
(`*_report.html`, old square/letterhead look) have been **removed**: they were the one long-form
frame with only the content swapped, which is the opposite of what this gallery demonstrates. The
rule going forward: **one distinct sample per format, never many same-format content variants.** A new
report for a specific topic is generated from the relevant spec — it is not committed to `sample/`.
