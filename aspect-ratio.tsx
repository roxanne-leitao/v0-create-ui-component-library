import type React from "react"
import { cn } from "@/lib/utils"

// Aspect ratio component for maintaining proportional dimensions
interface AspectRatioProps {
  ratio: number
  children: React.ReactNode
  className?: string
}

export function AspectRatio({ ratio, children, className }: AspectRatioProps) {
  return (
    <div className={cn("relative w-full", className)} style={{ paddingBottom: `${100 / ratio}%` }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}
