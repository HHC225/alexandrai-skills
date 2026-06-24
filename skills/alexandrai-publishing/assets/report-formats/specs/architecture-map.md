# Format: Architecture map / repository system view

> Inherits the family DNA from `_FOUNDATION.md` and the data-driven contract from `_DATA_DRIVEN.md`.
> This format reuses the full-bleed app-shell language of `diagram-topology` and `flowchart`, but its
> document type is different: it is an **architecture review map** for a repository or system. The
> reader asks "what are the main layers, components, public interfaces, and architectural risks?"

## One-line difference
`architecture-map` is a structured architecture view: components sit inside named layers/zones, typed
relationships show call/event/data/import/deploy dependencies, and the right rail surfaces component
interfaces plus architecture findings.

## When to use
Use this after inspecting a repository or system when the useful deliverable is:

- overall architecture structure of a codebase or service platform;
- module/package dependency map with entrypoints, jobs, libraries, config, and data stores;
- bounded-context / layer view for onboarding or design review;
- architectural risk review, including coupling, unclear ownership, public API surfaces, and runtime
  dependencies.

Use `diagram-topology` when the point is arbitrary spatial reachability or infrastructure topology.
Use `flowchart` when the point is ordered steps and decisions. Use `sequence-diagram` when the point is
one request over time. Use `entity-relationship` when the point is data shape and cardinality.

## Distinct chrome
- Full-bleed app shell with top bar, left layer/type filter, central canvas, and right inspection rail.
- Central canvas renders **layer bands** first, then component cards auto-arranged into evenly-spaced
  rows inside their layer band, then SVG relationships clipped to the card borders with
  collision-avoided action labels.
- Component cards expose type, path, owner, tech, status, and interfaces.
- Selecting a component highlights direct incoming/outgoing relationships and fills the right rail.
- The right rail also lists architecture findings, not prose sections.

## Data fields
Full contract: `schemas/architecture-map.schema.json`.

- `meta`: shared chrome and visual `theme`.
- `layers[]`: architecture zones/bands, e.g. UI, API, domain, data, integrations.
- `components[]`: cards `{id,label,type,layer,x,y,status,owner,tech,path,summary,interfaces[]}`. Cards are
  auto-placed as evenly-spaced rows inside their `layer` band; `x` is only a left-to-right ordering hint,
  and `y` is kept for compatibility but no longer sets the vertical position.
- `relationships[]`: typed edges `{from,to,label,kind,status}` where `kind` is `call`, `event`, `data`,
  `deploy`, or `imports`.
- `findings[]`: architecture review notes surfaced in the rail.

## Interactions
- Layer/type filters re-render the canvas.
- Click a component to select it, highlight direct edges, and show metadata/interfaces.
- Hover a relationship to reveal its label.
- Theme switcher recolours live.
- Print hides controls and shows the full canvas.

## Do / Don't
- Do derive components and paths from inspected local files when used for repository analysis.
- Do keep facts grounded: local facts come from the workspace; LLM knowledge is framing, not evidence.
- Do prefer 8-14 components so the architecture remains readable.
- Don't use this for every system diagram; if the data is a pure network graph, use `diagram-topology`.
- Don't invent package names, tables, or dependencies that were not found or explicitly provided.
