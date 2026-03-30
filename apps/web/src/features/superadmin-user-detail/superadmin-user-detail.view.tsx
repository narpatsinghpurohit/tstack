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
import { Select } from "@/components/ui/select";
import type { ViewProps } from "./superadmin-user-detail.hook";

export function SuperadminUserDetailView({
	user,
	isLoading,
	isUpdatePending,
	onStatusChange,
}: ViewProps) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading...</p>;
	}

	if (!user) {
		return <p className="text-muted-foreground">User not found</p>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link to="/superadmin/users">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{user.firstName} {user.lastName}
					</h1>
					<p className="text-muted-foreground">{user.email}</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>User Details</CardTitle>
						<CardDescription>User information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Email</span>
							<span className="text-sm">{user.email}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Phone</span>
							<span className="text-sm">{user.phone || "-"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Status</span>
							<Badge
								variant={
									user.status === "active" ? "default" : "destructive"
								}
							>
								{user.status}
							</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Created</span>
							<span className="text-sm">
								{new Date(user.createdAt).toLocaleDateString()}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Roles & Status</CardTitle>
						<CardDescription>
							Manage user roles and status
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="mb-2 text-sm font-medium">Platform Roles</p>
							<div className="flex flex-wrap gap-1">
								{user.roleNames.length > 0 ? (
									user.roleNames.map((role) => (
										<Badge key={role} variant="secondary">
											{role}
										</Badge>
									))
								) : (
									<span className="text-sm text-muted-foreground">
										No roles assigned
									</span>
								)}
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Status</p>
							<Select
								value={user.status}
								onChange={(e) =>
									onStatusChange(
										e.target.value as "active" | "inactive",
									)
								}
								disabled={isUpdatePending}
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</Select>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
