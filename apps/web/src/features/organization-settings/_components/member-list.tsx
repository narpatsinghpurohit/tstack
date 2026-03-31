import { PERMISSIONS } from "@tstack/shared";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCan } from "@/features/auth/hooks/use-can";
import { extractErrorMessage } from "@/lib/api-errors";
import { useMembers, useRemoveMember } from "../use-members";
import { InviteMemberDialog } from "./invite-member-dialog";

export function MemberList() {
	const [inviteOpen, setInviteOpen] = useState(false);
	const { can } = useCan();
	const { data, isLoading } = useMembers();
	const removeMember = useRemoveMember();

	const handleRemove = async (id: string) => {
		try {
			await removeMember.mutateAsync(id);
			toast.success("Member removed");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Members</CardTitle>
						<CardDescription>Manage your organization members</CardDescription>
					</div>
					{can(PERMISSIONS.INVITATIONS_CREATE) ? (
						<Button onClick={() => setInviteOpen(true)} size="sm">
							<UserPlus className="mr-2 h-4 w-4" />
							Invite Member
						</Button>
					) : null}
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading members...</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Roles</TableHead>
								<TableHead>Status</TableHead>
								{can(PERMISSIONS.MEMBERS_DELETE) ? (
									<TableHead className="w-[70px]" />
								) : null}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.data.map((member) => (
								<TableRow key={member._id}>
									<TableCell className="font-medium">
										{member.firstName} {member.lastName}
									</TableCell>
									<TableCell>{member.email}</TableCell>
									<TableCell>
										<div className="flex gap-1">
											{member.roleNames.map((role) => (
												<Badge key={role} variant="secondary">
													{role}
												</Badge>
											))}
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												member.status === "active" ? "default" : "destructive"
											}
										>
											{member.status}
										</Badge>
									</TableCell>
									{can(PERMISSIONS.MEMBERS_DELETE) ? (
										<TableCell>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleRemove(member._id)}
												disabled={removeMember.isPending}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</TableCell>
									) : null}
								</TableRow>
							))}
							{!data?.data.length ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center text-muted-foreground"
									>
										No members found
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				)}
			</CardContent>
			<InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
		</Card>
	);
}
