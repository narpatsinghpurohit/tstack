import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { SignupRequestDto } from "@tstack/shared";
import { signupRequestSchema } from "@tstack/shared";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signup } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";

export function useSignup() {
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

	return {
		register,
		errors,
		onSubmit: handleSubmit((data) => mutation.mutate(data)),
		isPending: mutation.isPending,
	};
}

export type SignupViewProps = ReturnType<typeof useSignup>;
