import { createFileRoute } from "@tanstack/react-router";
import { ProfileSettings } from "@/features/profile-settings";

export const Route = createFileRoute("/_authenticated/settings/profile")({
	component: ProfileSettings,
});
