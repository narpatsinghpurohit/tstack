import type { SessionUser } from "@tstack/shared";
import { create } from "zustand";

interface Session {
	user: SessionUser;
	tokens: {
		accessToken: string;
		refreshToken: string;
		accessTokenExpiresAt: string;
		refreshTokenExpiresAt: string;
	};
}

interface AuthState {
	session: Session | null;
	setSession: (session: Session) => void;
	clearSession: () => void;
	updateSessionUser: (user: Partial<SessionUser>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	session: null,
	setSession: (session) => set({ session }),
	clearSession: () => set({ session: null }),
	updateSessionUser: (partial) =>
		set((state) => {
			if (!state.session) return state;
			return {
				session: {
					...state.session,
					user: { ...state.session.user, ...partial },
				},
			};
		}),
}));
