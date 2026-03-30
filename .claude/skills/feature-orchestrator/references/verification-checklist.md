# Cross-App Verification Checklist

Run this after all agents complete, before invoking code-reviewer.

---

## API Consistency

- [ ] **Endpoint paths match**: Frontend API hooks use the same paths as backend `@Controller()` + `@Get/@Post` decorators
- [ ] **HTTP methods match**: Frontend uses the same method (GET/POST/PUT/DELETE) as backend
- [ ] **Request body fields match**: Frontend sends the same fields as backend Zod DTO expects
- [ ] **Response fields match**: Frontend types match backend response structure
- [ ] **Query params match**: Any query parameters are consistent between frontend and backend

## Type Consistency

- [ ] **Zod schemas shared**: All apps import DTOs from the shared package, not local copies
- [ ] **Field names match**: Same casing and naming across both apps (e.g., `createdAt` not `created_at`)
- [ ] **Field types match**: Same types across apps (e.g., `string` for IDs, not `number` in one app)
- [ ] **Optional fields match**: Fields marked optional in Zod schema are handled as optional in frontend
- [ ] **Enum values match**: Same string values used in backend Mongoose schema and frontend types

## Auth Consistency

- [ ] **Public endpoints**: Routes marked `@Public()` in backend are called without Bearer token in frontend
- [ ] **Protected endpoints**: Routes without `@Public()` are called with Bearer token via the API client
- [ ] **Multi-tenant scoping**: Backend service methods receive `orgId` from `@CurrentUser()` decorator

## Registration

- [ ] **Backend module**: New modules are imported in `apps/api/src/app.module.ts`
- [ ] **Shared exports**: New Zod schemas and types are exported from `packages/shared/src/index.ts`
- [ ] **Web routes**: New pages have TanStack Router route files in `apps/web/src/routes/` (both `route.tsx` and `route.lazy.tsx` for code splitting)
- [ ] **Web features**: New feature code is co-located in `apps/web/src/features/{name}/` with `components/`, `api/`, `hooks/`
- [ ] **Mobile screens**: New screens registered in React Navigation navigator in `apps/mobile/src/navigation/`
- [ ] **Mobile features**: New feature code in `apps/mobile/src/features/{name}/` using 3-file split (hook/view/glue)

## Shared Package (`packages/shared`)

- [ ] **Schemas exported**: New Zod schemas are exported from `packages/shared/src/index.ts`
- [ ] **Apps import correctly**: All apps use the shared package, not local type definitions
- [ ] **No duplicated types**: Types in shared are not redefined locally in any app

## Agent Convention Compliance

- [ ] **Web routing**: New pages use TanStack Router route files, not manual `pushState` or `useState`-based routing
- [ ] **Web data fetching**: API calls use TanStack Query hooks, not raw `useEffect` + `fetch`/`axios`
- [ ] **Web forms**: Forms use `react-hook-form` with Zod resolvers from shared, not manual `useState` per field
- [ ] **Web UI**: Components use `shadcn/ui` primitives, not custom HTML elements styled with Tailwind
- [ ] **Mobile routing**: Screens registered in React Navigation, not manual navigation state
- [ ] **Mobile data fetching**: Same TanStack Query hooks as web
- [ ] **Mobile styling**: NativeWind className, not inline StyleSheet or hardcoded pixels
- [ ] **Mobile lists**: FlatList/FlashList for lists, not ScrollView + .map()
- [ ] **Backend repositories**: Repository methods extend `BaseRepository` pattern
- [ ] **Backend validation**: DTOs validated via `ZodValidationPipe` with schemas from shared package

## Linting

- [ ] **No linter errors**: Run `ReadLints` on all files modified by agents

---

## Quick Fix Patterns

| Issue | Fix |
|-------|-----|
| Frontend calls wrong endpoint path | Update the API hook to match `@Controller()` + method decorator path |
| Type mismatch between apps | Use the plan's API contract as source of truth, update the deviating app |
| Missing module import | Add to `imports` array in `apps/api/src/app.module.ts` |
| Missing shared export | Add to `packages/shared/src/index.ts` |
| Missing route in web | Create route files in `apps/web/src/routes/{path}/` |
| Enum value mismatch | Use the plan's enum definition, update both apps to match |
| Local type instead of shared | Replace with import from the shared package |
| Missing mobile screen | Register in React Navigation navigator |

**For minor fixes** (wrong import path, missing registration): fix directly.
**For non-trivial fixes** (wrong logic, missing functionality): dispatch a targeted fix task to the responsible agent using the template in `references/agent-payloads.md`.
