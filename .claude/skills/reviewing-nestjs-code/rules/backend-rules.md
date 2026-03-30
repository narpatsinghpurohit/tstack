# NestJS Backend Review Rules (Non-Negotiable)

## BE-1: Every protected route must have `@Can(PERMISSIONS.X)`
No endpoint that modifies or reads protected data should be unguarded. Check that every `@Post`, `@Get`, `@Patch`, `@Delete` has a matching `@Can()` decorator with the correct permission constant.

## BE-2: Every route must extract `orgId` from `@CurrentUser()`
Never accept `orgId` from request body or query params. Always:
```typescript
@CurrentUser() user: AuthenticatedUser
// then: user.orgId!
```

## BE-3: Use `ZodValidationPipe` with shared schemas
Never use class-validator. All validation must use `ZodValidationPipe` with schemas from the shared package.
```typescript
@Body(new ZodValidationPipe(createEntitySchema)) dto: CreateEntityDto
```

## BE-4: DTOs must come from shared package
Never define DTO types in `apps/api/`. All DTOs live in `packages/shared/src/schemas/`.

## BE-5: Repository must extend `BaseRepository`
All database access goes through org-scoped `BaseRepository` methods. Never call `this.model` directly — use `findOneByOrg`, `findManyByOrg`, etc.

## BE-6: Always check existence before update/delete
```typescript
const entity = await this.repo.findOneByOrg(orgId, { _id: id });
if (!entity) throw new NotFoundException("Entity not found");
```

## BE-7: Use `ConflictException` for duplicate checks
Before creating, check for duplicates and throw `ConflictException`.

## BE-8: Mongoose schema must have `orgId` indexed
Every `@Schema` class must include `@Prop({ required: true, index: true }) orgId!: string`.

## BE-9: No raw MongoDB queries in services
Services call repository methods only. No `model.find()`, `model.aggregate()`, etc.

## BE-10: Module must export repository
Other modules may need the repository. Always `exports: [EntityRepository]`.

## BE-11: Use `forwardRef()` for circular dependencies
When modules reference each other, use `forwardRef(() => OtherModule)` in imports.

## BE-12: Every controller must have `@ApiTags` and `@ApiBearerAuth`
```typescript
@ApiTags("entity")
@ApiBearerAuth()
@Controller("entities")
```

## BE-13: No secrets or env vars in source code
All config must come from `ConfigService` or config files with Zod validation.
