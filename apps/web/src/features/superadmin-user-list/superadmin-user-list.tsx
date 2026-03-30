import { useSuperadminUserList } from "./superadmin-user-list.hook";
import { SuperadminUserListView } from "./superadmin-user-list.view";

export function SuperadminUserList() {
	return <SuperadminUserListView {...useSuperadminUserList()} />;
}
