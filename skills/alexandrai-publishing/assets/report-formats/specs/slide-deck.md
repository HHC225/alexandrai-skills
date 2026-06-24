# Format: Presentation / HTML PPT (slide deck)

> **Inherits from [`_FOUNDATION.md`](_FOUNDATION.md)** — the same 8-theme palette, the same type *stacks*
> (`--sans` / `--mono`), the rounded-panel shape language, the three status semantics (`ok`/`risk`/`hold`),
> the shared primitives (status badge, chip, data table, key/value grid), the icon style, and the
> **self-contained output rules** (§0: one file, inline `<style>`/`<svg>`/`<script>`, system fonts, no
> external requests, `{{ORG}}`/`{{PROJECT}}` placeholders).
>
> **The one sanctioned departure:** this is the single format that scales **type UP**. A slide is read
> from across a boardroom, not at 40 cm — so slide titles run **30–48px** and body runs **≥18px**. It
> keeps every other DNA rule (palette tokens, stacks, shapes, status colours). Default theme: **Purple**.

This is the **HTML PPT**. It is a *deck*, not a document. Do **NOT** wrap it in the long-form chrome
(thin sticky topbar + both-side sticky rails + stacked scrolling section panels). It has its own chrome:
full-viewport 16:9 slides, scroll-snap, keyboard nav, a slide counter, and a progress bar.

---

## When to use

A deliverable meant to be **presented or clicked through one idea at a time**, then exported to PDF as a
landscape slide pack:

- executive / steering-committee readouts, board briefings, kickoff & closeout decks;
- investor or strategy pitches (one point per slide);
- a "presentation cut" of a long-form report — the report stays the system of record; the deck is the
  room version.

If the artefact needs a table of contents, dense prose, and continuous reading → that's the
**long-form-report**, not this. If everything must fit in **one** non-scrolling view → that's the
**one-pager**. A deck is *many* full-screen views, one message each.

---

## Distinct identity (chrome + layout that MUST differ)

| Aspect | This format |
|:--|:--|
| **Unit** | the **slide** — a full-viewport 16:9 stage, ONE idea on it. |
| **Navigation** | vertical **scroll-snap** deck + keyboard (`←/→`, `PgUp/PgDn`, `Space`, `Home/End`); click the edge zones; deep-link via `#3`. |
| **Persistent chrome** | a fixed **slide counter** (`07 / 11`) and a thin **progress bar** pinned to the viewport — nothing else floats. |
| **Type** | scaled **UP** (titles 30–48px, body ≥18px) — the only format that does this. |
| **Print** | exactly **one slide per landscape page** (`page-break-after`), no snap, auto height. |
| **What it is NOT** | not a scrolling article, no TOC rail, no sticky topbar, no continuous body copy. |

---

## The slide system

### Aspect & sizing
- The deck is a vertical scroll container; each slide fills the viewport and snaps:
  ```css
  .deck  { height:100vh; overflow-y:auto; scroll-snap-type:y mandatory; scroll-behavior:smooth; }
  .slide { height:100vh; scroll-snap-align:start; scroll-snap-stop:always;
           display:grid; align-content:center; box-sizing:border-box; }
  ```
- Hold a true **16:9 stage** inside each slide so projection and PDF match, and letterbox the rest:
  ```css
  .slide-stage{ width:min(100%, calc((100vh - 2*var(--m)) * 16/9));
                aspect-ratio:16/9; margin-inline:auto; }
  ```
  (Or size the stage with `vh` math if `aspect-ratio` must be avoided. `--m` = the 48–64px slide gutter.)
- **Gutters** ~48–64px. ONE idea per slide; if a slide needs a scrollbar, split it in two.

### Print = 1 slide / page (landscape)
```css
@media print{
  @page { size: landscape; margin:0; }
  .deck { height:auto; overflow:visible; display:block; }
  .slide{ height:auto; min-height:auto; page-break-after:always; break-after:page; }
  .deck-hud, .deck-progress, .edge-nav { display:none !important; }   /* hide screen-only chrome */
}
```

---

## Slide types (class names)

Every slide is `<section class="slide …">` with a `.slide-stage` inside. Compose with the foundation
primitives — just larger.

| Class | Purpose | Anatomy |
|:--|:--|:--|
| `.slide-cover` | title slide | tracked **eyebrow** → huge `.deck-title` (40–48px) → verdict + date **chips** (reuse `.st-badge` / pill) → author/“prepared for” byline row. |
| `.slide-section` | section divider | full-bleed **band** (`--bg-deep` or `--navy-bg`); big two-digit `.sec-num` + section title. Resets the audience. |
| `.slide-agenda` | agenda / contents | numbered list of the sections to come; mono indices; one per line, generous leading. |
| `.slide-bullets` | the workhorse | one `.deck-title` + a `.deck-bullets` list (3–6 items, ≥18px, leading icon/marker). Never a wall of text. |
| `.slide-two-col` | split | `.two-col` grid (`1fr 1fr`, ~40px gap): text + visual, or two related groups; each side a rounded panel. |
| `.slide-stat` | the big KPI | one or a row of oversized numbers (`.deck-kpi` 64–120px, `font-feature-settings:"tnum" 1`) + label + one supporting line. Status-coloured. |
| `.slide-chart` | one chart | a single CSS/SVG bar or line chart filling the stage, big axis labels, a one-line takeaway as the title. |
| `.slide-table` | one table | the foundation **data table**, type bumped (header mono ~12px, cells ≥16px); ≤6 rows so it reads from afar. |
| `.slide-quote` | pull-quote | one large `.deck-quote` (28–40px) + attribution; lots of negative space. |
| `.slide-compare` | A vs B | `.compare` two-panel grid; left vs right (option A/B, before/after, us/them); a center “vs” or arrow; reuse `.st-badge` for verdicts. |
| `.slide-close` | closing / next steps | recap + a short **ask / next-steps** list + owners; mirrors the cover’s look to bookend the deck. |

