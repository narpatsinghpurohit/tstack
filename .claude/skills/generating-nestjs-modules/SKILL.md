---
name: generating-nestjs-modules
description: Scaffold a new NestJS feature module with controller, service, repository extending BaseRepository, Zod DTOs in packages/shared, Mongoose schema, and unit tests. Use when creating a new backend feature, adding a new resource, or the user says 'create module', 'add feature', 'new resource', or 'scaffold' for the API in apps/api.
disable-model-invocation: true
context: fork
agent: backend-agent
argument-hint: [module-name]
---

## Live Context
- Existing modules: !`ls apps/api/src/modules/`
- Shared schemas: !`ls packages/shared/src/schemas/ 2>/dev/null || ls shared/src/schemas/ 2>/dev/null || echo "check shared/"`

## Task
Create module: $ARGUMENTS

---

# Generating NestJS Modules

## Workflow

```
- [ ] Step 1: Create Zod schema in packages/shared
- [ ] Step 2: Define permission coverage
- [ ] Step 3: Create Mongoose schema in apps/api
- [ ] Step 4: Create repository extending BaseRepository
- [ ] Step 5: Create service with business logic
- [ ] Step 6: Create controller with Swagger decorators
- [ ] Step 7: Create and register the NestJS module
- [ ] Step 8: Write unit tests
```

## Step 1: Create Zod schema in packages/shared

```typescript
// packages/shared/src/schemas/example.schema.ts
import { z } from 'zod';

export const createExampleSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
});

export const updateExampleSchema = createExampleSchema.partial();

export type CreateExampleDto = z.infer<typeof createExampleSchema>;
export type UpdateExampleDto = z.infer<typeof updateExampleSchema>;
```

Export from `packages/shared/src/index.ts`.

## Step 2: Define permission coverage

Follow the `permission-guidelines` skill. Update `PERMISSIONS` in shared if new permissions needed.

## Step 3: Create Mongoose schema

Every schema must include `orgId` for multi-tenant isolation. See [examples/course-module.md](examples/course-module.md) for real example.

## Step 4: Create repository

Extend `BaseRepository`. All queries go through org-scoped base methods.

## Step 5: Create service

Every method receives `orgId` from the controller via `@CurrentUser()`.

## Step 6: Create controller

Guards are global via `APP_GUARD`. Use `@Can(PERMISSIONS.X)` for protected handlers. Use `@Public()` for unauthenticated endpoints.

## Step 7: Register module

Add to `apps/api/src/app.module.ts`. Do NOT add guard imports to feature modules.

## Step 8: Write unit tests

See [references/testing-patterns.md](references/testing-patterns.md).

## Final structure

```
apps/api/src/modules/<name>/
├── <name>.module.ts
├── <name>.controller.ts
├── <name>.service.ts
├── <name>.repository.ts
├── schemas/
│   └── <name>.schema.ts
└── __tests__/
    ├── <name>.service.spec.ts
    └── <name>.controller.spec.ts
```

## Rules

- [rules/module-rules.md](rules/module-rules.md) — Non-negotiable backend rules

## Examples

- [examples/generic-module.md](examples/generic-module.md) — Generic module template (Product)
- [examples/course-module.md](examples/course-module.md) — Real-world reference (exam-ai-guru)

## References

- [references/testing-patterns.md](references/testing-patterns.md) — Unit test templates
