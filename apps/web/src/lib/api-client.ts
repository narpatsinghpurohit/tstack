import axios from "axios";
import { clearSession, getSession, updateTokens } from "@/features/auth/lib/session-storage";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
	headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
	const session = getSession();
	if (session?.tokens.accessToken) {
		config.headers.Authorization = `Bearer ${session.tokens.accessToken}`;
	}
	return config;
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const original = error.config;

		if (error.response?.status !== 401 || original._retry) {
			return Promise.reject(error);
		}

		original._retry = true;

		const session = getSession();
		if (!session?.tokens.refreshToken) {
			clearSession();
			window.location.href = "/login";
			return Promise.reject(error);
		}

		if (!refreshPromise) {
			refreshPromise = axios
				.post<{ data: { accessToken: string; refreshToken: string; accessTokenExpiresAt: string; refreshTokenExpiresAt: string } }>(
					`${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/auth/refresh`,
					{ refreshToken: session.tokens.refreshToken },
				)
				.then((r) => {
					const tokens = r.data.data;
					updateTokens(tokens);
					return tokens.accessToken;
				})
				.catch(() => {
					clearSession();
					window.location.href = "/login";
					return "";
				})
				.finally(() => {
					refreshPromise = null;
				});
		}

		const newAccessToken = await refreshPromise;
		if (!newAccessToken) return Promise.reject(error);

		original.headers.Authorization = `Bearer ${newAccessToken}`;
		return apiClient(original);
	},
);

export { apiClient };
