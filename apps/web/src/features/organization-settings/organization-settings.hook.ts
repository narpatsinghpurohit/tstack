import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateOrganizationDto } from "@tstack/shared";
import { PERMISSIONS, updateOrganizationSchema } from "@tstack/shared";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCan } from "@/features/auth/hooks/use-can";
import { extractErrorMessage } from "@/lib/api-errors";
import {
	useCurrentOrganization,
	useUpdateOrganization,
} from "./use-organization";

export function useOrganizationSettings() {
	const { can } = useCan();
	const { data: org, isLoading } = useCurrentOrganization();
	const updateOrg = useUpdateOrganization();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateOrganizationDto>({
		resolver: zodResolver(updateOrganizationSchema),
		values: {
			name: org?.name ?? "",
			contactEmail: org?.contactEmail ?? "",
			contactPhone: org?.contactPhone ?? "",
			address: org?.address ?? "",
		},
	});

	const onSubmit = async (data: UpdateOrganizationDto) => {
		try {
			await updateOrg.mutateAsync(data);
			toast.success("Organization updated");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return {
		register,
		errors,
		onSubmit: handleSubmit(onSubmit),
		isPending: updateOrg.isPending,
		isLoading,
		canUpdateOrg: can(PERMISSIONS.ORGANIZATIONS_UPDATE),
		canViewMembers: can(PERMISSIONS.MEMBERS_VIEW),
	};
}

export type OrganizationSettingsViewProps = ReturnType<
	typeof useOrganizationSettings
>;
