"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { X } from 'lucide-react'

// Dialog component for modal interactions
interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  content?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Dialog({ open, onOpenChange, title, description, content, footer, className }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-[rgba(55,55,73,0.5)]" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg",
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
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        )}

        {content && <div>{content}</div>}

        {footer && <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{footer}</div>}
      </div>
    </div>
  )
}
