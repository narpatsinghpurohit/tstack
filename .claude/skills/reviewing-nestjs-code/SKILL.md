---
name: reviewing-nestjs-code
description: Review NestJS backend code for architecture compliance, security, performance, and project conventions. Checks repository pattern, Zod validation, error handling, auth guards, multi-tenant scoping, logging, and test coverage. Use when reviewing backend code, pull requests, API code, or the user asks to review NestJS, API, or backend code in apps/api.
context: fork
agent: code-reviewer
allowed-tools: Read, Grep, Glob
---

# Reviewing NestJS Code

## Severity levels

- **NON-NEGOTIABLE**: Blocks merge. No exceptions.
- **CRITICAL**: Must fix before merge.
- **SUGGESTION**: Should fix.

## Review process

1. Read all files in the module being reviewed
2. Check against non-negotiable rules in [rules/backend-rules.md](rules/backend-rules.md)
3. Check permission coverage using the `permission-guidelines` skill
4. Check for common issues in [references/common-issues.md](references/common-issues.md)
5. Output findings

## Non-negotiable checks

- [ ] Repository extends `BaseRepository`, not raw Mongoose model usage in service
- [ ] All queries scoped by `orgId` (multi-tenant isolation)
- [ ] `@Can(PERMISSIONS.X)` on all protected endpoints
- [ ] Validation via `ZodValidationPipe` with schemas from the shared package, NOT class-validator
- [ ] DTOs imported from the shared package, NOT defined locally
- [ ] `@CurrentUser()` used to extract user, `orgId` passed to service
- [ ] No `console.log` — use NestJS `Logger`
- [ ] No `process.env` — use `ConfigService.getOrThrow()`
- [ ] No guard imports in feature modules (guards are global via `APP_GUARD`)
- [ ] Module registered in `app.module.ts`

## Architecture checks

- [ ] Controller: HTTP layer only, no business logic
- [ ] Service: Business logic, throws proper NestJS exceptions
- [ ] Repository: Data access only, uses `.lean()` for reads
- [ ] Schema: `orgId` first field, `timestamps: true`, proper indexes

## Performance checks

- [ ] `.lean()` used for read queries
- [ ] Proper indexes for query patterns
- [ ] `Promise.all()` for parallel async operations
- [ ] No N+1 query patterns

## Output format

```markdown
## Code Review: [Module Name]

### NON-NEGOTIABLE (blocks merge)
- **[File:Line]** [Rule ID]: [Description and exact fix]

### Critical
- **[File:Line]**: [Description and fix]

### Suggestions
- **[File:Line]**: [Recommendation]

### Passed
- [Categories that passed all checks]
```

## Rules

- [rules/backend-rules.md](rules/backend-rules.md) — Non-negotiable backend rules

## References

- [references/common-issues.md](references/common-issues.md) — Common issues and fixes

## Examples

- [examples/review-report.md](examples/review-report.md) — Example review output
