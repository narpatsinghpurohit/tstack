import { zodResolver } from "@hookform/resolvers/zod";
import { signupRequestSchema } from "@tstack/shared";
import type { SignupRequestDto } from "@tstack/shared";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";

export function SignupForm() {
	const navigate = useNavigate();
	const setStoreSession = useAuthStore((s) => s.setSession);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupRequestDto>({
		resolver: zodResolver(signupRequestSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			orgName: "",
		},
	});

	const mutation = useMutation({
		mutationFn: signup,
		onSuccess: (data) => {
			const session = { user: data.user, tokens: data.tokens };
			setSession(session);
			setStoreSession(session);
			toast.success("Account created successfully");
			navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Create an account</CardTitle>
				<CardDescription>Get started with your organization</CardDescription>
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
							placeholder="you@example.com"
							{...register("email")}
						/>
						{errors.email ? (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						) : null}
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Min 8 characters"
							{...register("password")}
						/>
						{errors.password ? (
							<p className="text-sm text-destructive">{errors.password.message}</p>
						) : null}
					</div>
					<div className="space-y-2">
						<Label htmlFor="orgName">Organization name</Label>
						<Input
							id="orgName"
							placeholder="Acme Corp"
							{...register("orgName")}
						/>
						{errors.orgName ? (
							<p className="text-sm text-destructive">{errors.orgName.message}</p>
						) : null}
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Creating account..." : "Create account"}
					</Button>
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link to="/login" className="text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
