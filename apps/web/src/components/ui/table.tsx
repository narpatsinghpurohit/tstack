import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({
	className,
	...props
}: HTMLAttributes<HTMLTableElement>) {
	return (
		<div className="relative w-full overflow-auto">
			<table
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	);
}

export function TableHeader({
	className,
	...props
}: HTMLAttributes<HTMLTableSectionElement>) {
	return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({
	className,
	...props
}: HTMLAttributes<HTMLTableSectionElement>) {
	return (
		<tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
	);
}

export function TableRow({
	className,
	...props
}: HTMLAttributes<HTMLTableRowElement>) {
	return (
		<tr
			className={cn(
				"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

export function TableHead({
	className,
	...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th
			className={cn(
				"h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	);
}

export function TableCell({
	className,
	...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
	return (
		<td
			className={cn(
				"p-4 align-middle [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	);
}
