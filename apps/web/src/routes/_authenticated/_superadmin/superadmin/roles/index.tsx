import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminDeleteRole, useAdminRoles } from "@/features/superadmin/api/use-roles";
import { extractErrorMessage } from "@/lib/api-errors";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/roles/",
)({
	component: RoleListPage,
});

function RoleListPage() {
	const { data, isLoading } = useAdminRoles();
	const deleteRole = useAdminDeleteRole();

	const handleDelete = async (id: string) => {
		try {
			await deleteRole.mutateAsync(id);
			toast.success("Role deleted");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Roles</h1>
					<p className="text-muted-foreground">
						Manage platform roles and permissions
					</p>
				</div>
				<Link to="/superadmin/roles/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Create Role
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Roles</CardTitle>
					<CardDescription>{data?.data.length ?? 0} roles</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<p className="text-sm text-muted-foreground">Loading...</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Permissions</TableHead>
									<TableHead>Default</TableHead>
									<TableHead className="w-[100px]" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.data.map((role) => (
									<TableRow key={role._id}>
										<TableCell className="font-medium">{role.name}</TableCell>
										<TableCell className="text-muted-foreground">
											{role.description || "-"}
										</TableCell>
										<TableCell>{role.permissionNames.length}</TableCell>
										<TableCell>
											{role.isDefault ? (
												<Badge variant="secondary">System</Badge>
											) : (
												<Badge variant="outline">Custom</Badge>
											)}
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Link to={`/superadmin/roles/${role._id}`}>
													<Button variant="ghost" size="icon">
														<Edit className="h-4 w-4" />
													</Button>
												</Link>
												{!role.isDefault ? (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(role._id)}
														disabled={deleteRole.isPending}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												) : null}
											</div>
										</TableCell>
									</TableRow>
								))}
								{!data?.data.length ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center text-muted-foreground">
											No roles found
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
