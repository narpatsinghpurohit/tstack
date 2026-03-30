# Feature Structure Rules (Non-Negotiable)

Every feature follows the 3-file split pattern. Violations block merge. No exceptions.

## FEAT-1: Every feature uses 3-file split

Every feature directory must contain exactly these files:
- `{name}.hook.ts` — business logic
- `{name}.view.tsx` — pure rendering
- `{name}.tsx` — glue
- `index.ts` — public export

```typescript
// VIOLATION: Single file with mixed concerns
// features/course-list/course-list.tsx
export function CourseList() {
  const { data } = useCourses();          // hook call
  const [search, setSearch] = useState(''); // state
  return <div>{/* JSX */}</div>;           // rendering
}

// FIX: Split into 3 files
// course-list.hook.ts — logic
// course-list.view.tsx — rendering
// course-list.tsx — glue
```

## FEAT-2: View files contain ZERO hooks

View files (`*.view.tsx`) must not import or call any hook. This includes:
- `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`
- `useQuery`, `useMutation`, `useQueryClient`
- `useCan`, `useAuthStore`
- `useNavigate`, `useParams`, `useSearch`
- `useForm`
- Any custom `use*` hook

```typescript
// VIOLATION: View file using hooks
// course-list.view.tsx
import { useState } from 'react';

export function CourseListView({ courses }) {
  const [expanded, setExpanded] = useState<string | null>(null); // BLOCKED
  return <div>...</div>;
}

// FIX: Move state to hook, pass as props
// course-list.hook.ts
export function useCourseList(): CourseListViewProps {
  const [expanded, setExpanded] = useState<string | null>(null);
  return { expanded, onToggleExpand: (id) => setExpanded(id) };
}

// course-list.view.tsx
export function CourseListView({ expanded, onToggleExpand }: CourseListViewProps) {
  return <div>...</div>;
}
```

The ONLY React import allowed in view files is the React namespace itself (for JSX) and `type` imports.

## FEAT-3: Hook return type === View props type

The hook's return type and the view's props type must be the same TypeScript type. This is the contract.

```typescript
// VIOLATION: Types don't match
// hook returns { items: Course[] }
// view expects { courses: Course[] }

// FIX: Single type definition
export type CourseListViewProps = {
  courses: CourseResponse[];
  isLoading: boolean;
};

export function useCourseList(): CourseListViewProps { /* ... */ }
export function CourseListView(props: CourseListViewProps) { /* ... */ }
```

The type is defined in the hook file and imported by the view.

## FEAT-4: Glue file is a one-liner

The glue file contains ONLY the hook call and view render. No extra logic, no additional hooks, no wrappers.

```typescript
// VIOLATION: Logic in glue file
export function CourseList() {
  const props = useCourseList();
  const theme = useTheme(); // extra hook
  return (
    <ThemeWrapper theme={theme}> {/* extra wrapper */}
      <CourseListView {...props} />
    </ThemeWrapper>
  );
}

// FIX: Move everything to hook
export function CourseList() {
  return <CourseListView {...useCourseList()} />;
}
```

When the glue needs to accept external props (like route params):

```typescript
export function CourseDetail({ courseId }: { courseId: string }) {
  return <CourseDetailView {...useCourseDetail(courseId)} />;
}
```

This is the ONLY acceptable variation.

## FEAT-5: Features are flat directories

Features live directly in `features/`. No nesting by role, domain group, or page type.

```
// VIOLATION
features/admin/course-list/
features/admin/batch-list/
features/content/chapter-list/

// FIX
features/course-list/
features/batch-list/
features/chapter-list/
```

Use domain prefixing to group related features. Filesystem sorting handles the rest.

## FEAT-6: Private sub-components use underscore prefix

Sub-components go in `_components/`. Helper hooks go in `_hooks/`. Both are private to the feature.

```
// VIOLATION: Flat mixing of private and public files
features/course-list/
├── course-list.hook.ts
├── course-list.view.tsx
├── course-list.tsx
├── course-form-dialog.tsx     # Where does this belong?
├── course-row.tsx             # Is this shared?
└── index.ts

// FIX: Private components in _components/
features/course-list/
├── course-list.hook.ts
├── course-list.view.tsx
├── course-list.tsx
├── index.ts
└── _components/
    ├── course-form-dialog.tsx
    └── course-row.tsx
```

`_components/` are never exported from `index.ts`. They are never imported by other features.

## FEAT-7: index.ts only exports the glue component

```typescript
// VIOLATION: Exporting internals
export { CourseList } from './course-list';
export { useCourseList } from './course-list.hook';
export { CourseListView } from './course-list.view';
export { courseKeys } from './use-courses';

// FIX: Single export
export { CourseList } from './course-list';
```

If another feature needs the API hooks, promote them to `shared/api/queries/`.
