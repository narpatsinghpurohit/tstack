import type { LucideIcon } from "lucide-react";
import { Building2, KeyRound, Settings, Users } from "lucide-react";

interface DashboardSection {
	title: string;
	description: string;
	href: string;
	icon: LucideIcon;
}

const sections: DashboardSection[] = [
	{
		title: "Organizations",
		description: "Manage all organizations on the platform",
		href: "/superadmin/organizations",
		icon: Building2,
	},
	{
		title: "Users",
		description: "Manage platform users and their roles",
		href: "/superadmin/users",
		icon: Users,
	},
	{
		title: "Roles",
		description: "Configure roles and permissions",
		href: "/superadmin/roles",
		icon: KeyRound,
	},
	{
		title: "Settings",
		description: "System-wide configuration",
		href: "/superadmin/settings",
		icon: Settings,
	},
];

export function useSuperadminDashboard() {
	return {
		sections,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminDashboard>;
