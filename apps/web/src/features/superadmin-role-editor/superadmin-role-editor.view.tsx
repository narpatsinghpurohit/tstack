import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ViewProps } from "./superadmin-role-editor.hook";

export function SuperadminRoleEditorView({
	isNew,
	isLoading,
	roleName,
	isDefaultRole,
	nameRegister,
	descriptionRegister,
	errors,
	selectedPermissions,
	groupedPermissions,
	isSubmitting,
	onSubmit,
	onTogglePermission,
}: ViewProps) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading...</p>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link to="/superadmin/roles">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{isNew ? "Create Role" : `Edit: ${roleName}`}
					</h1>
				</div>
			</div>

			<form onSubmit={onSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Role Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								{...nameRegister}
								disabled={isDefaultRole}
							/>
							{errors.name ? (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							) : null}
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea id="description" {...descriptionRegister} />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Permissions</CardTitle>
						<CardDescription>
							Select the permissions for this role (
							{selectedPermissions.length} selected)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{Object.entries(groupedPermissions).map(
								([group, perms]) => (
									<div key={group}>
										<h4 className="mb-2 text-sm font-semibold capitalize">
											{group}
										</h4>
										<div className="grid grid-cols-2 gap-2 md:grid-cols-3">
											{perms.map((perm) => (
												<label
													key={perm}
													className="flex items-center gap-2 text-sm"
												>
													<input
														type="checkbox"
														checked={selectedPermissions.includes(
															perm,
														)}
														onChange={() =>
															onTogglePermission(perm)
														}
														className="rounded border-input"
													/>
													{perm.split(".")[1]}
												</label>
											))}
										</div>
									</div>
								),
							)}
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting}>
						{isNew
							? isSubmitting
								? "Creating..."
								: "Create Role"
							: isSubmitting
								? "Saving..."
								: "Save Changes"}
					</Button>
					<Link to="/superadmin/roles">
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</Link>
				</div>
			</form>
		</div>
	);
}
