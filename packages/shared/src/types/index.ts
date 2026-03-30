export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface AuthenticatedUser {
	sub: string;
	email: string;
	orgId: string | null;
	permissions: string[];
	tokenType: "access" | "refresh";
}
