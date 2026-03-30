import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/features/auth/lib/auth-api";
import { extractErrorMessage } from "@/lib/api-errors";

const formSchema = z
	.object({
		newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm({
	token,
	email,
}: {
	token: string;
	email: string;
}) {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { newPassword: "", confirmPassword: "" },
	});

	const mutation = useMutation({
		mutationFn: (data: FormValues) =>
			resetPassword({ email, token, newPassword: data.newPassword }),
		onSuccess: () => {
			toast.success("Password reset successfully");
			navigate({ to: "/login" });
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	if (!token || !email) {
		return (
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
		);
	}

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Reset password</CardTitle>
				<CardDescription>Enter your new password</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
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
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Resetting..." : "Reset password"}
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
