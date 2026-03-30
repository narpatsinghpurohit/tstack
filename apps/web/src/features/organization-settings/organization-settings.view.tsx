import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MemberList } from "./_components/member-list";
import type { OrganizationSettingsViewProps } from "./organization-settings.hook";

export function OrganizationSettingsView({
	register,
	errors,
	onSubmit,
	isPending,
	isLoading,
	canUpdateOrg,
	canViewMembers,
}: OrganizationSettingsViewProps) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading...</p>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Organization</h1>
				<p className="text-muted-foreground">
					Manage your organization settings and members
				</p>
			</div>

			{canUpdateOrg ? (
				<Card>
					<CardHeader>
						<CardTitle>Organization Details</CardTitle>
						<CardDescription>
							Update your organization information
						</CardDescription>
					</CardHeader>
					<form onSubmit={onSubmit}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Organization name</Label>
								<Input id="name" {...register("name")} />
								{errors.name ? (
									<p className="text-sm text-destructive">{errors.name.message}</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor="contactEmail">Contact email</Label>
								<Input
									id="contactEmail"
									type="email"
									{...register("contactEmail")}
								/>
								{errors.contactEmail ? (
									<p className="text-sm text-destructive">
										{errors.contactEmail.message}
									</p>
								) : null}
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="contactPhone">Contact phone</Label>
									<Input
										id="contactPhone"
										type="tel"
										{...register("contactPhone")}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="address">Address</Label>
									<Input id="address" {...register("address")} />
								</div>
							</div>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Saving..." : "Save changes"}
							</Button>
						</CardContent>
					</form>
				</Card>
			) : null}

			<Separator />

			{canViewMembers ? <MemberList /> : null}
		</div>
	);
}
