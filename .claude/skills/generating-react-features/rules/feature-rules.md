# Feature Rules (Non-Negotiable)

## FEAT-R1: View files contain ZERO hooks
No `useState`, `useEffect`, `useQuery`, `useCan`, `useNavigate`, `useForm`, `useMemo`, `useCallback`. Nothing from React hooks. Pure props in, JSX out.

## FEAT-R2: Hook return type === View props type
The hook must return exactly the type the view accepts. Single TypeScript type, defined in the hook file, imported by the view.

## FEAT-R3: Glue file is a one-liner
```tsx
export function CourseList() {
  return <CourseListView {...useCourseList()} />;
}
```
No extra logic, no wrappers, no additional props.

## FEAT-R4: Features are flat directories
`features/course-list/`, NOT `features/admin/course/`. Use domain prefix to group: `course-list/`, `course-detail/`, `course-editor/`.

## FEAT-R5: No cross-feature imports
`features/X` cannot import from `features/Y`. Exception: `features/auth/hooks/use-can.ts`.

## FEAT-R6: index.ts exports only the glue component
```ts
export { CourseList } from './course-list';
```

## FEAT-R7: API hooks start feature-local
Place in the feature directory. Promote to `shared/api/queries/` only when a second consumer appears.

## FEAT-R8: Import boundaries
```
routes/ → features/ → shared/ → components/ui/
```
- `features/X` CANNOT import from `features/Y`
- `shared/` CANNOT import from `features/`
- `.view.tsx` CANNOT import hooks
- Route files are thin wrappers (params + render, no logic)
