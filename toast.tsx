"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// Toast component for temporary notifications
interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  className?: string
  onClose?: () => void
}

export function Toast({ title, description, action, variant = "default", className, onClose }: ToastProps) {
  const variants = {
    default: "border bg-background text-foreground",
    destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
  }

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variants[variant],
        className,
      )}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
