import { zodResolver } from "@hookform/resolvers/zod";
import { ALL_PERMISSION_NAMES, createRoleSchema } from "@tstack/shared";
import type { CreateRoleDto } from "@tstack/shared";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	useAdminCreateRole,
	useAdminRole,
	useAdminUpdateRole,
} from "@/features/superadmin/api/use-roles";
import { extractErrorMessage } from "@/lib/api-errors";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/roles/$roleId",
)({
	component: RoleEditorPage,
});

function RoleEditorPage() {
	const { roleId } = Route.useParams();
	const isNew = roleId === "new";
	const navigate = useNavigate();

	const { data: role, isLoading } = useAdminRole(roleId);
	const createRole = useAdminCreateRole();
	const updateRole = useAdminUpdateRole();

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CreateRoleDto>({
		resolver: zodResolver(createRoleSchema),
		values: isNew
			? { name: "", description: "", permissionNames: [] }
			: {
					name: role?.name ?? "",
					description: role?.description ?? "",
					permissionNames: role?.permissionNames ?? [],
				},
	});

	const selectedPermissions = watch("permissionNames") ?? [];

	const togglePermission = (perm: string) => {
		const current = selectedPermissions;
		const next = current.includes(perm)
			? current.filter((p) => p !== perm)
			: [...current, perm];
		setValue("permissionNames", next, { shouldDirty: true });
	};

	const onSubmit = async (data: CreateRoleDto) => {
		try {
			if (isNew) {
				await createRole.mutateAsync(data);
				toast.success("Role created");
			} else {
				await updateRole.mutateAsync({ id: roleId, data });
				toast.success("Role updated");
			}
			navigate({ to: "/superadmin/roles" });
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	if (!isNew && isLoading) {
		return <p className="text-muted-foreground">Loading...</p>;
	}

	// Group permissions by prefix
	const grouped = ALL_PERMISSION_NAMES.reduce<Record<string, string[]>>(
		(acc, perm) => {
			const group = perm.split(".")[0];
			if (!acc[group]) acc[group] = [];
			acc[group].push(perm);
			return acc;
		},
		{},
	);

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
						{isNew ? "Create Role" : `Edit: ${role?.name}`}
					</h1>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Role Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								{...register("name")}
								disabled={role?.isDefault}
							/>
							{errors.name ? (
								<p className="text-sm text-destructive">{errors.name.message}</p>
							) : null}
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea id="description" {...register("description")} />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Permissions</CardTitle>
						<CardDescription>
							Select the permissions for this role ({selectedPermissions.length}{" "}
							selected)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{Object.entries(grouped).map(([group, perms]) => (
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
													checked={selectedPermissions.includes(perm)}
													onChange={() => togglePermission(perm)}
													className="rounded border-input"
												/>
												{perm.split(".")[1]}
											</label>
										))}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-2">
					<Button
						type="submit"
						disabled={createRole.isPending || updateRole.isPending}
					>
						{isNew
							? createRole.isPending
								? "Creating..."
								: "Create Role"
							: updateRole.isPending
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
