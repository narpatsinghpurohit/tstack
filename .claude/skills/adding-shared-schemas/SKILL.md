---
name: adding-shared-schemas
description: Add a new Zod validation schema to packages/shared with TypeScript type inference via z.infer, proper exports, and consumption patterns for both NestJS (ZodValidationPipe) and React (hookform/resolvers/zod). Use when creating shared types, DTOs, validation schemas, API contracts, or adding a new entity type used across frontend and backend.
disable-model-invocation: true
argument-hint: [schema-name]
---

## Task
Create shared schema: $ARGUMENTS

---

# Adding Shared Schemas

## Workflow

```
- [ ] Step 1: Create Zod schema file in packages/shared
- [ ] Step 2: Infer TypeScript types
- [ ] Step 3: Export from package index
- [ ] Step 4: Consume in NestJS (apps/api)
- [ ] Step 5: Consume in React (apps/web)
```

## Schema patterns

- **`z.coerce.number()`** for query params (strings from URL auto-coerced)
- **`.default()`** for fields with sensible defaults
- **`.partial()`** to generate update DTOs from create DTOs
- **`.extend()`** to add server-generated fields to response schemas
- **`.pick()` / `.omit()`** to create subset schemas

## Conventions

- One file per entity: `<entity>.schema.ts`
- Schema names: `create<Entity>Schema`, `update<Entity>Schema`, `<entity>ResponseSchema`
- Type names: `Create<Entity>Dto`, `Update<Entity>Dto`, `<Entity>Response`
- Always export both schema and inferred type
- No circular imports between schema files

## Rules

- [rules/schema-rules.md](rules/schema-rules.md) — Schema conventions

## Examples

- [examples/generic-schema.md](examples/generic-schema.md) — Generic schema template (Product)
- [examples/course-schema.md](examples/course-schema.md) — Real-world reference (exam-ai-guru)

## References

- [references/export-pattern.md](references/export-pattern.md) — Schema file structure and export conventions
