# Geo-region — regional breakdown as an abstract tile-grid choropleth

> **Format spec.** Inherits the family DNA from [`_FOUNDATION.md`](_FOUNDATION.md) and the data-driven /
> interactive / themeable contract from [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md). Read both first. This
> format renders a **regional breakdown** as a **tile-grid choropleth** — a stylised, map-like grid of
> labelled square tiles, shaded by a metric along the single-hue brand accent ramp — never a real map,
> never external tiles, never images.

---

## What it inherits (do not reinvent)

- **Palette & tokens** — the 9-theme block in `:root` + all 9 `html[data-theme="…"]` overrides,
  **including Black** (`--navy:#18181b; --navy-deep:#000; --navy-bg:#f1f1f3; --navy-line:#d6d6db;
  --ok:#3f3f46; --ok-bg:#f1f1f3; --ok-line:#cfcfd6;`). `risk`/`hold`/neutrals stay constant. The
  **choropleth ramp is the accent hue only** (`--navy-bg` → `--navy` → `--navy-deep`); semantic
  `ok`/`risk`/`hold` are reserved for the per-region facts, never the tile fill.
- **Type stacks & density** — system `--sans` / `--mono`, 13px body, `"tnum"` on every value, tracked
  uppercase mono micro-labels.
- **Rounded shapes & flat elevation** — panels `12px`, tiles `10px`, chips `5–6px`, whisper shadow only.
- **Shared primitives** — `.st-badge` (ok/risk/hold), `.chip` / `.ref-chip`, key/value grid, the dark
  footer band, the inline house SVG icons (`currentColor`).
- **The data-driven shell** — one `#report-data` JSON → `render()` builds the DOM → interactions
  re-render / recolour; `<noscript>` notice; print = static rendered snapshot.
- **The shared CSS-chart technique** from `sample/dashboard_sample.html` — the **floating tooltip**
  (`.chart-tip` fixed, single shared instance) and the **detail-panel / drill** pattern are reused here
  for the tile tooltip and the side detail panel. (Reuse the technique, **not** the console chrome.)

## When to use it

Reach for geo-region when the report is a **breakdown of one or two metrics across places** and the
reader cares about **relative magnitude and ranking across regions**, not precise geography:

- revenue / accounts / volume **by territory, market, or sales region**;
- a **branch / store / data-centre network** summarised per zone;
- incidents, traffic, or risk **by region**; coverage or penetration **by area**.

Use it **instead of**:
- **dashboard** — when the organising axis is *place* (a map silhouette) rather than time-series tiles.
- **data-register / comparison-grid** — when a spatial, at-a-glance shape beats a long table.
- **diagram-topology** — topology is a *free-form* node-and-edge system map with pan/zoom; geo-region is a
  **fixed grid** of magnitude-shaded place tiles ranked by a metric. Different artefact entirely.

Do **not** use it when exact coordinates / real borders matter (this format is deliberately abstract), or
when there is no regional dimension at all.

---

## Distinct chrome + layout (how it differs from the long-form report)

No thin top bar, no both-side sticky rails, no stacked prose sections. The page is an **atlas panel**: a
slim header strip, then a **two-pane body** at PC width (~1500px), tilemap left, list/detail right.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER STRIP  eyebrow · title · standfirst   [metric switcher] [9-dot]    │
├───────────────────────────────────────────────┬──────────────────────────┤
│  TILEMAP PANEL                                  │  SIDE COLUMN             │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐                 │  ┌─ region list ──────┐  │
│  │PNW ││ ·  ││ ·  ││GLK ││NEA │   ← tiles placed │  │ ▰ NCA   51.7  ████ │  │
│  └────┘└────┘└────┘└────┘└────┘    by gridRow/Col │  │ ▰ NEA   47.0  ███▌ │  │
│  ┌────┐      ┌────┐┌────┐┌────┐    shaded by the  │  │ ▰ SCA   44.2  ███▏ │  │
│  │NCA │      │TXC ││MWP ││MAT │    accent ramp    │  │  …  sort ▾  filter │  │
│  └────┘      └────┘└────┘└────┘                   │  └────────────────────┘  │
│  ┌────┐┌────┐      ┌────┐┌────┐                   │  ┌─ detail panel ─────┐  │
│  │SCA ││SWT │      │GULF││SEA │                   │  │ NCA · Northern Cal │  │
│  └────┘└────┘      └────┘└────┘                   │  │ 51.7 $M · #1       │  │
│  ── colour-scale legend ───────────              │  │ branches 118 …     │  │
├───────────────────────────────────────────────┴──────────────────────────┤
│  FOOTER  wordmark · as-of · source                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

- `<meta name="viewport" content="width=1440">`; layout grid `minmax(0,1fr) 392px` (tilemap | side),
  capped around **1500px** centred.
- **Threshold filter** lives over the tilemap; **sort + metric** govern the list. In print the panes
  stack, the detail panel shows the top-ranked region, controls are hidden.

## Signature components (class names)

- **`.geo-header`** — slim header strip: eyebrow (`.geo-eyebrow`, tracked mono), `.geo-title`, optional
  standfirst, an `.asof-chip`, the `.metric-switch` segmented control, and the canonical `.rc-theme` dots.
