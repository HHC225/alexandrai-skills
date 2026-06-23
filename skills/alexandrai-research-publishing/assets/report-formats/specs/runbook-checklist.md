# Runbook / Checklist (SOP) — format spec (`runbook-checklist.md`)

> **Extends [`_FOUNDATION.md`](_FOUNDATION.md) + [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md).** Read both first.
> This is an **operational, action-oriented procedure** — a runbook / standard-operating-procedure you
> *execute*, ticking steps as you go. It is **emphatically NOT the long-form narrative report**: there is
> no article flow, no prose TOC, no both-side reading rails, no drop-cap. The reader is an operator on a
> bridge call at 02:00, not someone reading a report. Every screen pixel earns its place by helping them
> **do the next step and check it off**.

## What it inherits (unchanged DNA)

Palette tokens (8 themes), system-font stacks, the dense 13px body, rounded-panel shape language
(`12px` panels / `10–11px` cards / `5–6px` chips), the three semantic states (`ok` / `risk` / `hold` —
never a 4th), flat elevation, and the self-contained output rule (one `.html`, inline `<style>`, inline
`<svg>`, **no external requests**). It also inherits the shared primitives where useful: **status badge**
(`.st-badge` + dot), **mono chip**, **dark code panel** (`--bg-deep`), **key/value grid**, **footer**,
and the house **inline SVG icons** (24×24, `stroke:currentColor`, `1.75`, round caps — never emoji).

## When to use it

Pick this format when the deliverable is a **procedure to perform**, not a finding to read:

- a **production-incident mitigation** runbook (detect → stabilise → mitigate → verify → close);
- a **release / deployment cutover** checklist (pre-flight → cutover → smoke-test → rollback gate);
- a **DR / failover** drill, a **maintenance-window** SOP, an **on-call escalation** procedure;
- any "do these numbered steps, in order, and confirm each one" artefact with commands + rollback.

If the goal is to *explain* a root cause or *present* evidence, use `long-form-report`. If it is a *board*
of independent work items, use `kanban-board`. This format is for **sequential, checkable execution**.

## Default theme

**Cyan** (`--navy:#0891b2`). Set `<html data-theme="cyan">` on render; all 8 `[data-theme]` blocks ship in
the CSS and the live `.rc-theme` switcher recolours instantly.

---

## Distinct chrome + layout model (how it must differ)

A **2-column operations shell** inside a PC-wide frame (`max-width:1500px`, ~40px gutter) — never a narrow
page. The two columns are deliberately unlike the long-form report's `TOC | article | rail`:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  RUNBOOK HEADER  — title · owner chips · severity · est. duration · status │  full-bleed band
├──────────────────────────────────────────────────────────────────────────┤
│  PREREQUISITES PANEL  — "before you begin" gate (chips / checklist items)   │  full-bleed panel
├───────────────────────────────────────────────┬────────────────────────────┤
│  STEP COLUMN  (≤ ~900px line length)           │  STICKY PROGRESS RAIL       │
│   ░ Section 1 — Detect & confirm   [3/4] ▸     │   ◉ overall % done (ring)   │
│     ☐ 1.1 step text … [copy] cmd  ✓ expected   │   ── per-section jump links │
│     ☑ 1.2 …                                    │      with n/total counts    │
│   ░ Section 2 — Stabilise          [0/5] ▸     │   ── filter: remaining only │
│     ☐ 2.1 …  ⚠ critical callout                │   ── reset                  │
│   …                                            │   ▸ ROLLBACK PLAN (always)  │
└───────────────────────────────────────────────┴────────────────────────────┘
```

- **Header band** (`.rc-header`): full-bleed, `--bg-band`. Carries the procedure **title**, an **owners**
  row (mono people-chips), and a meta strip of pills — **severity** (`st-*`-coloured), **est. duration**
  (clock icon), **status**, plus the live `.rc-theme` switcher at the right. This is an *operational
  header*, not a report hero — short, scannable, no standfirst paragraph.
- **Prerequisites panel** (`.rc-prereq`): a "before you begin" gate directly under the header — a compact
  checklist / chip set of preconditions, access, and tools. Visually distinct (left accent rule) so it
  reads as a gate, not a step.
- **Step column** (`.rc-steps`): the spine. **Numbered sections** (`.rc-section`), each a collapsible
  panel with a header showing the section title and a **live `done/total` counter** + caret. Inside,
  **checkable steps**.
- **Sticky progress rail** (`.rc-rail`, ~300px, `position:sticky`): the operator's HUD — an **overall
  progress ring + %**, **jump links** to each section (with per-section counts that update live), the
  **"remaining only" filter** toggle, a **reset** button, and a permanently-visible **rollback-plan**
  card. The rail never scrolls away.

### Signature components (class names)

| Component | Class | What it is |
|:--|:--|:--|
| Runbook header band | `.rc-header` | full-bleed title + owners + severity/duration/status pills + theme switcher |
| Owner chip | `.rc-owner` | mono people-chip (role · name) |
| Meta pill | `.rc-meta-pill` | severity / duration / status pill (icon + label); severity uses `st-*` colour |
| Prerequisites gate | `.rc-prereq` | "before you begin" panel, left accent rule, checklist/chips |
| Numbered section | `.rc-section` | collapsible step group; `[data-open]`; header has number, title, `.rc-count`, caret |
| Section counter | `.rc-count` | live `done/total` pill in the section header |
| **Checkable step** | `.rc-step` | the core unit: big checkbox + number + text (+ optional command / expected / callout) |
| Step checkbox | `.rc-check` | square (radius 5) custom checkbox; checked → accent fill + tick; `aria-checked` |
| Command block | `.rc-cmd` | dark `--bg-deep` panel, mono, with a **copy** button (`.rc-copy`) top-right |
| Expected-result line | `.rc-expected` | `ok`-toned line with a check-circle icon — "you should see …" |
| Critical callout | `.rc-critical` | `risk`-toned inset (warning-triangle) — destructive / no-undo step |
| Rollback note | `.rc-rollback` | `hold`-toned inset on a step — "if this fails, do …" |
| Progress rail | `.rc-rail` | sticky HUD (ring + jump links + filter + reset + rollback card) |
| Progress ring | `.rc-ring` | conic-gradient ring showing overall % (CSS-drawn, no lib) |
| Rollback-plan card | `.rc-rollback-card` | always-visible ordered rollback procedure in the rail |

### Step anatomy (the unit that defines this format)

```
☐  1.2   Drain the node from the load balancer and confirm zero in-flight requests.
         ┌───────────────────────────────────────────── copy ┐
         │ $ lbctl drain --node web-07 --wait 30s            │   ← .rc-cmd (dark, copy btn)
         └───────────────────────────────────────────────────┘
         ✓ Expected: `active_conn=0` within 30s; node state = DRAINING   ← .rc-expected (ok)
         ⚠ Critical: do NOT proceed if conn count is non-zero — abort.   ← .rc-critical (risk)
