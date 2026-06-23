# Report policy — format → schema → fields → icons (the router)

> **The entry contract.** When a user says *"produce this as a `<format>` report"*, follow this file:
> pick the format row, open its **schema** (the exact field contract), fill **only those fields** from
> your analysis, emit the JSON into the sample template's `#report-data`, and the renderer draws it.
> This makes output deterministic and complete — no missing sections, no invented layout.
>
> Reading order: **[`../DESIGN.md`](../DESIGN.md)** (shared DNA) → **[`_FOUNDATION.md`](_FOUNDATION.md)**
> (tokens, 9 themes incl. Black) → **[`_DATA_DRIVEN.md`](_DATA_DRIVEN.md)** (the data-driven + interactive
> + theme-switcher contract) → this file → the one **format spec** + its **schema** + its **sample**.

## How an LLM uses this

1. Choose the format whose *document type* matches the deliverable (table below; full descriptions in
   each `designs/<format>.md` and in `README.md`).
2. Open `designs/schemas/<format>.schema.json` — it lists the **required** and optional fields, each with
   a `description`, plus a worked `examples[0]`.
3. Produce a JSON instance that validates against that schema (always include the shared `meta` object:
   `org, project, reportType, title, subtitle, date, author, theme`). Keep `{{ORG}}`/`{{PROJECT}}` as
   placeholders unless real values are supplied. `theme` ∈ `blue|purple|indigo|teal|cyan|green|plum|slate|black`.
4. Drop the JSON into the format's sample template (`#report-data`) — the inline renderer builds the DOM
   and wires the interactions. Pick icons from [`../icons/`](../icons/) (the categories per format below).

## Router — all 35 formats (1:1 with schema)

