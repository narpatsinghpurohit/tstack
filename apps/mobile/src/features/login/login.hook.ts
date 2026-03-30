import { useState } from "react";
import { Alert } from "react-native";
import { apiClient } from "../../lib/api-client";
import { setStoredSession } from "../../lib/session-storage";
import { useAuthStore } from "../../stores/use-auth-store";
import type { LoginRequestDto, LoginResponse } from "@tstack/shared";

export type LoginViewProps = ReturnType<typeof useLogin>;

export function useLogin() {
	const setSession = useAuthStore((s) => s.setSession);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		if (!email.trim() || !password) {
			Alert.alert("Validation", "Email and password are required");
			return;
		}

		setIsLoading(true);
		try {
			const dto: LoginRequestDto = { email: email.trim().toLowerCase(), password };
			const { data } = await apiClient.post<{ data: LoginResponse }>("/auth/login", dto);
			const session = data.data;
			await setStoredSession(session);
			setSession(session);
		} catch (error: unknown) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				"Login failed. Please try again.";
			Alert.alert("Error", message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		email,
		password,
		isLoading,
		onEmailChange: setEmail,
		onPasswordChange: setPassword,
		onLogin: handleLogin,
	};
}
