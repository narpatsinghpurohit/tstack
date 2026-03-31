import { useParams } from "@tanstack/react-router";
import type { UserResponse } from "@tstack/shared";
import { toast } from "sonner";
import {
	useAdminUpdateUser,
	useAdminUser,
} from "@/features/superadmin/api/use-users";
import { extractErrorMessage } from "@/lib/api-errors";

export function useSuperadminUserDetail() {
	const { userId } = useParams({
		from: "/_authenticated/_superadmin/superadmin/users/$userId",
	});
	const { data: user, isLoading } = useAdminUser(userId);
	const updateUser = useAdminUpdateUser();

	const handleStatusChange = async (status: "active" | "inactive") => {
		try {
			await updateUser.mutateAsync({ id: userId, data: { status } });
			toast.success("User status updated");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return {
		user: user as UserResponse | undefined,
		isLoading,
		isUpdatePending: updateUser.isPending,
		onStatusChange: handleStatusChange,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminUserDetail>;
