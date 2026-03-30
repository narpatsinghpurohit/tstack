import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		const session = getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
		throw redirect({ to: "/login" });
	},
});
