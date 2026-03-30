---
name: creating-mongoose-schemas
description: Define a new Mongoose schema with @Schema decorator, SchemaFactory, indexes, virtuals, timestamps, and pre/post hooks. Creates matching repository extending BaseRepository. Use when adding a new MongoDB collection, database model, entity schema, or data model to the NestJS backend in apps/api.
disable-model-invocation: true
context: fork
agent: backend-agent
argument-hint: [entity-name]
---

## Live Context
- Existing schemas: !`find apps/api/src/modules -name "*.schema.ts" -not -path "*/node_modules/*" 2>/dev/null`

## Task
Create Mongoose schema for: $ARGUMENTS

---

# Creating Mongoose Schemas

## Workflow

```
- [ ] Step 1: Define the schema class with decorators
- [ ] Step 2: Add indexes for query performance
- [ ] Step 3: Add virtuals and hooks (if needed)
- [ ] Step 4: Create repository extending BaseRepository
- [ ] Step 5: Register in feature module
```

## Schema design guidelines

- **Always include `orgId`** as the first field — `BaseRepository` requires it
- **Always enable `timestamps: true`** for `createdAt` and `updatedAt`
- **Use `select: false`** for sensitive fields like `passwordHash`
- **Use `trim: true`** on string fields
- **Use `lowercase: true`** on email fields
- **Use `enum`** for fields with known set of values
- **Prefer `.lean()`** in repository reads for performance

## Rules

- [rules/schema-rules.md](rules/schema-rules.md) — Schema conventions

## Examples

- [examples/generic-schema.md](examples/generic-schema.md) — Generic schema template (Product)
- [examples/course-schema.md](examples/course-schema.md) — Real-world reference (exam-ai-guru)

## References

- [references/connection-config.md](references/connection-config.md) — Mongoose connection config
