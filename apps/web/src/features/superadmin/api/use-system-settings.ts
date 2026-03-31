import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	SystemSettingResponse,
	UpdateSystemSettingsDto,
} from "@tstack/shared";
import { apiClient } from "@/lib/api-client";

export const systemSettingKeys = {
	all: ["admin", "system-settings"] as const,
};

export function useSystemSettings() {
	return useQuery({
		queryKey: systemSettingKeys.all,
		queryFn: async () => {
			const r = await apiClient.get<{ data: SystemSettingResponse[] }>(
				"/admin/system-settings",
			);
			return r.data.data;
		},
	});
}

export function useUpdateSystemSettings() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: UpdateSystemSettingsDto) => {
			const r = await apiClient.patch<{ data: SystemSettingResponse[] }>(
				"/admin/system-settings",
				data,
			);
			return r.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: systemSettingKeys.all });
		},
	});
}
