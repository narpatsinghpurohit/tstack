import { useSuperadminOrgDetail } from "./superadmin-org-detail.hook";
import { SuperadminOrgDetailView } from "./superadmin-org-detail.view";

export function SuperadminOrgDetail() {
	return <SuperadminOrgDetailView {...useSuperadminOrgDetail()} />;
}
