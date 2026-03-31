import { Link } from "@tanstack/react-router";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ViewProps } from "./superadmin-dashboard.hook";

export function SuperadminDashboardView({ sections }: ViewProps) {
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
