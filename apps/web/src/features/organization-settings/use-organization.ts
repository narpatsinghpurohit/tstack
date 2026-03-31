import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateOrganizationDto,
	OrganizationResponse,
	UpdateOrganizationDto,
} from "@tstack/shared";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/use-auth-store";

export const organizationKeys = {
	all: ["organizations"] as const,
	current: () => [...organizationKeys.all, "current"] as const,
	detail: (id: string) => [...organizationKeys.all, "detail", id] as const,
};

export function useCurrentOrganization() {
	const orgId = useAuthStore((s) => s.session?.user.orgId);
	return useQuery({
		queryKey: organizationKeys.current(),
		queryFn: async () => {
			const r = await apiClient.get<{ data: OrganizationResponse }>(
				`/organizations/${orgId}`,
			);
			return r.data.data;
		},
		enabled: !!orgId,
	});
}

export function useUpdateOrganization() {
	const orgId = useAuthStore((s) => s.session?.user.orgId);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: UpdateOrganizationDto) => {
			const r = await apiClient.patch<{ data: OrganizationResponse }>(
				`/organizations/${orgId}`,
				data,
			);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: organizationKeys.current() });
		},
	});
}

export function useCreateOrganization() {
	return useMutation({
		mutationFn: async (data: CreateOrganizationDto) => {
			const r = await apiClient.post<{ data: OrganizationResponse }>(
				"/organizations",
				data,
			);
			return r.data.data;
		},
	});
}
