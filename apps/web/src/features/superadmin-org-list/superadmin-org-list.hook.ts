import type { PaginatedResponse } from "@tstack/shared";
import type { OrganizationResponse } from "@tstack/shared";
import { useState } from "react";
import { useAdminOrganizations } from "@/features/superadmin/api/use-organizations";

export function useSuperadminOrgList() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading } = useAdminOrganizations({
		page,
		limit: 20,
		search,
	});

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const handlePreviousPage = () => setPage((p) => p - 1);
	const handleNextPage = () => setPage((p) => p + 1);

	return {
		data: data as PaginatedResponse<OrganizationResponse> | undefined,
		isLoading,
		page,
		search,
		onSearchChange: handleSearchChange,
		onPreviousPage: handlePreviousPage,
		onNextPage: handleNextPage,
	};
}

export type ViewProps = ReturnType<typeof useSuperadminOrgList>;
