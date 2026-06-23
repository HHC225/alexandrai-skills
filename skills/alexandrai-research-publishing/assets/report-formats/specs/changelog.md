# Format: Changelog / release feed

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** — the 9-theme palette tokens
> (Black mandatory), the system-font stack, the dense 13px body, rounded panels, the three semantic
> states (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.ref-chip`, mono chips,
> key/value grid), and the self-contained, **data-driven + interactive** output rules
> ([`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md)). **Default theme: Slate.**
> What this format reinvents is its **chrome and layout**: there is no hero, no standfirst, no
> prose table-of-contents. **The reverse-chronological version feed IS the page**, with a sticky
> left **version jump rail** beside a readable centre column (~1400px PC-wide).

---

## One-line difference from long-form (and from timeline-roadmap)
Long-form is a *document you read top-to-bottom* (hero → TOC → stacked prose panels). **Changelog is a
*release history you scan backwards*** — newest version at the top, each version a tagged block of
typed change items. And unlike **timeline-roadmap**, which is a *forward* gantt plan across a time axis,
**changelog looks only at the past**: shipped versions, in descending semver/date order. No time axis,
no swimlanes, no bars — a feed of dated releases.

## When to use
A **published record of what shipped, version by version** — for readers who ask *"what changed, when,
and is anything going to break me?"*:

- product / API / SDK / library release notes (semver tags + dates);
- platform or service change history (stable & beta channels);
- "what's new" feeds for an app, CLI, or internal tool;
- migration-relevant change logs where **Breaking** / **Deprecated** / **Security** items must stand out;
- any append-only history that reads **newest-first** and is **typed by kind of change**.

Reach for a different format when: the deliverable is a *forward* plan (use **timeline-roadmap**); a
queryable record catalogue with sort/columns (use **data-register**); narrative analysis of one release
(use **long-form-report**); or a step-by-step procedure (use **runbook-checklist**).

---

## Distinct chrome + layout model

The document is a **release feed with a jump rail**, not a column of prose panels. Three structural
pieces define it:

1. **A compact release header band** (`.cl-header`) — `{{ORG}} / {{PROJECT}}` wordmark, the product
   name + the changelog title, a one-line subtitle, and a **control strip**: change-type **filter
   chips**, a **channel** filter (stable / beta), a **"breaking only"** toggle, a live **text search**,
   and the **theme switcher**. A small **summary stat row** (total versions / latest tag / total changes
   / breaking count) sits in the band — **all counts derived from the data**.
2. **A sticky left version jump rail** (`.cl-rail`) — a vertical **index of every version**: semver tag
   + date + channel badge + a per-version change count, each a **deep-link** that scrolls to (and
   expands) that version. The active version highlights via scroll-spy. This *replaces* the long-form
   prose TOC entirely; it is a **version ladder**, not a heading list.
3. **The version feed (the body).** A descending stack of **`.cl-version` sections**, newest first.
   Each version is a **collapsible** block: a header row (the **`.cl-tag` semver pill**, release `date`,
   a **`.cl-channel` badge**, an optional summary line, a change count, and a caret) over a list of
   **`.cl-change` rows**. Every change row carries a **coloured type chip** (`.cl-chip` — Added /
   Changed / Fixed / Deprecated / Removed / Security / **Breaking**), the change text, and an optional
   **`.ref-chip`** reference (PR / issue / ticket, optionally linked). **Breaking** uses the `risk`
   tone; **Deprecated** / **Removed** use `hold`; additive/neutral kinds use the brand accent or `ok`.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ flat header · {{ORG}}/{{PROJECT}} · product · "Changelog"                   │
