import { createFileRoute } from "@tanstack/react-router";
import { SuperadminRoleEditor } from "@/features/superadmin-role-editor";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/roles/$roleId",
)({
	component: SuperadminRoleEditor,
});
