# Backend Conventions (apps/api)

## NestJS request pipeline

Middleware → Guards → Interceptors (before) → Pipes → Handler → Interceptors (after) → Exception Filters

## Module structure

```
modules/<name>/
├── <name>.module.ts
├── <name>.controller.ts
├── <name>.service.ts
├── <name>.repository.ts
├── schemas/
│   └── <name>.schema.ts
└── __tests__/
    ├── <name>.service.spec.ts
    └── <name>.controller.spec.ts
```

## BaseRepository pattern

Every feature repository extends `BaseRepository<T>` from `src/core/database/base.repository.ts`. All data access is org-scoped by default — every query filters by `orgId`:

```typescript
abstract class BaseRepository<TDocument extends Document & { orgId: string }> {
  constructor(protected readonly model: Model<TDocument>) {}

  create(data: Partial<TDocument>, session?: ClientSession): Promise<TDocument>;
  createMany(data: Partial<TDocument>[], session?: ClientSession): Promise<TDocument[]>;
  findOneByOrg(orgId: string, filter: Record<string, unknown>);       // .lean()
  findManyByOrg(orgId: string, filter?: Record<string, unknown>);     // .lean()
  findManyByOrgWithSelect(orgId: string, filter, selectFields?);      // .lean() + .select()
  updateOneByOrg(orgId: string, filter, update);                      // { returnDocument: "after" }
  updateOneByOrgWithSession(orgId: string, filter, update, session);  // transactional
  deleteOneByOrg(orgId: string, filter);                              // .lean()
  countByOrg(orgId: string, filter?);
  countGroupedByOrg(orgId: string, groupByField, filter?);            // aggregation
  deleteManyByOrg(orgId: string, filter);
}
```

- `.lean()` on all read queries (returns plain objects, better performance)
- `{ returnDocument: "after" }` on updates (NOT the deprecated `{ new: true }`)
- `orgId` is required on every query — enforces multi-tenant isolation
- Returns `null` for not-found (service decides to throw or not)
- Catches MongoDB error code 11000 → `ConflictException`
- Session support on `create`, `createMany`, `updateOneByOrgWithSession` for transactions

## Validation

Uses custom `ZodValidationPipe` from `common/validation/zod-validation.pipe.ts`, NOT `class-validator`:

```typescript
@Post()
create(@Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto) {}
```

- Schemas from the shared package (see CLAUDE.md for import path)
- Returns field-level errors on validation failure
- Never define DTOs locally in `apps/api/`

## Auth and guards

Guards are global (`APP_GUARD` in `app.module.ts`), in this order:
1. `JwtAuthGuard` — validates JWT, extracts user, skips if `@Public()`
2. `CanGuard` — checks `@Can()` (ALL) and `@CanAny()` (ANY) decorators
3. `ThrottlerGuard` — rate limiting

```typescript
// Public endpoint (no auth required)
@Public()
@Post('login')
login(@Body(...) dto: LoginRequestDto) {}

// Protected with AND logic (all required)
@Post()
@Can(PERMISSIONS.PRODUCTS_CREATE)
create(@CurrentUser() user: AuthenticatedUser, @Body(...) dto: CreateProductDto) {
  return this.productService.create(user.orgId!, dto);
}

// Protected with OR logic (any one required)
@Get()
@CanAny(PERMISSIONS.PRODUCTS_VIEW, PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)
findAll(@CurrentUser() user: AuthenticatedUser) {}
```

## Seeding

Database seeders provide initial data. Run via CLI:

```bash
bun seed              # Run all seeders
bun seed --fresh      # Fresh mode: overwrites role permissions
bun seed --class=X    # Run single seeder by name
```

Seeder structure:
```
modules/seed/
├── database.seeder.ts          # Orchestrator
├── seeder.interface.ts         # Seeder contract
└── seeders/
    ├── permission.seeder.ts    # Upserts all permission constants
    ├── role.seeder.ts          # Upserts default roles with permission bundles
    └── superadmin.seeder.ts    # Creates superadmin user from env vars
```

Pattern: each seeder implements `Seeder` interface with `run(fresh: boolean)` method. Orchestrator runs them in dependency order.

## Queue processing

BullMQ + Redis for async job processing:

```typescript
// Define processor in the module
@Processor('email')
export class EmailProcessor {
  @Process('send')
  async handleSend(job: Job<SendEmailPayload>) {
    // process job
  }
}
```

Register queue in module, dispatch jobs via service injection.

## Config

All env vars validated via Zod config objects in `config/` directory. Never use `process.env` directly — use `ConfigService.getOrThrow()`.

## Error handling

- `NotFoundException` — entity not found (404)
- `ConflictException` — duplicate entity (409)
- `BadRequestException` — validation failure (400)
- `ForbiddenException` — permission denied (403)
- `UnauthorizedException` — auth failure (401)

## Response envelope

```typescript
// Success
{ data: T, status: number, message: string, requestId: string }

// Error
{ statusCode: number, message: string, error: string, timestamp: string, path: string, requestId: string }
```
