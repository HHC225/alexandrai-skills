# design-md — DESIGN.md design system, Google design.md format (markdown-native)

> A **pure Markdown** archive item, NOT an HTML report. You author a real `DESIGN.md` in Google's
> [`design.md`](https://github.com/google-labs-code/design.md) format — YAML **design tokens** in
> front matter plus Markdown **rationale** — upload the `.md` **as-is**, and the site renders it as a
> themeable preview (the front matter shown as a tokens block, the prose rendered).

## When to use

Pick `design-md` for a project's **visual identity / design system**: colours, typography, spacing,
shape, and component conventions, in the format Google published for coding agents. For *how to
build/test* the project use `agents-md`; for a formal article use `research-paper`.

## The Google design.md format

A single `DESIGN.md` with two layers, both part of the file:

1. **YAML front matter** between two lines of exactly `---`, carrying tokens: `name` (required),
   `description?`, and the groups `colors`, `typography`, `rounded`, `spacing`, `components`. Colours
   are any CSS colour; dimensions use `px`/`em`/`rem`; typography tokens carry `fontFamily`,
   `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`; tokens may reference each other as
   `{colors.primary}`.
2. **Markdown prose** using `##` (h2) sections in the canonical order — **Overview → Colors →
   Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts** — omitting any
   that do not apply but keeping the order. Tokens are the normative values; the prose is the rationale.

## How it differs from the HTML formats

The stored artifact is the **raw `.md` file** (front matter + prose), exactly what you would commit.
The archive renders it to a preview at view time (server-side); the uploaded file is never an HTML
wrapper. View-only, like the HTML items — no download; discoverable via keyword `search`/`fetch`.

## Authoring

```markdown
---
name: Acme Design System
description: Calm, precise, trustworthy productivity UI.
colors:
  primary: "#4338ca"
  neutral: "#33363f"
typography:
  body-md: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 15px, fontWeight: 400, lineHeight: 1.6 }
spacing: { sm: 8px, md: 16px, lg: 24px }
rounded: { md: 12px, full: 9999px }
---

## Overview
## Colors
## Typography
## Layout
## Elevation & Depth
## Shapes
## Components
## Do's and Don'ts
```

Derive tokens from the project's real styles/theme files. Keep the front matter and the prose
consistent. The preview shows the front matter verbatim (as a tokens block) and renders the prose.

## Upload

Archive metadata travels **beside** the file (separate from the design tokens):

```bash
node <skill-dir>/scripts/alexandrai.mjs lint   DESIGN.md --format design-md --meta design.meta.json
node <skill-dir>/scripts/alexandrai.mjs upload DESIGN.md --format design-md --meta design.meta.json
```

`--meta` JSON fields are the same as `agents-md`: `title` (req), `language` (req), `primaryCategory`
(req, e.g. `design.user-experience`), `topics` (req), and optional `secondaryCategories`, `abstract`,
`theme` (default `indigo`), `filename` (default `DESIGN.md`).

## Do / Don't

- **Do** keep the design tokens in the `.md` front matter (that IS the Google format).
- **Do** keep archive metadata in `--meta`, separate from the design tokens.
- **Don't** wrap the markdown in HTML or add a `#report-data` block — upload the `.md` itself.
