import { ActivityIndicator, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import type { SignupViewProps } from "./signup.hook";

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
	onGoToLogin,
}: SignupViewProps) {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<KeyboardAwareScrollView
				bottomOffset={20}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}
			>
				<Text className="text-3xl font-bold text-center mb-2">
					Create account
				</Text>
				<Text className="text-sm text-muted-foreground text-center mb-8">
					Set up your organization and get started
				</Text>

				<View className="gap-4">
					<View className="gap-1.5">
						<Label nativeID="firstName">First name</Label>
						<Input
							value={firstName}
							onChangeText={onFirstNameChange}
							placeholder="John"
							autoCapitalize="words"
							aria-labelledby="firstName"
							accessibilityLabel="First name"
						/>
					</View>

					<View className="gap-1.5">
						<Label nativeID="lastName">Last name</Label>
						<Input
							value={lastName}
							onChangeText={onLastNameChange}
							placeholder="Doe"
							autoCapitalize="words"
							aria-labelledby="lastName"
							accessibilityLabel="Last name"
						/>
					</View>

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

					<View className="gap-1.5">
						<Label nativeID="orgName">Organization name</Label>
						<Input
							value={orgName}
							onChangeText={onOrgNameChange}
							placeholder="Acme Corp"
							autoCapitalize="words"
							aria-labelledby="orgName"
							accessibilityLabel="Organization name"
						/>
					</View>

					<Button
						onPress={onSignup}
						disabled={isLoading}
						accessibilityLabel="Create account"
						className="mt-2"
					>
						{isLoading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text>Create account</Text>
						)}
					</Button>
				</View>

				<View className="flex-row items-center justify-center mt-8 gap-1">
					<Text className="text-sm text-muted-foreground">
						Already have an account?
					</Text>
					<Pressable onPress={onGoToLogin} accessibilityLabel="Sign in">
						<Text className="text-sm text-primary font-medium">Sign in</Text>
					</Pressable>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}
