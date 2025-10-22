"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { X } from 'lucide-react'

// Sheet component for slide-out panels
interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  content?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function Sheet({ open, onOpenChange, title, description, content, side = "right", className }: SheetProps) {
  if (!open) return null

  const sideStyles = {
    top: "inset-x-0 top-0 border-b",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out",
          sideStyles[side],
          className,
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>

        {(title || description) && (
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        )}

        {content && <div className="mt-4">{content}</div>}
      </div>
    </div>
  )
}
