import { PERMISSIONS } from "@tstack/shared";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";
import { can } from "@tstack/shared";

export const Route = createFileRoute("/_authenticated/_superadmin")({
	beforeLoad: () => {
		const session = getSession();
		if (!session) throw redirect({ to: "/login" });

		const subject = { permissions: session.user.permissions };
		if (!can(subject, PERMISSIONS.ACCESS_SUPERADMIN_SURFACE)) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SuperadminLayout,
});

function SuperadminLayout() {
	return <Outlet />;
}
