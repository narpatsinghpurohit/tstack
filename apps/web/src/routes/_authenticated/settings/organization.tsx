import { zodResolver } from "@hookform/resolvers/zod";
import { PERMISSIONS, updateOrganizationSchema } from "@tstack/shared";
import type { UpdateOrganizationDto } from "@tstack/shared";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCan } from "@/features/auth/hooks/use-can";
import { getSession } from "@/features/auth/lib/session-storage";
import { useCurrentOrganization, useUpdateOrganization } from "@/features/org/api/use-organization";
import { MemberList } from "@/features/org/components/member-list";
import { extractErrorMessage } from "@/lib/api-errors";

export const Route = createFileRoute(
	"/_authenticated/settings/organization",
)({
	beforeLoad: () => {
		const session = getSession();
		if (!session) throw redirect({ to: "/login" });
	},
	component: OrganizationPage,
});

function OrganizationPage() {
	const { can } = useCan();
	const { data: org, isLoading } = useCurrentOrganization();
	const updateOrg = useUpdateOrganization();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateOrganizationDto>({
		resolver: zodResolver(updateOrganizationSchema),
		values: {
			name: org?.name ?? "",
			contactEmail: org?.contactEmail ?? "",
			contactPhone: org?.contactPhone ?? "",
			address: org?.address ?? "",
		},
	});

	const onSubmit = async (data: UpdateOrganizationDto) => {
		try {
			await updateOrg.mutateAsync(data);
			toast.success("Organization updated");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

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

			{can(PERMISSIONS.ORGANIZATIONS_UPDATE) ? (
				<Card>
					<CardHeader>
						<CardTitle>Organization Details</CardTitle>
						<CardDescription>
							Update your organization information
						</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
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
							<Button type="submit" disabled={updateOrg.isPending}>
								{updateOrg.isPending ? "Saving..." : "Save changes"}
							</Button>
						</CardContent>
					</form>
				</Card>
			) : null}

			<Separator />

			{can(PERMISSIONS.MEMBERS_VIEW) ? <MemberList /> : null}
		</div>
	);
}
