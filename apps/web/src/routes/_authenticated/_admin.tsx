import { PERMISSIONS } from "@tstack/shared";
import { can } from "@tstack/shared";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";

export const Route = createFileRoute("/_authenticated/_admin")({
	beforeLoad: () => {
		const session = getSession();
		if (!session) throw redirect({ to: "/login" });

		const subject = { permissions: session.user.permissions };
		if (!can(subject, PERMISSIONS.ACCESS_ORG_ADMIN_SURFACE)) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: AdminLayout,
});

function AdminLayout() {
	return <Outlet />;
}
