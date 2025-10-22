"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// Popover component for floating content
interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function Popover({ trigger, content, side = "bottom", className }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sideStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  }

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              "absolute z-50 w-72 rounded-md border bg-popover text-popover-foreground shadow-md outline-none transition-all duration-200",
              sideStyles[side],
              className,
            )}
          >
            {content}
          </div>
        </>
      )}
    </div>
  )
}
