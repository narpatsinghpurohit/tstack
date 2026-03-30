import { PERMISSIONS } from "@tstack/shared";

export interface NavItem {
	label: string;
	href: string;
	icon: string;
	permission?: string;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

export const mainNav: NavGroup[] = [
	{
		title: "Main",
		items: [
			{ label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
		],
	},
	{
		title: "Settings",
		items: [
			{ label: "Profile", href: "/settings/profile", icon: "User" },
			{ label: "Password", href: "/settings/password", icon: "Lock" },
			{
				label: "Organization",
				href: "/settings/organization",
				icon: "Building2",
				permission: PERMISSIONS.ACCESS_ORG_ADMIN_SURFACE,
			},
		],
	},
];

export const superadminNav: NavGroup[] = [
	{
		title: "Superadmin",
		items: [
			{ label: "Dashboard", href: "/superadmin", icon: "Shield" },
			{
				label: "Organizations",
				href: "/superadmin/organizations",
				icon: "Building2",
			},
			{ label: "Users", href: "/superadmin/users", icon: "Users" },
			{ label: "Roles", href: "/superadmin/roles", icon: "KeyRound" },
			{ label: "Settings", href: "/superadmin/settings", icon: "Settings" },
		],
	},
];
