import { Text, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: TextProps & { nativeID?: string }) {
	return (
		<Text
			className={cn("text-sm font-medium text-foreground", className)}
			{...props}
		/>
	);
}

export { Label };
