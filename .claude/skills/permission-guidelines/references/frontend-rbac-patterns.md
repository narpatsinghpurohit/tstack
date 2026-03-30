> *These patterns apply to both web (`apps/web`) and mobile (`apps/mobile`). The `useCan()` hook works identically in both.*

# Frontend Permission Patterns

## Source of Truth

Frontend permission checks must use the resolved permission list in the session, never inferred from anything else.

Main files:
- `apps/web/src/stores/use-auth-store.ts` — Zustand store with session
- `apps/web/src/features/auth/hooks/use-can.ts` — `useCan()` hook returning `{ can, cannot, canAny, canAll }`
- `packages/shared/src/permissions/` — `can`, `cannot`, `canAny`, `canAll` helpers

## Route Surface Gating

Use `can(PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)` or `can(PERMISSIONS.ACCESS_ORG_ADMIN_SURFACE)` for major app surfaces.

Route guards in TanStack Router:
```typescript
// Superadmin layout guard
beforeLoad: ({ context }) => {
  if (!context.auth.can(PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)) {
    throw redirect({ to: "/dashboard" });
  }
}
```

These are broad surface checks, not substitutes for action-level gating inside pages.

## Action-Level Gating

Use `useCan()` hook in React components:
```tsx
const { can, canAny } = useCan();

// Single permission — use ternary, not &&
{can(PERMISSIONS.PRODUCTS_CREATE) ? (
  <Button onClick={openCreate}>Add Product</Button>
) : null}

// OR logic — any one permission
{canAny([PERMISSIONS.PRODUCTS_UPDATE, PERMISSIONS.PRODUCTS_DELETE]) ? (
  <DropdownMenu>{/* actions */}</DropdownMenu>
) : null}
```

Apply checks to:
- Create buttons
- Edit/delete row actions
- Dialogs and modal entry points
- Detail-page secondary actions
- Empty-state CTAs
- Dashboard cards and links
- Navigation items in sidebar

## Org Switching

When user switches org:
1. `POST /auth/select-org { orgId }` → new JWT with new permissions
2. Auth store updates session
3. `useCan()` re-evaluates — different permissions now
4. UI updates automatically (buttons appear/disappear)

## Mirroring Backend Rules

Frontend checks are for UX. Backend remains authoritative.

For every protected backend action, verify the frontend:
- Hides the action when permission is missing (use ternary + `null`)
- Does not expose entry points into disallowed workflows
- Uses the same permission string as the backend
- Never uses `&&` for conditional rendering — always ternary

## Review Questions

- Does the page hide actions the backend would reject?
- Are route guards aligned with the intended product surface?
- Are dialog triggers and empty-state buttons gated?
- Are permission checks based on `session.user.permissions`, not anything else?
- Does org switching trigger UI re-evaluation?
- Are ternaries used (not `&&`) for conditional rendering?
