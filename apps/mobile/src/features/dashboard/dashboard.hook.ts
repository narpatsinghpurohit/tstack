import { clearStoredSession } from "../../lib/session-storage";
import { useAuthStore } from "../../stores/use-auth-store";

export type DashboardViewProps = ReturnType<typeof useDashboard>;

export function useDashboard() {
	const session = useAuthStore((s) => s.session);
	const clearSession = useAuthStore((s) => s.clearSession);

	const handleLogout = async () => {
		await clearStoredSession();
		clearSession();
	};

	return {
		userName: session
			? `${session.user.firstName} ${session.user.lastName}`
			: "",
		orgName: session?.user.orgName ?? "No organization",
		email: session?.user.email ?? "",
		onLogout: handleLogout,
	};
}
