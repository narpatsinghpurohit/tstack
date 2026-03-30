import type { OrganizationResponse, UpdateOrganizationDto } from "@tstack/shared";
import type { PaginatedResponse } from "@tstack/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface OrgListParams {
	page?: number;
	limit?: number;
	search?: string;
}

export const adminOrgKeys = {
	all: ["admin", "organizations"] as const,
	list: (params: OrgListParams) => [...adminOrgKeys.all, "list", params] as const,
	detail: (id: string) => [...adminOrgKeys.all, "detail", id] as const,
};

export function useAdminOrganizations(params: OrgListParams = {}) {
	return useQuery({
		queryKey: adminOrgKeys.list(params),
		queryFn: async () => {
			const r = await apiClient.get<{ data: PaginatedResponse<OrganizationResponse> }>("/admin/organizations", { params });
			return r.data.data;
		},
	});
}

export function useAdminOrganization(id: string) {
	return useQuery({
		queryKey: adminOrgKeys.detail(id),
		queryFn: async () => {
			const r = await apiClient.get<{ data: OrganizationResponse }>(`/admin/organizations/${id}`);
			return r.data.data;
		},
		enabled: !!id,
	});
}

export function useAdminUpdateOrganization() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateOrganizationDto }) => {
			const r = await apiClient.patch<{ data: OrganizationResponse }>(`/admin/organizations/${id}`, data);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminOrgKeys.all });
		},
	});
}

export function useAdminUpdateOrgStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, status }: { id: string; status: string }) => {
			const r = await apiClient.patch<{ data: OrganizationResponse }>(`/admin/organizations/${id}/status`, { status });
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminOrgKeys.all });
		},
	});
}
