import { useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/auth/lib/auth-api";
import { clearSession } from "@/features/auth/lib/session-storage";
import { useAuthStore } from "@/stores/use-auth-store";

export function UserProfileMenu() {
	const session = useAuthStore((s) => s.session);
	const clearStoreSession = useAuthStore((s) => s.clearSession);
	const navigate = useNavigate();

	if (!session) return null;

	const { user } = session;
	const initials =
		`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

	const handleLogout = async () => {
		await logout();
		clearSession();
		clearStoreSession();
		navigate({ to: "/login" });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent">
				<Avatar className="h-8 w-8">
					<AvatarFallback className="text-xs">{initials}</AvatarFallback>
				</Avatar>
				<span className="hidden text-sm font-medium md:inline-block">
					{user.firstName} {user.lastName}
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="top" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium">
								{user.firstName} {user.lastName}
							</p>
							<p className="text-xs text-muted-foreground">{user.email}</p>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => navigate({ to: "/settings/profile" })}
					>
						<User className="mr-2 h-4 w-4" />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => navigate({ to: "/settings/password" })}
					>
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