│ [Added][Changed][Fixed][Deprecated][Removed][Security][Breaking] chips      │  ← .cl-controls
│ channel: (all|stable|beta)   ⦿ breaking only   🔎 search…       ● theme dots │
│ stat row: 6 versions · latest v4.2.0 · 31 changes · 2 breaking              │  ← .cl-stats (from data)
├──────────────┬──────────────────────────────────────────────────────────────┤
│ VERSIONS     │  ▼ v4.2.0   2026-06-18  ·STABLE·   12 changes                  │  ← .cl-rail │ .cl-version
│ v4.2.0  2026 │     ⬤Breaking  Drop Node 18 support … …………………  [#1420]        │     .cl-change → .cl-chip
│  ·12  STABLE │     ⬤Added     New idempotency-key header on POST …            │
│ v4.1.0  2026 │     ⬤Fixed     Retry storm on 429 from the rate limiter …      │
│  ·7   STABLE │  ▼ v4.1.0   2026-05-30  ·STABLE·    7 changes                  │
│ v4.0.0  …    │     ⬤Security  Patch token-leak in debug logs (CVE-…) …        │
│ v3.9.0  …    │  ▶ v4.0.0-beta.2  2026-05-12 ·BETA· 4 changes  (collapsed)     │
│ …            │  …                                                             │
├──────────────┴──────────────────────────────────────────────────────────────┤
│  dark footer wordmark · as-of {{DATE}}                                        │  ← shared footer
└───────────────────────────────────────────────────────────────────────────┘
```

Grid mechanics: the body is a two-column `display:grid` — `grid-template-columns: 220px minmax(0,1fr)`
(column 1 = sticky version rail, column 2 = the feed) inside a centred `max-width:~1400px` frame. The
rail is `position:sticky; top:…` and scroll-spies the version sections; the feed scrolls underneath it.

---

## Signature components (class names)

- **`.cl-frame`** — the centred PC-wide shell (`max-width:~1400px`, 40px gutter). Holds header, the
  2-col body, and the footer.
- **`.cl-header`** — the compact release band (`--bg-band`), wordmark + product + title + subtitle, the
  control strip, and the derived stat row. This *replaces* the long-form hero.
  - **`.cl-controls`** — the control strip holding all interactions below.
  - **`.cl-chip`** — the **typed change chip**, the format's signature mark. Seven variants keyed to
    `type`: `.is-added` (brand/ok), `.is-changed` (brand), `.is-fixed` (brand/ok), `.is-deprecated`
    (`hold`), `.is-removed` (`hold`), `.is-security` (brand-strong), `.is-breaking` (`risk`). Each is a
    mono pill with a leading dot/icon. **Doubles as a filter button** in the control strip (toggling a
    type shows/hides those change rows) and as the per-change label in the feed.
  - **`.cl-channel-filter`** — a small segmented control (All / Stable / Beta) filtering versions by
    `channel`.
  - **`.cl-breaking-toggle`** — a `.cl-switch` toggle that reduces the feed to **breaking changes only**.
  - **`.cl-search`** — a live text input that filters change rows by substring **and highlights** the
    match (`<mark>`); versions with zero surviving changes collapse out.
  - **`.cl-stats`** — a mono stat row (`.cl-stat` cells): total versions, latest tag, total changes,
    breaking count — every figure **computed from the data**, never hard-coded.
- **`.cl-rail`** — the sticky left **version jump rail**. Children `.cl-rail-item` (one per version):
  mono `.cl-tag` + date + `.cl-channel` badge + a `.cl-rail-count` change count, the whole item a
  deep-link (`href="#v-<key>"`). `.is-active` highlights the in-view version (scroll-spy). Hidden in print.
- **`.cl-version`** — one release section (`id="v-<key>"`, `scroll-margin-top`), **collapsible**
  (`data-open`). Leading **`.cl-version-hd`**: the **`.cl-tag`** semver pill (brand-tinted, mono), the
  release **`.cl-date`**, the **`.cl-channel`** badge (`stable` neutral / `beta` `hold`-tinted), an
  optional **`.cl-summary`** line, a **`.cl-count`** change count, and a **`.cl-caret`**. A `.is-latest`
  version may carry a "Latest" marker. A version whose changes include any `breaking` flags a small
  `.cl-breaking-flag` (risk).
- **`.cl-change`** — one change row inside a version: a leading **`.cl-chip`** type label, the change
  **text** (allows inline `` `code` ``), and an optional trailing **`.ref-chip`** (PR/issue/ticket;
  linked when `refUrl` is present). `.is-breaking` rows get a hairline `risk` left border so they read
  at a glance even when the chip is small.
- **`.cl-allbtn`** — an Expand-all / Collapse-all text button (reuses the family `.cl-textbtn` shape).
- **`.cl-empty`** — the filter empty-state panel (shown when search/filters hide every change).

Reused family primitives: **`.st-badge`** semantics drive the chip/channel colours; **`.ref-chip`** for
references (hover inverts to the brand accent); mono **chips** for the semver tag; the **dark footer**;
and inline **house SVG icons** (`version-tag`, `commit`, `pull-request`, `shield-alert`, `ban`,
`plus`/`minus`, `search`, `filter`, `chevron-right`, `external-link`) sized with `.icon`.

---

## Interactions (data-driven, vanilla JS — all MANDATORY)

Driven entirely from `#report-data`; each control filters the data and re-renders / shows-hides:

- **Filter by change-type chips** — toggle any of the 7 type chips; only matching change rows remain;
  versions left empty collapse out; counts update.
- **Filter by channel** — All / Stable / Beta segmented control hides non-matching versions.
- **Live text search** — substring match across change text + refs; matches are wrapped in `<mark>`
  (highlight); non-matching rows hide; emptied versions drop out.
- **Breaking-only toggle** — reduces the feed (and rail) to versions/changes flagged `breaking`.
- **Expand / collapse** — each version block toggles open/closed; an **Expand-all / Collapse-all** control.
- **Version-rail deep-link / jump** — clicking a rail item scrolls to that version and expands it;
  **scroll-spy** highlights the active version in the rail as you scroll.
- **Counts derived from data** — every stat (versions / changes / breaking / per-version counts /
  per-type counts) is computed at render time, and recomputed live under filters.

In **print**, expand every version, hide the rail + controls + theme switcher, and render the full feed
as a static, complete snapshot.

---

## Layout outline (build order)

```
flat header           ← {{ORG}}/{{PROJECT}} wordmark · product · "Changelog" · subtitle
  ├─ control strip    ← type filter chips · channel filter · breaking-only toggle · search · theme dots
  └─ stat row         ← versions / latest tag / total changes / breaking  (computed from data)
2-col body
  ├─ version rail     ← sticky left ladder: tag · date · channel · count  (deep-links, scroll-spy)
  └─ version feed     ← descending .cl-version blocks, each collapsible, holding .cl-change rows
       └─ .cl-change  ← .cl-chip type · text (`code`) · .ref-chip (PR/issue)
footer                ← dark wordmark band · as-of {{DATE}}
```

---

## Do / Don't

- **Do** order versions **newest-first** (reverse-chronological), and keep the **left version rail**
  sticky so the reader can jump across the history at any scroll position.
- **Do** give **every change a typed chip**; colour **Breaking** with the `risk` tone and
  **Deprecated/Removed** with `hold`, so migration-relevant changes pop without reading prose.
- **Do** derive **every count** (versions, changes, breaking, per-version) from the data, and keep them
  honest as filters/search change.
- **Do** keep change items terse, one line each, with the detail in a linked `.ref-chip` — this is a
  feed, not an essay.
- **Don't** wrap this in the long-form chrome (sticky reading TOC + right facts rail + stacked prose
  panels) — that is a different document type.
