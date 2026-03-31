import { HttpResponse } from "msw";

const BASE_URL = "http://localhost:8000";

export function apiUrl(path: string): string {
	return `${BASE_URL}${path}`;
}

export function jsonSuccess<T>(data: T, status = 200) {
	return HttpResponse.json({ data, status, message: "Success" }, { status });
}

export function jsonError(message: string, statusCode = 400) {
	return HttpResponse.json(
		{ statusCode, message, error: "Error" },
		{ status: statusCode },
	);
}
