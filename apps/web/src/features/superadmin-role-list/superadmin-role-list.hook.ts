import { toast } from "sonner";
import {
	useAdminDeleteRole,
	useAdminRoles,
} from "@/features/superadmin/api/use-roles";
import { extractErrorMessage } from "@/lib/api-errors";

export function useSuperadminRoleList() {
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

	return {
		roles: data?.data ?? [],
		roleCount: data?.data.length ?? 0,
		isLoading,
		isDeletePending: deleteRole.isPending,
		onDelete: handleDelete,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminRoleList>;
