# design-md — DESIGN.md design system (Google design.md format)

> Extends [`_FOUNDATION.md`](_FOUNDATION.md) + [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md). A **DESIGN.md**
> file in Google's [`design.md`](https://github.com/google-labs-code/design.md) format — machine-readable
> design **tokens** (YAML front matter) plus human-readable design **rationale** (Markdown) — rendered
> as a **visual token gallery + styled prose** preview, never raw text.

## When to use

Pick `design-md` when the deliverable is a project's **visual identity / design system**: the colours,
typography, spacing, shape, and component conventions an agent needs to build on-brand UI, in the format
Google published for coding agents. Use it after analysing a codebase's existing styles/tokens, or to
codify a new system. For *how to build/test* the project use `agents-md`; for a formal article use
`research-paper`.

## What the Google design.md format is

A single `DESIGN.md` with two layers:

1. **YAML front matter** (between two lines of exactly `---`) carrying tokens: `name` (required),
   `description?`, and the groups `colors`, `typography`, `rounded`, `spacing`, `components`.
   Colours are any CSS colour; dimensions use `px`/`em`/`rem`; typography tokens carry `fontFamily`,
   `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`. Tokens may reference each other as
   `{colors.primary}`.
2. **Markdown prose** using `##` (h2) sections in the canonical order — **Overview → Colors →
   Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts** — omitting any that
   do not apply but keeping the order. The tokens are the normative values; the prose gives the rationale.

## Distinct identity (chrome + layout)

A **design-system viewer**, not a document reader and not the long-form report:

- Sticky top bar with the `DESIGN.md` file chip, theme `<select>`, **Copy DESIGN.md**, Print.
- A compact hero (system name as H1, one-line personality summary).
- A **token gallery** built from `document.tokens` — the signature of this format:
  - **Colors** — a swatch grid; each swatch shows the role name + value and **copies its value on click**.
  - **Typography** — live type specimens rendered at each token's real `fontSize`/`fontWeight`/etc., with the spec beside them.
  - **Spacing** — a proportional bar scale; **Shapes** — boxes drawn at each corner-radius token.
  - **Components** — the named atoms with one-line styling notes.
- A `Rationale` divider, then the **prose** (the `document.source` body, with its YAML front matter
  stripped) rendered by the inline Markdown renderer.

## Data fields (see `schemas/design-md.schema.json`)

- `meta` — `org`, `project`, `reportType?`, `title`, `subtitle?`, `date?`, `author?`, `theme`
  (default `indigo`; this is the *preview* chrome theme, independent of the system's own tokens).
- `document.filename` — conventionally `DESIGN.md` (must end `.md`).
- `document.source` — the **complete** DESIGN.md text: YAML front matter + Markdown sections. Canonical,
  downloadable artifact; the preview strips the front matter and renders the prose.
- `document.tokens` — a **structured mirror** of the front-matter tokens (`name`, `description?`,
  `colors[]`, `typography[]`, `spacing[]`, `rounded[]`, `components[]`) that drives the visual gallery,
  so the template needs no YAML parser. Keep it consistent with the YAML in `source`. Any group may be omitted.
- `document.summary?` — one-line brand personality / audience.

## Interactions (per `_DATA_DRIVEN.md`)

Theme `<select>` recolours the preview chrome live; clicking any colour swatch copies its value;
**Copy DESIGN.md** yields the exact file; Print expands a clean static snapshot.

## Do / Don't

- **Do** derive tokens from the project's real styles; keep `document.tokens` and the YAML in
  `document.source` in sync (same values).
- **Do** follow the canonical section order and give each token a clear semantic role.
- **Don't** invent a YAML parser dependency — the gallery reads `document.tokens`; the prose reads `source`.
- **Don't** confuse the preview `meta.theme` (chrome colour) with the design system's own `colors` tokens.
