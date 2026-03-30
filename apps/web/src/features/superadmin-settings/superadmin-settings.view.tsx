import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ViewProps } from "./superadmin-settings.hook";

export function SuperadminSettingsView({
	isLoading,
	platformName,
	supportEmail,
	allowSignup,
	maintenanceMode,
	hasEdits,
	isSaving,
	onChange,
	onSave,
}: ViewProps) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading...</p>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					System Settings
				</h1>
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
							value={platformName}
							onChange={(e) =>
								onChange("platformName", e.target.value)
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="supportEmail">Support Email</Label>
						<Input
							id="supportEmail"
							type="email"
							value={supportEmail}
							onChange={(e) =>
								onChange("supportEmail", e.target.value)
							}
						/>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="allowSignup"
							checked={allowSignup}
							onChange={(e) =>
								onChange("allowSignup", e.target.checked)
							}
							className="rounded border-input"
						/>
						<Label htmlFor="allowSignup">Allow public signup</Label>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="maintenanceMode"
							checked={maintenanceMode}
							onChange={(e) =>
								onChange("maintenanceMode", e.target.checked)
							}
							className="rounded border-input"
						/>
						<Label htmlFor="maintenanceMode">Maintenance mode</Label>
					</div>
					<Button
						onClick={onSave}
						disabled={!hasEdits || isSaving}
					>
						{isSaving ? "Saving..." : "Save Settings"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
