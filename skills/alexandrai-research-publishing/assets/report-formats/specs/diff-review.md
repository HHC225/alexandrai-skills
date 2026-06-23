# Format: Diff-review (code review / pull request)

> **Inherits the family DNA from [`_FOUNDATION.md`](./_FOUNDATION.md)** and the data-driven contract from
> [`_DATA_DRIVEN.md`](./_DATA_DRIVEN.md) — the 9-theme palette tokens (Black mandatory), the system-font
> stack with the CJK `--sans`, the dense 13px body, rounded panels, the three semantic states
> (`ok` / `risk` / `hold`), the shared primitives (`.st-badge`, `.chip`, mini status dot), and the
> self-contained, JSON-driven, themeable output rules. **Default theme: Slate.**
> What this format reinvents is its **chrome and layout**: an **IDE-style three-pane app shell** built for
> reading code changes and leaving review comments. No format in the gallery touches code or review —
> keep it unmistakably a pull-request / merge-request view.

---

## One-line difference from long-form
Long-form is a *document you read top-to-bottom* (hero → TOC → stacked prose panels); the diff-review is a
*code-review tool you operate* — a fixed file-tree + diff viewer + review sidebar, where the only "prose"
is the change summary and the inline review threads. The canonical long-form dark **split-diff** exhibit
is a single static figure; here the **diff IS the application**, file-by-file, with live comments and a
verdict you can change.

## When to use
A **code-review / pull-request artefact** meant to be inspected change-by-change and signed off:

- a pull-request / merge-request review of a service or platform change
- a pre-merge code-review packet for stakeholders (what changed, who reviewed, did CI pass)
- a release-candidate diff walkthrough, a hotfix review, a migration / schema-change review
- any deliverable that is fundamentally *changed files + diff hunks + review verdict*

Reach for a different format if the deliverable is a *narrative* (long-form), a *release announcement of
shipped changes* (changelog), an *incident write-up* (incident-timeline), or a *board of work items*
(kanban). Those describe code; this one **shows the diff and the review**.

---

## Distinct chrome — an IDE-like three-pane review shell
This format must read as a **pull-request page in an IDE / code-host** (GitHub/GitLab PR view), never as an
article. Four structural commitments:

1. **A full-bleed app shell** (`.dr-shell`), `100vw × 100vh`, edge-to-edge — not a centred reading column.
   Per `_DATA_DRIVEN §5` this is a **wide** format (`viewport width=1440`); the three panes fill the screen.
2. **A top bar** (`.dr-top`) carrying: the change/PR title + **source→target branch chips** + an overall
   **verdict badge** (approved / changes-requested / pending) + a **`+N −M`** added/removed stat +
   **file-status filter chips** (all / added / modified / deleted / renamed) + a **unified | split** toggle +
   a **comment-visibility** toggle + the mandatory `.rc-theme` dropdown.
3. **Three panes** below the bar, a `grid-template-columns: <tree> 1fr <review>` layout:
   - **Left — changed-file tree** (`.dr-tree`): collapsible folders; each file row = a **status dot** +
     path + its **+/− counts** + a **comment-count chip**. Clicking a file loads its diff.
   - **Center — diff viewer** (`.dr-diff`): the selected file's **hunks** (`.dr-hunk`) with `@@` headers
     (collapsible), line numbers in **both** old + new gutters (`.dr-gutter`), ADDED lines tinted
     `--ok-bg` with a left accent, REMOVED lines tinted `--risk-bg`, context lines plain; **split** mode
     shows two side-by-side columns. Inline **comment threads** (`.dr-thread`) anchor under specific lines.
   - **Right — review summary** (`.dr-review`): the change summary, **reviewers + their state**, the CI
     **checks** list (pass/fail/running), and a **verdict control** (approve / request-changes) that
     updates the top-bar badge live.

Density is the point: a real diff gutter, ~13px mono code, tight rows — it should feel like a diff, not a
slideshow.

### Layout outline
```
.dr-shell                              ← full-bleed app shell, 100vw/100vh, flex column
├─ .dr-top (sticky, top)               ← title · branch chips · verdict badge · +N −M stat ·
│                                         file-status filter chips · unified|split · comments toggle · .rc-theme
└─ .dr-body (grid: 260px 1fr 300px, fills viewport, panes scroll independently)
   ├─ .dr-tree (left)                  ← collapsible folder rows + .dr-file rows (dot · path · +/− · 💬count)
   ├─ .dr-diff (center)                ← header (active file path + status badge) then .dr-hunk×N
   │   └─ .dr-hunk                      ← @@ header (click to collapse) → .dr-line rows
   │       ├─ .dr-line.add / .del / .ctx   (two .dr-gutter cells: old-no | new-no, then code)
   │       └─ .dr-thread                 ← anchored under a line: author · time · body · resolve toggle
   └─ .dr-review (right)               ← summary · reviewers[state] · checks[pass/fail] · verdict control
```

