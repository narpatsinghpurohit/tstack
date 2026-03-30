import { Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SelectOrgViewProps } from "./select-org.hook";

export function SelectOrgView({
	hasSession,
	memberships,
	currentOrgId,
	onSelect,
}: SelectOrgViewProps) {
	if (!hasSession) return null;

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Select Organization</CardTitle>
					<CardDescription>
						Choose an organization to continue
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					{memberships.map((membership) => (
						<Button
							key={membership.orgId}
							variant={membership.orgId === currentOrgId ? "default" : "outline"}
							className="w-full justify-start gap-3"
							onClick={() => onSelect(membership.orgId)}
						>
							<Building2 className="h-4 w-4" />
							<span className="flex-1 text-left">{membership.orgName}</span>
							{membership.orgId === currentOrgId ? (
								<Check className="h-4 w-4" />
							) : null}
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
