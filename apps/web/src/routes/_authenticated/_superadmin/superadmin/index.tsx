import { createFileRoute } from "@tanstack/react-router";
import { SuperadminDashboard } from "@/features/superadmin-dashboard";

export const Route = createFileRoute("/_authenticated/_superadmin/superadmin/")(
	{
		component: SuperadminDashboard,
	},
);
