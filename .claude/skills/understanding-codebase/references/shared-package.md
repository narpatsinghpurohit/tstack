> *Code examples reference `@tstack/shared`. Replace with your project's shared package from CLAUDE.md.*

# Shared Package (`packages/shared`)

## Purpose

The shared package provides the single source of truth for types, schemas, constants, and permissions used by all apps (backend, web, and mobile).

## What lives here

| Category | Path | Examples |
|----------|------|----------|
| Zod schemas | `src/schemas/*.schema.ts` | `createCourseSchema`, `updateCourseSchema`, `courseResponseSchema` |
| Inferred types | `src/schemas/*.schema.ts` | `CreateCourseDto`, `UpdateCourseDto`, `CourseResponse` |
| Permission constants | `src/constants/index.ts` | `PERMISSIONS.COURSES_CREATE`, `PERMISSIONS.CHAPTERS_VIEW` |
| Enums | `src/constants/index.ts` | `QUESTION_TYPES`, `DIFFICULTY_LEVELS`, `SOURCE_TYPES` |

## Rules

1. **All DTOs defined here** — never in `apps/api/src/modules/*/dto/`
2. **All permission constants defined here** — consumed by both `@Can()` decorator and `useCan()` hook
3. **Schemas export both schema object and inferred type** — `export const schema` + `export type Dto`
4. **Update schema = create.partial()** — always derived, never manually defined
5. **Response schema = create.extend(server fields)** — adds `_id`, `orgId`, timestamps

## Import pattern

```typescript
// Both backend and frontend use the same import
import {
  PERMISSIONS,
  createCourseSchema,
  type CreateCourseDto,
  type CourseResponse,
} from "@tstack/shared";
```

## Build

The shared package is built by Turborepo before dependent apps. Changes to shared schemas are immediately available to all apps (`apps/api`, `apps/web`, `apps/mobile`) after rebuild.
