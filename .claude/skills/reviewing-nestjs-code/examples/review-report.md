# Example: NestJS Code Review Report

## Code Review: Chapter Module

### NON-NEGOTIABLE (blocks merge)
- **chapter.controller.ts:15** [BE-1]: Missing `@Can(PERMISSIONS.CHAPTERS_VIEW)` on `findAll` endpoint. Every read endpoint must have permission guard.
- **chapter.service.ts:42** [BE-2]: `orgId` taken from `req.body.orgId` instead of `@CurrentUser()`. Org scoping must come from JWT, not request body.
- **chapter.controller.ts:28** [BE-3]: Using `class-validator` `@IsString()` instead of `ZodValidationPipe`. Must use `@Body(new ZodValidationPipe(createChapterSchema))`.

### Critical
- **chapter.service.ts:18** [BE-6]: `update()` does not check existence before updating. Add `findOneByOrg` + `NotFoundException` guard.
- **chapter.service.ts:55** [BE-9]: Direct `this.model.aggregate()` call in service. Move to repository as a named method.
- **chapter.module.ts:12**: Missing `exports: [ChapterRepository]` — other modules cannot access chapter data.

### Suggestions
- **chapter.controller.ts:8**: Consider adding `@ApiOperation({ summary: "..." })` to all endpoints for better Swagger docs.
- **chapter.service.ts:30**: `Promise.all()` could be used for the two independent count queries instead of sequential awaits.

### Passed
- Mongoose schema structure (orgId indexed, timestamps enabled)
- Module registration with `MongooseModule.forFeature`
- Repository extends `BaseRepository` correctly
- `@ApiTags` and `@ApiBearerAuth` present on controller
- No secrets or env vars in source code
