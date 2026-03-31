# tstack

**The AI-native full-stack starter kit.** Built for teams where AI agents and human developers ship together.

NestJS + React + React Native. Turborepo + Bun. Multi-tenant SaaS with RBAC, org management, and auth — ready to fork and build on.

---

## Why tstack?

Every SaaS needs the same foundation: authentication, organizations, roles, permissions, invitations, and a superadmin portal. Building this from scratch takes weeks. Copying it from a previous project carries tech debt.

tstack gives you a **production-ready base** with strict conventions that both humans and AI agents can follow. The `.claude/` directory contains skills, agents, and rules that teach AI exactly how your codebase works — so when you say "add a products module", it generates code that compiles, follows every convention, and passes review.

**Think Laravel Jetstream, but for the TypeScript full-stack + mobile world.**

## What's inside

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo + Bun workspaces |
| **Backend** | NestJS, Mongoose, MongoDB |
| **Web** | React 19, Vite, TanStack Router, TanStack Query, Zustand |
| **Mobile** | React Native CLI, React Navigation, NativeWind |
| **UI (Web)** | Tailwind CSS + shadcn/ui |
| **UI (Mobile)** | NativeWind + React Native Reusables (shadcn port) |
| **Validation** | Zod — shared between all apps |
| **Auth** | JWT (access + refresh), Argon2 |
| **Linting** | Biome |

## Features

### Auth
- Login, signup, forgot password, reset password
- JWT with silent refresh (access 15m + refresh 7d)
- Multi-org support — users belong to multiple organizations
- Org switcher with scoped permissions

### Multi-Tenancy
- Every entity scoped by `orgId` via `BaseRepository`
- Organization creation, invitation, member management
- Slug-based routing ready (subdomain or path)

### RBAC (Two-Level)
- **Platform level**: User roles + direct permissions + revoked permissions
- **Tenant level**: Membership roles + direct permissions + revoked permissions
- JWT contains merged permissions for the active org
- `@Can()` / `@CanAny()` decorators on backend
- `useCan()` hook on frontend

### Superadmin Portal (Web)
- Manage all organizations, users, roles
- Grouped permission editor
- System settings (allow signup, maintenance mode, etc.)

### Mobile App
- Login, signup, forgot password, org selector, dashboard
- 3-file split pattern (hook/view/glue) — same as web
- React Native Reusables for UI components
- `react-native-keyboard-controller` for proper keyboard handling

### AI-Native Engineering
- **5 specialized agents** in `.claude/agents/` — backend, web, mobile, code-reviewer, technical-architect
- **15 skills** in `.claude/skills/` — code generation, review, testing, spec-driven development
- **Non-negotiable rules** enforced by review skills — 3-file split, import boundaries, permission coverage
- Agents produce code that follows conventions without being told twice

## Quick start

```bash
# Clone
git clone https://github.com/narpatsinghpurohit/tstack.git
cd tstack

# Install
bun install

# Configure
cp .env.example apps/api/.env
# Edit apps/api/.env with your MongoDB URI, JWT secrets, etc.

# Seed database
bun seed

# Start all apps
bun run dev
```

- Backend: `http://localhost:8000/api/health`
- Web: `http://localhost:5173`
- Mobile: `cd apps/mobile && bun run android` (or `bun run ios`)

## Project structure

```
tstack/
├── apps/
│   ├── api/              # NestJS backend (port 8000)
│   ├── web/              # React + Vite frontend (port 5173)
│   └── mobile/           # React Native app
├── packages/
│   └── shared/           # @tstack/shared — Zod schemas, types, permissions
├── .claude/
│   ├── agents/           # AI agent definitions
│   └── skills/           # AI skill instructions + rules + examples
├── specs/                # Feature specifications
├── CLAUDE.md             # AI reads this first
├── turbo.json
├── biome.json
└── tsconfig.base.json
```

## AI-powered development

tstack is built to work with AI coding agents (Claude Code, Cursor, Copilot). The `.claude/` directory is the key:

### Agents
| Agent | What it does |
|-------|-------------|
| `backend-agent` | Builds NestJS modules, controllers, services, schemas |
| `web-agent` | Builds React features with 3-file split pattern |
| `mobile-agent` | Builds React Native screens with NativeWind + RN Reusables |
| `code-reviewer` | Reviews code against all project conventions |
| `technical-architect` | Plans features before implementation |

### Slash commands
```
/generating-nestjs-modules [name]     # Scaffold a NestJS module
/generating-react-features [name]     # Scaffold a React feature
/generating-rn-features [name]        # Scaffold a React Native feature
/adding-api-endpoints [name]          # Add CRUD endpoints + query hooks
/adding-shared-schemas [name]         # Create Zod schema trio
/reviewing-react-code                 # Review React code
/reviewing-rn-code                    # Review React Native code
/reviewing-nestjs-code                # Review NestJS code
/writing-tests [what]                 # Write tests
/spec-driven-development [feature]    # Full spec-to-code workflow
```

