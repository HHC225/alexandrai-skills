# Data-driven interactive reports — build contract (`_DATA_DRIVEN.md`)

> **Extends [`_FOUNDATION.md`](_FOUNDATION.md).** A report built on this contract is **not static
> paper** — it is an **interactive, themeable, data-driven** HTML document. The whole point of HTML
> output: the reader can filter, toggle, expand, and recolour it live. Read `_FOUNDATION.md` first
> (palette, type, density, rounded shapes, primitives, icons), then this.

## 1. Output shape — one self-contained `.html`

```
<script type="application/json" id="report-data"> { …instance… } </script>   ← the ONLY content source
<style> … </style>                                                            ← foundation tokens + 8 [data-theme] + PC-wide layout
<script> render(); wireInteractions(); wireThemeSwitch(); </script>           ← reads #report-data → DOM, on DOMContentLoaded
```

- **No external requests** (system fonts; inline `<svg>` icons). Mermaid CDN only if a diagram truly needs it.
- The content lives in `#report-data` (JSON). The JS **renders the DOM from that JSON** and re-renders /
  shows-hides on interaction. Do **not** hard-code content in the HTML body — the body is built by `render()`.
- Data-driven rendering **requires JS** (accepted tradeoff for interactivity). Include a `<noscript>`
  notice. Rendering runs once on load, so **print works** (print a rendered snapshot; hide controls).

## 2. The data contract — a JSON Schema per format

Each format ships **`designs/schemas/<format>.schema.json`** (JSON Schema, draft 2020-12 style:
`$id`, `title`, `type:"object"`, `required:[…]`, `properties` each with a `description`, plus
top-level `examples`). It defines **exactly the fields needed to render the format**.

- Every schema's top level includes a shared **`meta`** object:
  ```jsonc
  "meta": { "org":"{{ORG}}", "project":"{{PROJECT}}", "reportType":"…",
            "title":"…", "subtitle":"…", "date":"2026-06-22", "author":"{{AUTHOR}}",
            "theme":"blue|purple|indigo|teal|cyan|green|plum|slate" }
  ```
  Brand-neutral: keep `{{ORG}}` / `{{PROJECT}}` placeholders unless real values are supplied.
- Then **format-specific content** fields. Mark `required` vs optional, `description` every field,
  and provide realistic `examples`.
- The sample's `#report-data` **MUST be a valid instance** of its own schema — it is the canonical example.

**Why (the policy):** when a user says *"output as `<format>`"*, an LLM loads
`designs/schemas/<format>.schema.json`, fills **exactly those fields** from its analysis, and emits the
JSON. The template renders it deterministically — no missing sections, no layout drift, no invented
structure. (The orchestrator maintains `designs/REPORT_POLICY.md` mapping report-type → format → schema.)

## 3. In-report theme switcher — MANDATORY, standard markup

Every report carries ONE **compact dropdown** to recolour it live (**9 brand presets — Black is MANDATORY / always selectable**). Use a single `<select>` — **NOT a wide row of colour dots** (that wastes horizontal space). Canonical:

