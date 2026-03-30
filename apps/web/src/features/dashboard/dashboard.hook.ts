import { useAuthStore } from "@/stores/use-auth-store";

export function useDashboard() {
	const session = useAuthStore((s) => s.session);

	if (!session) {
		return {
			hasSession: false as const,
			firstName: "",
			orgName: "",
			membershipCount: 0,
			permissionCount: 0,
		};
	}

	const { user } = session;

	return {
		hasSession: true as const,
		firstName: user.firstName,
		orgName: user.orgName ?? "No org selected",
		membershipCount: user.memberships.length,
		permissionCount: user.permissions.length,
	};
}

export type DashboardViewProps = ReturnType<typeof useDashboard>;
