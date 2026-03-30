import type { OrganizationResponse } from "@tstack/shared";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	useAdminOrganization,
	useAdminUpdateOrgStatus,
} from "@/features/superadmin/api/use-organizations";
import { extractErrorMessage } from "@/lib/api-errors";

export function useSuperadminOrgDetail() {
	const { orgId } = useParams({
		from: "/_authenticated/_superadmin/superadmin/organizations/$orgId",
	});
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

	return {
		org: org as OrganizationResponse | undefined,
		isLoading,
		isStatusPending: updateStatus.isPending,
		onStatusChange: handleStatusChange,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminOrgDetail>;
