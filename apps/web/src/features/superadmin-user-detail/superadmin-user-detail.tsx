import { useSuperadminUserDetail } from "./superadmin-user-detail.hook";
import { SuperadminUserDetailView } from "./superadmin-user-detail.view";

export function SuperadminUserDetail() {
	return <SuperadminUserDetailView {...useSuperadminUserDetail()} />;
}
