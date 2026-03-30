import { useDashboard } from "./dashboard.hook";
import { DashboardView } from "./dashboard.view";

export function Dashboard() {
	return <DashboardView {...useDashboard()} />;
}
