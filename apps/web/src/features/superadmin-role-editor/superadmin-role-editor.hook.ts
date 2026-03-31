import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { CreateRoleDto } from "@tstack/shared";
import { ALL_PERMISSION_NAMES, createRoleSchema } from "@tstack/shared";
import type { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	useAdminCreateRole,
	useAdminRole,
	useAdminUpdateRole,
} from "@/features/superadmin/api/use-roles";
import { extractErrorMessage } from "@/lib/api-errors";

export function useSuperadminRoleEditor() {
	const { roleId } = useParams({
		from: "/_authenticated/_superadmin/superadmin/roles/$roleId",
	});
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

	const onSubmit = handleSubmit(async (data: CreateRoleDto) => {
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
	});

	// Group permissions by prefix
	const groupedPermissions = ALL_PERMISSION_NAMES.reduce<
		Record<string, string[]>
	>((acc, perm) => {
		const group = perm.split(".")[0];
		if (!acc[group]) acc[group] = [];
		acc[group].push(perm);
		return acc;
	}, {});

	return {
		isNew,
		isLoading: !isNew && isLoading,
		roleName: role?.name ?? "",
		isDefaultRole: role?.isDefault ?? false,
		nameRegister: register("name") as UseFormRegisterReturn<"name">,
		descriptionRegister: register(
			"description",
		) as UseFormRegisterReturn<"description">,
		errors: errors as FieldErrors<CreateRoleDto>,
		selectedPermissions,
		groupedPermissions,
		isSubmitting: createRole.isPending || updateRole.isPending,
		onSubmit,
		onTogglePermission: togglePermission,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminRoleEditor>;
