import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../features/login";
import { SignupScreen } from "../features/signup";
import { ForgotPasswordScreen } from "../features/forgot-password";
import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Signup" component={SignupScreen} />
			<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
		</Stack.Navigator>
	);
}
