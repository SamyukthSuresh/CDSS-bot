import { cn } from "@/lib/utils";

export function ChatHeaderBlock({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={cn("gap-3 flex flex-1 items-center", className)}>
            {children}
        </div>
    )
}

export function ChatHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex py-4 px-6 glass-effect header-shadow rounded-b-2xl transition-all duration-300">
            {children}
        </div>
    )
}
