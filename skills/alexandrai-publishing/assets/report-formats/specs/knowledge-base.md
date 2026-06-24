# Format: Knowledge base / FAQ

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** and the data-driven contract from
> [`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md) — the 9-theme palette tokens (Black mandatory), the system-font
> stack, the dense 13px body, rounded panels, the three semantic states (`ok` / `risk` / `hold`), the
> shared primitives (`.st-badge`, chip/tag, mono code panel, the key/value grid), the in-report theme
> switcher, and the self-contained output rules (§0). **Default theme: Blue.**
> What this format reinvents is its **chrome and layout**: a help-centre — a sticky **category sidebar**,
> a prominent **search box**, and a body of **Q&A accordion** entries grouped by category. There is no
> hero standfirst, no numbered section panels, no right metadata rail.

---

## One-line difference from long-form / magazine
The **long-form report** and **magazine** are documents you *read top-to-bottom* (hero → TOC →
stacked prose sections / a typeset article). The knowledge base is a thing you *search and jump around* —
you arrive with a question, type it, and land on one answer. It reads as a **help centre / FAQ**, never as
a narrative article: short self-contained Q&A entries, not a continuous argument. The left rail is a
**category filter**, not a scroll-spy table-of-contents; the body is **collapsed answers**, not open prose.

## When to use
A reference body of **discrete question→answer entries** built for lookup, not linear reading:

- product / platform **help centre**, support FAQ, "how do I…" articles
- internal **onboarding / runbook KB**, ops playbook Q&A, policy FAQ
- API / SDK **troubleshooting knowledge base**, error-code explainers
- release / migration **"common questions"**, security-review FAQ, compliance Q&A

Reach for a different format if the deliverable wants to be *read straight through* (long-form / magazine),
*worked step-by-step as one procedure* (runbook-checklist), *queried as rows of records* (data-register),
or *watched at a glance* (dashboard).

---

## Distinct chrome — a help centre, not a document
This format must be **unmistakably a knowledge base** (a docs site / support centre), not an article.
Three structural commitments:

1. **A search-first masthead** (`.kb-masthead`). A compact banner carrying the `{{ORG}} · {{PROJECT}}`
   wordmark, the KB title/subtitle, the theme switcher, and — the centrepiece — a **large search box**
   (`.kb-search`) with a leading search icon and a live **result count** (`.kb-count`). The search box is
   visually the most prominent control on the page; this *replaces* the long-form hero entirely.
2. **A sticky left category sidebar** (`.kb-sidebar`). A vertical list of **category links**
   (`.cat-link`) each with an icon, label, and a live **per-category count badge**; clicking one filters
   the body to that category and sets an **active state**. An "All" entry resets. The rail is sticky and
   stays put while answers scroll — it is a *filter*, not a scroll-spy TOC.
3. **A Q&A accordion body** (`.kb-articles`). Entries are grouped under **category headings**
   (`.cat-heading`); each entry is a collapsed **`<details>` card** (`.qa`) whose `<summary>` is the
   **question** (`.qa-q`) and whose body (`.qa-a`) holds the rendered **answer blocks** + a **tag row**
   (`.qa-tags`) and **related links** (`.qa-related`). Reads as FAQ, expand-on-demand.

This is a **PC-wide two-pane app shell**: `~240px` sticky sidebar + a content column, the whole capped at
**~1500px** centred (40px gutter). Not full-bleed (that is data-register), not a centred reading measure
(that is magazine).

### Layout outline
```
.kb (centred app shell, max ~1500px)
├─ .kb-masthead (sticky, top)        ← wordmark · KB title · theme dots · BIG .kb-search + .kb-count
└─ .kb-main (grid: 240px | 1fr)
   ├─ .kb-sidebar (sticky)            ← .cat-link×N (icon · label · count) + "All" reset; active state
   │    └─ .kb-tags-panel (optional)  ← popular tag chips (.tag-chip) as an alt filter axis
   └─ .kb-articles (the body, scrolls)
      ├─ .cat-heading (per category)  ← icon + label + count; hidden when the category has no hits
      └─ details.qa[ data-cat data-tags ]   ← one entry; summary = question, body = answer
         ├─ summary.qa-q              ← the QUESTION (+ caret, + category chip)
         └─ .qa-a                     ← answer blocks (p / code / list / note) + .qa-tags + .qa-related
   (a .kb-empty state shows when search/filter yields zero entries)
```

---

## Signature components (class names)
- **`.kb`** — the centred two-pane app shell (`max-width:~1500px`, 40px gutter). *Replaces* the long-form
  topbar+hero+3-col frame.
- **`.kb-masthead`** — slim sticky banner: wordmark + KB title + **theme dots** + the prominent search.
  Whisper shadow on scroll.
  - **`.kb-search`** — the centrepiece text input (leading `search` icon, mono placeholder, rounded,
    generous). Live-filters across **question + every answer block's text**, highlights matches
    (`<mark class="kb-hit">`), and updates the count. A clear (`×`) button resets it.
  - **`.kb-count`** — mono pill showing the live "N of M answers" / "N matches" count.
- **`.kb-sidebar`** — the sticky category rail. *Replaces* the long-form scroll-spy TOC.
  - **`.cat-link[data-cat]`** — a category filter row: house icon + label + **`.cat-count`** badge. The
    active one inverts to the brand accent (`--navy-bg` / `--navy-deep`, left accent border). An **"All"**
    link clears the category filter.
  - **`.kb-tags-panel`** *(optional)* — a small panel of **`.tag-chip`** pills (popular tags) offering a
    second filter axis; a selected chip is the brand accent and is reflected in the count.
- **`.kb-articles`** — the answer body.
  - **`.cat-heading`** — a category section header (icon + label + count). Auto-hidden when the active
    filter / search leaves that category with no visible entries.
  - **`.qa`** — a single Q&A entry as native **`<details>`** (so it opens with JS off too). Carries
    `data-cat` and `data-tags` for filtering, and an `id` for deep-linking.
    - **`.qa-q`** — the `<summary>`: the **question**, a rotating caret, and a small category chip.
    - **`.qa-a`** — the answer: a stack of rendered **answer blocks** —
      `p` (prose), `code` (mono dark panel with a copy button), `list` (`ul`/`ol`), `note`
      (a `--bg-subtle` / state-tinted callout, optional `ok`/`risk`/`hold` variant).
    - **`.qa-tags`** — the entry's tag row of **`.tag-chip`** pills (clicking one activates that tag filter).
    - **`.qa-related`** — "Related" links to other entries by id (`.related-link`); clicking deep-links and
      opens the target.
- **`.kb-empty`** — the zero-result state (shown when search + filters match nothing; offers "clear").

Reuse the family primitives verbatim: `.st-badge` (inside `note` blocks), the chip/tag pill shape, the
mono dark **code** panel + copy button, the key/value grid where an answer needs one. Inline house SVG
icons (`search`, `close`, `chevron-right`, `tag`, `anchor-link`, plus a per-category icon) per
`../icons/SPEC.md`, coloured by `currentColor` so they recolour across all 9 themes.

---

## Interactions (data-driven, vanilla JS)
Every control is driven from `#report-data` (filter the data → re-render or show/hide), no libraries,
≤150ms transitions. Mandatory:

| Control | Behaviour |
|:--|:--|
| **Live search** (`.kb-search`) | filters entries by matching the **question + all answer text**; **highlights** the matched substring (`<mark class="kb-hit">`) in visible questions; updates **`.kb-count`**; empties → `.kb-empty`. |
| **Category filter** (`.cat-link`) | shows only the active category's entries (or all via "All"); sets **active state**; hides empty `.cat-heading`s; updates counts. Combines with search and tag. |
| **Tag-chip filter** (`.tag-chip`) | clicking a tag (in the side panel or on an entry) filters to entries carrying that tag; toggle off to clear; reflected in the count. |
| **Expand / collapse** (`.qa`) | each answer opens/closes (native `<details>`); an **"Expand all / Collapse all"** bulk control toggles every *visible* entry. |
| **Deep-link** (hash) | `#<articleId>` on load **opens** that entry, scrolls to it, and flashes it; clicking an entry updates the hash. Works on `hashchange` too. |
| **Related-link jump** (`.related-link`) | jumps to a related entry by id, opening it (and its category) and flashing it. |

In **print**, expand every entry to a complete static snapshot, show all categories, and hide the search,
sidebar, theme dots, and bulk controls (a clean printable FAQ).

---

## Do / Don't
- **Do** make the **search box the visual centrepiece** and keep it + the category rail **sticky**.
- **Do** keep entries **short and self-contained** — one question, one focused answer; long material is a
  `code`/`list`/`note` block, not three screens of prose.
- **Do** keep the **live count honest** as search / category / tag filters change, and show a real empty state.
- **Do** group entries under **category headings** and hide a heading when its category is filtered out.
- **Do** make search **highlight** matches and deep-links **open** the target entry.
- **Don't** wrap the KB in a hero standfirst, a scroll-spy TOC, numbered section panels, or a right
  metadata rail — that is the long-form report.
- **Don't** let it read as one continuous article (that is magazine / long-form) — entries are discrete Q&A.
- **Don't** make it full-bleed edge-to-edge (that is data-register) or a glanceable tile grid (dashboard).
- **Don't** invent a 4th status colour or use emoji / generic "AI" icons; obey the foundation palette +
  house icon set.

## Exemplar
`sample/knowledge_base_sample.html` — a platform **help centre / FAQ** (Blue theme): a search-first
masthead with a live result count, a sticky category sidebar with per-category counts + a popular-tags
panel, and a Q&A accordion of ~12 entries across ~4 categories — each with tags, related links, and
prose / code / list / note answer blocks. Live search with match highlighting, category + tag filtering,
expand/collapse-all, hash deep-linking, and the 9-dot theme switcher.

## Data schema

Full field contract: [`schemas/knowledge-base.schema.json`](schemas/knowledge-base.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome — `org`, `project`, `reportType`, `title`, `subtitle`, `date`, `author`, `theme` (default `"blue"`). |
| `categories` | array | Sidebar categories. Each: `id`, `label`. Optional: `icon` (house-icon category name), `description`. |
| `articles` | array | The Q&A entries. Each: `id`, `category` (a category `id`), `question`, `answerBlocks[]`. Optional: `tags[]`, `related[]` (other article `id`s). |

**`answerBlocks[]` items** (discriminated by `type`):
- `type:"p"` — `text` (prose; inline HTML allowed: `<code>`, `<strong>`, links).
- `type:"code"` — `code` (verbatim mono block), optional `lang`, optional `caption`.
- `type:"list"` — `items[]` (strings), optional `ordered` (boolean).
- `type:"note"` — `text`, optional `variant` (`ok`\|`risk`\|`hold`\|`info`) + `label` (callout).

**Optional top-level fields:** `searchPlaceholder` (string), `popularTags[]` (tag strings to surface in the
sidebar panel), `intro` (a short line under the masthead title).

## Icons

Icons are drawn inline from the house icon set at [`../icons/`](../icons/) per `../icons/SPEC.md`.
Knowledge-base-relevant categories:

- **`document`** — document, file-text, pages-stack, clipboard-list (per-category and KB marks)
- **`nav`** — search, close, chevron-right (accordion caret), filter, anchor-link, expand/collapse-all
- **`status`** — info-circle, question-circle, check-circle, warning-triangle (`note` callout marks)
- **`editorial`** — tag, label, bookmark, note, callout, key-point (tags + related)

Use `currentColor` so icons recolour automatically across all 9 brand themes.
