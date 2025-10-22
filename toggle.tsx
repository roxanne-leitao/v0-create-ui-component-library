"use client"

import type React from "react"
import { cn } from "@/lib/utils"

// Toggle component for binary state switching
interface ToggleProps {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  children: React.ReactNode
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function Toggle({
  pressed,
  onPressedChange,
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}: ToggleProps) {
  const variants = {
    default: "bg-transparent",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
  }

  const sizes = {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5",
  }

  return (
    <button
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        pressed && "bg-accent text-accent-foreground",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
