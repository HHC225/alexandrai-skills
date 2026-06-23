# Incident timeline / postmortem chronology — format spec (`incident-timeline.md`)

> **Extends [`_FOUNDATION.md`](_FOUNDATION.md) + [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md).** Read both first.
> This is a **vertical, chronological PAST event log** — an incident / postmortem timeline you read
> *downward* to reconstruct what happened, minute by minute. It is **emphatically NOT** the long-form
> narrative report (no article TOC, no dual reading rails, no drop-cap) and it is **the opposite of
> [`timeline-roadmap`](timeline-roadmap.md)**: that is a *forward, horizontal gantt* of planned work
> across a time axis; this is a *backward, vertical record* of events that already occurred, anchored to
> exact timestamps with durations and MTTR.

## What it inherits (unchanged DNA)

The 9-theme palette (default **Plum**), system-font stacks, the dense 13px body, rounded-panel shape
language (`12px` panels / `10–11px` cards / `5–6px` chips/badges), the three semantic states
(`ok` / `risk` / `hold` — never a 4th), flat elevation, and the self-contained output rule (one `.html`,
inline `<style>`, inline `<svg>`, **no external requests**). It reuses the shared primitives: **status
badge** (`.st-badge` + dot) for severity, **mono ref-chip** for tickets/commits/dashboards, **dark code
panel** (`--bg-deep`) for the command exhibits on action events, **key/value grid** for the header facts,
the **dark footer**, and the house **inline SVG icons** (24×24, `stroke:currentColor`, `1.75`, round
caps — never emoji).

## When to use it

Pick this format when the deliverable is a **chronological record of an incident** — the answer to
"*what happened, in what order, who did it, and how long each phase took?*":

- a **production-incident timeline** / postmortem chronology (impact → detect → escalate → mitigate → resolve);
- an **incident review** deck input where MTTD / MTTM / MTTR and the detection-lag breakdown matter;
- a **security-incident** or **outage** event log with actor attribution and contributing factors;
- any "reconstruct the sequence and the durations" artefact where **time runs down the page as history**.

Reach for a different format when: the work is **forward-planned** across time (use `timeline-roadmap` —
horizontal gantt); the deliverable is a **procedure to execute** rather than a record of one that ran
(use `runbook-checklist`); the goal is a **calendar of dated events** in month/week cells (use
`calendar-schedule`); or it is **narrative root-cause analysis** prose (use `long-form-report`).

## One-line difference from the look-alikes
`timeline-roadmap` reads **left-to-right as a plan** (future); `runbook-checklist` reads **top-down as
steps you tick** (procedure); **incident-timeline reads top-down as a clock that already ran** — every
node is a fixed past timestamp on a vertical rail, with phase markers and live-computed durations.

## Default theme

**Plum** (`--navy:#a21d6e`). Set `<html data-theme="plum">` on render; all 9 `[data-theme]` blocks ship
in the CSS (**including Black**) and the live `.rc-theme` dot group recolours instantly.

---

## Distinct chrome + layout model (how it must differ)

