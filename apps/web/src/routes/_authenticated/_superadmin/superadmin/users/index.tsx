import { createFileRoute } from "@tanstack/react-router";
import { SuperadminUserList } from "@/features/superadmin-user-list";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/users/",
)({
	component: SuperadminUserList,
});
