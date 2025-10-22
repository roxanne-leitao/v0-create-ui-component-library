"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// Hover card component for contextual information on hover
interface HoverCardProps {
  trigger: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function HoverCard({ trigger, content, side = "bottom", className }: HoverCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  const sideStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {trigger}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 w-64 rounded-md border bg-popover text-popover-foreground shadow-md outline-none transition-all duration-200",
            sideStyles[side],
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
