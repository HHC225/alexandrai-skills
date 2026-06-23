# Status page / uptime page — format spec (`status-page.md`)

> **Extends [`_FOUNDATION.md`](_FOUNDATION.md) + [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md).** Read both first.
> This is a **service status / uptime page** — the public-facing artefact that answers, at a glance,
> *"is the platform up right now, has it been up lately, and what's the latest on any disruption?"*
> It is **emphatically NOT** the [`dashboard`](dashboard.md) (that is a live-metric operations console of
> KPI tiles, gauges, and charts read by on-call engineers) and it is **NOT** the
> [`incident-timeline`](incident-timeline.md) (that is one incident's minute-by-minute postmortem
> chronology read downward). This format is **uptime HISTORY + incident COMMS**: a derived status banner,
> per-component day-bar history strips, an incident feed, and scheduled maintenance.

## What it inherits (unchanged DNA)

The 9-theme palette (default **Cyan**), system-font stacks (CJK-aware `--sans`), the dense 13px body,
rounded-panel shape language (`12px` panels / `10–11px` cards / `5–6px` chips/badges), the three semantic
states (`ok` / `hold` / `risk` — never a 4th), flat elevation, and the self-contained output rule (one
`.html`, inline `<style>`, inline `<svg>`, ONE inline `render()` script, **no external requests**). It
reuses the shared primitives: **status badge** (`.st-badge` + dot) and **mini status dot** for component
state, the **mono chip** for component/severity tags, the **dark footer** wordmark, and the house **inline
SVG icons** (24×24, `stroke:currentColor`, `1.75`, round caps — never emoji, never the AI vocabulary).

## When to use it

Pick this format when the deliverable is a **status communication surface** — not an internal metrics
view, but the page a service publishes to its consumers:

- a **public service-status / uptime page** for a platform or product (the StatusPage / Statuspage genre);
- an **SLA / availability summary** where the headline is "X-day uptime per component" rather than live latency;
- an **incident-communications log** — the running, customer-facing "what's happening" feed (investigating
  → identified → monitoring → resolved) plus a **maintenance calendar**;
- any "is it up, and what's been going on?" artefact where **historical availability** and **comms** are the point.

Reach for a different format when: the deliverable is a **live engineering console** with metric tiles,
gauges, and trend charts (use `dashboard`); the deliverable is **one incident reconstructed minute-by-minute**
with MTTR/phase analysis (use `incident-timeline`); the deliverable is a **calendar of dated events** in
month/week cells (use `calendar-schedule`); or it is a **procedure to execute** (use `runbook-checklist`).

## One-line difference from the look-alikes
`dashboard` shows **right-now metrics** (KPI tiles, gauges, charts); `incident-timeline` shows **one
incident's chronology** down a rail; **status-page shows uptime HISTORY (day-bar strips per component) +
the running incident COMMS feed** — the consumer-facing "are we up, and have we been?" page.

## Default theme

**Cyan** (`--navy:#0891b2`). Set `<html data-theme="cyan">` on render; all 9 `[data-theme]` blocks ship in
the CSS (**including Black = `#000000`**) and the live `.rc-theme` dropdown recolours instantly.

---

## Distinct chrome + layout model (how it must differ)