---

## Signature components (class names)
- **`.dr-shell`** — the full-bleed app shell (`width:100vw; height:100vh`, flex column, owns the scroll
  context). Replaces the long-form hero + rails entirely.
- **`.dr-top`** — slim sticky top bar. Holds every global control:
  - **branch chips** — two `.dr-branch` mono pills (`source` → `target`) joined by a merge arrow.
  - **`.dr-verdict`** — the overall verdict badge; a `.st-badge` variant (`st-ok` approved / `st-risk`
    changes-requested / `st-hold` pending). It is the live target of the right-pane verdict control.
  - **`.dr-stat`** — the `+N −M` total added/removed counts (green `+` / bordeaux `−`, `tnum`).
  - **`.dr-filter`** — file-status filter chips (`all / added / modified / deleted / renamed`); the active
    chip inverts to the brand accent. Reuses the family chip shape; filters the tree.
  - **`.dr-seg`** — a segmented **unified | split** toggle that re-renders the center diff layout.
  - **`.dr-cmt-toggle`** — a switch that shows/hides all inline comment threads.
  - **`.rc-theme`** — the mandatory 9-preset dropdown (copied verbatim from `_DATA_DRIVEN §3`).
- **`.dr-tree`** — the changed-file tree (left pane). **`.dr-folder`** rows are collapsible (chevron
  rotates); **`.dr-file`** rows show a **status dot** (`add`/`mod`/`del`/`ren` colour), the file name, its
  **`+/−` counts**, and a **`.dr-cc`** comment-count chip. The active file row is accent-highlighted.
- **`.dr-diff`** — the center diff viewer. A header strip shows the active file path + a `.st-badge` for its
  status + its `+/−`. Body is a stack of hunks.
- **`.dr-hunk`** — one hunk: a clickable **`@@ -old +new @@ header`** band (collapses/expands its lines) over
  the line rows.
- **`.dr-line`** — one diff line: two **`.dr-gutter`** cells (old line-no | new line-no) + the code cell.
  Variants `.add` (tinted `--ok-bg`, left accent bar, `+` marker), `.del` (tinted `--risk-bg`, `−` marker),
  `.ctx` (plain). In **split** mode the row becomes two columns (old | new). Code uses `var(--mono)`.
- **`.dr-gutter`** — the line-number gutter cell (mono, `--ink-faint`, right-aligned, `tnum`,
  `user-select:none`).
- **`.dr-thread`** — an inline review thread anchored under a line: author handle + time + body + a
  **resolve / unresolve** toggle. Resolved threads mute their styling (`--bg-subtle`, struck accent) and
  drop out of the file's comment count.
- **`.dr-review`** — the right pane: the change **summary**, a **reviewers** list (handle + role +
  `.st-badge` state), a **checks** list (`.dr-check` rows with a pass/fail/running dot + detail), and the
  **verdict control** (`Approve` / `Request changes` buttons) that rewrites `.dr-verdict` and the data.

Reuse the family primitives verbatim: `.st-badge` + `.st-ok/.st-risk/.st-hold`, `.chip`, the mini status
dot. Inline house SVG icons (`code-diff`, `branch`, `pull-request`, `check-circle`, `cross-circle`,
`chevron-right`, `folder`, `file-code`, `comment`) per `../icons/SPEC.md`, all `currentColor`.

### Colour & syntax discipline
- ADDED lines use the **`--ok` / `--ok-bg`** family; REMOVED lines use **`--risk` / `--risk-bg`** — both
  recolour per theme automatically (in Black, `ok` becomes ink-grey while `risk` stays bordeaux — honest).
- Structural accent (branch chips, active file, links, segmented control) is `var(--navy)`; body ink is
  `var(--ink-mid)`; only the three semantic states exist.
- **Syntax tinting is light + honest.** Rely on the add/del/context tints. If you want keyword/string/
  comment colour, bake simple span runs into the line data (`lines[].tokens[]` with class `kw|str|com|num|fn`)
  — **do NOT ship a heavy parser.** Tint classes are muted, theme-aware, and never compete with the diff tint.

