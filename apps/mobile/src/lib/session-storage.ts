import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthTokens, LoginResponse } from "@tstack/shared";

const SESSION_KEY = "tstack_session";

export async function getStoredSession(): Promise<LoginResponse | null> {
	try {
		const raw = await AsyncStorage.getItem(SESSION_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as LoginResponse;
	} catch {
		return null;
	}
}

export async function setStoredSession(session: LoginResponse): Promise<void> {
	await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
	await AsyncStorage.removeItem(SESSION_KEY);
}

export async function updateStoredTokens(tokens: AuthTokens): Promise<void> {
	const session = await getStoredSession();
	if (!session) return;
	session.tokens = tokens;
	await setStoredSession(session);
}
