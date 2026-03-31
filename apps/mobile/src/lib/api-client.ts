import axios from "axios";
import {
	clearStoredSession,
	getStoredSession,
	updateStoredTokens,
} from "./session-storage";

const API_URL = "http://localhost:8000/api";

export const apiClient = axios.create({
	baseURL: API_URL,
	headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingRequests: Array<{
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
	for (const req of pendingRequests) {
		if (error) {
			req.reject(error);
		} else {
			req.resolve(token!);
		}
	}
	pendingRequests = [];
}

apiClient.interceptors.request.use(async (config) => {
	const session = await getStoredSession();
	if (session?.tokens.accessToken) {
		config.headers.Authorization = `Bearer ${session.tokens.accessToken}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status !== 401 ||
			originalRequest._retry ||
			originalRequest.url?.includes("/auth/refresh") ||
			originalRequest.url?.includes("/auth/login")
		) {
			return Promise.reject(error);
		}

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				pendingRequests.push({ resolve, reject });
			}).then((token) => {
				originalRequest.headers.Authorization = `Bearer ${token}`;
				return apiClient(originalRequest);
			});
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			const session = await getStoredSession();
			if (!session?.tokens.refreshToken) {
				throw new Error("No refresh token");
			}

			const { data } = await axios.post(`${API_URL}/auth/refresh`, {
				refreshToken: session.tokens.refreshToken,
			});

			const newTokens = data.data.tokens;
			await updateStoredTokens(newTokens);
			processQueue(null, newTokens.accessToken);

			originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
			return apiClient(originalRequest);
		} catch (refreshError) {
			processQueue(refreshError, null);
			await clearStoredSession();
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);
