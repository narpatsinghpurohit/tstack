import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getSession } from "@/features/auth/lib/session-storage";
import { useAuthStore } from "@/stores/use-auth-store";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: () => {
		const session = getSession();
		if (!session) {
			throw redirect({ to: "/login" });
		}
		return { session };
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { session } = Route.useRouteContext();
	const setStoreSession = useAuthStore((s) => s.setSession);
	const storeSession = useAuthStore((s) => s.session);

	useEffect(() => {
		if (!storeSession && session) {
			setStoreSession(session);
		}
	}, [session, storeSession, setStoreSession]);

	return (
		<AppSidebar>
			<Outlet />
		</AppSidebar>
	);
}