- **Don't** add a time axis, swimlanes, or gantt bars — that is **timeline-roadmap**, and it points
  *forward*; the changelog points *back*.
- **Don't** turn it into a sortable column grid (that's **data-register**) or order versions
  oldest-first.
- **Don't** invent a 4th status colour or a change type outside the seven, and never use emoji icons;
  obey the family palette + house icon set.

## Exemplar
[`../sample/changelog_sample.html`](../sample/changelog_sample.html) — a fictional payments-API release
changelog: 6 versions (stable + beta channels) spanning Added / Changed / Fixed / Deprecated / Removed /
Security / Breaking, with a sticky version rail, type-chip + channel filters, a breaking-only toggle,
live highlight search, expand/collapse, scroll-spy, and data-derived counts (Slate theme, with all 9
`data-theme` swaps incl. Black).

## Data schema

Full field contract: [`schemas/changelog.schema.json`](schemas/changelog.schema.json) (JSON Schema
draft 2020-12, includes a realistic `examples[0]` instance with ~6 versions and a breaking change).

**Required top-level fields:** `meta`, `product`, `versions`

| Field | Required | Description |
|:--|:--|:--|
| `meta` | yes | Shared chrome: `org`, `project`, `reportType`, `title`, `date`, `theme` (default `slate`). Optional `subtitle`, `author`. |
| `product` | yes | The thing being versioned: `name`; optional `repoUrl`, `description`. |
| `versions[]` | yes | Releases, newest-first. Each: `version` (semver tag), `date`, `changes[]`; optional `channel` (`stable`\|`beta`), `summary`, `yanked`. |
| `versions[].changes[]` | yes | The typed change items. Each: `type` (`added`\|`changed`\|`fixed`\|`deprecated`\|`removed`\|`security`\|`breaking`), `text`; optional `ref`, `refUrl`. |

## Icons

Icons are inline SVG from [`../icons/`](../icons/) per `../icons/SPEC.md` — no external requests. Colour
follows `currentColor`, so a chip's icon recolours with its state across all 9 themes. Relevant categories:

- **code** — `version-tag` (the semver pill / rail), `commit`, `pull-request`, `branch`, `code-diff`,
  `rollback` (yanked release)
- **status** — `plus` (Added), `info-circle`/`progress-half` (Changed), `check-circle` (Fixed),
  `clock-pending`/`hourglass` (Deprecated), `ban`/`minus` (Removed), `shield-alert` (Security),
  `warning-triangle` (Breaking → `risk`)
- **nav** — `search`, `filter`, `chevron-right` (caret), `expand`/`collapse`, `external-link`,
  `anchor-link` (rail deep-link)
- **editorial** — `tag`/`label` (channel badge), `note` (version summary), `bookmark` (latest marker)
