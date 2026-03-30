import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
	useAdminOrganization,
	useAdminUpdateOrgStatus,
} from "@/features/superadmin/api/use-organizations";
import { extractErrorMessage } from "@/lib/api-errors";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/organizations/$orgId",
)({
	component: OrgDetailPage,
});

function OrgDetailPage() {
	const { orgId } = Route.useParams();
	const { data: org, isLoading } = useAdminOrganization(orgId);
	const updateStatus = useAdminUpdateOrgStatus();

	const handleStatusChange = async (status: string) => {
		try {
			await updateStatus.mutateAsync({ id: orgId, status });
			toast.success("Organization status updated");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

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
							<span className="text-sm text-muted-foreground">Contact Email</span>
							<span className="text-sm">{org.contactEmail}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Contact Phone</span>
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
							<Select
								value={org.status}
								onChange={(e) => handleStatusChange(e.target.value)}
								disabled={updateStatus.isPending}
							>
								<option value="active">Active</option>
								<option value="suspended">Suspended</option>
								<option value="inactive">Inactive</option>
							</Select>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
