import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	useSystemSettings,
	useUpdateSystemSettings,
} from "@/features/superadmin/api/use-system-settings";
import { extractErrorMessage } from "@/lib/api-errors";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/settings",
)({
	component: SystemSettingsPage,
});

function SystemSettingsPage() {
	const { data: settings, isLoading } = useSystemSettings();
	const updateSettings = useUpdateSystemSettings();
	const [edited, setEdited] = useState<Record<string, unknown>>({});

	const getValue = (key: string) => {
		if (key in edited) return edited[key];
		const setting = settings?.find((s) => s.key === key);
		return setting?.value ?? "";
	};

	const setValue = (key: string, value: unknown) => {
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

	if (isLoading) {
		return <p className="text-muted-foreground">Loading...</p>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
				<p className="text-muted-foreground">
					Configure platform-wide settings
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Platform Settings</CardTitle>
					<CardDescription>
						These settings affect the entire platform
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="platformName">Platform Name</Label>
						<Input
							id="platformName"
							value={String(getValue("platformName"))}
							onChange={(e) => setValue("platformName", e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="supportEmail">Support Email</Label>
						<Input
							id="supportEmail"
							type="email"
							value={String(getValue("supportEmail"))}
							onChange={(e) => setValue("supportEmail", e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="allowSignup"
							checked={Boolean(getValue("allowSignup"))}
							onChange={(e) => setValue("allowSignup", e.target.checked)}
							className="rounded border-input"
						/>
						<Label htmlFor="allowSignup">Allow public signup</Label>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="maintenanceMode"
							checked={Boolean(getValue("maintenanceMode"))}
							onChange={(e) =>
								setValue("maintenanceMode", e.target.checked)
							}
							className="rounded border-input"
						/>
						<Label htmlFor="maintenanceMode">Maintenance mode</Label>
					</div>
					<Button
						onClick={handleSave}
						disabled={
							Object.keys(edited).length === 0 || updateSettings.isPending
						}
					>
						{updateSettings.isPending ? "Saving..." : "Save Settings"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
