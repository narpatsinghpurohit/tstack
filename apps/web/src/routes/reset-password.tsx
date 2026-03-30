import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPassword } from "@/features/reset-password";

const searchSchema = z.object({
	token: z.string().catch(""),
	email: z.string().catch(""),
});

export const Route = createFileRoute("/reset-password")({
	validateSearch: searchSchema,
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	const { token, email } = Route.useSearch();
	return <ResetPassword token={token} email={email} />;
}
