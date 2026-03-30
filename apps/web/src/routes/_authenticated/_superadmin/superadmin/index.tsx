import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, KeyRound, Settings, Users } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/",
)({
	component: SuperadminDashboard,
});

const sections = [
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

function SuperadminDashboard() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Superadmin</h1>
				<p className="text-muted-foreground">
					Platform administration dashboard
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{sections.map((section) => (
					<Link key={section.href} to={section.href}>
						<Card className="transition-colors hover:bg-accent">
							<CardHeader>
								<div className="flex items-center gap-3">
									<section.icon className="h-5 w-5 text-muted-foreground" />
									<div>
										<CardTitle className="text-lg">{section.title}</CardTitle>
										<CardDescription>{section.description}</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
