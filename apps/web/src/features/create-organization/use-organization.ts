import { useMutation } from "@tanstack/react-query";
import type {
	CreateOrganizationDto,
	OrganizationResponse,
} from "@tstack/shared";
import { apiClient } from "@/lib/api-client";

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
