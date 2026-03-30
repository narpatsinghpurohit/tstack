import { createFileRoute } from "@tanstack/react-router";
import { PasswordSettings } from "@/features/password-settings";

export const Route = createFileRoute("/_authenticated/settings/password")({
	component: PasswordSettings,
});
