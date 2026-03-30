import { useSuperadminDashboard } from "./superadmin-dashboard.hook";
import { SuperadminDashboardView } from "./superadmin-dashboard.view";

export function SuperadminDashboard() {
	return <SuperadminDashboardView {...useSuperadminDashboard()} />;
}
