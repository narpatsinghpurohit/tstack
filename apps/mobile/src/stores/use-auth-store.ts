import type { LoginResponse } from "@tstack/shared";
import { create } from "zustand";

interface AuthState {
	session: LoginResponse | null;
	isBootstrapping: boolean;
	setSession: (session: LoginResponse) => void;
	clearSession: () => void;
	setBootstrapping: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	session: null,
	isBootstrapping: true,
	setSession: (session) => set({ session }),
	clearSession: () => set({ session: null }),
	setBootstrapping: (value) => set({ isBootstrapping: value }),
}));