**Reuse from the foundation, scaled up:** status badge `.st-badge`, chip/`.ref-chip`, the KPI strip
(`overview`/`.stat`), bar rows, the data table, the key/value grid, the dark footer band, icons.

---

## Runtime (single inline `<script>` at end of body)

Core content reads with JS **off** (scroll-snap + anchors already work). JS only enhances:

1. **Keyboard nav** — `ArrowRight`/`ArrowDown`/`PageDown`/`Space` → next; `ArrowLeft`/`ArrowUp`/`PageUp` →
   prev; `Home`/`End` → first/last. Each scrolls the target slide into view (`scrollIntoView`).
2. **Slide counter** — a fixed `.deck-hud` showing `current / total`, updated from an
   `IntersectionObserver` (the slide ≥60% visible is “current”).
3. **Progress bar** — a fixed `.deck-progress > i` whose width = `current / total`.
4. **Edge click zones** — invisible left/right `.edge-nav` hit areas page the deck on click.
5. **Deep-link** — on load, honour `location.hash` (`#5` → slide 5); on nav, update the hash
   (`history.replaceState`) so any slide is shareable; respond to `hashchange`.

Keep it dependency-free and short. No framework, no animation library.

---

## Do / Don't

- **Do** keep **one idea per slide** and **large** type (title ≥30px, body ≥18px) — it’s read across a room.
- **Do** keep the foundation’s **palette, stacks, rounded panels, and the three status colours**; the only
  thing you scale is the type.
- **Do** guarantee `@media print` yields **one slide per landscape page** and hides the HUD/progress/edge-nav.
- **Do** make every slide deep-linkable and keyboard-reachable; keep the counter + progress visible.
- **Don't** paste a long-form section, a TOC rail, or a sticky topbar onto a slide — that's the report, not a deck.
- **Don't** crowd a slide with multiple charts/tables or a paragraph of prose; split it.
- **Don't** depend on JS for *reading* (scroll + anchors must work with JS disabled).
- **Don't** invent a 4th status colour or add gradients on text.

## Exemplar

`sample/presentation_deck_sample.html` — a self-contained Purple readout deck: cover · agenda · section
divider · bullets · two-column · big-stat KPI · CSS bar chart · comparison (two panels) · closing/next
steps; working scroll-snap, keyboard nav, slide counter, progress bar, deep-link, and 1-slide-per-page print.

---

## Data schema

Schema file: [`schemas/slide-deck.schema.json`](schemas/slide-deck.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome: `org`, `project`, `reportType`, `title`, `date`, `theme` (required); `subtitle`, `author` (optional). Default `theme`: `"purple"`. |
| `slides` | array | Ordered list of slide objects. Each slide requires `id` (deep-link anchor) and `type` (one of `cover \| agenda \| section \| bullets \| two-col \| stat \| chart \| table \| quote \| compare \| close`). |

**Per-slide fields (by type):**

| `type` | Required fields | Optional fields |
|:--|:--|:--|
| `cover` | `title` | `eyebrow`, `subtitle`, `chips[]`, `byline[]` |
| `agenda` | `agendaItems[]{index, title}` | `title`, `note`, `current` per item |
| `section` | `title` | `eyebrow`, `subtitle`, `sectionNumber`, `sectionProgress[]` |
| `bullets` | `bullets[]{text}` | `title`, `eyebrow`, `tone`, `icon` per bullet |
| `two-col` | `cols[2]{heading}` | `title`, `eyebrow`, `accent`, `kvRows[]`, `items[]` per col |
| `stat` | `stats[1-3]{value, label}` | `title`, `eyebrow`, `unit`, `note`, `trend`, `trendDir`, `tone` per stat |
| `chart` | `chart{kind, series[]{name, values}}` | `title`, `eyebrow`, `categories[]`, `xLabel`, `yLabel`, `maxValue`, `tone` per series |
| `table` | `tableData{headers[], rows[]}` | `title`, `eyebrow`, `numeric` per header, `tone` per cell |
| `quote` | `quote{text}` | `title`, `eyebrow`, `quote.attribution` |
| `compare` | `compare{optionA{heading, label, items[]}, optionB{heading, label, items[]}}` | `title`, `eyebrow`, `vsLabel`, `recommended`, `positive` per item |
| `close` | `bullets[]{text}` | `title`, `eyebrow`, `owner`, `due`, `tone` per bullet, `footnote` |

---

## Icons

Icon assets: [`../icons/`](../icons/) — inline SVG, `currentColor`, system.

Recommended categories for slide-deck content:

| Category | Use |
|:--|:--|
| `editorial` | Section dividers, cover decorations, pull-quote marks |
| `data` | Chart slides, stat slides, KPI indicators, table annotations |
| `status` | Bullet tone icons (ok / risk / hold), badge markers |
| `nav` | Edge navigation arrows, agenda progress pips, keyboard hints |

Browse available icons: [`../icons/index.html`](../icons/index.html) or [`../icons/manifest.json`](../icons/manifest.json).
