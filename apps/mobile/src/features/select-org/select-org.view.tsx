import type { OrgMembership } from "@tstack/shared";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { SelectOrgViewProps } from "./select-org.hook";

export function SelectOrgView({
	memberships,
	isLoading,
	onSelectOrg,
}: SelectOrgViewProps) {
	const renderItem = ({ item }: { item: OrgMembership }) => (
		<Pressable
			onPress={() => onSelectOrg(item.orgId)}
			accessibilityLabel={`Select ${item.orgName}`}
			accessibilityRole="button"
		>
			<Card className="mb-3">
				<CardContent className="p-4">
					<Text className="text-base font-semibold">{item.orgName}</Text>
					<Text className="text-sm text-muted-foreground mt-1">
						{item.roleNames.join(", ")}
					</Text>
				</CardContent>
			</Card>
		</Pressable>
	);

	return (
		<SafeAreaView className="flex-1 bg-background px-6">
			<Text className="text-3xl font-bold text-center mt-8 mb-2">
				Select organization
			</Text>
			<Text className="text-sm text-muted-foreground text-center mb-8">
				Choose which organization to work in
			</Text>

			{isLoading ? (
				<ActivityIndicator size="large" className="mt-8" />
			) : (
				<FlatList
					data={memberships}
					keyExtractor={(item) => item.orgId}
					renderItem={renderItem}
					ListEmptyComponent={
						<View className="items-center mt-8">
							<Text className="text-muted-foreground">
								No organizations found
							</Text>
						</View>
					}
				/>
			)}
		</SafeAreaView>
	);
}
