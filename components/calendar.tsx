"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Calendar component for date selection
interface CalendarProps {
  onSelect?: (date: Date) => void
  className?: string
  // Range selection props
  rangeStart?: Date
  rangeEnd?: Date
  isInRange?: (date: Date) => boolean
}

export function Calendar({ onSelect, className, rangeStart, rangeEnd, isInRange }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const selectDate = (day: number) => {
    const selectedDate = new Date(year, month, day)
    onSelect?.(selectedDate)
  }

  const isToday = (day: number) => {
    const date = new Date(year, month, day)
    return date.toDateString() === today.toDateString()
  }

  const isRangeStart = (day: number) => {
    if (!rangeStart) return false
    const date = new Date(year, month, day)
    return date.toDateString() === rangeStart.toDateString()
  }

  const isRangeEnd = (day: number) => {
    if (!rangeEnd) return false
    const date = new Date(year, month, day)
    return date.toDateString() === rangeEnd.toDateString()
  }

  const isInDateRange = (day: number) => {
    if (!isInRange) return false
    const date = new Date(year, month, day)
    return isInRange(date)
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {monthNames[month]} {year}
        </div>
        <button
          onClick={nextMonth}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayWeekday }, (_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const isTodayDay = isToday(day)
          const isStartDay = isRangeStart(day)
          const isEndDay = isRangeEnd(day)
          const isInRangeDay = isInDateRange(day)
          
          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9",
                // Range styling
                isInRangeDay && !isStartDay && !isEndDay && "bg-blue-100 text-blue-900",
                // Start/end date styling
                (isStartDay || isEndDay) && "bg-blue-600 text-white hover:bg-blue-700",
                // Today styling (when not selected/in range)
                isTodayDay && !isStartDay && !isEndDay && !isInRangeDay && "bg-accent text-accent-foreground",
                // Default hover
                !isStartDay && !isEndDay && !isInRangeDay && "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
