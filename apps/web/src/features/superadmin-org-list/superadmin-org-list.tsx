import { useSuperadminOrgList } from "./superadmin-org-list.hook";
import { SuperadminOrgListView } from "./superadmin-org-list.view";

export function SuperadminOrgList() {
	return <SuperadminOrgListView {...useSuperadminOrgList()} />;
}
