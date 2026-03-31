# CLAUDE.md

## Project Config

| Setting | Value |
|---------|-------|
| Project name | tstack |
| Shared package | `@tstack/shared` |
| Backend | `apps/api/` (NestJS, port 8000) |
| Web | `apps/web/` (React + Vite, port 5173) |
| Mobile | `apps/mobile/` (React Native) |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Multi-tenant field | `orgId` |
| Tenant entity | Organization |
| Package manager | bun |
| Linter | Biome |
| Queue | BullMQ + Redis |
| Email | Nodemailer (SMTP) |

> Skills and agents read this table to adapt to your project. Update values above when forking for a new project. For example, change `orgId` to `workspaceId` or `companyId` if that fits your domain.

## Project overview

Multi-tenant SaaS starter kit (Turborepo + Bun monorepo). NestJS + Mongoose backend, React 19 + Vite web frontend, React Native mobile app. Zod schemas shared between all apps via the shared package. Fork this repo and build your product on top.

## Quick reference

| What | Where |
|------|-------|
| Backend | `apps/api/` |
| Web frontend | `apps/web/` |
| Mobile app | `apps/mobile/` |
| Shared schemas | `packages/shared/src/schemas/` |
| Permission constants | `packages/shared/src/constants/` |
| Permission helpers | `packages/shared/src/permissions/` |
| Types | `packages/shared/src/types/` |
| Feature specs | `specs/` |

## Commands

```bash
bun install          # Install all deps
bun run dev          # Start all apps (Turborepo)
bun run build        # Build all
bun run lint         # Biome check
bun run test         # Run all tests
bun run type-check   # TypeScript check
bun seed             # Run all seeders
bun seed --fresh     # Re-seed (overwrites role permissions)
bun seed --class=X   # Run single seeder
```

## Architecture rules

### Backend (NestJS)
- Controller → Service → Repository → Mongoose (never skip layers)
- Every entity repository extends `BaseRepository` (auto-scopes queries by tenant field)
- Every endpoint needs `@Can(PERMISSIONS.X)` or `@CanAny(...)` + `@CurrentUser()` for tenant scoping
- Validation via `ZodValidationPipe` with schemas from the shared package
- DTOs defined ONLY in `packages/shared/src/schemas/`, never locally
- Seeding via `DatabaseSeeder` with dedicated `Seeder` classes
- Queue processing via BullMQ processors in `core/queue/`

### Web (React)
- Features in `features/` with co-located `api/`, `components/`, `hooks/`, `lib/`
- TanStack Query for server state, Zustand for client UI state only
- Query key factories for cache invalidation
- `useCan()` hook for permission-gated UI
- TanStack Router with file-based routing + `beforeLoad` guards
- react-hook-form + zodResolver for forms
- shadcn/ui for component library
- MSW for API mocking in tests, Vitest + React Testing Library

### Mobile (React Native)
- Same 3-file split pattern as web (hook/view/glue)
- **React Native Reusables** for UI components (shadcn/ui port for RN) — `@/components/ui/`
- **RN Primitives** (`@rn-primitives/*`) as foundation layer (Radix port)
- React Navigation for routing (Stack, Tab, Drawer)
- NativeWind for styling (Tailwind for RN — consistent with web theme tokens)
- TanStack Query + Zustand (same as web)
- FlatList/FlashList for lists, never .map() in ScrollView
- `react-native-reanimated` for animations
- `lucide-react-native` for icons
- Jest + React Native Testing Library for tests
- Add components via CLI: `bunx --bun @react-native-reusables/cli@latest add <component>`

### Shared package
- Zod schema trio per entity: `createSchema` + `updateSchema` (.partial()) + `responseSchema` (.extend())
- Types inferred via `z.infer<>`, never manually defined
- All apps import from the shared package
- Permission helpers: `can()`, `cannot()`, `canAny()`, `canAll()`

## Code style

- **Formatter**: Biome (not ESLint/Prettier) — config at root `biome.json`
- **Imports**: Use `import type` for type-only imports
- **No `any`**: Use `unknown` + type guards
- **No barrel files**: Import directly from source
- **No `console.log` in backend**: Use NestJS Logger
- **No `&&` for conditional JSX**: Use ternary (web and mobile)

## Multi-tenancy

Every entity has the tenant field (see Project Config table above). Every query goes through `BaseRepository` which auto-scopes by tenant. Never accept the tenant field from request body — extract from JWT via `@CurrentUser()`.

## Permission model

Two-level permission system:
- **Platform level**: `User.roleNames` + `User.directPermissions` - `User.revokedPermissions`
- **Tenant level**: Membership document stores `roleNames` + `directPermissions` - `revokedPermissions`
- **JWT contains**: Union of platform + selected tenant permissions
- **Backend**: `@Can()` (all required) and `@CanAny()` (any one required) decorators
- **Frontend**: `useCan()` hook with `can()`, `cannot()`, `canAny()`, `canAll()`

## Subagents

| Agent | Purpose | Isolation |
|-------|---------|-----------|
| `backend-agent` | NestJS implementation | worktree |
| `web-agent` | React web implementation | worktree |
| `mobile-agent` | React Native implementation | worktree |
| `code-reviewer` | Read-only code review | none |
| `technical-architect` | Planning and design | plan mode |

## Slash commands

| Command | What it does |
|---------|-------------|
| `/generating-react-features [name]` | Scaffold a React web feature (3-file split) |
| `/generating-rn-features [name]` | Scaffold a React Native feature (3-file split) |
| `/generating-nestjs-modules [name]` | Scaffold a NestJS module (controller+service+repo+schema) |
| `/adding-api-endpoints [name]` | Add CRUD endpoints with query hooks |
| `/adding-shared-schemas [name]` | Create Zod schema trio in shared package |
| `/creating-mongoose-schemas [name]` | Create Mongoose schema + repository |
| `/reviewing-react-code` | Review React web code for conventions |
| `/reviewing-rn-code` | Review React Native code for conventions |
| `/reviewing-nestjs-code` | Review NestJS code for conventions |
| `/writing-tests [what]` | Write tests for a module/component |
| `/spec-driven-development [feature]` | Full spec → design → tasks → implementation |
| `/feature-orchestrator [feature]` | Orchestrate multi-agent feature development |
