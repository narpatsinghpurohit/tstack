import type { AxiosError } from "axios";

interface ApiErrorResponse {
	statusCode: number;
	message: string | string[];
	error: string;
}

export function extractErrorMessage(error: unknown): string {
	const axiosError = error as AxiosError<ApiErrorResponse>;
	const data = axiosError.response?.data;
	if (!data) return "An unexpected error occurred";

	if (Array.isArray(data.message)) {
		return data.message[0] ?? "Validation error";
	}
	return data.message ?? "An unexpected error occurred";
}

export function extractFieldErrors(
	error: unknown,
): Record<string, string> | null {
	const axiosError = error as AxiosError<ApiErrorResponse>;
	const data = axiosError.response?.data;
	if (!data || !Array.isArray(data.message)) return null;

	const fieldErrors: Record<string, string> = {};
	for (const msg of data.message) {
		const match = msg.match(/^(\w+)\s*:\s*(.+)$/);
		if (match) {
			fieldErrors[match[1]] = match[2];
		}
	}
	return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}
