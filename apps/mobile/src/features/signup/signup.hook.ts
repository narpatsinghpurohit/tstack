import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { LoginResponse, SignupRequestDto } from "@tstack/shared";
import { useState } from "react";
import { Alert } from "react-native";
import { apiClient } from "@/lib/api-client";
import { setStoredSession } from "@/lib/session-storage";
import type { AuthStackParamList } from "@/navigation/types";
import { useAuthStore } from "@/stores/use-auth-store";

export type SignupViewProps = ReturnType<typeof useSignup>;

export function useSignup() {
	const navigation =
		useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
	const setSession = useAuthStore((s) => s.setSession);
	const [isLoading, setIsLoading] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [orgName, setOrgName] = useState("");

	const handleSignup = async () => {
		if (
			!firstName.trim() ||
			!lastName.trim() ||
			!email.trim() ||
			!password ||
			!orgName.trim()
		) {
			Alert.alert("Validation", "All fields are required");
			return;
		}

		setIsLoading(true);
		try {
			const dto: SignupRequestDto = {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim().toLowerCase(),
				password,
				orgName: orgName.trim(),
			};
			const { data } = await apiClient.post<{ data: LoginResponse }>(
				"/auth/signup",
				dto,
			);
			const session = data.data;
			await setStoredSession(session);
			setSession(session);
		} catch (error: unknown) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message ?? "Signup failed. Please try again.";
			Alert.alert("Error", message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		firstName,
		lastName,
		email,
		password,
		orgName,
		isLoading,
		onFirstNameChange: setFirstName,
		onLastNameChange: setLastName,
		onEmailChange: setEmail,
		onPasswordChange: setPassword,
		onOrgNameChange: setOrgName,
		onSignup: handleSignup,
		onGoToLogin: () => navigation.navigate("Login"),
	};
}
