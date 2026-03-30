import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganizationSchema } from "@tstack/shared";
import type { CreateOrganizationDto } from "@tstack/shared";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectOrg } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { useCreateOrganization } from "@/features/org/api/use-organization";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";

export const Route = createFileRoute("/_authenticated/create-organization")({
	component: CreateOrganizationPage,
});

function CreateOrganizationPage() {
	const navigate = useNavigate();
	const setStoreSession = useAuthStore((s) => s.setSession);
	const createOrg = useCreateOrganization();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateOrganizationDto>({
		resolver: zodResolver(createOrganizationSchema),
		defaultValues: {
			name: "",
			contactEmail: "",
			contactPhone: "",
			address: "",
		},
	});

	const onSubmit = async (data: CreateOrganizationDto) => {
		try {
			const org = await createOrg.mutateAsync(data);
			// Switch to the new org
			const result = await selectOrg({ orgId: org._id });
			const newSession = { user: result.user, tokens: result.tokens };
			setSession(newSession);
			setStoreSession(newSession);
			toast.success(`Organization "${org.name}" created`);
			navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Create Organization
				</h1>
				<p className="text-muted-foreground">
					Set up a new organization
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Organization Details</CardTitle>
					<CardDescription>
						Provide the details for your new organization
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Organization name</Label>
							<Input id="name" placeholder="Acme Corp" {...register("name")} />
							{errors.name ? (
								<p className="text-sm text-destructive">{errors.name.message}</p>
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
						<Button type="submit" disabled={createOrg.isPending}>
							{createOrg.isPending ? "Creating..." : "Create Organization"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
