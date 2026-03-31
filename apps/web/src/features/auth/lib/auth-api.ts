import type {
	ForgotPasswordRequestDto,
	LoginRequestDto,
	LoginResponse,
	ResetPasswordRequestDto,
	SelectOrgRequestDto,
	SessionUser,
	SignupRequestDto,
} from "@tstack/shared";
import { apiClient } from "@/lib/api-client";

export async function login(dto: LoginRequestDto): Promise<LoginResponse> {
	const r = await apiClient.post<{ data: LoginResponse }>("/auth/login", dto);
	return r.data.data;
}

export async function signup(dto: SignupRequestDto): Promise<LoginResponse> {
	const r = await apiClient.post<{ data: LoginResponse }>("/auth/signup", dto);
	return r.data.data;
}

export async function forgotPassword(
	dto: ForgotPasswordRequestDto,
): Promise<{ message: string }> {
	const r = await apiClient.post<{ data: { message: string } }>(
		"/auth/forgot-password",
		dto,
	);
	return r.data.data;
}

export async function resetPassword(
	dto: ResetPasswordRequestDto,
): Promise<{ message: string }> {
	const r = await apiClient.post<{ data: { message: string } }>(
		"/auth/reset-password",
		dto,
	);
	return r.data.data;
}

export async function refreshAccessToken(refreshToken: string) {
	const r = await apiClient.post<{ data: LoginResponse["tokens"] }>(
		"/auth/refresh",
		{ refreshToken },
	);
	return r.data.data;
}

export async function selectOrg(
	dto: SelectOrgRequestDto,
): Promise<LoginResponse> {
	const r = await apiClient.post<{ data: LoginResponse }>(
		"/auth/select-org",
		dto,
	);
	return r.data.data;
}

export async function getCurrentUser(): Promise<SessionUser> {
	const r = await apiClient.get<{ data: SessionUser }>("/auth/me");
	return r.data.data;
}

export async function logout(): Promise<void> {
	try {
		await apiClient.post("/auth/logout");
	} catch {
		// Swallow — we clear session regardless
	}
}
