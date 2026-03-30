---
name: generating-react-features
description: Create a new React feature in apps/web using the 3-file split pattern (hook/view/glue). Every feature follows the same structure — no exceptions. Use when adding a new page, screen, feature, view, or section to the frontend application.
disable-model-invocation: true
context: fork
agent: web-agent
argument-hint: [feature-name]
---

## Live Context
- Existing features: !`ls apps/web/src/features/`
- Existing routes: !`ls apps/web/src/routes/_authenticated/ 2>/dev/null`
- Shared schemas: !`ls packages/shared/src/schemas/ 2>/dev/null || ls shared/src/schemas/ 2>/dev/null || echo "check shared/"`

## Task
Create feature: $ARGUMENTS

---

# Generating React Features

## The Pattern

Every feature uses exactly 3 files + index. No exceptions.

```
features/<domain>-<action>/
├── <domain>-<action>.hook.ts       # Business logic (custom hook)
├── <domain>-<action>.view.tsx      # Pure UI (props only, ZERO hooks)
├── <domain>-<action>.tsx           # Glue: calls hook, renders view
├── index.ts                        # Public API
├── _components/                    # Private sub-components (CAN use hooks)
└── _hooks/                         # Private helper hooks
```

## Rules (non-negotiable)

1. **View files contain ZERO hooks.** No useState, useEffect, useQuery, useCan, useNavigate. Nothing.
2. **Hook return type === View props type.** TypeScript-enforced contract.
3. **Glue file is a one-liner.** `<View {...useHook()} />`. No logic.
4. **Features are flat directories.** `features/course-list/`, NOT `features/admin/course/`.
5. **Domain prefix groups related features.** `course-list/`, `course-detail/`, `course-editor/`.
6. **No cross-feature imports.** `features/X` cannot import from `features/Y`.
7. **API hooks live in the feature.** Promote to `shared/api/queries/` only when a second consumer appears.

## Workflow

```
- [ ] Step 1: Create feature directory
- [ ] Step 2: Define ViewProps type
- [ ] Step 3: Create API hooks (query key factory)
- [ ] Step 4: Create feature hook (returns ViewProps)
- [ ] Step 5: Create pure view (accepts ViewProps, ZERO hooks)
- [ ] Step 6: Create glue file (one-liner)
- [ ] Step 7: Create index.ts
- [ ] Step 8: Create route (thin wrapper)
- [ ] Step 9: Add _components/ if needed
- [ ] Step 10: Add _hooks/ if needed
```

## Conventions

- **Named exports** for all components
- **Ternary** for conditional rendering, not `&&`
- **`import type`** for type-only imports
- **Forms**: `react-hook-form` + `zodResolver` with schemas from the shared package
- **Dark mode**: semantic Tailwind classes (`bg-background`, `text-foreground`)
- **Response envelope**: access via `r.data.data`
- **Package manager**: bun (NEVER npm/npx)

## References

- [references/3-file-pattern.md](references/3-file-pattern.md) — Pattern examples at different scales
- [references/file-organization.md](references/file-organization.md) — Feature naming and directory rules

## Rules

- [rules/feature-rules.md](rules/feature-rules.md) — Non-negotiable rules with examples

## Examples

- [examples/generic-feature.md](examples/generic-feature.md) — Generic feature template (Product List)
- [examples/course-list-feature.md](examples/course-list-feature.md) — Real-world reference (exam-ai-guru)
- [examples/query-hook-factory.md](examples/query-hook-factory.md) — Query key factory pattern
