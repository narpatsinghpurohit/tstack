import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/use-auth-store";
import { getStoredSession } from "../lib/session-storage";
import { AuthNavigator } from "./auth.navigator";
import { MainNavigator } from "./main.navigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
	const session = useAuthStore((s) => s.session);
	const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
	const setSession = useAuthStore((s) => s.setSession);
	const setBootstrapping = useAuthStore((s) => s.setBootstrapping);

	useEffect(() => {
		async function restoreSession() {
			const stored = await getStoredSession();
			if (stored) {
				setSession(stored);
			}
			setBootstrapping(false);
		}
		restoreSession();
	}, [setSession, setBootstrapping]);

	if (isBootstrapping) {
		return null;
	}

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{session ? (
				<Stack.Screen name="Main" component={MainNavigator} />
			) : (
				<Stack.Screen name="Auth" component={AuthNavigator} />
			)}
		</Stack.Navigator>
	);
}