```

A checked step gets `.is-done` (struck-through text, faded, accent tick). `command`, `expected`,
`rollback`, `critical` are all **optional** per step — render only what the data provides.

---

## Data fields (summary — full contract in `schemas/runbook-checklist.schema.json`)

- **`meta`** *(required)* — shared block: `org`, `project`, `reportType`, `title`, `subtitle?`, `date`,
  `author`, `theme` (default `cyan`).
- **`severity?`** — `sev1` | `sev2` | `sev3` | `info` (drives the severity pill colour: sev1/2 → `risk`,
  sev3 → `hold`, info → `ok`).
- **`estDuration?`** — human string, e.g. `"~45 min"`.
- **`owners[]?`** — `{ role, name }` people-chips.
- **`prerequisites[]`** *(required)* — array of strings **or** `{ text, note? }` objects.
- **`sections[]`** *(required)* — `{ id, title, steps[] }`.
  - **`steps[]`** — `{ id, text, command?, expected?, rollback?, critical? }` (`critical` boolean).
- **`rollbackPlan?`** — `{ summary?, steps[] }` rendered in the rail's always-visible rollback card.

The sample's `#report-data` **is a valid instance** of this schema (the canonical example).

## Interactions (mandatory, all data-driven, vanilla JS, ≤150ms)

1. **Check off a step** → toggles `.is-done`; recomputes the **overall progress ring + %** and **every
   per-section `done/total` counter** + rail jump-link count. State held in-memory (a `Set` of done
   step-ids), so it survives filtering, collapsing, and theme swaps within the session.
2. **Collapse / expand a section** → click the section header; caret rotates; body height animates. A
   "expand all / collapse all" affordance is provided.
3. **Copy** button on every command block → writes the command to the clipboard, flips the button label
   to "Copied ✓" briefly. (Uses `navigator.clipboard` with a `execCommand` fallback.)
4. **"Remaining only" filter** → a rail toggle that hides every `.is-done` step (and auto-hides a section
   whose steps are all done), so the operator sees only what's left. Toggling off restores all.
5. **Reset** → clears the done set, unchecks everything, recomputes (with a confirm).
6. **Theme switch** → the standard `.rc-theme` dot group recolours live (8 presets).

## `@media print`

- All sections **force-expanded** (`[data-open]` ignored; bodies shown), "remaining only" filter ignored
  (print the **complete** procedure).
- Hide all controls: `.rc-theme`, copy buttons, filter/reset, the section carets, and the sticky rail
  collapses to a static end-block (or is hidden) so the printed sheet is a clean, complete SOP.
- Checkbox state prints as drawn (a checked step still reads as done on paper). White footer.

## Do / Don't

**Do** keep steps **imperative and atomic** ("Drain node web-07", not a paragraph); put exactly one action
per `.rc-step`; pair risky steps with a `rollback` or `critical`; keep the step column to a readable
≤ ~900px measure while the *page* stays PC-wide; make the rail the operator's constant HUD.

**Don't** wrap this in the long-form report chrome (thin top bar + prose TOC + dual reading rails); don't
write narrative prose between steps; don't invent a 4th status colour; don't cap the whole page narrow
(only the step *column* is measure-limited); don't fake progress — every number is computed from the
checked-step set; don't use emoji for the check/critical marks (use the house SVG icons).

## Icons

Use the bespoke set in [`../icons/`](../icons/) — inline SVG, `currentColor` (themes automatically). Typical categories for this format: process, status, code, time. Browse `../icons/index.html`; never use emoji or generic "AI" icons (see [`../icons/SPEC.md`](../icons/SPEC.md)).
