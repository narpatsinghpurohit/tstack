import type { SessionUser } from "@tstack/shared";

const SESSION_KEY = "tstack_session";

interface StoredSession {
	user: SessionUser;
	tokens: {
		accessToken: string;
		refreshToken: string;
		accessTokenExpiresAt: string;
		refreshTokenExpiresAt: string;
	};
}

export function getSession(): StoredSession | null {
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as StoredSession;
	} catch {
		return null;
	}
}

export function setSession(session: StoredSession): void {
	localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
	localStorage.removeItem(SESSION_KEY);
}

export function updateTokens(tokens: StoredSession["tokens"]): void {
	const session = getSession();
	if (!session) return;
	session.tokens = tokens;
	setSession(session);
}

export function updateStoredUser(partial: Partial<SessionUser>): void {
	const session = getSession();
	if (!session) return;
	session.user = { ...session.user, ...partial };
	setSession(session);
}
