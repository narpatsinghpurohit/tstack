import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	MemberResponse,
	PaginatedResponse,
	UpdateMemberDto,
} from "@tstack/shared";
import { apiClient } from "@/lib/api-client";

interface MemberListParams {
	page?: number;
	limit?: number;
	search?: string;
}

export const memberKeys = {
	all: ["members"] as const,
	list: (params: MemberListParams) =>
		[...memberKeys.all, "list", params] as const,
};

export function useMembers(params: MemberListParams = {}) {
	return useQuery({
		queryKey: memberKeys.list(params),
		queryFn: async () => {
			const r = await apiClient.get<{
				data: PaginatedResponse<MemberResponse>;
			}>("/members", { params });
			return r.data.data;
		},
	});
}

export function useUpdateMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateMemberDto }) => {
			const r = await apiClient.patch<{ data: MemberResponse }>(
				`/members/${id}`,
				data,
			);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: memberKeys.all });
		},
	});
}

export function useRemoveMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await apiClient.delete(`/members/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: memberKeys.all });
		},
	});
}
