import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";
import { Login } from "@/features/login";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		const session = getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: Login,
});
