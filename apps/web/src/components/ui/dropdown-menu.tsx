import {
	type HTMLAttributes,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue>({
	open: false,
	setOpen: () => {},
});

export function DropdownMenu({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	return (
		<DropdownContext.Provider value={{ open, setOpen }}>
			<div className="relative">{children}</div>
		</DropdownContext.Provider>
	);
}

export function DropdownMenuTrigger({
	children,
	className,
	...props
}: HTMLAttributes<HTMLButtonElement>) {
	const { open, setOpen } = useContext(DropdownContext);
	return (
		<button
			type="button"
			className={className}
			onClick={() => setOpen(!open)}
			aria-expanded={open}
			{...props}
		>
			{children}
		</button>
	);
}

export function DropdownMenuContent({
	className,
	align = "end",
	children,
	...props
}: HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }) {
	const { open, setOpen } = useContext(DropdownContext);
	const ref = useRef<HTMLDivElement>(null);

	const handleClickOutside = useCallback(
		(e: MouseEvent) => {
			if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) {
				setOpen(false);
			}
		},
		[setOpen],
	);

	useEffect(() => {
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [open, handleClickOutside]);

	if (!open) return null;

	return (
		<div
			ref={ref}
			className={cn(
				"absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
				align === "end" ? "right-0" : "left-0",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function DropdownMenuItem({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	const { setOpen } = useContext(DropdownContext);
	return (
		<div
			className={cn(
				"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				className,
			)}
			onClick={(e) => {
				props.onClick?.(e);
				setOpen(false);
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					props.onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
					setOpen(false);
				}
			}}
			role="menuitem"
			tabIndex={0}
			{...props}
		/>
	);
}

export function DropdownMenuLabel({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("px-2 py-1.5 text-sm font-semibold", className)}
			{...props}
		/>
	);
}

export function DropdownMenuSeparator({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
	);
}
