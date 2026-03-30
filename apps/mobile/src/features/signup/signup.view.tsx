import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SignupViewProps } from "./signup.hook";

function FormField({
	label,
	value,
	onChangeText,
	placeholder,
	secureTextEntry,
	keyboardType,
	autoCapitalize,
}: {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder: string;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address";
	autoCapitalize?: "none" | "words";
}) {
	return (
		<View style={{ marginBottom: 16 }}>
			<Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 6 }}>{label}</Text>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType ?? "default"}
				autoCapitalize={autoCapitalize ?? "none"}
				autoCorrect={false}
				accessibilityLabel={label}
				style={{
					borderWidth: 1,
					borderColor: "#d1d5db",
					borderRadius: 8,
					padding: 12,
					fontSize: 16,
				}}
			/>
		</View>
	);
}

export function SignupView({
	firstName,
	lastName,
	email,
	password,
	orgName,
	isLoading,
	onFirstNameChange,
	onLastNameChange,
	onEmailChange,
	onPasswordChange,
	onOrgNameChange,
	onSignup,
}: SignupViewProps) {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={{ justifyContent: "center", paddingHorizontal: 24, paddingVertical: 32 }}
					keyboardShouldPersistTaps="handled"
				>
					<Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>
						Create account
					</Text>
					<Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 32, textAlign: "center" }}>
						Set up your organization and get started
					</Text>

					<FormField label="First name" value={firstName} onChangeText={onFirstNameChange} placeholder="John" autoCapitalize="words" />
					<FormField label="Last name" value={lastName} onChangeText={onLastNameChange} placeholder="Doe" autoCapitalize="words" />
					<FormField label="Email" value={email} onChangeText={onEmailChange} placeholder="you@example.com" keyboardType="email-address" />
					<FormField label="Password" value={password} onChangeText={onPasswordChange} placeholder="••••••••" secureTextEntry />
					<FormField label="Organization name" value={orgName} onChangeText={onOrgNameChange} placeholder="Acme Corp" autoCapitalize="words" />

					<Pressable
						onPress={onSignup}
						disabled={isLoading}
						accessibilityLabel="Create account"
						accessibilityRole="button"
						style={{
							backgroundColor: isLoading ? "#9ca3af" : "#111827",
							paddingVertical: 14,
							borderRadius: 8,
							alignItems: "center",
							marginTop: 8,
						}}
					>
						{isLoading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Create account</Text>
						)}
					</Pressable>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
