import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordRequestSchema } from "@tstack/shared";
import type { ForgotPasswordRequestDto } from "@tstack/shared";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { forgotPassword } from "@/features/auth/lib/auth-api";
import { extractErrorMessage } from "@/lib/api-errors";

export function useForgotPassword() {
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

	return {
		register,
		errors,
		onSubmit: handleSubmit((data) => mutation.mutate(data)),
		isPending: mutation.isPending,
	};
}

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPassword>;
