import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

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
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<ResetPasswordForm token={token} email={email} />
			</div>
		</div>
	);
}
