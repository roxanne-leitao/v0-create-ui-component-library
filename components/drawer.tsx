"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { X } from 'lucide-react'

// Drawer component for bottom sheet interactions
interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  content?: React.ReactNode
  className?: string
}

export function Drawer({ open, onOpenChange, title, description, content, className }: DrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-lg border bg-white",
          className,
        )}
      >
        <div className="mx-auto mt-4 h-2 w-24 rounded-full bg-gray-300" />
        <div className="p-4">
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
    </div>
  )
}
