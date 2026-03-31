import { Link } from "@tanstack/react-router";
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
import type { LoginViewProps } from "./login.hook";

export function LoginView({
	register,
	errors,
	onSubmit,
	isPending,
}: LoginViewProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Welcome back</CardTitle>
						<CardDescription>Sign in to your account</CardDescription>
					</CardHeader>
					<form onSubmit={onSubmit}>
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
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
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
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								) : null}
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-4">
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Signing in..." : "Sign in"}
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
			</div>
		</div>
	);
}
