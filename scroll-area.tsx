import type React from "react"
import { cn } from "@/lib/utils"

// Scroll area component for custom scrollable content
interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
}

export function ScrollArea({ children, className }: ScrollAreaProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  )
}
