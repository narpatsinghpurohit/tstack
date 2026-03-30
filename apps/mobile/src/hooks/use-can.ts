import { useMemo } from "react";
import { can, cannot, canAny, canAll } from "@tstack/shared";
import { useAuthStore } from "../stores/use-auth-store";

export function useCan() {
	const permissions = useAuthStore((s) => s.session?.user.permissions ?? []);

	return useMemo(() => {
		const subject = { permissions };
		return {
			can: (permission: string) => can(subject, permission),
			cannot: (permission: string) => cannot(subject, permission),
			canAny: (perms: string[]) => canAny(subject, perms),
			canAll: (perms: string[]) => canAll(subject, perms),
		};
	}, [permissions]);
}
