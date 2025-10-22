"use client"

import { cn } from "@/lib/utils"
import { X } from 'lucide-react'

interface FilterPillProps {
  label: string
  badge?: number
  onRemove: () => void
  className?: string
}

export function FilterPill({ label, badge, onRemove, className }: FilterPillProps) {
  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md text-sm",
      className
    )}>
      {badge && (
        <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
          {badge}
        </div>
      )}
      <span className="text-blue-700 font-medium">{label}</span>
      <button
        onClick={onRemove}
        className="text-blue-500 hover:text-blue-700"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
