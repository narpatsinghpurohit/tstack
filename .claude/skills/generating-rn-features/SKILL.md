---
name: generating-rn-features
description: Create a new React Native feature using the 3-file split pattern (hook/view/glue). Every feature follows the same structure. Use when adding a new screen, feature, or section to the mobile app.
disable-model-invocation: true
context: fork
agent: mobile-agent
argument-hint: [feature-name]
---

## Live Context
- Existing features: !`ls apps/mobile/src/features/ 2>/dev/null || echo "no features yet"`
- Existing navigation: !`ls apps/mobile/src/navigation/ 2>/dev/null || echo "no navigation yet"`
- Shared schemas: !`ls packages/shared/src/schemas/ 2>/dev/null || echo "check shared/"`

## Task
Create feature: $ARGUMENTS

---

# Generating React Native Features

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

1. **View files contain ZERO hooks.** No useState, useEffect, useQuery, useCan, useNavigation. Nothing.
2. **Hook return type === View props type.** TypeScript-enforced contract.
3. **Glue file is a one-liner.** `<View {...useHook()} />`. No logic.
4. **Features are flat directories.** `features/product-list/`, NOT `features/admin/product/`.
5. **Domain prefix groups related features.** `product-list/`, `product-detail/`, `product-editor/`.
6. **No cross-feature imports.** `features/X` cannot import from `features/Y`.
7. **API hooks live in the feature.** Promote to `shared/api/queries/` only when a second consumer appears.
8. **FlatList for lists.** Never `.map()` inside ScrollView.
9. **NativeWind className.** No inline styles or web CSS.
10. **SafeAreaView on every screen root.** Use `useSafeAreaInsets` or SafeAreaView.
11. **KeyboardAvoidingView for form screens.**
12. **Typed navigation params.** Always type `useNavigation` and `useRoute`.

## Workflow

```
- [ ] Step 1: Create feature directory
- [ ] Step 2: Define ViewProps type
- [ ] Step 3: Create API hooks (query key factory)
- [ ] Step 4: Create feature hook (returns ViewProps)
- [ ] Step 5: Create pure view (accepts ViewProps, ZERO hooks)
- [ ] Step 6: Create glue file (one-liner)
- [ ] Step 7: Create index.ts
- [ ] Step 8: Register navigation screen
- [ ] Step 9: Add _components/ if needed
- [ ] Step 10: Add _hooks/ if needed
```

## Conventions

- **Named exports** for all components
- **Ternary** for conditional rendering, not `&&`
- **`import type`** for type-only imports
- **Forms**: `react-hook-form` + `zodResolver` with schemas from the shared package
- **NativeWind classes**: semantic colors (`bg-background`, `text-foreground`)
- **Response envelope**: access via `r.data.data`
- **Package manager**: bun (NEVER npm/npx)
- **Lists**: FlatList with `keyExtractor`, `renderItem` as named function or React.memo component
- **Accessibility**: `accessibilityLabel` + `accessibilityRole` on all interactive elements

## Rules

- [rules/rn-feature-rules.md](rules/rn-feature-rules.md) — Non-negotiable rules with examples

## References

- [references/rn-patterns.md](references/rn-patterns.md) — RN conventions and patterns

## Examples

- [examples/screen-feature.md](examples/screen-feature.md) — Generic ProductList screen
