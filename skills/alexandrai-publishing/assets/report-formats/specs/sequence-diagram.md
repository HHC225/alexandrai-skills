# Format: Sequence diagram / request trace

> Inherits the family DNA from `_FOUNDATION.md` and the data-driven contract from `_DATA_DRIVEN.md`.
> This format reuses the canvas/rail style of the existing diagram formats, but its silhouette is a
> lifeline diagram: participants across the top, time flowing downward, and arrows between lifelines.

## One-line difference
`sequence-diagram` explains one behavior over time: participants are vertical lifelines and messages are
ordered rows with sync/async/return/event/error arrows.

## When to use
Use this for repository or system analysis when the useful deliverable is:

- request lifecycle through controllers, services, queues, workers, and databases;
- login/signup/payment/import/export sequence;
- event handling path from producer to consumer;
- error path or retry path that needs exact ordering;
- public API call trace discovered from source code.

Use `flowchart` when the point is a process with ownership lanes and decisions. Use `architecture-map`
for static structure. Use `diagram-topology` for arbitrary connectivity.

## Distinct chrome
- Full-bleed trace shell with participant headers across the top.
- Central canvas renders lifelines, ordered message rows, arrows, status chips, and optional notes.
- Left rail lists participants and message type legend.
- Right rail shows the selected step, source/target participants, detail, and nearby notes.
- A step-through control walks the message list in order.

## Data fields
Full contract: `schemas/sequence-diagram.schema.json`.

- `meta`: shared chrome and visual `theme`.
- `participants[]`: actors/modules/services/stores `{id,label,type,owner,path,status}`.
- `messages[]`: ordered message rows `{from,to,label,kind,detail,status}`.
- `notes[]`: optional notes pinned to a step and optional participant.

## Interactions
- Step-through next/previous selects a message and scrolls the trace.
- Click a message to highlight source/target lifelines and show details.
- Filter by message kind.
- Theme switcher recolours live.
- Print shows all messages and notes without controls.

## Do / Don't
- Do use exact module/service names from the repository when available.
- Do keep one diagram to one behavior; create another report for another trace.
- Do show async/event/return/error differences with line style.
- Don't use this as a generic flowchart; no swimlane boxes or decision diamonds.
- Don't invent sequence steps that cannot be supported by inspected code or provided context.
