import { createFileRoute, redirect } from "@tanstack/react-router";
import { Signup } from "@/features/signup";
import { getSession } from "@/features/auth/lib/session-storage";

export const Route = createFileRoute("/signup")({
	beforeLoad: () => {
		const session = getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: Signup,
});
