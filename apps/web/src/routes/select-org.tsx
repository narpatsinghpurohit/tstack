import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Building2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { selectOrg } from "@/features/auth/lib/auth-api";
import { getSession, setSession } from "@/features/auth/lib/session-storage";
import { useAuthStore } from "@/stores/use-auth-store";

export const Route = createFileRoute("/select-org")({
	beforeLoad: () => {
		const session = getSession();
		if (!session) {
			throw redirect({ to: "/login" });
		}
	},
	component: SelectOrgPage,
});

function SelectOrgPage() {
	const session = useAuthStore((s) => s.session);
	const setStoreSession = useAuthStore((s) => s.setSession);
	const navigate = useNavigate();

	if (!session) return null;

	const { user } = session;

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

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Select Organization</CardTitle>
					<CardDescription>
						Choose an organization to continue
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					{user.memberships.map((membership) => (
						<Button
							key={membership.orgId}
							variant={membership.orgId === user.orgId ? "default" : "outline"}
							className="w-full justify-start gap-3"
							onClick={() => handleSelect(membership.orgId)}
						>
							<Building2 className="h-4 w-4" />
							<span className="flex-1 text-left">{membership.orgName}</span>
							{membership.orgId === user.orgId ? (
								<Check className="h-4 w-4" />
							) : null}
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