| Format | Use when… | Schema | Required top-level fields | Theme | Icon categories |
|:--|:--|:--|:--|:--|:--|
| **long-form-report** | narrative analysis / audit / incident, evidence-forward | `schemas/long-form-report.schema.json` | meta, hero, tocSections, sections, railFacts, references | purple | document, status, editorial, source, code, data |
| **dashboard** | live KPI / SLA / ops monitoring at a glance | `schemas/dashboard.schema.json` | meta, navItems, kpis, widgets | blue | data, status, nav, infra, time |
| **data-register** | a managed catalogue for lookup/filter (risk, control, dependency) | `schemas/data-register.schema.json` | meta, columns, rows | slate | data, status, nav, legal-governance |
| **kanban-board** | work items by stage / flow / WIP | `schemas/kanban-board.schema.json` | meta, lanes, cards | teal | process, status, people, time |
| **timeline-roadmap** | a forward plan across time (quarters/sprints) | `schemas/timeline-roadmap.schema.json` | meta, periods, swimlanes, bars | indigo | process, time, status, people |
| **presentation** (slide-deck) | a deck to present / read slide-by-slide | `schemas/slide-deck.schema.json` | meta, slides | purple | editorial, data, status, nav |
| **one-pager** | a single-sheet executive brief (prints to 1 page) | `schemas/one-pager.schema.json` | meta, verdict, bluf, scr, kpis, visual, ask, risks | plum | editorial, status, data, finance |
| **portfolio** | showcase of projects / case studies + outcomes | `schemas/portfolio.schema.json` | meta, hero, cases | cyan | editorial, data, people, commerce |
| **infographic** | a visual-statistical narrative poster | `schemas/infographic.schema.json` | meta, bands | green | data, math-units, status, science-rnd |
| **matrix-canvas** | a 2×2 / SWOT / business-model framework | `schemas/matrix-canvas.schema.json` | meta, matrix (+swot, canvas) | indigo | process, status, shapes, data |
| **magazine** | a long editorial feature read | `schemas/magazine.schema.json` | meta, body, folio | slate | editorial, document, people |
| **comparison-grid** | decision / feature / pricing matrix (options × criteria) | `schemas/comparison-grid.schema.json` | meta, options, criteriaGroups, cells | teal | status, data, nav, editorial |
| **financial-statement** | formal P&L / balance sheet / cash flow / ledger | `schemas/financial-statement.schema.json` | meta, statementType, currency, periods, lines | blue | finance, data, status, editorial |
| **org-chart** | a top-down hierarchy / org / work-breakdown tree | `schemas/org-chart.schema.json` | meta, root | indigo | people, process, status, nav |
| **calendar-schedule** | a month/week/resource calendar of events | `schemas/calendar-schedule.schema.json` | meta, view, periodStart, eventTypes, events | green | time, status, process, nav |
| **runbook-checklist** | an operational step-by-step procedure / SOP | `schemas/runbook-checklist.schema.json` | meta, sections | cyan | process, status, code, time |
| **diagram-topology** | a system / network / data-flow map | `schemas/diagram-topology.schema.json` | meta, layers, nodeTypes, nodes, edges | purple | infra, code, process, status, nav |
| **scorecard** | periodic graded assessment (maturity / RAG / review) | `schemas/scorecard.schema.json` | meta, scale, areas, overall | blue | status, data, editorial, process |
| **incident-timeline** | chronological incident / postmortem event log | `schemas/incident-timeline.schema.json` | meta, incident, events | plum | time, status, bug-qa, people |
| **heatmap-grid** | N×M graded matrix (risk likelihood×impact / correlation / activity) | `schemas/heatmap-grid.schema.json` | meta, mode, rows, cols, cells, scale | teal | data, status, math-units, nav |
| **flowchart** | structured process flow with swimlanes + decisions | `schemas/flowchart.schema.json` | meta, lanes, nodes, edges | indigo | process, status, nav, code |
| **survey-results** | question-by-question survey / poll results | `schemas/survey-results.schema.json` | meta, summary, segments, questions | green | data, status, people, editorial |
| **leaderboard** | ranked entities by a metric (podium + bars + tiers) | `schemas/leaderboard.schema.json` | meta, metric, tiers, entries | cyan | data, status, people, nav |
| **changelog** | reverse-chronological release feed | `schemas/changelog.schema.json` | meta, product, versions | slate | code, status, nav, editorial |
| **knowledge-base** | FAQ / help centre (searchable Q&A) | `schemas/knowledge-base.schema.json` | meta, categories, articles | blue | document, nav, status, editorial |
| **experiment-readout** | A/B controlled-experiment results | `schemas/experiment-readout.schema.json` | meta, experiment, variants, metrics | purple | data, status, science-rnd, nav |
| **geo-region** | regional / geographic breakdown (tile-grid choropleth) | `schemas/geo-region.schema.json` | meta, metric, regions, scale | teal | maps-location, data, status, nav |
| **sankey-flow** | quantitative flow between stages (funds / throughput / journey volume) | `schemas/sankey-flow.schema.json` | meta, units, groups, nodes, links | teal | process, data, infra, nav, status |
| **treemap** | part-of-whole hierarchy where magnitude + nesting both matter | `schemas/treemap.schema.json` | meta, sizeMetric, colorMetric, root | indigo | data, status, nav, math-units |
| **diff-review** | a code change / pull request to review (diffs + comments + verdict) | `schemas/diff-review.schema.json` | meta, change, reviewers, checks, files | slate | code, status, nav, people |
| **waterfall** | explain a net change as a bridge of +/- contributions | `schemas/waterfall.schema.json` | meta, opening, steps, closing | blue | finance, data, status, math-units |
| **test-report** | a test-execution run (suites × cases, pass/fail/flaky) | `schemas/test-report.schema.json` | meta, runs, activeRunId, suites, cases | green | bug-qa, status, data, process |
| **status-page** | service uptime history + incident communications | `schemas/status-page.schema.json` | meta, windows, groups, components, incidents | cyan | status, infra, time, nav |
| **bracket** | a knockout tournament / elimination | `schemas/bracket.schema.json` | meta, format, rounds, matches | plum | people, process, status, nav |
| **research-paper** | a formal academic / journal article (abstract, citations, equations, figures) | `schemas/research-paper.schema.json` | meta, paper, sections, references | indigo | editorial, science-rnd, data, document |

(Default themes above are suggestions; any of the 9 presets — **Black always available** — may be set
via `meta.theme`. Every sample ships the in-report 9-dot switcher so the reader can recolour live.)

## Choosing the right format (disambiguation)

- Numbers leading, monitored over time → **dashboard**; numbers in a formal ruled statement → **financial-statement**; a lookup catalogue → **data-register**.
- A plan over time → **timeline-roadmap** (continuous gantt) vs **calendar-schedule** (discrete day cells).
- A hierarchy → **org-chart**; a spatial system map → **diagram-topology**; a 2×2/SWOT → **matrix-canvas**.
- Options weighed against criteria → **comparison-grid**. A procedure to execute → **runbook-checklist**.
- Presented aloud → **presentation**; one page for execs → **one-pager**; a narrative investigation → **long-form-report**; a visual story → **infographic**; a showcase → **portfolio**; an editorial read → **magazine**.

## Compliance bar (every report)

Per `_DATA_DRIVEN.md`: self-contained single `.html` (no external requests, system fonts); content in
`#report-data` validating its schema; **every visual interactive** (charts answer on hover with exact
values + legend toggle; tables sort/filter/expand; spatial views pan/zoom; etc.); the canonical 9-dot
`.rc-theme` switcher **including Black**; `viewport width=1440` (PC); icons only from `../icons/`
(no emoji, no generic "AI" icons); a clean `@media print` static snapshot.
