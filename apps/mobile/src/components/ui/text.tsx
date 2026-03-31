import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text as RNText, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

const textVariants = cva("text-foreground text-base", {
	variants: {
		variant: {
			default: "",
			h1: "text-center text-4xl font-extrabold tracking-tight",
			h2: "border-border border-b pb-2 text-3xl font-semibold tracking-tight",
			h3: "text-2xl font-semibold tracking-tight",
			h4: "text-xl font-semibold tracking-tight",
			p: "mt-3 leading-7",
			lead: "text-muted-foreground text-xl",
			large: "text-lg font-semibold",
			small: "text-sm font-medium leading-none",
			muted: "text-muted-foreground text-sm",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
	className,
	variant = "default",
	...props
}: TextProps & VariantProps<typeof textVariants>) {
	const textClass = React.useContext(TextClassContext);
	return (
		<RNText
			className={cn(textVariants({ variant }), textClass, className)}
			{...props}
		/>
	);
}

export { Text, TextClassContext };
