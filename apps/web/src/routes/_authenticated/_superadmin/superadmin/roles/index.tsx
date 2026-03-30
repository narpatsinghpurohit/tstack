import { createFileRoute } from "@tanstack/react-router";
import { SuperadminRoleList } from "@/features/superadmin-role-list";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/roles/",
)({
	component: SuperadminRoleList,
});
