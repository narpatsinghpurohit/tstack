import { createFileRoute } from "@tanstack/react-router";
import { SuperadminOrgDetail } from "@/features/superadmin-org-detail";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/organizations/$orgId",
)({
	component: SuperadminOrgDetail,
});
