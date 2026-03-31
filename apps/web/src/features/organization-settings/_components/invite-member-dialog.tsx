import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateInvitationDto } from "@tstack/shared";
import {
	createInvitationSchema,
	ORG_ASSIGNABLE_ROLE_NAMES,
} from "@tstack/shared";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { extractErrorMessage } from "@/lib/api-errors";
import { useCreateInvitation } from "../use-invitations";

export function InviteMemberDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateInvitationDto>({
		resolver: zodResolver(createInvitationSchema),
		defaultValues: { email: "", roleName: ORG_ASSIGNABLE_ROLE_NAMES[1] },
	});

	const createInvitation = useCreateInvitation();

	const onSubmit = async (data: CreateInvitationDto) => {
		try {
			await createInvitation.mutateAsync(data);
			toast.success("Invitation sent");
			reset();
			onOpenChange(false);
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite Member</DialogTitle>
					<DialogDescription>
						Send an invitation to join your organization
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="invite-email">Email</Label>
						<Input
							id="invite-email"
							type="email"
							placeholder="colleague@example.com"
							{...register("email")}
						/>
						{errors.email ? (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						) : null}
					</div>
					<div className="space-y-2">
						<Label htmlFor="invite-role">Role</Label>
						<Select id="invite-role" {...register("roleName")}>
							{ORG_ASSIGNABLE_ROLE_NAMES.map((role) => (
								<option key={role} value={role}>
									{role}
								</option>
							))}
						</Select>
						{errors.roleName ? (
							<p className="text-sm text-destructive">
								{errors.roleName.message}
							</p>
						) : null}
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={createInvitation.isPending}>
							{createInvitation.isPending ? "Sending..." : "Send Invitation"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
