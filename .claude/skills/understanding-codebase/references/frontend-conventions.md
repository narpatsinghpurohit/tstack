> *These conventions apply to `apps/web/`. For React Native conventions, see the `generating-rn-features` skill.*

# Frontend Conventions (apps/web)

## 3-File Feature Pattern

Every feature uses the same structure. No exceptions.

```
features/{domain}-{action}/
├── {name}.hook.ts          # Business logic (custom hook, returns ViewProps)
├── {name}.view.tsx          # Pure rendering (props only, ZERO hooks)
├── {name}.tsx               # Glue: <View {...useHook()} />
├── index.ts                 # Public API: exports glue component only
├── use-{entity}.ts          # API hooks (TanStack Query)
├── _components/             # Private sub-components (CAN use hooks)
└── _hooks/                  # Private helper hooks (composed by primary hook)
```

### Core Rules

1. **View files contain ZERO hooks.** No useState, useEffect, useQuery, useCan. Pure props → JSX.
2. **Hook return type === View props type.** Single TypeScript type, defined in hook file.
3. **Glue file is a one-liner.** `<View {...useHook()} />`.
4. **Features are flat.** `features/course-list/`, NOT `features/admin/course/`.
5. **Domain prefix groups related features.** `course-list/`, `course-detail/`, `course-editor/`.
6. **No cross-feature imports.** `features/X` cannot import `features/Y`.
7. **index.ts exports only the glue component.** Nothing else.

## Import Boundaries

```
routes/ → features/ → shared/ → components/ui/
```

- `features/X` CANNOT import from `features/Y`
- `shared/` CANNOT import from `features/`
- `.view.tsx` CANNOT import hooks
- Route files are thin wrappers (params + render)

## Component rules

- Functional components only, named exports
- No default exports except TanStack Router lazy routes
- Use shadcn/ui primitives from `src/components/ui/`
- Never modify generated shadcn/ui files

## TanStack Router

File-based routing with code splitting:

```typescript
// routes/<name>/index.tsx -- route definition (eager loaded)
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/<name>/')({});

// routes/<name>/index.lazy.tsx -- component (lazy loaded)
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/<name>/')({ component: Page });
```

- Search params validated with Zod
- Layout routes for shared UI (sidebar, header)
- No hardcoded paths -- use route references
- Route files extract params and render feature component. No business logic.

## TanStack Query

```typescript
const KEYS = {
  all: ['users'] as const,
  byId: (id: string) => ['users', id] as const,
  list: (filters: Filters) => ['users', 'list', filters] as const,
};

export function useUsers() {
  return useQuery({ queryKey: KEYS.all, queryFn: fetchUsers });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
```

- Query keys: `[resource]` for lists, `[resource, id]` for details
- Always `invalidateQueries` on mutation success
- Use `enabled` flag for conditional queries
- Never `refetch()` in `useEffect` -- change query keys instead
- Access response: `r.data.data` (through API envelope)

## Zustand

Client UI state only. Server state belongs in TanStack Query.

```typescript
const user = useAuthStore((s) => s.user); // use selectors
```

## Forms

`react-hook-form` + `@hookform/resolvers/zod` with schemas from the shared package.

## API client

Centralized Axios instance at `src/lib/api-client.ts`:
- Request interceptor: Authorization Bearer header
- Response interceptor: 401 → refresh token → retry

## Styling

- Tailwind CSS for all styling
- shadcn/ui components in `src/components/ui/`
- `cn()` utility for conditional class merging
- Semantic classes for dark mode (`bg-background`, `text-foreground`)
- No CSS modules, no styled-components

## Performance rules

- No barrel file imports — import directly from source
- Ternary for conditional rendering (not `&&`)
- `Promise.all()` for parallel async
- `Set`/`Map` for O(1) lookups
- Functional `setState` when depending on previous state
- Hoist static JSX outside components
- No inline objects/arrays in JSX props
- Package manager: bun (NEVER npm/npx)
