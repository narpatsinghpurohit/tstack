import {
	type ComponentPropsWithoutRef,
	type HTMLAttributes,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue>({
	open: false,
	setOpen: () => {},
});

export function Dialog({
	open: controlledOpen,
	onOpenChange,
	children,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = useCallback(
		(v: boolean) => {
			if (!isControlled) setInternalOpen(v);
			onOpenChange?.(v);
		},
		[isControlled, onOpenChange],
	);

	return (
		<DialogContext.Provider value={{ open, setOpen }}>
			{children}
		</DialogContext.Provider>
	);
}

export function DialogTrigger({
	children,
	...props
}: ComponentPropsWithoutRef<"button">) {
	const { setOpen } = useContext(DialogContext);
	return (
		<button type="button" onClick={() => setOpen(true)} {...props}>
			{children}
		</button>
	);
}

export function DialogContent({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	const { open, setOpen } = useContext(DialogContext);
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 bg-black/80"
				onClick={() => setOpen(false)}
				onKeyDown={(e) => {
					if (e.key === "Escape") setOpen(false);
				}}
			/>
			<div
				className={cn(
					"relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg",
					className,
				)}
				{...props}
			>
				{children}
				<button
					type="button"
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					onClick={() => setOpen(false)}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>
			</div>
		</div>
	);
}

export function DialogHeader({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex flex-col space-y-1.5 text-center sm:text-left",
				className,
			)}
			{...props}
		/>
	);
}

export function DialogTitle({
	className,
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h2
			className={cn(
				"text-lg font-semibold leading-none tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

export function DialogDescription({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p className={cn("text-sm text-muted-foreground", className)} {...props} />
	);
}

export function DialogFooter({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
				className,
			)}
			{...props}
		/>
	);
}
