import type { PaginatedResponse, UserResponse } from "@tstack/shared";
import { useState } from "react";
import { useAdminUsers } from "@/features/superadmin/api/use-users";

export function useSuperadminUserList() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading } = useAdminUsers({ page, limit: 20, search });

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const handlePreviousPage = () => setPage((p) => p - 1);
	const handleNextPage = () => setPage((p) => p + 1);

	return {
		data: data as PaginatedResponse<UserResponse> | undefined,
		isLoading,
		page,
		search,
		onSearchChange: handleSearchChange,
		onPreviousPage: handlePreviousPage,
		onNextPage: handleNextPage,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminUserList>;
