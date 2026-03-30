import { createFileRoute, redirect } from "@tanstack/react-router";
import { Login } from "@/features/login";
import { getSession } from "@/features/auth/lib/session-storage";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		const session = getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: Login,
});
