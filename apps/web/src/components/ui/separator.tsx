import { cn } from "@/lib/utils";

export function Separator({
	className,
	orientation = "horizontal",
}: {
	className?: string;
	orientation?: "horizontal" | "vertical";
}) {
	return (
		<hr
			className={cn(
				"border-none",
				"shrink-0 bg-border",
				orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
				className,
			)}
		/>
	);
}
