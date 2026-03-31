import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/lib/session-storage";
import { SelectOrg } from "@/features/select-org";

export const Route = createFileRoute("/select-org")({
	beforeLoad: () => {
		const session = getSession();
		if (!session) {
			throw redirect({ to: "/login" });
		}
	},
	component: SelectOrg,
});
