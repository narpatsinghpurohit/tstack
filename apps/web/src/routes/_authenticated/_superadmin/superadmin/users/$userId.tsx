import { createFileRoute } from "@tanstack/react-router";
import { SuperadminUserDetail } from "@/features/superadmin-user-detail";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/users/$userId",
)({
	component: SuperadminUserDetail,
});
