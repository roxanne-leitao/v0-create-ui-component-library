import { cn } from "@/lib/utils"

// Separator component for visual content division
interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "shrink-0 bg-slate-200",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
    />
  )
}
