import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordRequestSchema } from "@tstack/shared";
import type { ForgotPasswordRequestDto } from "@tstack/shared";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/features/auth/lib/auth-api";
import { extractErrorMessage } from "@/lib/api-errors";

export function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordRequestDto>({
		resolver: zodResolver(forgotPasswordRequestSchema),
		defaultValues: { email: "" },
	});

	const mutation = useMutation({
		mutationFn: forgotPassword,
		onSuccess: () => {
			toast.success("If an account exists, a reset link has been sent");
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Forgot password</CardTitle>
				<CardDescription>
					Enter your email and we'll send a reset link
				</CardDescription>
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
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Sending..." : "Send reset link"}
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
	);
}
