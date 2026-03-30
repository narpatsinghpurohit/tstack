import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@tstack/shared";
import type { ChangePasswordDto } from "@tstack/shared";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { extractErrorMessage } from "@/lib/api-errors";

export const Route = createFileRoute("/_authenticated/settings/password")({
	component: PasswordPage,
});

function PasswordPage() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordDto>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: { currentPassword: "", newPassword: "" },
	});

	const mutation = useMutation({
		mutationFn: async (data: ChangePasswordDto) => {
			const r = await apiClient.patch("/users/password", data);
			return r.data.data;
		},
		onSuccess: () => {
			toast.success("Password changed successfully");
			reset();
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	return (
		<div className="max-w-2xl space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
				<p className="text-muted-foreground">
					Update your password to keep your account secure
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Password</CardTitle>
					<CardDescription>
						Enter your current password and choose a new one
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Current password</Label>
							<Input
								id="currentPassword"
								type="password"
								{...register("currentPassword")}
							/>
							{errors.currentPassword ? (
								<p className="text-sm text-destructive">
									{errors.currentPassword.message}
								</p>
							) : null}
						</div>
						<div className="space-y-2">
							<Label htmlFor="newPassword">New password</Label>
							<Input
								id="newPassword"
								type="password"
								placeholder="Min 8 characters"
								{...register("newPassword")}
							/>
							{errors.newPassword ? (
								<p className="text-sm text-destructive">
									{errors.newPassword.message}
								</p>
							) : null}
						</div>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? "Changing..." : "Change password"}
						</Button>
					</CardContent>
				</form>
			</Card>
		</div>
	);
}
