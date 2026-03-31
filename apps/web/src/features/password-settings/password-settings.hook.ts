import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordDto } from "@tstack/shared";
import { changePasswordSchema } from "@tstack/shared";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { extractErrorMessage } from "@/lib/api-errors";

export function usePasswordSettings() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordDto>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: { currentPassword: "", newPassword: "" },
	});

	const mutation = useMutation({
		mutationFn: async (data: ChangePasswordDto) => {
			const r = await apiClient.patch("/users/password", data);
			return r.data.data;
		},
		onSuccess: () => {
			toast.success("Password changed successfully");
			reset();
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

export type PasswordSettingsViewProps = ReturnType<typeof usePasswordSettings>;
