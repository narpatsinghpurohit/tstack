# Backend Permission Patterns

## Shared Permission Source

Backend permission checks must use names from `packages/shared/src/constants/permissions.ts`.

Update these when a feature adds new capabilities:
- `PERMISSIONS` object
- Run `bun seed` to sync new permissions to the database
- `GET /permissions/grouped` — API endpoint returns grouped permission categories

## Two-Level Permission Resolution

The backend resolves effective permissions by merging two levels:

### Platform Level (from User document)
```
User.roleNames → expand via Role.permissionNames
+ User.directPermissions
- User.revokedPermissions
= platformPermissions
```

### Tenant Level (from Membership document)
```
Membership.roleNames → expand via Role.permissionNames
+ Membership.directPermissions
- Membership.revokedPermissions
= tenantPermissions
```

### Merge (JWT payload)
```typescript
const merged = [...new Set([...platformPermissions, ...tenantPermissions])];
// JWT.permissions = merged (for User.currentOrgId only)
```

Tenant permissions are resolved only for the **currently selected org** (`User.currentOrgId`). They are NOT merged globally across all memberships.

Main files:
- `apps/api/src/modules/user/user.service.ts` — `resolvePlatformPermissions()`
- `apps/api/src/modules/membership/membership.service.ts` — `resolveOrgPermissions()`
- `apps/api/src/modules/auth/auth.service.ts` — merges both levels into JWT

## Default Enforcement Pattern

For standard endpoints:
- Guards are global (`APP_GUARD` in `app.module.ts`)
- Add `@Can(PERMISSIONS.X)` on controller handlers (AND — all required)
- Add `@CanAny(PERMISSIONS.X, PERMISSIONS.Y)` for OR-logic (any one required)
- Use `@CurrentUser()` and pass `user.orgId!` into services
- Use `BaseRepository` methods which auto-scope by `orgId`

```typescript
// AND logic — user must have ALL permissions
@Post()
@Can(PERMISSIONS.PRODUCTS_CREATE)
create(@CurrentUser() user: AuthenticatedUser, @Body(...) dto: CreateProductDto) {
  return this.productService.create(user.orgId!, dto);
}

// OR logic — user must have ANY one permission
@Get()
@CanAny(PERMISSIONS.PRODUCTS_VIEW, PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)
findAll(@CurrentUser() user: AuthenticatedUser) {
  return this.productService.findAll(user.orgId!);
}
```

## Org Switching

When user calls `POST /auth/select-org`:
1. Verify user has active Membership in the target org
2. Resolve new tenantPermissions for that org
3. Merge with existing platformPermissions
4. Issue new JWT with updated `orgId` + `permissions`
5. Update `User.currentOrgId`

## Backend Review Questions

- Is every protected handler guarded with `@Can()` or `@CanAny()`?
- Does the handler use the correct permission for the specific action?
- Is `view` used only for reads, `update` for mutations, `delete` for destructive actions?
- Does the service/repository filter by `orgId` via `BaseRepository`?
- Is `orgId` extracted from `@CurrentUser()`, NEVER from request body?
- Are permission errors surfaced as `ForbiddenException`?
- After adding new permissions, was `bun seed` documented/run?
