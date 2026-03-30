import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SignupViewProps } from "./signup.hook";

export function SignupView({ register, errors, onSubmit, isPending }: SignupViewProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Create an account</CardTitle>
						<CardDescription>Get started with your organization</CardDescription>
					</CardHeader>
					<form onSubmit={onSubmit}>
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
								disabled={isPending}
							>
								{isPending ? "Creating account..." : "Create account"}
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
			</div>
		</div>
	);
}
