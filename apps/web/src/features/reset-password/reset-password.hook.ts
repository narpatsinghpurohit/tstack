import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { resetPassword } from "@/features/auth/lib/auth-api";
import { extractErrorMessage } from "@/lib/api-errors";

const formSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(128),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof formSchema>;

export function useResetPassword({
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

	const isInvalidLink = !token || !email;

	return {
		register,
		errors,
		onSubmit: handleSubmit((data) => mutation.mutate(data)),
		isPending: mutation.isPending,
		isInvalidLink,
	};
}

export type ResetPasswordViewProps = ReturnType<typeof useResetPassword>;
