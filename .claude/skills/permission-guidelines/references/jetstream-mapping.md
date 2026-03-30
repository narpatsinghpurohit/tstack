# Jetstream → tstack Mapping

| Jetstream (Laravel) | tstack (NestJS + MongoDB) |
|---------------------|--------------------------|
| Team | Organization |
| `teams` table | `organizations` collection |
| `teams.user_id` (owner) | `Organization.ownerId` |
| `teams.personal_team` | `Organization.isPersonal` |
| `team_user` pivot table | `memberships` collection |
| `team_user.role` (single string) | `Membership.roleNames[]` + `directPermissions` + `revokedPermissions` |
| `users.current_team_id` | `User.currentOrgId` |
| `team_invitations` table | `invitations` collection |
| `HasTeams::switchTeam()` | `POST /auth/select-org` |
| Roles defined in PHP code (`Jetstream::role()`) | Roles stored in DB (`roles` collection) with `permissionNames[]` |
| OwnerRole (wildcard `*`) | Superadmin role with all permissions |
| `HasTeamPermissions::hasTeamPermission()` | `@Can()` guard + JWT merged permissions |
| `Features::teams()` toggle | Multi-tenant always on |
| `belongsToTeam()` | `Membership` exists with `status: "active"` |
| Team creation (auto personal) | Org creation on signup (`isPersonal: true`) |
| `JetstreamServiceProvider::configurePermissions()` | `packages/shared/src/constants/permissions.ts` |
| `Authorization::define()` + policies | `@Can()` / `@CanAny()` decorators |
| `Authorizable::can()` (frontend via Inertia) | `useCan()` hook (React/RN) |

## Key Differences

1. **Roles in DB vs code**: Jetstream defines roles in PHP. tstack stores them in MongoDB — more flexible, can create custom roles at runtime.
2. **Permission overrides**: Jetstream has role-level permissions only. tstack adds `directPermissions` and `revokedPermissions` at both platform and org level for fine-grained overrides.
3. **Two-level merge**: Jetstream resolves per-team only. tstack merges platform-level + org-level into one JWT — supports platform admins who also belong to orgs.
4. **Three clients**: Jetstream serves one app (Blade/Inertia). tstack serves API + Web + Mobile from the same permission system.
