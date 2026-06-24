# agents-md — AGENTS.md project guide

> Extends [`_FOUNDATION.md`](_FOUNDATION.md) + [`_DATA_DRIVEN.md`](_DATA_DRIVEN.md). A **Markdown
> document** — an `AGENTS.md` / `CLAUDE.md` agent guide for a codebase — rendered as a clean,
> themeable **preview**, never raw text. Inherits the family palette, system fonts, rounded panels,
> theme switcher, and self-contained output rule.

## When to use

Pick `agents-md` when the deliverable is **"how a coding agent should work on this project"**: the
open [agents.md](https://agents.md) standard / Claude Code `CLAUDE.md` convention. It complements a
human `README.md` with the build/test/convention context an agent needs. Use it to publish the guide
you generate after analysing a local codebase. For the project's *visual identity* (colours, type,
components) use `design-md` instead; for a formal article use `research-paper`.

## Distinct identity (chrome + layout)

A **single-file document reader**, not the long-form report's evidence frame:

- A slim **sticky top bar** carrying the file identity — accent square + `AlexandrAI` wordmark, a
  monospace **filename chip** (`AGENTS.md`), and the tools (theme `<select>`, **Copy Markdown**, Print).
- A compact **hero**: eyebrow (`reportType`), H1 (`meta.title`), one-line `subtitle`, a metaline of
  mono chips (org · project · date), and an optional `document.summary` callout.
- A **two-column body**: a sticky `226px` heading **outline (TOC)** on the left with scroll-spy, and a
  centred reading **document card** (`max-width:860px`) holding the rendered Markdown.
- A dark **footer** band with the wordmark + project/file/date.

The Markdown is rendered by a small **inline renderer** (no libraries): headings (with slugged ids),
paragraphs, **bold**/*italic*/`inline code`, links, ordered/unordered (nested) lists, fenced code
blocks with a language tag, blockquotes, tables, and horizontal rules. Everything is HTML-escaped
before rendering, so code and raw markup display literally and nothing in the data can inject markup.

## Signature components

- `.topbar` + `.file-chip` — the persistent file identity.
- `.toc` — auto-generated `<h2>/<h3>` outline with `.active` scroll-spy.
- `.doc .md` — the rendered Markdown reading column (the family's prose styling).
- `#copy-btn` — copies the exact `document.source` to the clipboard (round-trips the real `.md`).

## Data fields (see `schemas/agents-md.schema.json`)

- `meta` — `org`, `project`, `reportType?`, `title`, `subtitle?`, `date?`, `author?`, `theme`
  (default `slate`). `title`/`subtitle` become the archive card title/abstract.
- `document.filename` — what the file is saved as (conventionally `AGENTS.md`; must end `.md`).
- `document.source` — the **complete** Markdown text (the canonical, downloadable artifact and the
  only content source for the preview).
- `document.summary?` — one-line "what is this project".

## Interactions (per `_DATA_DRIVEN.md`)

Theme `<select>` recolours live; the TOC jumps to sections and highlights the current one on scroll;
**Copy Markdown** yields the raw file; Print expands to a clean static snapshot (chrome hidden).

## Authoring the source

Write `document.source` like a real `AGENTS.md`: lead with a one-line project overview, then the
sections agents actually need — **Setup/build/test commands**, **Code style**, **Testing**,
**Security**, **Commit & PR rules** — using concrete, copy-pasteable commands. Keep it signal-dense
and specific to the analysed repo; non-obvious, project-specific facts beat generic advice. Use real
`## H2` headings so the outline is meaningful (the TOC needs ≥2).

## Do / Don't

- **Do** derive the content from the actual project (real commands, real paths, real conventions).
- **Do** keep the file brand-neutral (`{{ORG}}` / `{{AUTHOR}}`) unless real values are supplied.
- **Don't** paste raw, unstyled Markdown into the body — the renderer styles it; just supply `source`.
- **Don't** wrap this in the long-form report's rails/facts chrome — it is a single-document reader.
