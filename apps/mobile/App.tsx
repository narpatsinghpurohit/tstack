import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, useColorScheme } from "react-native";
import { RootNavigator } from "./src/navigation/root.navigator";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: 1, staleTime: 5 * 60 * 1000 },
	},
});

function App() {
	const isDarkMode = useColorScheme() === "dark";

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<NavigationContainer>
					<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
					<RootNavigator />
				</NavigationContainer>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}

export default App;
