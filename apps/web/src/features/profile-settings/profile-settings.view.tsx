import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileSettingsViewProps } from "./profile-settings.hook";

export function ProfileSettingsView({
	register,
	errors,
	onSubmit,
	isPending,
	email,
}: ProfileSettingsViewProps) {
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
				<form onSubmit={onSubmit}>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First name</Label>
								<Input id="firstName" {...register("firstName")} />
								{errors.firstName ? (
									<p className="text-sm text-destructive">
										{errors.firstName.message}
									</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last name</Label>
								<Input id="lastName" {...register("lastName")} />
								{errors.lastName ? (
									<p className="text-sm text-destructive">
										{errors.lastName.message}
									</p>
								) : null}
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" value={email} disabled />
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
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save changes"}
						</Button>
					</CardContent>
				</form>
			</Card>
		</div>
	);
}
