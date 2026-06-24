# Format: Entity relationship / data model diagram

> Inherits the family DNA from `_FOUNDATION.md` and the data-driven contract from `_DATA_DRIVEN.md`.
> This format is a data-model canvas: entity cards list fields, keys, indexes, and cardinality edges.

## One-line difference
`entity-relationship` explains schema shape: entities/tables/models as cards, attributes with PK/FK/
unique/index badges, and relationships labelled with cardinality.

## When to use
Use this for repository or system analysis when the useful deliverable is:

- database schema overview from migrations, Prisma, SQLModel, ORM models, or SQL DDL;
- domain model ER diagram for a service;
- table relationship review before refactoring;
- key/index/nullability audit;
- onboarding view of how core records connect.

Use `data-register` when the deliverable is a lookup table of rows. Use `architecture-map` for modules
and services. Use `diagram-topology` for runtime connectivity.

## Distinct chrome
- Full-bleed ER canvas with entity cards and SVG relationship connectors.
- Entity cards have a table-like attribute list, with PK/FK/unique/index badges and nullable markers.
- Left rail lists domains/areas and key legend.
- Right rail shows the selected entity's attributes, indexes, and incident/risk status.
- Relationship labels show cardinality at both ends.

## Data fields
Full contract: `schemas/entity-relationship.schema.json`.

- `meta`: shared chrome and visual `theme`.
- `entities[]`: cards `{id,name,area,x,y,status,attributes[],indexes[]}`.
- `relationships[]`: cardinality edges `{from,to,fromCardinality,toCardinality,label,fromAttribute,toAttribute}`.
- `domains[]`: optional domain legend entries.

## Interactions
- Click an entity to highlight direct relationships and show attributes/indexes.
- Filter or focus by domain.
- Hover a relationship to reveal FK/PK details.
- Theme switcher recolours live.
- Print shows the full model without interactive chrome.

## Do / Don't
- Do preserve table/model names and field names exactly when read from source files.
- Do show unknown or inferred fields as notes only, not as confirmed attributes.
- Do keep cards readable; split very large schemas into bounded contexts.
- Don't use this for arbitrary class diagrams unless the main question is persistent data shape.
- Don't invent cardinalities when they cannot be inferred; mark uncertain relationships as `hold`.
