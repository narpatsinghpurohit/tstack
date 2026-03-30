import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganizationSchema } from "@tstack/shared";
import type { CreateOrganizationDto } from "@tstack/shared";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { selectOrg } from "@/features/auth/lib/auth-api";
import { setSession } from "@/features/auth/lib/session-storage";
import { extractErrorMessage } from "@/lib/api-errors";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCreateOrganization } from "./use-organization";

export function useCreateOrganizationForm() {
	const navigate = useNavigate();
	const setStoreSession = useAuthStore((s) => s.setSession);
	const createOrg = useCreateOrganization();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateOrganizationDto>({
		resolver: zodResolver(createOrganizationSchema),
		defaultValues: {
			name: "",
			contactEmail: "",
			contactPhone: "",
			address: "",
		},
	});

	const onSubmit = async (data: CreateOrganizationDto) => {
		try {
			const org = await createOrg.mutateAsync(data);
			const result = await selectOrg({ orgId: org._id });
			const newSession = { user: result.user, tokens: result.tokens };
			setSession(newSession);
			setStoreSession(newSession);
			toast.success(`Organization "${org.name}" created`);
			navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return {
		register,
		errors,
		onSubmit: handleSubmit(onSubmit),
		isPending: createOrg.isPending,
	};
}

export type CreateOrganizationViewProps = ReturnType<typeof useCreateOrganizationForm>;
