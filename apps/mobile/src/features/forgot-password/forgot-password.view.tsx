import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ForgotPasswordViewProps } from "./forgot-password.hook";

export function ForgotPasswordView({
	email,
	isLoading,
	isSubmitted,
	onEmailChange,
	onSubmit,
}: ForgotPasswordViewProps) {
	if (isSubmitted) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", paddingHorizontal: 24 }}>
				<Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>
					Check your email
				</Text>
				<Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center" }}>
					If an account exists for {email}, we sent a password reset link.
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
			>
				<Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>
					Forgot password?
				</Text>
				<Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 32, textAlign: "center" }}>
					Enter your email and we'll send you a reset link
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
						marginBottom: 24,
						fontSize: 16,
					}}
				/>

				<Pressable
					onPress={onSubmit}
					disabled={isLoading}
					accessibilityLabel="Send reset link"
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
						<Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Send reset link</Text>
					)}
				</Pressable>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
