# Format: Calendar / schedule

> Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md): the 8-theme palette
> (default **Green** here), the dense 13px system-font register, rounded panels, the three
> semantic states (`ok` / `risk` / `hold`), the shared status-badge / chip / data-table
> primitives, and the self-contained single-file output rules (§0). It is **data-driven and
> interactive** per [`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md): all content lives in a
> `#report-data` JSON instance and the grid is rendered (and re-rendered) by JS. It **diverges
> on chrome and layout**: this is **not** the long-form article frame and **not** the
> timeline-roadmap.

## One-line difference from timeline-roadmap (and long-form)
Both deal with time, so be precise: **timeline-roadmap is a *continuous* horizontal axis** —
gantt bars stretch fluidly across quarters/sprints and time is a ruler. **Calendar/schedule is a
*discrete* day-cell grid** — time is quantised into named **day boxes** (a real month wall
calendar / week schedule), events sit *inside* cells as chips, and you navigate by **month/week**,
not by zooming an axis. If it has a fluid time ruler with spanning gantt bars, it is the roadmap;
if it has a 7-column week-of-days grid with dated cells, it is this. (Long-form is vertical prose —
not relevant here.)

## When to use
A **dated operational calendar** the audience reads like a wall calendar or a team schedule:

- release / deployment calendars, test-window & code-freeze schedules, change calendars (CAB);
- BCP/DR rehearsal dates, on-call rotations, maintenance windows, cutover day plans;
- sprint ceremonies, review/gate dates, audit & regulator submission deadlines;
- any "what is happening *on which day*" view where the **day cell** is the unit and events are
  short-lived (a day or a few days), not multi-quarter workstreams.

Reach for a different format when: time is a long continuous plan with spanning workstream bars
(use **timeline-roadmap**); the work is unscheduled flow by stage (use **kanban-board**); there is
no date axis at all (use **dashboard** or **matrix-canvas**).

---

## Distinct chrome + layout model

The whole document is a **calendar application surface**, PC-wide (centred, `max-width ~1640px`),
with large readable day cells — never a column of prose panels. Four structural pieces define it:

1. **Calendar toolbar (top).** A single control strip: the **month/period label** (`July 2026`)
   with **‹ prev / next ›** stepper and a **Today** button; a **view toggle** (`Month · Week ·
   Resource`); and on the right the **legend chips** (one per event type — these double as the
   **filter** control) plus the `.rc-theme` brand switcher. This is the command bar, not a hero.
2. **Weekday header row.** Seven mono UPPERCASE column heads (`MON … SUN`, honouring
   `meta.weekStart`), with a 2px brand bottom rule. In resource view the first column is the lane
   rail and the heads become the seven dates of the week.
3. **The day-cell grid (the body).** A CSS `grid` of **7 columns**. Month view lays 5-6 week rows
   of day cells; each `.cal-cell` has a **date number** in its corner, an optional "out-of-month"
   dimming, a **today** ring, and a vertical stack of **`.evchip`** event chips (overflow folds
   into a `+N more` pill). Week view is one tall row of 7 cells. **Resource view** re-grids to
   `rows = resources`, `cols = the 7 dates`, so it reads as a **schedule lane grid**.
4. **Detail popover.** Clicking any chip opens a **`.cal-pop`** floating card (title, type band,
   status badge, date/time, resource, owner, note) anchored near the chip; click-away / Esc
   closes. This carries the detail the compact chip can't.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ◀ ▶  July 2026   [Today]    │ Month · Week · Resource │   ● Release ● Test ...  ◑◑◑│  ← .cal-toolbar (label/nav/view/legend/theme)
├────────┬────────┬────────┬────────┬────────┬────────┬────────────────────────────┤
│  MON   │  TUE   │  WED   │  THU   │  FRI   │  SAT   │  SUN                         │  ← .cal-weekhead (2px brand rule)
├────────┼────────┼────────┼────────┼────────┼────────┼────────────────────────────┤
│ 29·    │ 30·    │  1     │  2     │  3     │  4     │  5                           │  ← .cal-cell (·=out-of-month dim)
│        │        │ ▭ plan │        │        │        │                              │     .evchip inside cells
├────────┼────────┼────────┼────────┼────────┼────────┼────────────────────────────┤
│  6     │  7     │  8 ◉   │  9     │ 10     │ 11     │ 12                           │  ← ◉ = today ring
│ ▭▭ Regression test window ▭▭▭▭▭▭▭▭ │        │        │  (multi-day spanning chip)  │
├────────┼────────┼────────┼────────┼────────┼────────┼────────────────────────────┤
│ 13     │ 14 ◉   │ 15     │ 16     │ 17     │ 18     │ 19   (+2 more)               │  ← .evmore overflow pill
│ ▭ freeze (hold) ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭   │        │ ◆ gate │ ▭ release (ok)               │
└────────┴────────┴────────┴────────┴────────┴────────┴────────────────────────────┘
                                          ┌─ .cal-pop ─────────────┐  ← click chip → detail popover
                                          │ ● Review / gate · RISK │
                                          │ Go / no-go gate        │
                                          │ Jul 14 · 16:00 · Staging│
                                          └────────────────────────┘
```

Grid mechanics: the body is `display:grid; grid-template-columns:repeat(7,1fr)`. A single-day chip
sits in its date's cell stack. A **multi-day** event renders one continuous bar per week-row,
placed with `grid-column:<startCol> / <endCol+1>` and clipped at week boundaries (a chip continued
from the previous week gets a flat left edge; one continuing into next week a flat right edge). The
renderer computes, per displayed month, the leading out-of-month days, the week rows, the today
cell, and lays events by date — all from `periodStart` + `events[]`, recomputed on every prev/next.

---

## Signature components (class names)

- **`.cal`** — the calendar shell. Owns `--cols` (7), `--cell-min-h`, and the rendered view state
  (`data-view="month|week|resource"`). Everything reads these custom properties.
- **`.cal-toolbar`** — the command strip: `.cal-nav` (`.cal-step` prev/next buttons + `.cal-label`
  month title + `.cal-today` button), `.cal-views` (segmented `.cal-view` toggle), `.cal-legend`
  (filter chips), and the `.rc-theme` switcher. Sticky-top, flat, `--bg-band`.
- **`.cal-weekhead`** — the 7 mono UPPERCASE weekday column heads with a 2px brand bottom rule;
  weekend heads get `--ink-faint`.
- **`.cal-grid`** — the 7-column day-cell grid (month/week). In resource view this becomes
  `.cal-grid--res` with a leading `.res-rail` of lane labels and 7 date columns.
- **`.cal-cell`** — one day box: `.cal-date` (corner number, mono, `"tnum"`), an `.evstack` of
  chips, optional `.evmore` overflow pill. Modifiers: `.is-out` (other-month, dimmed),
  `.is-today` (brand ring + tinted corner), `.is-weekend` (faint band). Generous min-height so the
  cell is readable, never cramped.
- **`.evchip`** — a compact rounded event chip (`border-radius:6px`, ~22px tall) with a **leading
  type colour band** (4px), a status dot when `status` is set, an optional time label, and a
  truncating title. Multi-day variants `.evchip--span` (with `.is-startclip` / `.is-endclip` flat
  edges). Type colour comes from the assigned `eventTypes[].tone`; `status` overlays a family
  `ok/risk/hold` dot — colour discipline preserved (type = band, state = dot).
- **`.legend-chip`** — a toggleable filter chip per event type: a colour swatch + label + count;
  `.is-off` greys it and hides that type's events. Doubles as the **legend** key and the **filter**
  control (one affordance, two jobs).
- **`.milestone-dot` / `◆`** — single-day "point" events may render as a small diamond/flag glyph
  rather than a bar, to read as a gate/milestone within the day cell.
- **`.cal-pop`** — the detail popover card: header (type band + `.st-badge` status), title,
  key/value meta row (date · time · resource · owner), and `note` body. Floating, whisper shadow,
  anchored to the clicked chip; Esc / click-away closes. Reuses the **key/value grid** primitive.
- **`.cal-empty`** — empty-state panel shown when no events fall in the current period (or all
  types are filtered off): a calendar glyph + "No events in <period>" + a hint to step or clear
  filters. Mandatory, not an afterthought.

Reused family primitives: `.st-badge` (+`.st-ok/.st-risk/.st-hold`) for status, mono **chips** for
ids/refs, the **key/value grid** in the popover, the **dark footer**, and the house inline **SVG
icons** (`calendar`, `calendar-event`, `chevron-left/right`, `filter`, `clock`, `flag`,
`check-circle`) sized with `.icon`. Use the squared-node icon construction from `icons/SPEC.md`.

---

## Data fields (summary — full contract in `schemas/calendar-schedule.schema.json`)

- **`meta`** — shared chrome (`org/project/reportType/title/subtitle/date/author`), plus
  `theme` (default `green`), `weekStart` (0=Sun, 1=Mon), and optional `today` for the highlight.
- **`view`** — `"month" | "week" | "resource"` (initial view; the toggle switches live).
- **`periodStart`** — `YYYY-MM-DD` anchor; the grid shows the month (or week) containing it.
- **`eventTypes[]`** — `{ key, label, tone? }`; the legend/filter set and chip colour bands.
- **`resources[]`** *(optional)* — `{ key, label, meta? }`; lanes for resource view.
- **`events[]`** — `{ id, title, start, end?, type, status?(ok|risk|hold), allDay?, time?,
  resource?, owner?, note? }`; ~15-25 across 3-4 types. Multi-day = `end` set.

The sample's `#report-data` is a valid instance of this schema (the canonical example).

## Interactions (MANDATORY — all driven from the data, vanilla JS)

- **Prev / next period** — `.cal-step` steps `periodStart` by one **month** (month view) or one
  **week** (week/resource view) and **re-renders the grid and re-places every event**.
- **Today** — `.cal-today` jumps `periodStart` back to the period containing `meta.today` and
  re-renders; the matching cell shows the **today ring**.
- **Filter by event type** — clicking a `.legend-chip` toggles `.is-off` and **hides/shows** that
  type's chips in place (counts update). When every type is off → `.cal-empty`.
- **View toggle** — `Month · Week · Resource` re-grids the same data: month grid → single tall
  week → resource lane grid. (Resource view also reads as the "toggle resources" control.)
- **Event detail** — clicking an `.evchip` opens the `.cal-pop` popover for that event id; Esc or
  click-away closes; arrow none required.
- **Empty state** — when no events fall in the visible period, or all are filtered out, the grid
  area shows `.cal-empty` instead of blank cells.

In **print**, render a static snapshot of the **current month**: expand all chips, hide the
toolbar controls / theme switcher / popover, keep the legend as a static key.

---

## Layout outline (build order)

```
cal-toolbar          ← month label · prev/next · today · view toggle · legend(filter) · rc-theme
cal-weekhead         ← MON..SUN column heads (weekStart-aware), 2px brand rule
cal-grid (month)     ← 5-6 week rows × 7 day cells; chips + multi-day spans + today ring
  └─ (week view)     ← one tall week row of 7 cells
  └─ (resource view) ← res-rail lanes × 7 date columns (schedule grid)
cal-pop              ← floating event-detail popover (on chip click)
cal-empty            ← shown when the visible period has no (visible) events
footer               ← dark wordmark band (org / project / reportType / date)
```

---

## Do / Don't

- **Do** make the **day cell** the unit: a real 7-column week-of-days grid with dated boxes, a
  visible today ring, and event chips living *inside* cells. It must read as a wall calendar.
- **Do** colour each chip by **event type** (leading band) and overlay **status** as a family
  `ok/risk/hold` dot — keep the type-band / state-dot split so colour stays disciplined.
- **Do** make prev/next, the type filter, the view toggle, and the detail popover **real**
  (re-render from `events[]`), and always handle the **empty period** state.
- **Do** keep it PC-wide with large, readable cells; let week/resource views breathe taller.
- **Don't** turn this into a continuous gantt axis with fluid spanning bars across quarters — that
  is **timeline-roadmap**. Keep time quantised into day cells.
- **Don't** wrap it in long-form chrome (sticky TOC + facts rail + stacked prose panels) or render
  a vertical list of dated rows (that's just a table). If there is no 7-column day grid, it isn't
  this format.
- **Don't** invent a 4th status colour, gradient chips, or hard-code events in the HTML body — the
  body is built by `render()` from `#report-data`.

## Exemplar
[`../sample/calendar_schedule_sample.html`](../sample/calendar_schedule_sample.html) — a fictional
**Release & Test Calendar** for July 2026 with ~20 events across 4 types (release / test window /
code freeze / review-gate), 3 resource lanes, multi-day spans, status dots, prev/next month, a
legend filter, month/week/resource view toggle, click-to-detail popovers, a today ring, and the
empty state (Green theme, with the 8 `data-theme` swaps + `.rc-theme` switcher).

## Icons

Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically). Typical categories for this format: time, status, process, nav. Browse `../icons/index.html`; never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
