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
import type { ForgotPasswordViewProps } from "./forgot-password.hook";

export function ForgotPasswordView({
	register,
	errors,
	onSubmit,
	isPending,
}: ForgotPasswordViewProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Forgot password</CardTitle>
						<CardDescription>
							Enter your email and we'll send a reset link
						</CardDescription>
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
						</CardContent>
						<CardFooter className="flex flex-col gap-4">
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Sending..." : "Send reset link"}
							</Button>
							<Link
								to="/login"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								Back to login
							</Link>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}
