# Example: End-to-End Permission Flow (Two-Level RBAC)

## 1. Permission constants — `packages/shared/src/constants/permissions.ts`

```typescript
export const PERMISSIONS = {
  // Access gates
  ACCESS_SUPERADMIN_SURFACE: "access.superadminSurface",
  ACCESS_ORG_ADMIN_SURFACE: "access.orgAdminSurface",

  // Products (example domain — added after fork)
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",
  // ... more
} as const;
```

## 2. Two-level resolution

```
User: narpatsingh@gmail.com
├── Platform roles: ["Superadmin"]
│   └── Expands to: ["access.superadminSurface", "organizations.create", ...]
├── directPermissions: []
├── revokedPermissions: []
│
├── Membership (Org: Acme Corp)
│   ├── roleNames: ["Admin"]
│   │   └── Expands to: ["access.orgAdminSurface", "products.create", "products.view", ...]
│   ├── directPermissions: ["reports.export"]   ← extra grant
│   └── revokedPermissions: ["products.delete"]  ← revoked from Admin role
│
└── JWT (when currentOrgId = Acme):
    permissions = platformPerms UNION (adminPerms + ["reports.export"] - ["products.delete"])
```

## 3. Backend enforcement

```typescript
// Controller
@Post()
@Can(PERMISSIONS.PRODUCTS_CREATE)
create(@CurrentUser() user: AuthenticatedUser, @Body(...) dto: CreateProductDto) {
  return this.productService.create(user.orgId!, dto);
}

// Service — orgId scopes all queries
async create(orgId: string, dto: CreateProductDto) {
  const existing = await this.productRepository.findOneByOrg(orgId, { name: dto.name });
  if (existing) throw new ConflictException("Product already exists");
  return this.productRepository.create({ orgId, ...dto });
}

// @CanAny example — OR logic
@Get()
@CanAny(PERMISSIONS.PRODUCTS_VIEW, PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)
findAll(@CurrentUser() user: AuthenticatedUser) {
  return this.productService.findAll(user.orgId!);
}
```

## 4. Frontend route guard

```typescript
// routes/_authenticated/_admin.tsx
export const Route = createFileRoute("/_authenticated/_admin")({
  beforeLoad: ({ context }) => {
    const { can } = context.auth;
    if (!can(PERMISSIONS.ACCESS_ORG_ADMIN_SURFACE)) {
      throw redirect({ to: "/dashboard" });
    }
  },
});
```

## 5. Frontend action gating

```tsx
const { can } = useCan();

return (
  <>
    {can(PERMISSIONS.PRODUCTS_CREATE) ? (
      <Button onClick={openCreateDialog}>Add Product</Button>
    ) : null}

    {can(PERMISSIONS.PRODUCTS_DELETE) ? (
      <Button variant="destructive" onClick={() => handleDelete(product._id)}>
        Delete
      </Button>
    ) : null}
  </>
);
```

## 6. Org switching flow

```
User clicks org switcher → selects "Startup Inc"
  → POST /auth/select-org { orgId: "startup-id" }
  → Backend:
      1. Verify user has active Membership in Startup Inc
      2. Resolve new tenantPermissions for Startup Inc
      3. Merge with platformPermissions
      4. Issue new JWT
      5. Update User.currentOrgId
  → Frontend:
      1. Update session in auth store
      2. useCan() re-evaluates (different permissions now)
      3. UI updates — some buttons appear/disappear
```

## Checklist

- [ ] Permission constant exists in `packages/shared/src/constants/permissions.ts`
- [ ] `bun seed` run to sync permissions to database
- [ ] `@Can(PERMISSIONS.X)` or `@CanAny(...)` on every backend endpoint
- [ ] `@CurrentUser()` extracts `orgId` from JWT — never from request body
- [ ] Route guard checks permission in `beforeLoad`
- [ ] `useCan()` gates UI actions (buttons, menu items)
- [ ] Hidden actions don't leak data (no disabled buttons for restricted features)
- [ ] Org switching triggers permission re-evaluation
