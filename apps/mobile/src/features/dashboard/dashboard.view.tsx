import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DashboardViewProps } from "./dashboard.hook";

export function DashboardView({
	userName,
	orgName,
	email,
	onLogout,
}: DashboardViewProps) {
	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 24 }}
		>
			<View style={{ marginTop: 32 }}>
				<Text style={{ fontSize: 28, fontWeight: "bold" }}>Dashboard</Text>
				<Text style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
					Welcome back, {userName}
				</Text>
			</View>

			<View
				style={{
					marginTop: 32,
					padding: 16,
					backgroundColor: "#f9fafb",
					borderRadius: 12,
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
					Your account
				</Text>
				<Text style={{ fontSize: 14, color: "#374151" }}>Name: {userName}</Text>
				<Text style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>
					Email: {email}
				</Text>
				<Text style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>
					Organization: {orgName}
				</Text>
			</View>

			<View
				style={{
					marginTop: 24,
					padding: 16,
					backgroundColor: "#f0fdf4",
					borderRadius: 12,
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
					Ready to build
				</Text>
				<Text style={{ fontSize: 14, color: "#374151" }}>
					This is your tstack starter kit. Add your domain features here.
				</Text>
			</View>

			<Pressable
				onPress={onLogout}
				accessibilityLabel="Sign out"
				accessibilityRole="button"
				style={{
					marginTop: 32,
					paddingVertical: 14,
					borderRadius: 8,
					borderWidth: 1,
					borderColor: "#ef4444",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "#ef4444", fontWeight: "600", fontSize: 16 }}>
					Sign out
				</Text>
			</Pressable>
		</SafeAreaView>
	);
}
