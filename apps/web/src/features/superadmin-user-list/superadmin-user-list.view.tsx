import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ViewProps } from "./superadmin-user-list.hook";

export function SuperadminUserListView({
	data,
	isLoading,
	page,
	search,
	onSearchChange,
	onPreviousPage,
	onNextPage,
}: ViewProps) {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Users</h1>
				<p className="text-muted-foreground">Manage platform users</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>All Users</CardTitle>
							<CardDescription>
								{data?.total ?? 0} total users
							</CardDescription>
						</div>
						<Input
							placeholder="Search..."
							className="w-64"
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
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
										<TableHead>Email</TableHead>
										<TableHead>Roles</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="w-[70px]" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{data?.data.map((user) => (
										<TableRow key={user._id}>
											<TableCell className="font-medium">
												{user.firstName} {user.lastName}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{user.email}
											</TableCell>
											<TableCell>
												<div className="flex gap-1">
													{user.roleNames.map((role) => (
														<Badge key={role} variant="secondary">
															{role}
														</Badge>
													))}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant={
														user.status === "active"
															? "default"
															: "destructive"
													}
												>
													{user.status}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{new Date(user.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<Link to="/superadmin/users/$userId" params={{ userId: user._id }}>
													<Button variant="ghost" size="icon">
														<Eye className="h-4 w-4" />
													</Button>
												</Link>
											</TableCell>
										</TableRow>
									))}
									{!data?.data.length ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center text-muted-foreground"
											>
												No users found
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
										onClick={onPreviousPage}
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
										onClick={onNextPage}
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
