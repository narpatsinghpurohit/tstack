import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResetPasswordViewProps } from "./reset-password.hook";

export function ResetPasswordView({
	register,
	errors,
	onSubmit,
	isPending,
	isInvalidLink,
}: ResetPasswordViewProps) {
	if (isInvalidLink) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background p-4">
				<div className="w-full max-w-md">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-2xl">Invalid link</CardTitle>
							<CardDescription>
								This password reset link is invalid or expired.
							</CardDescription>
						</CardHeader>
						<CardFooter className="justify-center">
							<Link to="/login" className="text-sm text-primary hover:underline">
								Back to login
							</Link>
						</CardFooter>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Reset password</CardTitle>
						<CardDescription>Enter your new password</CardDescription>
					</CardHeader>
					<form onSubmit={onSubmit}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="newPassword">New password</Label>
								<Input
									id="newPassword"
									type="password"
									placeholder="Min 8 characters"
									{...register("newPassword")}
								/>
								{errors.newPassword ? (
									<p className="text-sm text-destructive">
										{errors.newPassword.message}
									</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm password</Label>
								<Input
									id="confirmPassword"
									type="password"
									{...register("confirmPassword")}
								/>
								{errors.confirmPassword ? (
									<p className="text-sm text-destructive">
										{errors.confirmPassword.message}
									</p>
								) : null}
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-4">
							<Button
								type="submit"
								className="w-full"
								disabled={isPending}
							>
								{isPending ? "Resetting..." : "Reset password"}
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
