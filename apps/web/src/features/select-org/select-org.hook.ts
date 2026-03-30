import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { selectOrg } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { useAuthStore } from "@/stores/use-auth-store";

export function useSelectOrg() {
	const session = useAuthStore((s) => s.session);
	const setStoreSession = useAuthStore((s) => s.setSession);
	const navigate = useNavigate();

	const handleSelect = async (orgId: string) => {
		try {
			const result = await selectOrg({ orgId });
			const newSession = { user: result.user, tokens: result.tokens };
			setSession(newSession);
			setStoreSession(newSession);
			toast.success(`Switched to ${result.user.orgName}`);
			navigate({ to: "/dashboard" });
		} catch {
			toast.error("Failed to select organization");
		}
	};

	if (!session) {
		return {
			hasSession: false as const,
			memberships: [] as Array<{ orgId: string; orgName: string }>,
			currentOrgId: undefined as string | undefined,
			onSelect: handleSelect,
		};
	}

	return {
		hasSession: true as const,
		memberships: session.user.memberships,
		currentOrgId: session.user.orgId,
		onSelect: handleSelect,
	};
}

export type SelectOrgViewProps = ReturnType<typeof useSelectOrg>;