```html
<label class="rc-theme" title="Brand colour">
  <span class="rc-theme-sw" aria-hidden="true"></span>
  <select class="rc-theme-sel" aria-label="Brand theme">
    <option value="blue">Blue</option>
    <option value="purple">Purple</option>
    <option value="indigo">Indigo</option>
    <option value="teal">Teal</option>
    <option value="cyan">Cyan</option>
    <option value="green">Green</option>
    <option value="plum">Plum</option>
    <option value="slate">Slate</option>
    <option value="black">Black</option>
  </select>
</label>
```
```css
.rc-theme{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--rule);border-radius:7px;
          padding:3px 4px 3px 7px;background:var(--bg);}
.rc-theme-sw{width:12px;height:12px;border-radius:50%;background:var(--navy);box-shadow:0 0 0 1px var(--rule);flex:none;}
.rc-theme-sel{border:0;background:none;font:600 11px/1 var(--mono);color:var(--ink-mid);cursor:pointer;outline:none;padding:2px;}
@media print{.rc-theme{display:none;}}
```
```js
var rcSel = document.querySelector('.rc-theme-sel');
if (rcSel) {
  rcSel.value = document.documentElement.dataset.theme || 'blue';
  rcSel.addEventListener('change', () => { document.documentElement.dataset.theme = rcSel.value; });
}
```
The `.rc-theme-sw` swatch uses `var(--navy)`, so it shows the live accent colour; the dropdown holds all 9 named presets in one compact control. (Do not lay the themes out as a horizontal dot row.)
- Initial theme = `meta.theme` (set `<html data-theme="…">` on render). All 9 `[data-theme]` override
  blocks must be present in the CSS (copy all 9 from `_FOUNDATION.md` §1, **including Black**). Switcher hidden in print.

Black preset (always include): `html[data-theme="black"]{ --navy:#000000; --navy-deep:#000000; --navy-bg:#f1f1f3; --navy-line:#d6d6db; --ok:#3f3f46; --ok-bg:#f1f1f3; --ok-line:#cfcfd6; }` — a mono/ink theme; `risk` (bordeaux) and `hold` (amber) stay constant.

## 4. Interactivity — MANDATORY on every visual

Every chart / roadmap / table / calendar / tree / diagram MUST have **≥1 real control that changes what
is shown**, driven from the data, vanilla JS, no libraries, smooth (≤150ms transitions). Examples:

| Visual | Required interaction(s) |
|:--|:--|
| Bar/line/area chart | clickable **legend → series show/hide**; hover **tooltip** |
| Roadmap / gantt | **period/date-range** filter; **lane** toggle; **status** filter; jump-to-today |
| Table / register | **search**; **sortable** columns; **status filter** chips; **row expand** |
| Calendar / schedule | **prev/next** period; **event-type** filter; resource toggle; event detail |
| Tree / org chart | **collapse/expand** node; **focus** subtree / reset |
| Topology / diagram | **layer** toggle; **type** filter; click node → **highlight neighbours**; **pan/zoom** |
| Comparison grid | **column (option)** toggle; criteria-group filter; highlight-best; sort by criterion |

Drive every interaction from the underlying data / DOM (filter the data → re-render, or show/hide
nodes) — never fake it. Controls use `_FOUNDATION` primitives (filter chips, toggles, `st-*` badges).
In print, expand everything to a static, complete snapshot and hide the controls.

## 5. PC width — these are PC-only deliverables

- `<meta name="viewport" content="width=1440">`.
- **WIDE formats fill the screen.** Either a centred container `max-width: 1600–1760px` (40px gutter),
  **or** a full-bleed app shell (toolbar / rails + content) using the full viewport width. **Do NOT cap
  a wide format at ≤1280px** — that was the old mistake. Tables / diagrams / roadmaps may scroll
  horizontally inside a full-width frame.
- **Narrow-by-design** formats (one-pager A4 sheet, a single slide) keep their intended width — cap only
  when the content genuinely wants it.

## 6. Per-format deliverables (for the build agents)

1. **`designs/<format>.md`** — spec: what it inherits, when to use, the **distinct chrome + layout**,
   signature components (class names), the **data fields summary**, the **interactions**, a short Do/Don't.
2. **`designs/schemas/<format>.schema.json`** — the field contract (+ `examples`).
3. **`sample/<format>_sample.html`** — the data-driven, interactive, PC-wide, themeable exemplar whose
   `#report-data` is a valid example instance.

Write only those three files for your format. The orchestrator assembles `REPORT_POLICY.md`, the icon
catalog, and the READMEs. Keep the two-colour discipline, rounded panels, system fonts, and the
self-contained rule from `_FOUNDATION.md`. Diverge on chrome; converge on the data-driven + interactive
+ themeable + PC-wide contract above.
