import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SelectOrgViewProps } from "./select-org.hook";
import type { OrgMembership } from "@tstack/shared";

export function SelectOrgView({ memberships, isLoading, onSelectOrg }: SelectOrgViewProps) {
	const renderItem = ({ item }: { item: OrgMembership }) => (
		<Pressable
			onPress={() => onSelectOrg(item.orgId)}
			accessibilityLabel={`Select ${item.orgName}`}
			accessibilityRole="button"
			style={{
				padding: 16,
				borderWidth: 1,
				borderColor: "#e5e7eb",
				borderRadius: 8,
				marginBottom: 12,
			}}
		>
			<Text style={{ fontSize: 16, fontWeight: "600" }}>{item.orgName}</Text>
			<Text style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
				{item.roleNames.join(", ")}
			</Text>
		</Pressable>
	);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 24 }}>
			<Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 32, marginBottom: 8, textAlign: "center" }}>
				Select organization
			</Text>
			<Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 32, textAlign: "center" }}>
				Choose which organization to work in
			</Text>

			{isLoading ? (
				<ActivityIndicator size="large" style={{ marginTop: 32 }} />
			) : (
				<FlatList
					data={memberships}
					keyExtractor={(item) => item.orgId}
					renderItem={renderItem}
					ListEmptyComponent={
						<Text style={{ textAlign: "center", color: "#9ca3af", marginTop: 32 }}>
							No organizations found
						</Text>
					}
				/>
			)}
		</SafeAreaView>
	);
}
