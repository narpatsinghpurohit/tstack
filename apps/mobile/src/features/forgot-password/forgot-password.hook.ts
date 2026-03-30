import { useState } from "react";
import { Alert } from "react-native";
import { apiClient } from "../../lib/api-client";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPassword>;

export function useForgotPassword() {
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
			await apiClient.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
			setIsSubmitted(true);
		} catch (error: unknown) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				"Failed to send reset email. Please try again.";
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
	};
}
