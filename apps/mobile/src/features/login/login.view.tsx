import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { LoginViewProps } from "./login.hook";

export function LoginView({
	email,
	password,
	isLoading,
	onEmailChange,
	onPasswordChange,
	onLogin,
}: LoginViewProps) {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
			>
				<Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>
					Welcome back
				</Text>
				<Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 32, textAlign: "center" }}>
					Sign in to your account
				</Text>

				<Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 6 }}>Email</Text>
				<TextInput
					value={email}
					onChangeText={onEmailChange}
					placeholder="you@example.com"
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					accessibilityLabel="Email"
					style={{
						borderWidth: 1,
						borderColor: "#d1d5db",
						borderRadius: 8,
						padding: 12,
						marginBottom: 16,
						fontSize: 16,
					}}
				/>

				<Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 6 }}>Password</Text>
				<TextInput
					value={password}
					onChangeText={onPasswordChange}
					placeholder="••••••••"
					secureTextEntry
					accessibilityLabel="Password"
					style={{
						borderWidth: 1,
						borderColor: "#d1d5db",
						borderRadius: 8,
						padding: 12,
						marginBottom: 24,
						fontSize: 16,
					}}
				/>

				<Pressable
					onPress={onLogin}
					disabled={isLoading}
					accessibilityLabel="Sign in"
					accessibilityRole="button"
					style={{
						backgroundColor: isLoading ? "#9ca3af" : "#111827",
						paddingVertical: 14,
						borderRadius: 8,
						alignItems: "center",
					}}
				>
					{isLoading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Sign in</Text>
					)}
				</Pressable>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
