import { ActivityIndicator, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import type { ForgotPasswordViewProps } from "./forgot-password.hook";

export function ForgotPasswordView({
	email,
	isLoading,
	isSubmitted,
	onEmailChange,
	onSubmit,
	onGoToLogin,
}: ForgotPasswordViewProps) {
	if (isSubmitted) {
		return (
			<SafeAreaView className="flex-1 bg-background justify-center px-6">
				<Text className="text-3xl font-bold text-center mb-2">
					Check your email
				</Text>
				<Text className="text-sm text-muted-foreground text-center mb-8">
					If an account exists for {email}, we sent a password reset link.
				</Text>
				<Pressable onPress={onGoToLogin} accessibilityLabel="Back to sign in">
					<Text className="text-sm text-primary font-medium text-center">
						Back to sign in
					</Text>
				</Pressable>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background">
			<KeyboardAwareScrollView
				bottomOffset={20}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					paddingHorizontal: 24,
				}}
			>
				<Text className="text-3xl font-bold text-center mb-2">
					Forgot password?
				</Text>
				<Text className="text-sm text-muted-foreground text-center mb-8">
					Enter your email and we'll send you a reset link
				</Text>

				<View className="gap-4">
					<View className="gap-1.5">
						<Label nativeID="email">Email</Label>
						<Input
							value={email}
							onChangeText={onEmailChange}
							placeholder="you@example.com"
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							aria-labelledby="email"
							accessibilityLabel="Email"
						/>
					</View>

					<Button
						onPress={onSubmit}
						disabled={isLoading}
						accessibilityLabel="Send reset link"
					>
						{isLoading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text>Send reset link</Text>
						)}
					</Button>
				</View>

				<Pressable
					onPress={onGoToLogin}
					accessibilityLabel="Back to sign in"
					className="mt-8"
				>
					<Text className="text-sm text-primary font-medium text-center">
						Back to sign in
					</Text>
				</Pressable>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}
