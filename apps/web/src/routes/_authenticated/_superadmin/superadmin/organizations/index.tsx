import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminOrganizations } from "@/features/superadmin/api/use-organizations";

export const Route = createFileRoute(
	"/_authenticated/_superadmin/superadmin/organizations/",
)({
	component: OrganizationListPage,
});

function OrganizationListPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading } = useAdminOrganizations({ page, limit: 20, search });

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
				<p className="text-muted-foreground">
					Manage all platform organizations
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>All Organizations</CardTitle>
							<CardDescription>
								{data?.total ?? 0} total organizations
							</CardDescription>
						</div>
						<Input
							placeholder="Search..."
							className="w-64"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
						/>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<p className="text-sm text-muted-foreground">Loading...</p>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Slug</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Members</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="w-[70px]" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{data?.data.map((org) => (
										<TableRow key={org._id}>
											<TableCell className="font-medium">{org.name}</TableCell>
											<TableCell className="text-muted-foreground">{org.slug}</TableCell>
											<TableCell>
												<Badge
													variant={
														org.status === "active"
															? "default"
															: org.status === "suspended"
																? "destructive"
																: "secondary"
													}
												>
													{org.status}
												</Badge>
											</TableCell>
											<TableCell>{org.memberCount ?? "-"}</TableCell>
											<TableCell className="text-muted-foreground">
												{new Date(org.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<Link to={`/superadmin/organizations/${org._id}`}>
													<Button variant="ghost" size="icon">
														<Eye className="h-4 w-4" />
													</Button>
												</Link>
											</TableCell>
										</TableRow>
									))}
									{!data?.data.length ? (
										<TableRow>
											<TableCell colSpan={6} className="text-center text-muted-foreground">
												No organizations found
											</TableCell>
										</TableRow>
									) : null}
								</TableBody>
							</Table>
							{(data?.totalPages ?? 0) > 1 ? (
								<div className="mt-4 flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										disabled={page <= 1}
										onClick={() => setPage((p) => p - 1)}
									>
										Previous
									</Button>
									<span className="text-sm text-muted-foreground">
										Page {page} of {data?.totalPages}
									</span>
									<Button
										variant="outline"
										size="sm"
										disabled={page >= (data?.totalPages ?? 1)}
										onClick={() => setPage((p) => p + 1)}
									>
										Next
									</Button>
								</div>
							) : null}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
