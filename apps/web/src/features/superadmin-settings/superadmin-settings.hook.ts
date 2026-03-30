import { useState } from "react";
import { toast } from "sonner";
import {
	useSystemSettings,
	useUpdateSystemSettings,
} from "@/features/superadmin/api/use-system-settings";
import { extractErrorMessage } from "@/lib/api-errors";

export function useSuperadminSettings() {
	const { data: settings, isLoading } = useSystemSettings();
	const updateSettings = useUpdateSystemSettings();
	const [edited, setEdited] = useState<Record<string, unknown>>({});

	const getValue = (key: string) => {
		if (key in edited) return edited[key];
		const setting = settings?.find((s) => s.key === key);
		return setting?.value ?? "";
	};

	const handleChange = (key: string, value: unknown) => {
		setEdited((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = async () => {
		const entries = Object.entries(edited).map(([key, value]) => ({
			key,
			value,
		}));
		if (entries.length === 0) return;

		try {
			await updateSettings.mutateAsync({ settings: entries });
			setEdited({});
			toast.success("Settings saved");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return {
		isLoading,
		platformName: String(getValue("platformName")),
		supportEmail: String(getValue("supportEmail")),
		allowSignup: Boolean(getValue("allowSignup")),
		maintenanceMode: Boolean(getValue("maintenanceMode")),
		hasEdits: Object.keys(edited).length > 0,
		isSaving: updateSettings.isPending,
		onChange: handleChange,
		onSave: handleSave,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminSettings>;