---

## Required interactions (data-driven, vanilla JS)
Per `_DATA_DRIVEN §4`, every control is real and driven from `#report-data`:

- **Select a file** in the tree → load its diff into the center pane (active-row highlight follows).
- **File-status filter chips** → filter the tree to matching files (and keep the count honest).
- **Unified | split toggle** → re-render the center diff in the chosen layout.
- **Collapse / expand a hunk** → click the `@@` header to fold its lines.
- **Comment-visibility toggle** → show/hide all inline threads at once.
- **Resolve / unresolve a thread** → flips its styling **and** updates that file's comment-count chip.
- **Approve / Request changes** → updates `change.verdict`, the top-bar **verdict badge**, and the
  reviewer's own state, live.

In **print** (`@media print`): expand every hunk, render a complete static snapshot of all files' diffs,
show all threads, and hide the chrome (filter chips, segmented control, toggles, theme switcher).

---

## Do / Don't
- **Do** make the **diff the hero** — real both-side gutters, mono code, `--ok-bg` adds / `--risk-bg` dels.
- **Do** keep the file tree, diff, and review pane as **three independent scroll regions** under a sticky bar.
- **Do** anchor review threads **under the specific line** they discuss; keep resolve state honest in the counts.
- **Do** keep the verdict badge and the verdict control in sync — changing one changes the other.
- **Don't** wrap the review in a hero, standfirst, TOC, or stacked prose sections — that is long-form.
- **Don't** centre the content in a reading column or cap it at ≤1280px; the three panes span the viewport.
- **Don't** ship a syntax-highlighting engine; bake light token spans into the data instead.
- **Don't** invent a 4th status colour or use emoji / AI-sparkle icons; obey the foundation palette + house set.

## Exemplar
`sample/diff_review_sample.html` — a fictional banking-platform change (Slate theme): a PR to bound
`ledger-writer` retries and dead-letter poison-pill events. It ships the IDE three-pane shell — a top bar
with branch chips + verdict badge + `+N −M` + file-status filters + unified/split + comment toggle + theme
dropdown; a collapsible changed-file tree; a both-gutter diff viewer with collapsible hunks and inline
review threads (resolvable); and a review sidebar with reviewers, CI checks, and a live verdict control.

## Data schema
Full field contract: [`schemas/diff-review.schema.json`](schemas/diff-review.schema.json) (JSON Schema draft 2020-12).

**Required top-level fields:**

| Field | Type | Description |
|:--|:--|:--|
| `meta` | object | Shared chrome — `org`, `project`, `reportType`, `title`, `date`, `theme` (default `"slate"`). Optional: `subtitle`, `author`. |
| `change` | object | The PR: `title`, `sourceBranch`, `targetBranch`, `verdict` (`approved`\|`changes-requested`\|`pending`). Optional: `id`, `summary`. |
| `files` | array | Changed files. Each: `path`, `status` (`add`\|`mod`\|`del`\|`ren`), `additions`, `deletions`, `hunks[]`. Optional: `oldPath`, `lang`, `threads[]`. |

**Optional top-level fields:** `reviewers[]` (`name`, `state`, optional `role`) · `checks[]` (`name`, `status` = `pass`\|`fail`\|`running`\|`pending`, optional `detail`).

**`files[].hunks[]`:** `header`, `oldStart`, `newStart`, `lines[]` (+ optional `collapsed`).
**`hunks[].lines[]`:** `type` (`add`\|`del`\|`ctx`), `text`, optional `oldNo` / `newNo`, optional `tokens[]` (`t` + class `c`).
**`files[].threads[]`:** `side` (`new`\|`old`), `line`, `author`, `time`, `body`, optional `resolved`.

## Icons
Icons are drawn inline from the house icon set at [`../icons/`](../icons/) per `../icons/SPEC.md`. Diff-review-relevant categories:

- **`code`** — `code-diff`, `pull-request`, `branch`, `commit`, `merge`, `file-code`, `file-diff`
- **`status`** — `check-circle` (pass / approved), `cross-circle` (fail / changes-requested), `clock-pending`
- **`nav`** — `chevron-right` / `chevron-down` (tree + hunk collapse), `filter`, `close`
- **`document`** — `folder` / `folder-open`, `file-text`
- **`editorial`** — `comment` / `note` (review threads)

Use `currentColor` so icons recolour automatically across all 9 brand themes.
