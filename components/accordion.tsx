"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// Accordion component for collapsible content sections
interface AccordionItem {
  id: string
  trigger: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  type?: "single" | "multiple"
  className?: string
}

export function Accordion({ items, type = "single", className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    if (type === "single") {
      setOpenItems(openItems.includes(itemId) ? [] : [itemId])
    } else {
      setOpenItems(openItems.includes(itemId) ? openItems.filter((id) => id !== itemId) : [...openItems, itemId])
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)

        return (
          <div key={item.id} className="border-b">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
              data-state={isOpen ? "open" : "closed"}
            >
              {item.trigger}
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
            {isOpen && (
              <div className="overflow-hidden text-sm transition-all">
                <div className="pb-4 pt-0">{item.content}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
