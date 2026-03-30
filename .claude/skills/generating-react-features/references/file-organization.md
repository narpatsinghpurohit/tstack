# File Organization — Feature Naming & Directory Rules

## Flat Features, Domain Prefixed

Every feature is a flat directory inside `features/`. No nesting. No role-based grouping.

```
features/
├── course-list/
├── course-detail/
├── course-editor/
├── batch-list/
├── batch-detail/
├── batch-enrollment/
├── student-list/
├── student-detail/
├── student-import/
├── paper-list/
├── paper-editor/
├── paper-preview/
├── session-live/
├── session-schedule/
├── session-recording/
├── institute-list/
├── institute-detail/
├── role-list/
├── dashboard-admin/
├── dashboard-student/
├── login/
├── select-institute/
```

### Naming Convention

`{domain}-{action}` in kebab-case.

| Domain | Features |
|---|---|
| course | course-list, course-detail, course-editor |
| batch | batch-list, batch-detail, batch-enrollment |
| student | student-list, student-detail, student-import |
| teacher | teacher-list, teacher-detail |
| subject | subject-list, subject-detail |
| chapter | chapter-list, chapter-editor |
| paper | paper-list, paper-editor, paper-preview |
| question | question-bank, question-editor |
| session | session-live, session-schedule, session-recording |
| exam | exam-list, exam-detail, exam-evaluate |
| report | report-student, report-batch, report-course |
| institute | institute-list, institute-detail |
| role | role-list, role-editor |
| auth | login, select-institute |
| dashboard | dashboard-admin, dashboard-student, dashboard-parent |

### Why Flat?

Filesystem alphabetical sorting groups related features automatically:
```
batch-detail/
batch-enrollment/
batch-list/
chapter-editor/
chapter-list/
course-detail/
course-editor/
course-list/
```

A new dev searching for "anything batch-related" sees all batch features grouped together without knowing the folder hierarchy.

## Feature Directory Structure

Every feature has the same shape:

```
features/{domain}-{action}/
├── {domain}-{action}.hook.ts           # Business logic hook
├── {domain}-{action}.view.tsx          # Pure view (zero hooks)
├── {domain}-{action}.tsx               # Glue
├── index.ts                            # Public export
├── {domain}-{action}.hook.test.ts      # Hook test
├── {domain}-{action}.view.test.tsx     # View test
├── use-{entity}.ts                     # API hooks (feature-local)
├── _components/                        # Private sub-components
│   ├── {name}-dialog.tsx
│   ├── {name}-card.tsx
│   └── {name}-form.tsx
└── _hooks/                             # Private helper hooks
    ├── use-{concern-a}.ts
    └── use-{concern-b}.ts
```

### Rules

1. **`_components/`** — Prefixed with underscore. Private to this feature. NOT exported from `index.ts`. CAN use hooks internally.
2. **`_hooks/`** — Prefixed with underscore. Private helper hooks composed by the primary hook. Never imported outside the feature.
3. **`use-{entity}.ts`** — API hooks (TanStack Query). Feature-local by default. Promote to `shared/api/queries/` when a second feature needs it.
4. **`index.ts`** — Only exports the glue component. Nothing else.
5. **Tests** — Co-located next to the file they test.
6. **No `types.ts`** — ViewProps type lives in the hook file. Shared types come from the shared package.

## What Goes Where

| File | Purpose | Can use hooks? |
|---|---|---|
| `*.hook.ts` | Business logic, state, side effects | Yes (it IS the hook) |
| `*.view.tsx` | Pure rendering from props | **NO** |
| `*.tsx` (glue) | Connects hook to view | Only calls the feature hook |
| `_components/*.tsx` | Private sub-components | Yes |
| `_hooks/*.ts` | Helper hooks for decomposition | Yes |
| `use-*.ts` | API query/mutation hooks | Yes |
| `index.ts` | Public API | No logic |

## Cross-Feature Communication

Features cannot import from each other. When features need to share:

1. **Shared data** — Promote API hooks to `shared/api/queries/{domain}.queries.ts`
2. **Shared UI** — Extract to `shared/ui/` (zero business logic) or `shared/domain/` (domain-aware, props only)
3. **Shared state** — Use Zustand store in `shared/stores/`
4. **Navigation** — Use router navigation with params. Feature A navigates to Feature B's route.
5. **Shared query cache** — Features using the same query keys from `shared/api/queries/` automatically share cache.
