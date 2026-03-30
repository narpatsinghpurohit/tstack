---
name: understanding-codebase
description: Core project guide for this monorepo. Covers project structure, tech stack, naming conventions, architecture layers, development workflow, and coding standards. Use when starting work on any task, exploring the codebase, onboarding, asking about project structure, or needing context about how the monorepo is organized and how apps connect.
user-invocable: false
---

# Project Guide

## Tech stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + Bun workspaces |
| Backend | NestJS, Mongoose, MongoDB |
| Frontend | React + Vite, TanStack Router, TanStack Query, Zustand |
| UI | Tailwind CSS + shadcn/ui |
| Validation | Zod (shared between frontend and backend) |
| Auth | JWT (access + refresh tokens, Bearer header), Argon2 |
| Linting | Biome (replaces ESLint + Prettier) — config at root `biome.json` |
| Testing | Jest (backend + mobile), Vitest + React Testing Library + MSW (web), Jest + RNTL (mobile) |
| Mobile | React Native CLI, React Navigation, NativeWind |

## Monorepo layout

```
project/
├── apps/
│   ├── api/                  # NestJS backend
│   │   └── src/
│   │       ├── core/         # Auth, database, logging infrastructure
│   │       ├── common/       # Shared pipes, guards, filters, decorators, interceptors
│   │       ├── config/       # Env validation (Zod), config namespaces
│   │       └── modules/      # Feature modules (singular naming)
│   ├── web/                  # React + Vite frontend
│   │   └── src/
│   │       ├── components/   # Shared UI (ui/ for shadcn, layout/ for shell)
│   │       ├── features/     # Feature modules (co-located, 3-file split)
│   │       ├── hooks/        # Global custom hooks
│   │       ├── lib/          # API client, utilities
│   │       ├── routes/       # TanStack Router route tree
│   │       └── stores/       # Zustand stores
│   └── mobile/               # React Native app
│       └── src/
│           ├── components/   # Shared mobile UI components
│           ├── features/     # Feature modules (co-located, 3-file split)
│           ├── hooks/        # Global custom hooks
│           ├── lib/          # API client, utilities
│           ├── navigation/   # React Navigation config (stacks, tabs, drawers)
│           └── stores/       # Zustand stores
├── packages/
│   └── shared/               # Zod schemas, types, constants
│       └── src/
│           ├── schemas/      # Zod validation schemas (single source of truth)
│           ├── types/        # Shared TypeScript interfaces
│           └── constants/    # Error codes, enums, route constants
├── specs/                    # Feature specs (requirement, design, tasks)
├── turbo.json                # Task pipeline
├── biome.json                # Linting & formatting (root config)
└── tsconfig.base.json        # Shared TypeScript config
```

## How the layers connect

```
packages/shared (Zod schemas + types)
       ↓              ↓              ↓
   apps/api        apps/web       apps/mobile
   (ZodValPipe)    (zodResolver)  (zodResolver)
       ↓              ↓              ↓
   MongoDB         Browser        iOS/Android
```

1. **Define once** in `packages/shared`: Zod schema + inferred TypeScript type
2. **Backend consumes** via custom `ZodValidationPipe` from `common/validation/zod-validation.pipe.ts`
3. **Web consumes** via `zodResolver` for forms and types for API hooks
4. **Mobile consumes** via `zodResolver` for forms and types for API hooks (same as web)

## Naming conventions

| What | Convention | Example |
|------|-----------|---------|
| Feature module dir | Singular | `modules/user/`, `modules/exam/` |
| NestJS files | `<name>.<type>.ts` | `user.service.ts`, `user.repository.ts` |
| Zod schema files | `<entity>.schema.ts` | `user.schema.ts` in `packages/shared` |
| Mongoose schema files | `<entity>.schema.ts` | `user.schema.ts` in `modules/user/schemas/` |
| React feature dir | Singular or descriptive | `features/auth/`, `features/dashboard/` |
| React components | PascalCase, named export | `export function UserList()` |
| API hooks | `use-<resource>.ts` | `use-users.ts` in `features/user/api/` |
| Zustand stores | `use-<name>-store.ts` | `use-auth-store.ts` |
| Tests (backend) | `<name>.<type>.spec.ts` | `user.service.spec.ts` |
| Tests (frontend) | `<name>.test.tsx` | `user-list.test.tsx` |
| RN feature dir | Same as web | `features/product-list/` |
| RN components | PascalCase, named export | `export function ProductList()` |
| RN navigation | `<name>.navigator.tsx` | `main.navigator.tsx` |
| Tests (mobile) | `<name>.test.tsx` | `product-list.test.tsx` |

## Architecture patterns

### Backend: Controller → Service → Repository → Mongoose

- **Controller**: HTTP layer only. Validation via `ZodValidationPipe`. Swagger decorators.
- **Service**: Business logic. Throws `NotFoundException`, `ConflictException`, etc.
- **Repository**: Extends `BaseRepository<T>`. Data access only. Uses `.lean()` for reads.
- **Schema**: Mongoose `@Schema()` decorator. Defines shape, indexes, hooks.

### Web: Route → Feature → Component → API hook

- **Route**: TanStack Router file. Split into `route.tsx` (eager) and `route.lazy.tsx` (lazy).
- **Feature**: Co-located folder with `components/`, `hooks/`, `api/`, `types.ts`.
- **Component**: Functional, named export. Uses shadcn/ui primitives.
- **API hook**: TanStack Query. Query key factory. Reads from centralized Axios client.

### Mobile: Navigator → Feature → Component → API hook

- **Navigator**: React Navigation config (Stack, Tab, Drawer). Defines screens and params.
- **Feature**: Same 3-file split as web (`hook.ts` + `view.tsx` + `glue.tsx`).
- **Component**: React Native components (View, Text, FlatList, Pressable). NativeWind for styling.
- **API hook**: Same TanStack Query hooks as web. Shared Axios client.

### Shared package: Single source of truth

- Zod schemas define validation rules
- TypeScript types inferred via `z.infer<>`
- All apps import from the shared package (see CLAUDE.md for import path)

## Key conventions

### Do

- Use `import type` for type-only imports
- Use `.lean()` for Mongoose read queries
- Use `Promise.all()` for parallel async operations
- Use ternary for conditional JSX rendering
- Use functional `setState` when depending on previous state
- Validate all inputs with Zod schemas from `@shared`
- Keep Zustand for client UI state only, TanStack Query for server state

### Do not

- Use `any` -- use `unknown` and narrow with type guards
- Use barrel files (`index.ts` re-exports) -- import directly
- Use `console.log` in backend -- use NestJS Logger
- Use `&&` for conditional rendering -- use ternary
- Hardcode secrets -- use `ConfigService`
- Put business logic in controllers
- Use raw Mongoose models in services -- always go through repository

## Development workflow

```bash
bun install              # Install all dependencies
bun run dev              # Start all apps in parallel (Turborepo)
bun run build            # Build all apps
bun run lint             # Biome check all apps
bun run test             # Run all tests
```

## API response envelope

```typescript
// Success
{ data: T, status: number, message: string, requestId: string }

// Error
{ statusCode: number, message: string, error: string, timestamp: string, path: string, requestId: string }
```

## References

- [references/backend-conventions.md](references/backend-conventions.md) -- NestJS patterns, middleware stack, auth flow
- [references/frontend-conventions.md](references/frontend-conventions.md) -- React patterns, state management, routing
- [references/shared-package.md](references/shared-package.md) -- Shared package structure, imports, build
