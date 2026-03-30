---
name: adding-api-endpoints
description: Add a new API endpoint end-to-end from backend to frontend. Creates Zod schema in packages/shared, NestJS repository method, service logic, controller with Swagger decorators, TanStack Query hook in apps/web, and React component. Use when the user wants to add a new endpoint, connect frontend to backend, wire up a full-stack feature, or add CRUD operations.
disable-model-invocation: true
argument-hint: [endpoint-name]
---

## Live Context
- Existing modules: !`ls apps/api/src/modules/`
- Existing features: !`ls apps/web/src/features/`

## Task
Add API endpoint: $ARGUMENTS

---

# Adding API Endpoints (Full-Stack)

## Workflow

```
- [ ] Step 1: Define Zod schema in packages/shared
- [ ] Step 2: Add or confirm permission coverage
- [ ] Step 3: Add repository method in apps/api
- [ ] Step 4: Add service method in apps/api
- [ ] Step 5: Add controller endpoint with Swagger
- [ ] Step 6: Create TanStack Query hook in apps/web
- [ ] Step 7: Create React component consuming the hook
```

## Conventions

- **Permissions**: Follow the `permission-guidelines` skill
- **Query keys**: `[resource]` for lists, `[resource, id]` for single items
- **Mutations**: Always `invalidateQueries` on success
- **API client**: Centralized Axios instance at `apps/web/src/lib/api-client.ts`
- **Response envelope**: Backend wraps in `{ data, status, message }`. Access `r.data.data` in hooks.

## Examples

- [examples/generic-endpoint.md](examples/generic-endpoint.md) — Generic CRUD endpoint template (Product)
- [examples/crud-endpoint.md](examples/crud-endpoint.md) — Real-world reference (exam-ai-guru)

## References

- [references/query-patterns.md](references/query-patterns.md) — Advanced TanStack Query usage
- [references/swagger-patterns.md](references/swagger-patterns.md) — Swagger decorator reference
