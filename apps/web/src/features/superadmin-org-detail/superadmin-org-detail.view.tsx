import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ViewProps } from "./superadmin-org-detail.hook";

export function SuperadminOrgDetailView({
	org,
	isLoading,
	isStatusPending,
	onStatusChange,
}: ViewProps) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading...</p>;
	}

	if (!org) {
		return <p className="text-muted-foreground">Organization not found</p>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link to="/superadmin/organizations">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
					<p className="text-muted-foreground">{org.slug}</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Details</CardTitle>
						<CardDescription>Organization information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								Contact Email
							</span>
							<span className="text-sm">{org.contactEmail}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">
								Contact Phone
							</span>
							<span className="text-sm">{org.contactPhone || "-"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Address</span>
							<span className="text-sm">{org.address || "-"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Personal</span>
							<Badge variant={org.isPersonal ? "secondary" : "outline"}>
								{org.isPersonal ? "Yes" : "No"}
							</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Members</span>
							<span className="text-sm">{org.memberCount ?? "-"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Created</span>
							<span className="text-sm">
								{new Date(org.createdAt).toLocaleDateString()}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Status</CardTitle>
						<CardDescription>Manage organization status</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<Badge
								variant={
									org.status === "active"
										? "default"
										: org.status === "suspended"
											? "destructive"
											: "secondary"
								}
							>
								{org.status}
							</Badge>
						</div>
						<div className="space-y-2">
							<select
								value={org.status}
								onChange={(e) => onStatusChange(e.target.value)}
								disabled={isStatusPending}
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
							>
								<option value="active">Active</option>
								<option value="suspended">Suspended</option>
								<option value="inactive">Inactive</option>
							</select>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
