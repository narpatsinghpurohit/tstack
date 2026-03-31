import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";
import { Signup } from "@/features/signup";

export const Route = createFileRoute("/signup")({
	beforeLoad: () => {
		const session = getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: Signup,
});
