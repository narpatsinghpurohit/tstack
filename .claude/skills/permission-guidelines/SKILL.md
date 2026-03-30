---
name: permission-guidelines
description: Define and review permission coverage for project features. Covers the two-level RBAC model (platform + tenant), permission constants, backend enforcement with @Can/@CanAny, tenant-scoped permission resolution via Membership, frontend/mobile route and action gating with useCan(), and review checks. Use when adding or changing protected features, defining new permissions, reviewing authorization, or understanding how permissions merge across platform and org levels.
user-invocable: false
---

# Permission Guidelines

## Two-Level RBAC Model

tstack uses a **two-level** permission system inspired by Laravel Jetstream's team model:

### Platform Level (User document)
```
User.roleNames           → expand via Role.permissionNames
+ User.directPermissions → explicit grants
- User.revokedPermissions → explicit denials
= platformPermissions
```

### Tenant Level (Membership document)
```
Membership.roleNames           → expand via Role.permissionNames
+ Membership.directPermissions → explicit grants
- Membership.revokedPermissions → explicit denials
= tenantPermissions
```

### JWT Contains
```
[...new Set([...platformPermissions, ...tenantPermissions])]
```
Merged union for the user's `currentOrgId`. Changes when user switches org.

## Permission Format

**Dot notation**: `resource.action` (e.g., `products.create`, `access.superadminSurface`)

Never colon notation. Always lowercase resource, camelCase for multi-word actions.

## Default Roles

| Role | Level | Purpose |
|------|-------|---------|
| Superadmin | Platform | Full platform access, manage all orgs/users/roles |
| Admin | Org | Full org access, manage members/invitations |
| Member | Org | Basic org access, read-only by default |

## Quick Workflow

```text
- [ ] Step 1: Decide whether to reuse or add permissions
- [ ] Step 2: Update shared permission definitions
- [ ] Step 3: Protect backend endpoints with @Can/@CanAny + orgId scoping
- [ ] Step 4: Gate frontend routes, entry points, and actions with useCan()
- [ ] Step 5: Review backend/frontend permission alignment
```

## Step 1: Reuse vs Add

Inspect existing catalog in `packages/shared/src/constants/permissions.ts`. Prefer CRUD pattern: `resource.create`, `resource.view`, `resource.update`, `resource.delete`.

## Step 2: Update Shared Definitions

Add to `PERMISSIONS` object in `packages/shared/src/constants/permissions.ts`. Then run `bun seed` to sync to database.

## Step 3: Protect Backend Access

- `@Can(PERMISSIONS.X)` — requires ALL listed permissions (AND logic)
- `@CanAny(PERMISSIONS.X, PERMISSIONS.Y)` — requires ANY one (OR logic)
- `@CurrentUser()` → pass `user.orgId!` into services
- All queries go through `BaseRepository` which auto-scopes by `orgId`

```typescript
@Post()
@Can(PERMISSIONS.PRODUCTS_CREATE)
create(
  @CurrentUser() user: AuthenticatedUser,
  @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto,
) {
  return this.productService.create(user.orgId!, dto);
}
```

An endpoint is not secure if it has a permission check but can still cross org boundaries.

## Step 4: Gate Frontend Access

Use `useCan()` hook: `can(permission)`, `cannot(permission)`, `canAny(permissions)`, `canAll(permissions)`.

Apply to: route entry, nav items, action buttons, dialogs, row actions, empty-state CTAs.

```tsx
const { can } = useCan();

// Use ternary, not &&
{can(PERMISSIONS.PRODUCTS_CREATE) ? (
  <Button onClick={openCreate}>Add Product</Button>
) : null}
```

**Table rules:** Follow [rules/table-patterns.md](rules/table-patterns.md).

## Step 5: Org Switching

When user switches org (`POST /auth/select-org`):
1. Backend resolves new tenantPermissions for the selected org
2. New JWT issued with merged permissions
3. Frontend updates session → `useCan()` re-evaluates all gates
4. `User.currentOrgId` updated in database

## Anti-Patterns

- Adding a protected feature without updating `PERMISSIONS`
- Guarding frontend but forgetting backend enforcement
- Guarding backend but leaving frontend actions visible
- Accepting `orgId` from request body instead of `@CurrentUser()`
- Forgetting to run `bun seed` after adding new permissions
- Using colon notation (`products:create`) instead of dot notation (`products.create`)

## Rules

- [rules/table-patterns.md](rules/table-patterns.md)

## References

- [references/backend-rbac-patterns.md](references/backend-rbac-patterns.md)
- [references/frontend-rbac-patterns.md](references/frontend-rbac-patterns.md)
- [references/review-checklist.md](references/review-checklist.md)
- [references/jetstream-mapping.md](references/jetstream-mapping.md)

## Examples

- [examples/permission-flow.md](examples/permission-flow.md) — End-to-end permission flow with two-level resolution
