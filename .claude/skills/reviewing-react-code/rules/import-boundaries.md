# Import Boundary Rules (Non-Negotiable)

Import boundaries prevent hidden coupling between features. Violations block merge.

## IMP-1: Features cannot import from other features

`features/X` cannot import anything from `features/Y`. No exceptions.

```typescript
// VIOLATION: cross-feature import
// features/batch-enrollment/batch-enrollment.hook.ts
import { useCourses } from '@/features/course-list/use-courses';

// FIX: Promote shared hook to shared/api/queries/
// shared/api/queries/course.queries.ts
export function useCourses() { /* ... */ }

// features/batch-enrollment/batch-enrollment.hook.ts
import { useCourses } from '@/shared/api/queries/course.queries';

// features/course-list/course-list.hook.ts
import { useCourses } from '@/shared/api/queries/course.queries';
```

The ONLY exception: `features/auth/hooks/use-can.ts` may be imported by any feature for permission checks. This is the single shared auth utility.

## IMP-2: shared/ cannot import from features/

`shared/` directories (`shared/ui/`, `shared/api/`, `shared/lib/`, `shared/stores/`, `shared/hooks/`, `shared/domain/`) cannot import from any feature.

```typescript
// VIOLATION
// shared/ui/course-card.tsx
import { courseKeys } from '@/features/course-list/use-courses';

// FIX: shared components receive everything via props
// shared/ui/course-card.tsx
type CourseCardProps = { title: string; description: string; onClick: () => void };
export function CourseCard({ title, description, onClick }: CourseCardProps) { /* ... */ }
```

## IMP-3: View files cannot import hooks

`.view.tsx` files cannot import any hook — neither from React, TanStack, Zustand, nor custom hooks.

Allowed imports in view files:
- Type imports (`import type { ... }`)
- UI components (`@/components/ui/*`, `_components/*`)
- Utility functions (`@/lib/utils`, `cn`)
- Constants
- Icons (`lucide-react`)

```typescript
// VIOLATION
// course-list.view.tsx
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

// FIX: All hook logic stays in the hook file
// course-list.view.tsx
import type { CourseListViewProps } from './course-list.hook';
import { Button } from '@/components/ui/button';
```

## IMP-4: Route files are thin wrappers

Route files extract params, import the feature's glue component, and render it. No business logic.

```typescript
// VIOLATION: Logic in route file
// routes/.../courses/index.lazy.tsx
function CoursesPage() {
  const { data } = useCourses(); // business logic in route
  const filtered = data?.filter(/* ... */);
  return <CourseTable courses={filtered} />;
}

// FIX: Route renders feature component
function CoursesPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">Courses</h1>
      <CourseList />
    </div>
  );
}
```

Route files may contain:
- Page-level layout (container, heading, breadcrumbs)
- `Route.useParams()` to extract and pass params
- `Route.useSearch()` to extract and pass search params

Route files must NOT contain:
- API calls or queries
- Business logic
- State management
- Form handling

## IMP-5: API hooks promotion rule

API hooks start feature-local. When a second feature needs the same hook, promote to shared.

```
Step 1: Hook lives in feature
  features/course-list/use-courses.ts

Step 2: Second consumer appears (batch-enrollment needs courses)
  Move to: shared/api/queries/course.queries.ts
  Update both imports.

Step 3: Third, fourth consumer — already in shared, just import.
```

Never pre-emptively put hooks in `shared/api/queries/`. Start local, promote when needed.

## IMP-6: components/ui/ has zero domain knowledge

`components/ui/` contains shadcn/ui primitives. They must not:
- Import from `features/`
- Import from `shared/api/`
- Import from `shared/stores/`
- Import domain types from the shared package
- Contain business logic

```typescript
// VIOLATION
// components/ui/course-badge.tsx
import type { CourseStatus } from '@tstack/shared';

// FIX: Domain components go in shared/domain/ or _components/
// shared/domain/course-status-badge.tsx (if used by 2+ features)
// features/course-list/_components/course-status-badge.tsx (if used by 1 feature)
```

## Import Direction Summary

```
routes/ → features/ → shared/ → components/ui/
   ↓         ↓           ↓
   └─────────┴───────────┴──→ shared package (types, schemas, constants)
```

Arrows show allowed import direction. Never import against the arrow.

```
routes/        CAN import: features, shared, components/ui
features/X     CAN import: shared, components/ui, the shared package
               CANNOT import: features/Y, routes
shared/        CAN import: components/ui, the shared package
               CANNOT import: features, routes
components/ui/ CAN import: @/lib/utils
               CANNOT import: features, shared, routes
```
