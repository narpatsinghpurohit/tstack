export const DEFAULT_ROLE_NAMES = {
	SUPERADMIN: "Superadmin",
	ADMIN: "Admin",
	MEMBER: "Member",
} as const;

export type DefaultRoleName =
	(typeof DEFAULT_ROLE_NAMES)[keyof typeof DEFAULT_ROLE_NAMES];

/**
 * Roles that can be assigned at the org (tenant) level.
 * Superadmin is platform-only, not assignable within an org.
 */
export const ORG_ASSIGNABLE_ROLE_NAMES = [
	DEFAULT_ROLE_NAMES.ADMIN,
	DEFAULT_ROLE_NAMES.MEMBER,
] as const;
