import { useSuperadminRoleList } from "./superadmin-role-list.hook";
import { SuperadminRoleListView } from "./superadmin-role-list.view";

export function SuperadminRoleList() {
	return <SuperadminRoleListView {...useSuperadminRoleList()} />;
}
