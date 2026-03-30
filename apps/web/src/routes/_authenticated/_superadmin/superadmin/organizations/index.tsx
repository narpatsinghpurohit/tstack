import { createFileRoute } from "@tanstack/react-router";
import { SuperadminOrgList } from "@/features/superadmin-org-list";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/organizations/",
)({
	component: SuperadminOrgList,
});