A **PC-wide two-column shell** (`max-width:1440px`, ~40px gutter): a **readable centre column** carrying
the vertical time rail, and a **sticky right summary rail** carrying the live durations / MTTR and the
filters. The two columns are deliberately unlike the long-form report's `TOC | article | rail`.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  INCIDENT HEADER — title · SEV badge · status · key-times key/value grid   │  full-bleed band
│                    (start · detected · mitigated · resolved · impact)      │
├───────────────────────────────────────────────┬────────────────────────────┤
│  TIME RAIL  (centre, vertical chronology)      │  STICKY SUMMARY RAIL        │
│   ┃                                            │   ◷ MTTR / TTD / TTM (live) │
│   ●─ 01:12  +0m   ▣ detect  Monitoring         │   ── phase legend           │
│   ┃   first double-post written …              │   ── jump: detected ▸       │
│   ┃                                            │           mitigated ▸       │
│   ◆━ 01:31  +19m  [F] DETECTED ── phase marker  │           resolved ▸        │
│   ┃   dup alert fired  [OR-CTL-118-dup]        │   ── filter chips:          │
│   ●─ 01:34  +22m  [E] escalation  SRE → SEV1   │        actor · kind · sev   │
│   ●─ 01:52  +40m  [A] action  SRE  [CHG-4471]  │   ── density: compact ↔ exp │
│   ◆━ 02:24  +1h12m [M] MITIGATED ── phase mark  │                             │
│   ●─ 02:59  +1h47m [R] RESOLVED ── phase marker │                             │
├───────────────────────────────────────────────┴────────────────────────────┤
│  CONTRIBUTING FACTORS  — labelled cause / gap / trigger cards               │  full-bleed panel
├──────────────────────────────────────────────────────────────────────────┤
│  dark footer wordmark                                                       │  shared footer
└──────────────────────────────────────────────────────────────────────────┘
```

- **Incident header band** (`.rc-header`): full-bleed `--bg-band`. Carries the incident **title**, the
  **severity badge** (`st-*`-coloured: sev1/2 → risk, sev3 → hold, sev4/info → ok), the **status** pill,
  and a **key-times key/value grid** (`.rc-keytimes`) — *start · detected · mitigated · resolved* — plus
  the **impact** line and the live `.rc-theme` switcher. An incident header, not a report hero.
- **Time rail** (`.rc-timeline`): the spine. A single continuous **vertical rule** down the centre column
  with **event nodes** (`.rc-event`) hung off it in chronological order. Each event shows its **exact
  clock** + a derived **`+Nm since start`**, a **kind-coded node** (icon + accent), the **actor** chip,
  the one-line title, an optional dark **command block**, an optional **ref-chip**, and an
  expand-to-detail. The three **phase markers** (`.rc-phase` — DETECTED / MITIGATED / RESOLVED) are
  enlarged diamond nodes that interrupt the rail and carry the cumulative duration.
- **Sticky summary rail** (`.rc-rail`, ~312px, `position:sticky`): the analyst's HUD — a **live MTTR
  card** (`.rc-mttr`) showing **time-to-detect / time-to-mitigate / time-to-resolve** *computed from the
  data* (never hard-coded) as stat tiles + a proportional **phase bar**; a **phase legend / jump** block
  (click DETECTED/MITIGATED/RESOLVED → scroll the rail to that marker); the **filter chips** (actor /
  kind / severity); and the **density** toggle. The rail never scrolls away.

### Signature components (class names)

| Component | Class | What it is |
|:--|:--|:--|
| Incident header band | `.rc-header` | full-bleed title + severity badge + status pill + key-times grid + theme switcher |
| Key-times grid | `.rc-keytimes` | key/value grid: start · detected · mitigated · resolved (mono values, tiny uppercase keys) |
| Severity badge | `.rc-sev` | `st-badge` pill (dot + label); sev1/2 → risk, sev3 → hold, sev4/info → ok |
| **Vertical time rail** | `.rc-timeline` | the continuous centre rule that all event nodes hang from |
| **Event node** | `.rc-event` | the core unit: clock + `+Nm`, kind-coded node, actor chip, title, optional command / ref, expandable detail |
| Kind node dot | `.rc-node` | the on-rail marker; `data-kind` recolours + swaps the icon (detect/action/comms/escalation/decision/resolve) |
| Relative-time stamp | `.rc-since` | derived `+Nm since start` shown beside the exact clock (mono, tnum) |
| **Phase marker** | `.rc-phase` | enlarged diamond on the rail for DETECTED / MITIGATED / RESOLVED, carrying cumulative duration |
| Actor chip | `.rc-actor` | mono attribution chip (person / team / system icon + label) |
| Command exhibit | `.rc-cmd` | dark `--bg-deep` mono block on `action`-kind events (a change that was made) |
| Reference chip | `.rc-ref` | mono `ref-chip` for the event's ticket / commit / dashboard |
| Summary rail | `.rc-rail` | sticky HUD (MTTR card + phase legend/jump + filter chips + density toggle) |
| **Live MTTR card** | `.rc-mttr` | TTD / TTM / MTTR stat tiles + proportional phase bar, all computed from incident times |
| Phase bar | `.rc-phasebar` | a single stacked bar showing detect/mitigate/resolve durations to scale |
| Filter chip | `.rc-chip` | toggleable actor / kind / severity filter chip (uses family chip styling) |
| Density toggle | `.rc-density` | switch between compact and expanded event spacing |
| Contributing-factors panel | `.rc-factors` | full-bleed grid of cause / gap / trigger cards below the timeline |

### Event anatomy (the unit that defines this format)

```
●─ 01:52  +40m     ⚙ action · On-call SRE                        [ CHG-4471 ]
│         Raised client retry budget to shrink the post-commit gap window.
│         ┌──────────────────────────────────────────────────────────────┐
│         │ kubectl -n payments set env deploy/settle-orchestrator …      │   ← .rc-cmd (dark)
│         └──────────────────────────────────────────────────────────────┘
│         ▸ (click) Partial relief only — narrowed but did not close …      ← expand → .detail
```

`severity` (per-event emphasis), `command`, `ref`, and `detail` are all **optional** per event — render
only what the data provides. A `kind` of `detect` and `resolve`, plus the incident's `mitigated` time,
drive the three on-rail **phase markers**.

---

## Data fields (summary — full contract in `schemas/incident-timeline.schema.json`)

- **`meta`** *(required)* — shared block: `org`, `project`, `reportType`, `title`, `subtitle?`, `date`,
  `author`, `theme` (default `plum`).
- **`incident`** *(required)* — `{ id, severity, status?, start, detected, mitigated?, resolved?, impact? }`.
  All times are ISO-8601 with offset; `start` is time-zero. The renderer derives **TTD = detected−start**,
  **TTM = mitigated−start**, **MTTR = resolved−start**, and every `+Nm` from these.
- **`actors[]`** *(required)* — `{ key, label, kind? }` (person / team / system). Every `event.actor`
  references one `key`; rendered as attribution + filter chips.
- **`events[]`** *(required)* — `{ ts, actor, kind, severity?, title, detail?, command?, ref? }`.
  `kind` ∈ detect | action | comms | escalation | decision | resolve (drives node icon + accent).
- **`factors[]?`** — `{ label, detail, kind? }` (cause / gap / trigger) for the contributing-factors panel.

The sample's `#report-data` **is a valid instance** of this schema (the canonical example).

