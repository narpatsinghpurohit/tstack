import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema } from "@tstack/shared";
import type { LoginRequestDto } from "@tstack/shared";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";

export function useLogin() {
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

	return {
		register,
		errors,
		onSubmit: handleSubmit((data) => mutation.mutate(data)),
		isPending: mutation.isPending,
	};
}

export type LoginViewProps = ReturnType<typeof useLogin>;
