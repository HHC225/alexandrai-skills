# Study Framing & Format Selection

Run this before the first external search, for every deliverable. The output is a
content theme, a valid taxonomy category, a `formatId`, a visual `meta.theme`, and
an evidence mode. "Content theme" is the subject/deliverable idea; `meta.theme` is
only the colour preset.

Pick the format from the router in `assets/report-formats/REPORT_POLICY.md`
(all 38 formats, "use when", required fields). Research-paper specifics live in
`assets/report-formats/specs/research-paper.md`.

## 1. Survey local resources first

**Skill Local Resource Survey** — before the first external search, read
`assets/categories.json`, `assets/languages.json`,
`assets/report-formats/registry.json`, `assets/report-formats/REPORT_POLICY.md`,
`assets/chart-examples.json`, the relevant `assets/report-formats/schemas/*.schema.json`,
and `assets/report-formats/specs/research-paper.md`. Extract taxonomy ids,
language ids, available formats, schema requirements, theme options, and
evidence/visualization constraints. If local files conflict with memory, the
local files win.

**User Workspace Survey** — before the first external search, inspect the current
working directory and nearby project context: `README*`, `AGENTS.md`, docs, specs,
`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, lockfiles, source-tree
and test names, `git status`, and recent commit metadata when useful. Do not read
or quote secrets, credentials, `.env*`, private keys, tokens, `.git`,
`node_modules`, `dist`, `build`, `.next`, `coverage`, or virtual environments.
Workspace names and examples can inspire themes, but they must never become
category ids.

## 2. Choose a content theme

- Determine the theme before the category. Use the workspace survey plus the
  LLM's prior knowledge/reasoning; treat prior knowledge as synthesis, not
  factual evidence. Local facts must come from inspected files.
- If the workspace is a source-code repository, strong themes include
  architecture structure, request/sequence flow, ER or data model, module
  dependency map, API surface, build/test readiness, operational runbook,
  incident path, or release risk.
- If the workspace has no useful signal, fall back to the taxonomy: read
  `assets/categories.json`, pick a defensible existing category, and derive a
  theme from it.

## 3. Map theme → category

- Flatten `assets/categories.json` after the content theme exists, then choose
  only existing category ids that best match the theme.
- Never invent category ids from filenames, folder names, package names,
  examples, or prior memory. If the ideal category is absent, pick the closest
  existing id.
- If the selected topic is in `ai-ml` or `computer-science`, document why it beat
  the strongest non-CS/AI candidate — unless the workspace itself is clearly a
  CS/software repository.

## 4. Choose the format and colour preset

- **Do not default to `research-paper`.** Use it only for a formal academic
  article with abstract, numbered sections, citations, and a real `researchAudit`.
- If the user requested a specific format, use that format or its registered alias.
  Otherwise choose the format whose document type fits the evidence and the
  reader's need (the router in `REPORT_POLICY.md` is the source of truth).
- Choose the visual `meta.theme` from the selected format's default unless the
  user or subject gives a stronger fit. Keep `meta.theme` inside `#report-data`.
- Good defaults by intent (full router in `REPORT_POLICY.md`):
  - operational metrics: `dashboard`, `status-page`, `test-report`
  - executive decision: `one-pager`, `scorecard`, `comparison-grid`
  - procedure or incident: `runbook-checklist`, `incident-timeline`, `long-form-report`
  - structured reference: `knowledge-base`, `data-register`, `changelog`
  - systems or flows: `diagram-topology`, `flowchart`, `sankey-flow`, `treemap`
  - repository/system analysis: `architecture-map`, `sequence-diagram`, `entity-relationship`, `diff-review`

## 5. Pick the evidence mode

- Choose the mode that fits the format: measurement, literature review, taxonomy,
  checklist, comparison, timeline, register, decision brief, knowledge base,
  diagram, architecture review, or formal paper.
- Do not invent experiments, datasets, numbers, user observations, or source
  claims. If evidence is thin, choose an evidence-limited format such as
  `long-form-report`, `one-pager`, `knowledge-base`, `diagram-topology`,
  `flowchart`, or `research-paper` with scarce-evidence framing.

## AlexandrAI metadata contract

Most `assets/report-formats/schemas/*.schema.json` use `additionalProperties: false`,
so keep `#report-data` pure to the selected schema. Put AlexandrAI archive metadata
in a separate script:

```html
<script type="application/json" id="alexandrai-metadata">
{
  "formatId": "dashboard",
  "templateVersion": "dashboard@1",
  "skillVersion": "alexandrai-research-publishing@0.2.0",
  "language": "en",
  "primaryCategory": "computer-science.distributed-systems",
  "secondaryCategories": [],
  "topics": ["release readiness", "operational review"]
}
</script>
```

- The API request `formatId` must match `alexandrai-metadata.formatId`.
- `topics` and search terms must be English-only ASCII.
- Use only category/language ids from `assets/categories.json` and `assets/languages.json`.
- Research-paper reports may carry `aipaper` inside `#report-data`; new non-paper
  reports should use `#alexandrai-metadata`.
