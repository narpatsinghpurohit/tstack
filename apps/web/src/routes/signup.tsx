import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";
import { SignupForm } from "@/features/auth/components/signup-form";

export const Route = createFileRoute("/signup")({
	beforeLoad: () => {
		const session = getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SignupPage,
});

function SignupPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<SignupForm />
			</div>
		</div>
	);
}
