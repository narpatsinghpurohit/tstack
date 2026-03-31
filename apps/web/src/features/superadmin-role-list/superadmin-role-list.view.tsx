import { Link } from "@tanstack/react-router";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ViewProps } from "./superadmin-role-list.hook";

export function SuperadminRoleListView({
	roles,
	roleCount,
	isLoading,
	isDeletePending,
	onDelete,
}: ViewProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Roles</h1>
					<p className="text-muted-foreground">
						Manage platform roles and permissions
					</p>
				</div>
				<Link to="/superadmin/roles/$roleId" params={{ roleId: "new" }}>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Create Role
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Roles</CardTitle>
					<CardDescription>{roleCount} roles</CardDescription>
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
								{roles.map((role) => (
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
												<Link
													to="/superadmin/roles/$roleId"
													params={{ roleId: role._id }}
												>
													<Button variant="ghost" size="icon">
														<Edit className="h-4 w-4" />
													</Button>
												</Link>
												{!role.isDefault ? (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => onDelete(role._id)}
														disabled={isDeletePending}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												) : null}
											</div>
										</TableCell>
									</TableRow>
								))}
								{!roles.length ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center text-muted-foreground"
										>
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
