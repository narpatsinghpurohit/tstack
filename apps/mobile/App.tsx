import "./src/global.css";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar, useColorScheme } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/root.navigator";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: 1, staleTime: 5 * 60 * 1000 },
	},
});

function App() {
	const isDarkMode = useColorScheme() === "dark";

	return (
		<KeyboardProvider statusBarTranslucent navigationBarTranslucent>
			<SafeAreaProvider>
				<QueryClientProvider client={queryClient}>
					<NavigationContainer>
						<StatusBar
							barStyle={isDarkMode ? "light-content" : "dark-content"}
						/>
						<RootNavigator />
					</NavigationContainer>
				</QueryClientProvider>
			</SafeAreaProvider>
		</KeyboardProvider>
	);
}

export default App;
