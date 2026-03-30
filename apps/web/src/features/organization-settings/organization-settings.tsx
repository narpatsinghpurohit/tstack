import { useOrganizationSettings } from "./organization-settings.hook";
import { OrganizationSettingsView } from "./organization-settings.view";

export function OrganizationSettings() {
	return <OrganizationSettingsView {...useOrganizationSettings()} />;
}
