import { createFileRoute, redirect } from "@tanstack/react-router";
import { SelectOrg } from "@/features/select-org";
import { getSession } from "@/features/auth/lib/session-storage";

export const Route = createFileRoute("/select-org")({
	beforeLoad: () => {
		const session = getSession();
		if (!session) {
			throw redirect({ to: "/login" });
		}
	},
	component: SelectOrg,
});
