import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { UpdateProfileDto } from "@tstack/shared";
import { updateProfileSchema } from "@tstack/shared";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateStoredUser } from "@/features/auth/lib/session-storage";
import { apiClient } from "@/lib/api-client";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";

export function useProfileSettings() {
	const session = useAuthStore((s) => s.session);
	const updateSessionUser = useAuthStore((s) => s.updateSessionUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateProfileDto>({
		resolver: zodResolver(updateProfileSchema),
		values: {
			firstName: session?.user.firstName ?? "",
			lastName: session?.user.lastName ?? "",
			phone: session?.user.phone ?? "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: UpdateProfileDto) => {
			const r = await apiClient.patch("/users/profile", data);
			return r.data.data;
		},
		onSuccess: (_data, variables) => {
			updateSessionUser(variables);
			updateStoredUser(variables);
			toast.success("Profile updated");
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
		email: session?.user.email ?? "",
	};
}

export type ProfileSettingsViewProps = ReturnType<typeof useProfileSettings>;
