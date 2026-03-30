import type { CreateUserDto, UpdateUserInfoDto, UpdateUserRolesDto, UserResponse } from "@tstack/shared";
import type { PaginatedResponse } from "@tstack/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface UserListParams {
	page?: number;
	limit?: number;
	search?: string;
}

export const adminUserKeys = {
	all: ["admin", "users"] as const,
	list: (params: UserListParams) => [...adminUserKeys.all, "list", params] as const,
	detail: (id: string) => [...adminUserKeys.all, "detail", id] as const,
};

export function useAdminUsers(params: UserListParams = {}) {
	return useQuery({
		queryKey: adminUserKeys.list(params),
		queryFn: async () => {
			const r = await apiClient.get<{ data: PaginatedResponse<UserResponse> }>("/admin/users", { params });
			return r.data.data;
		},
	});
}

export function useAdminUser(id: string) {
	return useQuery({
		queryKey: adminUserKeys.detail(id),
		queryFn: async () => {
			const r = await apiClient.get<{ data: UserResponse }>(`/admin/users/${id}`);
			return r.data.data;
		},
		enabled: !!id,
	});
}

export function useAdminCreateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateUserDto) => {
			const r = await apiClient.post<{ data: UserResponse }>("/admin/users", data);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
		},
	});
}

export function useAdminUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateUserInfoDto }) => {
			const r = await apiClient.patch<{ data: UserResponse }>(`/admin/users/${id}`, data);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
		},
	});
}

export function useAdminUpdateUserRoles() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateUserRolesDto }) => {
			const r = await apiClient.patch<{ data: UserResponse }>(`/admin/users/${id}/roles`, data);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
		},
	});
}
