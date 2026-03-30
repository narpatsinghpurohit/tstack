# Module Rules (Non-Negotiable)

## MOD-1: Repository extends BaseRepository
Never use raw Mongoose models in services. Always extend `BaseRepository<TDocument>` from `core/database/base.repository.ts`.

## MOD-2: Every entity includes orgId
`orgId` must be the first field in every Mongoose schema. BaseRepository enforces multi-tenant scoping through it.

## MOD-3: Zod validation, NOT class-validator
Use `ZodValidationPipe` with schemas from the shared package. Never use class-validator decorators.

## MOD-4: DTOs from shared package
Define DTOs in `packages/shared/src/schemas/`, NOT in local `dto/` folders. Import types from the shared package.

## MOD-5: No guard imports in feature modules
Guards (`JwtAuthGuard`, `CanGuard`) are registered globally via `APP_GUARD` in `app.module.ts`. Do NOT add guard imports or providers to feature modules.

## MOD-6: CurrentUser for org scoping
Use `@CurrentUser()` decorator in controller to get `AuthenticatedUser`. Pass `user.orgId!` to every service method.

## MOD-7: No console.log
Use NestJS `Logger` class. Never `console.log`.

## MOD-8: No process.env
Use `ConfigService.getOrThrow()`. Never `process.env`.

## MOD-9: Timestamps always enabled
Every `@Schema()` must have `timestamps: true`.

## MOD-10: Permission decorators on protected routes
Use `@Can(PERMISSIONS.X)` or `@CanAny(PERMISSIONS.X, PERMISSIONS.Y)`. Use `@Public()` only for unauthenticated endpoints.
