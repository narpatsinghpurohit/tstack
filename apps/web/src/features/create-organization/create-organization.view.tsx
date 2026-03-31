import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateOrganizationViewProps } from "./create-organization.hook";

export function CreateOrganizationView({
	register,
	errors,
	onSubmit,
	isPending,
}: CreateOrganizationViewProps) {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Create Organization
				</h1>
				<p className="text-muted-foreground">Set up a new organization</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Organization Details</CardTitle>
					<CardDescription>
						Provide the details for your new organization
					</CardDescription>
				</CardHeader>
				<form onSubmit={onSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Organization name</Label>
							<Input id="name" placeholder="Acme Corp" {...register("name")} />
							{errors.name ? (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							) : null}
						</div>
						<div className="space-y-2">
							<Label htmlFor="contactEmail">Contact email</Label>
							<Input
								id="contactEmail"
								type="email"
								placeholder="admin@acme.com"
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
									placeholder="Optional"
									{...register("contactPhone")}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="address">Address</Label>
								<Input
									id="address"
									placeholder="Optional"
									{...register("address")}
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Creating..." : "Create Organization"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
