"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// Collapsible component for expandable content
interface CollapsibleProps {
  trigger: React.ReactNode
  content: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Collapsible({ trigger, content, defaultOpen = false, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn("w-full", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
        data-state={isOpen ? "open" : "closed"}
      >
        {trigger}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
      {isOpen && (
        <div className="overflow-hidden text-sm transition-all">
          <div className="pb-4 pt-0">{content}</div>
        </div>
      )}
    </div>
  )
}
