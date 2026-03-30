import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema } from "@tstack/shared";
import type { LoginRequestDto } from "@tstack/shared";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";

export function LoginForm() {
	const navigate = useNavigate();
	const setStoreSession = useAuthStore((s) => s.setSession);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginRequestDto>({
		resolver: zodResolver(loginRequestSchema),
		defaultValues: { email: "", password: "" },
	});

	const mutation = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			const session = { user: data.user, tokens: data.tokens };
			setSession(session);
			setStoreSession(session);
			toast.success("Logged in successfully");

			if (data.user.memberships.length > 1 && !data.user.orgId) {
				navigate({ to: "/select-org" });
			} else {
				navigate({ to: "/dashboard" });
			}
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Welcome back</CardTitle>
				<CardDescription>Sign in to your account</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
				<CardContent className="space-y-4">
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
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
							<Link
								to="/forgot-password"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								Forgot password?
							</Link>
						</div>
						<Input
							id="password"
							type="password"
							{...register("password")}
						/>
						{errors.password ? (
							<p className="text-sm text-destructive">{errors.password.message}</p>
						) : null}
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Signing in..." : "Sign in"}
					</Button>
					<p className="text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link to="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
