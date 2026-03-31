import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashboardScreen } from "../features/dashboard";
import { SelectOrgScreen } from "../features/select-org";
import type { MainStackParamList } from "./types";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Dashboard" component={DashboardScreen} />
			<Stack.Screen name="SelectOrg" component={SelectOrgScreen} />
		</Stack.Navigator>
	);
}
