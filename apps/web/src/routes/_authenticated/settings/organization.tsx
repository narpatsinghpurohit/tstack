import { createFileRoute, redirect } from "@tanstack/react-router";
import { OrganizationSettings } from "@/features/organization-settings";
import { getSession } from "@/features/auth/lib/session-storage";

export const Route = createFileRoute("/_authenticated/settings/organization")({
	beforeLoad: () => {
		const session = getSession();
		if (!session) throw redirect({ to: "/login" });
	},
	component: OrganizationSettings,
});