## Spec-Driven Development

tstack ships with a full spec-to-code workflow. Instead of jumping straight into code, you start with a spec — and the AI builds from it.

```
/spec-driven-development payments
```

This triggers a structured pipeline:

```
1. REQUIREMENT    → AI asks clarifying questions, writes REQ-1 through REQ-N
                    with acceptance criteria, scope, and data model

2. DESIGN         → Technical design: API contracts, Zod schemas,
                    DB schema changes, frontend component tree

3. TASKS          → Phased implementation plan with checkboxes:
                    Phase 1: Shared schemas
                    Phase 2: Backend module
                    Phase 3: Frontend feature
                    Phase 4: Tests

4. IMPLEMENTATION → Agents execute tasks in order, following the design.
                    Backend agent builds the API.
                    Web agent builds the UI.
                    Mobile agent builds the screens.

5. REVIEW         → Code reviewer checks everything against conventions.
```

Everything lives in `specs/`:
```
specs/payments/
├── requirement/
│   ├── REQUIREMENT.md        # What to build and why
│   └── resources/            # Detailed acceptance criteria
├── design/
│   ├── DESIGN.md             # How to build it
│   └── resources/            # API contracts, data models
└── tasks/
    └── TASK.md               # Step-by-step implementation plan
```

The spec is the **single source of truth**. When requirements change, update the spec — not random Slack messages. When a new dev (or AI agent) picks up the feature, they read the spec first.

## Convention highlights

### 3-File Split (Web + Mobile)
Every feature follows the same pattern:
```
features/product-list/
├── product-list.hook.ts    # Business logic (ALL hooks here)
├── product-list.view.tsx   # Pure rendering (ZERO hooks)
├── product-list.tsx        # Glue: <View {...useHook()} />
└── index.ts
```

### Backend layers
```
Controller → Service → Repository → Mongoose
```
Never skip a layer. Every repository extends `BaseRepository` which auto-scopes by `orgId`.

### Shared package
```typescript
// Define once in packages/shared
export const createProductSchema = z.object({ name: z.string().min(1) });
export type CreateProductDto = z.infer<typeof createProductSchema>;

// Backend uses it
@Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto

// Frontend uses it
const form = useForm<CreateProductDto>({ resolver: zodResolver(createProductSchema) });
```

## Default roles

| Role | Level | Purpose |
|------|-------|---------|
| Superadmin | Platform | Full platform access |
| Admin | Organization | Full org access, manage members |
| Member | Organization | Basic org access |

## How to build on top

1. **Fork this repo**
2. **Update `CLAUDE.md`** — change project name, shared package name, tenant field
3. **Add your domain schemas** in `packages/shared/src/schemas/`
4. **Add permissions** in `packages/shared/src/constants/permissions.ts`
5. **Run `bun seed`** to sync new permissions
6. **Use slash commands** to scaffold modules and features
7. **Ship**

## Tech decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Bun over Node | Bun | Faster installs, native TS, no build step for dev |
| Biome over ESLint | Biome | Single tool for format + lint, 100x faster |
| Zod over class-validator | Zod | Shared between frontend and backend, type inference |
| TanStack Router | File-based | Type-safe routes, lazy loading, route guards |
| NativeWind | Tailwind for RN | Consistent styling across web and mobile |
| MongoDB over Postgres | Mongoose | Flexible schema, good for multi-tenant SaaS |
| JWT over sessions | Stateless | Works across web + mobile + API consumers |

## Contributing

tstack is in **early stage** — it's a working concept, not a polished product yet. Things will break, APIs will change, and conventions will evolve.

That said, contributions are welcome. Here's how:

**What helps most right now:**
- Try it. Fork it, build something on top, and report what breaks.
- Open issues for bugs, rough edges, or missing features.
- Improve the `.claude/` skills — better rules, examples, and patterns make the AI produce better code.

**Before submitting a PR:**
1. Follow the existing conventions (3-file split, BaseRepository, Zod schemas in shared)
2. Run `bun run type-check` and `bun run lint` — both must pass
3. Don't add features that belong in userland (domain-specific modules, custom themes, etc.)

**Not accepting right now:**
- Large architectural changes (let the foundation settle first)
- New frameworks or ORMs (NestJS + Mongoose + React is the stack)
- Expo migration (this is React Native CLI by design)

If you're unsure, open an issue first and let's talk.

## License

MIT

---

Built by [Narpat Singh](https://github.com/narpatsinghpurohit). Inspired by Laravel Jetstream.
