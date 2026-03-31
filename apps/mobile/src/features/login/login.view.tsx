import { ActivityIndicator, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import type { LoginViewProps } from "./login.hook";

export function LoginView({
	email,
	password,
	isLoading,
	onEmailChange,
	onPasswordChange,
	onLogin,
	onGoToSignup,
	onGoToForgotPassword,
}: LoginViewProps) {
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
					Welcome back
				</Text>
				<Text className="text-sm text-muted-foreground text-center mb-8">
					Sign in to your account
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

					<View className="gap-1.5">
						<Label nativeID="password">Password</Label>
						<Input
							value={password}
							onChangeText={onPasswordChange}
							placeholder="••••••••"
							secureTextEntry
							aria-labelledby="password"
							accessibilityLabel="Password"
						/>
					</View>

					<Pressable
						onPress={onGoToForgotPassword}
						accessibilityLabel="Forgot password"
					>
						<Text className="text-sm text-primary text-right">
							Forgot password?
						</Text>
					</Pressable>

					<Button
						onPress={onLogin}
						disabled={isLoading}
						accessibilityLabel="Sign in"
					>
						{isLoading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text>Sign in</Text>
						)}
					</Button>
				</View>

				<View className="flex-row items-center justify-center mt-8 gap-1">
					<Text className="text-sm text-muted-foreground">
						Don't have an account?
					</Text>
					<Pressable onPress={onGoToSignup} accessibilityLabel="Sign up">
						<Text className="text-sm text-primary font-medium">Sign up</Text>
					</Pressable>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}
