import { useNavigate } from "@tanstack/react-router";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { selectOrg } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { useAuthStore } from "@/stores/use-auth-store";

export function OrgSwitcher() {
	const session = useAuthStore((s) => s.session);
	const setStoreSession = useAuthStore((s) => s.setSession);
	const navigate = useNavigate();

	if (!session) return null;

	const { user } = session;
	const currentOrg = user.memberships.find((m) => m.orgId === user.orgId);

	const handleSwitch = async (orgId: string) => {
		if (orgId === user.orgId) return;
		try {
			const result = await selectOrg({ orgId });
			const newSession = { user: result.user, tokens: result.tokens };
			setSession(newSession);
			setStoreSession(newSession);
			toast.success(`Switched to ${result.user.orgName}`);
			navigate({ to: "/dashboard" });
		} catch {
			toast.error("Failed to switch organization");
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg border p-2 hover:bg-accent">
				<Building2 className="h-4 w-4 shrink-0" />
				<span className="flex-1 truncate text-left text-sm font-medium">
					{currentOrg?.orgName ?? "Select Org"}
				</span>
				<ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuLabel>Organizations</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{user.memberships.map((membership) => (
					<DropdownMenuItem
						key={membership.orgId}
						onClick={() => handleSwitch(membership.orgId)}
						className={membership.orgId === user.orgId ? "bg-accent" : ""}
					>
						<Building2 className="mr-2 h-4 w-4" />
						{membership.orgName}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => navigate({ to: "/create-organization" })}
				>
					<Plus className="mr-2 h-4 w-4" />
					Create Organization
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
