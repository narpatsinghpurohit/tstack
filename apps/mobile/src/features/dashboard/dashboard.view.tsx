import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import type { DashboardViewProps } from "./dashboard.hook";

export function DashboardView({
	userName,
	orgName,
	email,
	onLogout,
}: DashboardViewProps) {
	return (
		<SafeAreaView className="flex-1 bg-background px-6">
			<View className="mt-8">
				<Text className="text-3xl font-bold">Dashboard</Text>
				<Text className="text-sm text-muted-foreground mt-1">
					Welcome back, {userName}
				</Text>
			</View>

			<Card className="mt-8">
				<CardContent className="p-4 gap-2">
					<Text className="text-base font-semibold mb-2">Your account</Text>
					<Text className="text-sm text-foreground">Name: {userName}</Text>
					<Text className="text-sm text-foreground">Email: {email}</Text>
					<Text className="text-sm text-foreground">
						Organization: {orgName}
					</Text>
				</CardContent>
			</Card>

			<Card className="mt-4">
				<CardContent className="p-4 gap-1">
					<Text className="text-base font-semibold">Ready to build</Text>
					<Text className="text-sm text-muted-foreground">
						This is your tstack starter kit. Add your domain features here.
					</Text>
				</CardContent>
			</Card>

			<Separator className="my-6" />

			<Button
				variant="outline"
				onPress={onLogout}
				accessibilityLabel="Sign out"
				className="border-destructive"
			>
				<Text className="text-destructive">Sign out</Text>
			</Button>
		</SafeAreaView>
	);
}
