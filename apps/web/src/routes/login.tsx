import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";
import { LoginForm } from "@/features/auth/components/login-form";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		const session = getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
