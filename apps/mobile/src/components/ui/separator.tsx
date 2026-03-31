import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

function Separator({
	className,
	orientation = "horizontal",
	...props
}: ViewProps & { orientation?: "horizontal" | "vertical" }) {
	return (
		<View
			className={cn(
				"bg-border shrink-0",
				orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