A **centred, intentionally narrow page** (`max-width:~1180px`, ~24px gutter — still a PC deliverable, never
below ~1100px). A status page is a single readable column, deliberately unlike the dashboard's full-bleed
rail+grid app shell and unlike the long-form report's `TOC | article | rail`.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  MASTHEAD — brand mark · title · sub-line          as of …   [theme ▾]     │
├──────────────────────────────────────────────────────────────────────────┤
│  ████  ALL SYSTEMS OPERATIONAL                       6/6  Operational      │  ← BANNER (derived)
│        All monitored components are operating normally.   0   With issues  │
├──────────────────────────────────────────────────────────────────────────┤
│  UPTIME WINDOW [90 days][60][30]   ◻ Only issues      All Edge Core Data    │  ← controls
├──────────────────────────────────────────────────────────────────────────┤
│  ▸ Edge & Access                                              2 components  │  ← GROUP panel
│    ◷ API Gateway     ▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏█▏▏▏     99.94% uptime   │  ← component row
│    ◷ Authentication  ▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏     99.99% uptime   │
│  ▸ Core Services …                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  ◷ PAST INCIDENTS                                          3 in this window │
│   Mon, Jun 22, 2026                                                         │
│    ┌ [PARTIAL OUTAGE] [Payments][API]  Elevated error rate …          ▸ ┐   │  ← incident card
│    │   09:05  Monitoring   Error rate has returned to baseline …       │   │  ← update timeline
│    │   08:34  Identified   A connection-pool exhaustion …              │   │     (expand/collapse)
│    └ …                                                                 ┘   │
├──────────────────────────────────────────────────────────────────────────┤
│  ▤ SCHEDULED MAINTENANCE                                          2 planned │
│    ┌ [Jun 26 · 22:00–01:00] [DB][Payments]  Database engine upgrade ┐      │
├──────────────────────────────────────────────────────────────────────────┤
│  ◼ {{ORG}}    ● Operational ● Degraded ● Outage      {{PROJECT}} STATUS    │  ← dark footer
└──────────────────────────────────────────────────────────────────────────┘
```

- **Masthead** (`.sp-mast`): brand square + title + mono sub-line, an **"as of" timestamp**, and the live
  `.rc-theme` switcher. A status header, not a report hero or a console topbar.
- **Overall status banner** (`.sp-banner`): a large coloured panel whose **label and colour are DERIVED
  from the worst CURRENT (latest-day) component state** — `ok → "All Systems Operational"` (ok colour),
  `hold → "Degraded Performance"` (amber), `risk → "Service Disruption"` (bordeaux). Carries a rolled-up
  "operational / with issues" count. **Never hard-coded** — recomputed from the components.
- **Controls bar** (`.sp-controls`): the **uptime-window selector** (`.sp-winsel`, e.g. 90/60/30 days), an
  **"only issues" toggle** (`.sp-toggle`), and **group filter chips** (`.sp-gchip`).
- **Component groups** (`.sp-group`): each group is a rounded panel with a header (icon + name + count) and
  its component rows. Each **component row** (`.sp-comp`) is a 3-column grid: `status dot + name | uptime
  strip | period uptime %`.
- **Uptime-history strip** (`.sp-uptime` → `.sp-daybars` of `.sp-daybar`): the **signature** — a horizontal
  strip of thin rounded day-bars, one per day, OLDEST→newest left→right, each coloured by that day's worst
  state (`ok/hold/risk`). The right-hand **period uptime %** is the mean over the selected window — derived.
- **Past incidents feed** (`.sp-incident`): grouped under **date headings**; each card has a severity badge
  (`.sp-sev`), impacted-**component chips** (`.sp-comp-chip`), a headline, and a collapsible **update
  timeline** (`.sp-updates` → `.sp-update`) of timestamped status posts on a vertical rail, status-coded
  node per update (investigating → risk, identified → hold, monitoring → accent, resolved → ok).
- **Scheduled maintenance** (`.sp-maint`): cards with the formatted time window, component chips, and body.
- **Footer** (`.sp-foot`): the shared dark band + wordmark, carrying the **state legend** (Operational /
  Degraded / Outage swatches).

## Signature components (class names)

| Component | Class | Notes |
|:--|:--|:--|
| Page shell | `.sp-page` | centred `max-width:~1180px`; the narrow status column |
| Status banner | `.sp-banner` (`.is-hold` / `.is-risk`) | label + colour derived from worst current component |
| Component group panel | `.sp-group` | one per `groups[]`; header + rows |
| Component row | `.sp-comp` | `name | uptime strip | uptime %` grid |
| Uptime strip | `.sp-uptime` / `.sp-daybars` / `.sp-daybar` | day-bars; `.ok/.hold/.risk` colour per day |
| Incident card | `.sp-incident` | severity badge + component chips + collapsible updates |
| Update entry | `.sp-update` | timestamped status post on the incident's vertical rail |
| Maintenance card | `.sp-maint` | window + component chips + body |

## Data fields (summary — full contract in `schemas/status-page.schema.json`)

- **`meta`** — shared identity block (`org`, `project`, `reportType`, `title`, `subtitle`, `date`, `author`,
  `theme`); keep `{{…}}` placeholders. Default `theme:"cyan"`.
- **`asOf`** — optional ISO-8601 "as of" timestamp for the masthead.
- **`windows`** — the selectable uptime windows in days, e.g. `[90, 60, 30]`. The largest sets the strip length.
- **`groups[]`** — `{id, name}` component groups (panels + filter chips).
- **`components[]`** — `{id, groupId, name, description?, days[]}`. Each **`days[]`** entry is
  `{date, uptime (0-100), state:"ok|hold|risk", incidents?}`, OLDEST first. (The sample uses the sentinel
  `days:"__GEN__"` so the renderer synthesises a reproducible 90-day history aligned with the incident
  feed; a real instance supplies the array verbatim.)
- **`incidents[]`** — `{date, title, severity:"major|partial|degraded|minor", status?, components[],
  updates[]}`; each **`updates[]`** = `{time, status:"investigating|identified|monitoring|resolved", body}`.
- **`maintenance[]`** — `{window ("start/end" ISO interval), title, status?, components[], body}`.

## Required interactions (data-driven, vanilla JS — per `_DATA_DRIVEN.md` §4)

- **Window selector (90/60/30)** → re-slices every day-bar strip to the trailing N days **and recomputes
  each component's period uptime %** from the sliced history. Both the bars shown and the % are derived.
- **"Only issues" toggle** → hides components that were **fully operational across the selected window**
  (re-evaluated when the window changes); empties hide their group panel; an empty-state shows if all hide.
- **Day-bar hover tooltip** → the **exact** date + uptime % + incident count for that day. Never faked.
- **Incident card click** → expand / collapse its update timeline (`aria-expanded`, keyboard-operable).
- **Group filter chips** → show only the chosen group's components (plus an "All" chip).
- **Theme switcher** → the canonical `.rc-theme` dropdown recolours via `<html data-theme>` live.
- **Print** (`@media print`): a complete static snapshot — controls hidden, all incident timelines and
  hidden components/groups forced visible, shadows removed, footer inverted to ink-on-white.

## Do / Don't

**Do**
- **Derive** the banner label/colour, every period uptime %, and every day-bar colour from the data.
- Keep the page **narrow and centred** (~1180px) — a status page is calmer and tighter than the dashboard.
- Order day-bars **oldest → newest** (left → right), "Today" at the right edge.
- Use only the three semantic states: `ok` (operational), `hold` (degraded), `risk` (outage).
- Keep component / incident / maintenance content **brand-neutral** (API, Auth, Payments, Notifications,
  Batch, DB) and the chrome on `{{ORG}}` / `{{PROJECT}}` / `{{AUTHOR}}` placeholders.

**Don't**
- Don't add live-metric **KPI tiles, gauges, or trend charts** — that's the `dashboard`. This is history + comms.
- Don't turn an incident card into a full **postmortem** (MTTR tiles, phase bars, contributing factors) —
  that's `incident-timeline`. Keep it to the comms updates.
- Don't hard-code the banner state or the uptime percentages; don't invent a fourth status colour.
- Don't add external requests, web fonts, emoji, or the banned "AI" icon vocabulary.
- Don't widen the strip past the largest window or fabricate days the data doesn't contain.
