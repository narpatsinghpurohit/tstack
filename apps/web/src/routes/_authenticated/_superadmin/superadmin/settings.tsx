import { createFileRoute } from "@tanstack/react-router";
import { SuperadminSettings } from "@/features/superadmin-settings";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/settings",
)({
	component: SuperadminSettings,
});
