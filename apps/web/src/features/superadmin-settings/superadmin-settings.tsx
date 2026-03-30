import { useSuperadminSettings } from "./superadmin-settings.hook";
import { SuperadminSettingsView } from "./superadmin-settings.view";

export function SuperadminSettings() {
	return <SuperadminSettingsView {...useSuperadminSettings()} />;
}
