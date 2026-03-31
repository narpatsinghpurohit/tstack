import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert } from "react-native";
import { apiClient } from "@/lib/api-client";
import type { AuthStackParamList } from "@/navigation/types";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPassword>;

export function useForgotPassword() {
	const navigation =
		useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async () => {
		if (!email.trim()) {
			Alert.alert("Validation", "Email is required");
			return;
		}

		setIsLoading(true);
		try {
			await apiClient.post("/auth/forgot-password", {
				email: email.trim().toLowerCase(),
			});
			setIsSubmitted(true);
		} catch (error: unknown) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message ?? "Failed to send reset email. Please try again.";
			Alert.alert("Error", message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		email,
		isLoading,
		isSubmitted,
		onEmailChange: setEmail,
		onSubmit: handleSubmit,
		onGoToLogin: () => navigation.navigate("Login"),
	};
}
