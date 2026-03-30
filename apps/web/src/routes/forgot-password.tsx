import { createFileRoute } from "@tanstack/react-router";
import { ForgotPassword } from "@/features/forgot-password";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPassword,
});
