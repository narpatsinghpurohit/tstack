import { useState } from "react";
import { Alert } from "react-native";
import { apiClient } from "../../lib/api-client";
import { setStoredSession } from "../../lib/session-storage";
import { useAuthStore } from "../../stores/use-auth-store";
import type { LoginResponse, OrgMembership } from "@tstack/shared";

export type SelectOrgViewProps = ReturnType<typeof useSelectOrg>;

export function useSelectOrg() {
	const session = useAuthStore((s) => s.session);
	const setSession = useAuthStore((s) => s.setSession);
	const [isLoading, setIsLoading] = useState(false);

	const memberships = session?.user.memberships ?? [];

	const handleSelectOrg = async (orgId: string) => {
		setIsLoading(true);
		try {
			const { data } = await apiClient.post<{ data: LoginResponse }>("/auth/select-org", { orgId });
			const newSession = data.data;
			await setStoredSession(newSession);
			setSession(newSession);
		} catch (error: unknown) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				"Failed to switch organization.";
			Alert.alert("Error", message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		memberships,
		isLoading,
		onSelectOrg: handleSelectOrg,
	};
}