## Interactions (mandatory, all data-driven, vanilla JS, ≤150ms)

1. **Filter by actor / kind / severity** → `.rc-chip` toggles in the rail; matching events stay, the rest
   collapse out. Multiple chips combine (within a facet = OR, across facets = AND). The MTTR card and
   phase markers stay fixed (they describe the incident, not the filtered view); an empty-state shows when
   nothing matches.
2. **Jump to phase** → click DETECTED / MITIGATED / RESOLVED in the rail → smooth-scroll the centre column
   to that phase marker and pulse it.
3. **Density zoom** → the `.rc-density` toggle switches compact ↔ expanded event spacing (rail gap,
   detail visibility default) so a long incident can be skimmed or studied.
4. **Expand an event → detail** → click an event row (or its caret) to reveal the `detail` text and the
   full command; click again to collapse. "Expand all / collapse all" affordance provided.
5. **Hover an event** → a tooltip shows the **exact ISO timestamp** and the precise **`+Nm since start`**.
6. **Live MTTR** → TTD / TTM / MTTR and the proportional phase bar are **computed from `incident` times on
   render** (and re-formatted, never re-typed) — change the data, the numbers change.
7. **Theme switch** → the standard `.rc-theme` dot group recolours live (9 presets incl. **Black**).

## `@media print`

- The timeline prints **fully expanded** (every event detail shown), all **filters ignored** (print the
  complete chronology), and the **density** forced to expanded.
- Hide all controls: `.rc-theme`, filter chips, density/expand toggles, the event carets; the sticky rail
  collapses to a static end-block so the printed sheet is a clean, complete incident record. White footer.
- Node colours and phase markers print as drawn.

## Do / Don't

**Do** keep time running **down** the page as history; anchor every node to an **exact timestamp** and a
**derived `+Nm since start`**; mark the three **phases** (detected → mitigated → resolved) on the rail with
their durations; **compute MTTR from the data**; attribute every event to an **actor**; keep the centre
column to a readable measure while the *page* stays PC-wide; put a command exhibit only on `action` events.

**Don't** turn this into a **horizontal gantt** (that's `timeline-roadmap`) or a forward plan of future
work; **don't** make it a checkable to-do (that's `runbook-checklist`) — these events already happened and
are not tickable; don't fake the durations (every number is computed from `incident` times); don't invent
a 4th severity colour or use gradients; don't use emoji for the kind/phase markers (use the house SVG
icons); don't wrap it in the long-form chrome (TOC rail + dual reading rails + drop-cap).

## Exemplar
[`../sample/incident_timeline_sample.html`](../sample/incident_timeline_sample.html) — a SEV1 settlement
outage chronology: 9 events down a vertical rail, three phase markers (detected / mitigated / resolved)
with durations, actor attribution, command exhibits, ref-chips, a live MTTR card, actor/kind/severity
filter chips, a density toggle, and a contributing-factors panel (Plum theme, with all 9 `data-theme`
swaps incl. Black).

## Data schema

Full field contract: [`schemas/incident-timeline.schema.json`](schemas/incident-timeline.schema.json)
(JSON Schema draft 2020-12, includes a realistic `examples[0]` instance).

**Required top-level fields:** `meta`, `incident`, `actors`, `events`

| Field | Required | Description |
|:--|:--|:--|
| `meta` | yes | Shared chrome: org, project, reportType, title, date, theme (default `plum`) |
| `incident` | yes | `id`, `severity`, `start`, `detected` (+ optional `status`, `mitigated`, `resolved`, `impact`); drives MTTR + phase markers |
| `actors[]` | yes | `key`, `label` (+ optional `kind`: person/team/system); referenced by every event |
| `events[]` | yes | `ts`, `actor`, `kind` (detect/action/comms/escalation/decision/resolve), `title` (+ optional `severity`, `detail`, `command`, `ref`) |
| `factors[]` | no | Contributing factors: `label`, `detail` (+ optional `kind`: cause/gap/trigger) |

## Icons

Icons are inline SVG from [`../icons/`](../icons/) — no external requests, `currentColor` (themes flow
automatically). Never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).

Relevant icon categories for this format:

- **time** — the rail clocks + `+Nm` stamps, the MTTR card (clock / stopwatch / elapsed / duration), the footer as-of stamp
- **status** — the severity `.st-badge` (shield-alert / flag), phase markers (flag → check-circle), per-event severity dots
- **bug-qa** — kind nodes for the incident itself (incident-alert, escalate, root-cause) and the contributing-factors panel
- **people** — the `.rc-actor` attribution chips and actor filter chips (user / users-team / on-call / system)
