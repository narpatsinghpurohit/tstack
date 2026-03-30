import { useProfileSettings } from "./profile-settings.hook";
import { ProfileSettingsView } from "./profile-settings.view";

export function ProfileSettings() {
	return <ProfileSettingsView {...useProfileSettings()} />;
}
