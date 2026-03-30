import { useDashboard } from "./dashboard.hook";
import { DashboardView } from "./dashboard.view";

export function DashboardScreen() {
	return <DashboardView {...useDashboard()} />;
}
