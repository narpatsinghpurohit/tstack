import { usePasswordSettings } from "./password-settings.hook";
import { PasswordSettingsView } from "./password-settings.view";

export function PasswordSettings() {
	return <PasswordSettingsView {...usePasswordSettings()} />;
}
