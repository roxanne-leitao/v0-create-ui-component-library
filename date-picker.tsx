"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./calendar"

// Date picker component combining input and calendar
interface DatePickerProps {
  selected?: Date
  onSelect?: (date: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ selected, onSelect, placeholder = "Pick a date", className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <span>{selected ? selected.toLocaleDateString() : placeholder}</span>
        <CalendarIcon className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full z-50 mt-1 rounded-md border bg-popover p-0 text-popover-foreground shadow-md">
            <Calendar
              selected={selected}
              onSelect={(date) => {
                onSelect?.(date)
                setIsOpen(false)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
