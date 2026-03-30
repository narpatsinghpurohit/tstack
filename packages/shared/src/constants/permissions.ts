/**
 * tstack permission constants.
 * Format: resource.action (dot notation)
 * Add new permissions here, then run `bun seed` to sync to database.
 */
export const PERMISSIONS = {
	// Access gates
	ACCESS_SUPERADMIN_SURFACE: "access.superadminSurface",
	ACCESS_ORG_ADMIN_SURFACE: "access.orgAdminSurface",

	// Organizations
	ORGANIZATIONS_CREATE: "organizations.create",
	ORGANIZATIONS_VIEW: "organizations.view",
	ORGANIZATIONS_UPDATE: "organizations.update",
	ORGANIZATIONS_DELETE: "organizations.delete",
	ORGANIZATIONS_MANAGE_STATUS: "organizations.manageStatus",

	// Members
	MEMBERS_CREATE: "members.create",
	MEMBERS_VIEW: "members.view",
	MEMBERS_UPDATE: "members.update",
	MEMBERS_DELETE: "members.delete",

	// Invitations
	INVITATIONS_CREATE: "invitations.create",
	INVITATIONS_VIEW: "invitations.view",
	INVITATIONS_DELETE: "invitations.delete",

	// Platform Users (superadmin)
	PLATFORM_USERS_CREATE: "platformUsers.create",
	PLATFORM_USERS_VIEW: "platformUsers.view",
	PLATFORM_USERS_UPDATE: "platformUsers.update",
	PLATFORM_USERS_DELETE: "platformUsers.delete",

	// Roles
	ROLES_CREATE: "roles.create",
	ROLES_VIEW: "roles.view",
	ROLES_UPDATE: "roles.update",
	ROLES_DELETE: "roles.delete",

	// System Settings
	SETTINGS_VIEW: "settings.view",
	SETTINGS_UPDATE: "settings.update",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSION_NAMES = Object.values(PERMISSIONS);

/**
 * Permission definitions with descriptions and groups.
 * Used by the seeder to populate the permissions collection.
 */
export interface PermissionDefinition {
	name: PermissionName;
	description: string;
	group: string;
}

function deriveGroup(name: string): string {
	const prefix = name.split(".")[0];
	return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] =
	ALL_PERMISSION_NAMES.map((name) => ({
		name,
		description: name,
		group: deriveGroup(name),
	}));
