import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@tstack/shared";
import type { UpdateProfileDto } from "@tstack/shared";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStoredUser } from "@/features/auth/lib/session-storage";
import { apiClient } from "@/lib/api-client";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";

export const Route = createFileRoute("/_authenticated/settings/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const session = useAuthStore((s) => s.session);
	const updateSessionUser = useAuthStore((s) => s.updateSessionUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateProfileDto>({
		resolver: zodResolver(updateProfileSchema),
		values: {
			firstName: session?.user.firstName ?? "",
			lastName: session?.user.lastName ?? "",
			phone: session?.user.phone ?? "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: UpdateProfileDto) => {
			const r = await apiClient.patch("/users/profile", data);
			return r.data.data;
		},
		onSuccess: (_data, variables) => {
			updateSessionUser(variables);
			updateStoredUser(variables);
			toast.success("Profile updated");
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	return (
		<div className="max-w-2xl space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Profile</h1>
				<p className="text-muted-foreground">
					Manage your personal information
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your name and contact info</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First name</Label>
								<Input id="firstName" {...register("firstName")} />
								{errors.firstName ? (
									<p className="text-sm text-destructive">{errors.firstName.message}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last name</Label>
								<Input id="lastName" {...register("lastName")} />
								{errors.lastName ? (
									<p className="text-sm text-destructive">{errors.lastName.message}</p>
								) : null}
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={session?.user.email ?? ""}
								disabled
							/>
							<p className="text-xs text-muted-foreground">
								Email cannot be changed
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input
								id="phone"
								type="tel"
								placeholder="Optional"
								{...register("phone")}
							/>
						</div>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? "Saving..." : "Save changes"}
						</Button>
					</CardContent>
				</form>
			</Card>
		</div>
	);
}
