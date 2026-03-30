# Scope Matrix & Feature Patterns

## Decision Matrix

Use this to determine which apps need changes for a given feature type:

| Feature Type | Backend (`apps/api`) | Web (`apps/web`) | Mobile (`apps/mobile`) | Shared (`packages/shared`) |
|---|---|---|---|---|
| New API endpoint only | Yes | No | No | Yes (DTOs) |
| New admin page | Yes | Yes | No | Yes (DTOs) |
| New user-facing page | Yes | Yes | Possibly | Yes (DTOs) |
| New cross-platform feature | Yes | Yes | Yes | Yes (DTOs + enums) |
| Web-only UI change | No | Yes | No | No |
| Mobile-only screen | Yes (if new API) | No | Yes | Possibly (types) |
| Schema/DB change only | Yes | No | No | Possibly (types) |
| New shared validation | No | No | No | Yes |

### Scope Questions

If the feature type isn't obvious, ask:

1. Does it need a new/modified API endpoint? → Backend + Shared (Zod DTOs)
2. Does it need a new/modified web page? → Web
3. Does it need a new/modified mobile screen? → Mobile
4. Does it need a new DB schema or schema change? → Backend
5. Does it need new shared validation or types? → Shared package
6. Does it touch file uploads? → Backend (storage) + whichever client triggers it
7. Should it work on both web and mobile? → Web + Mobile + Backend + Shared

**If still unclear, ask the user** which apps should be affected before proceeding.

---

## Feature Patterns

Check if the feature matches a known pattern (saves analysis time and ensures consistency):

### Pattern 1 — New CRUD Entity

Examples: "add announcements", "add study materials", "add bookmarks"

| App | What to Build |
|-----|---------------|
| Shared | Zod schemas in `packages/shared/src/schemas/{entity}.schema.ts` — create/update/response/query schemas + inferred types. Export from `packages/shared/src/index.ts`. |
| Backend | New module `apps/api/src/modules/{entity}/` with module, controller, service, repository (extends `BaseRepository`), Mongoose schema (with `orgId`). Register in `app.module.ts`. |
| Web | New feature `apps/web/src/features/{entity}/` with `components/`, `api/` (TanStack Query hooks), `hooks/`. New TanStack Router route in `apps/web/src/routes/`. |
| Mobile | New feature `apps/mobile/src/features/{entity}/` with 3-file split. Register screen in React Navigation navigator. |

Standard endpoints: `GET /{entities}`, `GET /{entities}/:id`, `POST /{entities}`, `PUT /{entities}/:id`, `DELETE /{entities}/:id`

### Pattern 2 — Exam/Course Sub-Feature

Examples: "add hints to questions", "add timer settings", "add mock test mode"

| App | What to Build |
|-----|---------------|
| Shared | Update existing Zod schema or add new fields to existing schemas in `packages/shared/src/schemas/`. |
| Backend | Update existing Mongoose schema, service methods, and controller endpoints in the relevant module under `apps/api/src/modules/`. |
| Web | Update existing feature components and API hooks. May add new components to an existing feature folder. |

### Pattern 3 — Admin Dashboard Widget

Examples: "add revenue chart", "add active users count"

| App | What to Build |
|-----|---------------|
| Shared | Response schema for the new data endpoint. |
| Backend | Add endpoint to existing admin or analytics module. Add service method with aggregation query. |
| Web | Add widget component in the dashboard feature. Add TanStack Query hook for the new endpoint. |

### Pattern 4 — Student-Facing Feature

Examples: "add study streaks", "add leaderboard", "add progress tracking"

| App | What to Build |
|-----|---------------|
| Shared | Zod schemas for new endpoints. |
| Backend | New or extend existing module with student-scoped endpoints. |
| Web | Create/update student portal feature in `apps/web/src/features/`. Add TanStack Router route under student layout. |

### Pattern 5 — Settings/Configuration Feature

Examples: "add notification preferences", "add institute branding", "add grading scale config"

| App | What to Build |
|-----|---------------|
| Shared | Zod schemas for settings CRUD. |
| Backend | Add settings endpoints to existing or new module. Mongoose schema for settings document. |
| Web | Settings page/section with form using `react-hook-form` + `zodResolver` with shared schemas. |

If no pattern matches, fall back to the general scope questions above.
