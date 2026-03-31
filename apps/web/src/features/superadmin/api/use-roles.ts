import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateRoleDto,
	PaginatedResponse,
	RoleResponse,
	UpdateRoleDto,
} from "@tstack/shared";
import { apiClient } from "@/lib/api-client";

interface RoleListParams {
	page?: number;
	limit?: number;
}

export const adminRoleKeys = {
	all: ["admin", "roles"] as const,
	list: (params: RoleListParams) =>
		[...adminRoleKeys.all, "list", params] as const,
	detail: (id: string) => [...adminRoleKeys.all, "detail", id] as const,
};

export function useAdminRoles(params: RoleListParams = {}) {
	return useQuery({
		queryKey: adminRoleKeys.list(params),
		queryFn: async () => {
			const r = await apiClient.get<{ data: PaginatedResponse<RoleResponse> }>(
				"/admin/roles",
				{ params },
			);
			return r.data.data;
		},
	});
}

export function useAdminRole(id: string) {
	return useQuery({
		queryKey: adminRoleKeys.detail(id),
		queryFn: async () => {
			const r = await apiClient.get<{ data: RoleResponse }>(
				`/admin/roles/${id}`,
			);
			return r.data.data;
		},
		enabled: !!id,
	});
}

export function useAdminCreateRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateRoleDto) => {
			const r = await apiClient.post<{ data: RoleResponse }>(
				"/admin/roles",
				data,
			);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminRoleKeys.all });
		},
	});
}

export function useAdminUpdateRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateRoleDto }) => {
			const r = await apiClient.patch<{ data: RoleResponse }>(
				`/admin/roles/${id}`,
				data,
			);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminRoleKeys.all });
		},
	});
}

export function useAdminDeleteRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await apiClient.delete(`/admin/roles/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminRoleKeys.all });
		},
	});
}
