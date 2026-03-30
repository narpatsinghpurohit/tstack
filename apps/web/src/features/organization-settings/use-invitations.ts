import type { CreateInvitationDto, InvitationResponse } from "@tstack/shared";
import type { PaginatedResponse } from "@tstack/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface InvitationListParams {
	page?: number;
	limit?: number;
}

export const invitationKeys = {
	all: ["invitations"] as const,
	list: (params: InvitationListParams) => [...invitationKeys.all, "list", params] as const,
};

export function useInvitations(params: InvitationListParams = {}) {
	return useQuery({
		queryKey: invitationKeys.list(params),
		queryFn: async () => {
			const r = await apiClient.get<{ data: PaginatedResponse<InvitationResponse> }>("/invitations", { params });
			return r.data.data;
		},
	});
}

export function useCreateInvitation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateInvitationDto) => {
			const r = await apiClient.post<{ data: InvitationResponse }>("/invitations", data);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: invitationKeys.all });
		},
	});
}

export function useDeleteInvitation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await apiClient.delete(`/invitations/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: invitationKeys.all });
		},
	});
}
