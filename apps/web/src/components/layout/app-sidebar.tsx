import { Link, useLocation } from "@tanstack/react-router";
import { PERMISSIONS } from "@tstack/shared";
import {
	Building2,
	KeyRound,
	LayoutDashboard,
	Lock,
	Menu,
	Settings,
	Shield,
	User,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCan } from "@/features/auth/hooks/use-can";
import { cn } from "@/lib/utils";
import type { NavGroup, NavItem } from "./nav-config";
import { mainNav, superadminNav } from "./nav-config";
import { OrgSwitcher } from "./org-switcher";
import { UserProfileMenu } from "./user-profile-menu";

const iconMap: Record<string, React.ElementType> = {
	LayoutDashboard,
	User,
	Lock,
	Building2,
	Shield,
	Users,
	KeyRound,
	Settings,
};

function NavItemLink({ item, active }: { item: NavItem; active: boolean }) {
	const Icon = iconMap[item.icon] ?? LayoutDashboard;
	return (
		<Link
			to={item.href}
			className={cn(
				"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
				active
					? "bg-accent text-accent-foreground font-medium"
					: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
			)}
		>
			<Icon className="h-4 w-4" />
			{item.label}
		</Link>
	);
}

function NavGroupSection({ group }: { group: NavGroup }) {
	const location = useLocation();
	const { can } = useCan();

	const visibleItems = group.items.filter(
		(item) => !item.permission || can(item.permission),
	);

	if (visibleItems.length === 0) return null;

	return (
		<div className="px-3 py-2">
			<h4 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
				{group.title}
			</h4>
			<nav className="space-y-1">
				{visibleItems.map((item) => (
					<NavItemLink
						key={item.href}
						item={item}
						active={location.pathname === item.href}
					/>
				))}
			</nav>
		</div>
	);
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { can } = useCan();

	const isSuperadmin = can(PERMISSIONS.ACCESS_SUPERADMIN_SURFACE);

	const navGroups = [...mainNav, ...(isSuperadmin ? superadminNav : [])];

	const sidebarContent = (
		<div className="flex h-full flex-col">
			<div className="p-4">
				<OrgSwitcher />
			</div>
			<Separator />
			<div className="flex-1 overflow-y-auto py-2">
				{navGroups.map((group) => (
					<NavGroupSection key={group.title} group={group} />
				))}
			</div>
			<Separator />
			<div className="p-4">
				<UserProfileMenu />
			</div>
		</div>
	);

	return (
		<div className="flex h-screen">
			{/* Mobile overlay */}
			{sidebarOpen ? (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-black/80 lg:hidden cursor-default"
					onClick={() => setSidebarOpen(false)}
					aria-label="Close navigation"
				/>
			) : null}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 border-r bg-sidebar-background transition-transform lg:static lg:translate-x-0",
					sidebarOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				{sidebarContent}
			</aside>

			{/* Main content */}
			<div className="flex flex-1 flex-col overflow-hidden">
				<header className="flex h-14 items-center gap-4 border-b px-4 lg:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						{sidebarOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
					<span className="font-semibold">tstack</span>
				</header>
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}