- **`.tilemap`** — the choropleth canvas: a `display:grid` whose cells are positioned with
  `grid-row`/`grid-column` from each region's `gridRow`/`gridCol`. The signature element.
- **`.tile`** — one region: a rounded square, `--fill` set inline to the ramp colour for the active
  metric, a `.tile-code` (mono) and `.tile-val` (tnum). Modifiers: `.is-active` (selected — accent ring),
  `.below` (dimmed by the threshold filter). Light tiles get readable dark ink, dark tiles light ink
  (auto-contrast from the normalised value).
- **`.scale-legend`** — the colour-scale key: a continuous accent gradient bar (or discrete `.lg-band`
  swatches when `scale.bands` is supplied) with min/max/`metric.unit` end-labels. Reflects the active
  metric/scale.
- **`.region-list`** — the ranked list: each `.rl-row` is `rank · swatch · code/name · value · mini-bar`,
  sorted by the active metric; clicking a row selects its region. Header carries `.rl-sort` (value / name /
  rank) and a `.threshold` range input that dims tiles + rows below the cutoff.
- **`.detail-panel`** — the per-region readout: `.dp-head` (code chip + name + group), the big active
  value (`.dp-value`, tnum + unit), a `.dp-kv` key/value grid (the region's `stats` + every metric), an
  optional `.dp-note`, and a per-metric mini-bar vs the network max.
- **`.chart-tip`** — the shared floating tooltip (region name + active value) on tile hover, reused
  verbatim from the dashboard technique.

## Data summary

`#report-data` (valid against [`schemas/geo-region.schema.json`](schemas/geo-region.schema.json)):

- **`meta`** — org/project/title/subtitle/date/author, optional `asOf`, and `theme` (default `teal`).
- **`metric`** `{key,label,unit,format?,higherIsBetter?}` — the metric shown on load.
- **`metrics[]?`** — 2+ switchable metric defs (drives the switcher); each `key` resolves in every region.
- **`regions[]`** `{code,name,gridRow,gridCol,value,metrics{key→number},group?,note?,stats[]?}` — the
  tiles; `gridRow`/`gridCol` are abstract grid coordinates, **not** geography. Every region carries a
  value for every active metric key.
- **`scale`** `{min,max,bands[]?}` — the colour domain shared by tile shading and the legend.

## Interactions (data-driven, vanilla JS)

| Control | Effect |
|:--|:--|
| **Metric switch** (`.metric-switch`) | recolour **every tile** along the ramp for the new metric, **re-rank** the list, re-point the **legend** + unit, refresh the detail panel. |
| **Hover tile** | floating `.chart-tip` with region name + active value (+ unit). |
| **Click tile** or **click list row** | open/refresh the `.detail-panel` and add `.is-active` ring to the matching tile; selecting in one pane highlights the other. |
| **Sort list** (`.rl-sort`) | reorder `.region-list` by value (respecting `higherIsBetter`), name, or rank. |
| **Threshold filter** (`.threshold`) | dim every tile and row whose active value is below the cutoff (`.below`); legend marks the cutoff. |
| **Theme dots** (`.rc-theme`) | recolour the whole report (9 presets incl. Black); the ramp re-derives from the new accent. |

All transitions ≤150ms. Print expands to a complete static snapshot (panes stack, top region detailed,
controls hidden).

## Data schema

Field contract and example instance: [`schemas/geo-region.schema.json`](schemas/geo-region.schema.json).
The sample's `#report-data` is a valid instance and the canonical example (`examples[0]`).

## Icons

House SVG set ([`../icons/`](../icons/SPEC.md)), inlined, `currentColor`, 24×24, never emoji. Used here:

- **`maps-location`** *(category: infra / source)* — the tilemap panel title and the format mark.
- **`data`** — `bar-chart` / `metric` glyph for the metric switcher and legend.
- **`status`** — `check-circle` / `dot` marks for the per-region semantic facts in the detail panel.
- **`nav`** — `sort-asc/desc`, `filter`, `chevron` for the list controls.

(Draw `maps-location` to spec — a pin over a stylised tile grid, squared signature node — if the library
copy is not yet present; the sample inlines it.)

## Do / Don't

**Do**
- Keep the tilemap **abstract**: squares on a grid placed by `gridRow`/`gridCol` to *suggest* geography.
- Shade tiles on a **single-hue** accent ramp (`--navy-bg`→`--navy-deep`); auto-contrast the tile label.
- Drive colour, ranking, legend, and detail entirely from `#report-data` + the active metric.
- Reserve `ok`/`risk`/`hold` for the **facts** (YoY, status) in the detail panel — never the tile fill.
- Make every region reachable from both the tilemap and the list, and keep them in sync.

**Don't**
- Don't embed a real map, map tiles, GeoJSON paths, or any external image.
- Don't use a **rainbow / multi-hue** choropleth — that breaks the two-colour discipline.
- Don't reuse the long-form report frame (top bar + dual rails) or the dashboard's console chrome.
- Don't hard-code tiles/rows in the HTML body — `render()` builds everything from the JSON.
- Don't require JS to *read* the data (ship the `<noscript>` notice + the raw JSON block).
