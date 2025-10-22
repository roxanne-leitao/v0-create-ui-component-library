"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { Calendar } from "./calendar"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangePickerProps {
  value?: DateRange
  onSelect?: (range: DateRange) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({ 
  value = { from: undefined, to: undefined }, 
  onSelect, 
  placeholder = "Date Range",
  className 
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState<DateRange>(value)

  const formatDateRange = (range: DateRange) => {
    if (!range.from && !range.to) return placeholder
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    }

    // Single date selected
    if (range.from && !range.to) {
      return formatDate(range.from)
    }
    
    // Date range selected
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`
    }
    
    return placeholder
  }

  const hasSelection = value.from || value.to
  const displayText = formatDateRange(value)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const newRange = { ...tempRange }
    
    // If no dates selected, set as start date
    if (!newRange.from && !newRange.to) {
      newRange.from = date
      newRange.to = undefined
    }
    // If only start date selected
    else if (newRange.from && !newRange.to) {
      // If clicking the same date as start, clear selection
      if (date.getTime() === newRange.from.getTime()) {
        newRange.from = undefined
        newRange.to = undefined
      }
      // If clicking a date before start, make it the new start
      else if (date < newRange.from) {
        newRange.from = date
        newRange.to = undefined
      }
      // If clicking a date after start, make it the end
      else {
        newRange.to = date
      }
    }
    // If both dates selected, start fresh with clicked date
    else {
      newRange.from = date
      newRange.to = undefined
    }
    
    setTempRange(newRange)
  }

  const handleApply = () => {
    onSelect?.(tempRange)
    setIsOpen(false)
  }

  const handleClear = () => {
    const clearedRange = { from: undefined, to: undefined }
    setTempRange(clearedRange)
    onSelect?.(clearedRange)
    setIsOpen(false)
  }

  const isDateInRange = (date: Date) => {
    if (!tempRange.from || !tempRange.to) return false
    return date >= tempRange.from && date <= tempRange.to
  }

  const isStartDate = (date: Date) => {
    return tempRange.from && date.getTime() === tempRange.from.getTime()
  }

  const isEndDate = (date: Date) => {
    return tempRange.to && date.getTime() === tempRange.to.getTime()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          hasSelection && "border-blue-500 bg-blue-50",
          className
        )}
      >
        {hasSelection && (
          <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
            1
          </div>
        )}
        <CalendarIcon className="w-4 h-4 text-gray-400" />
        <span className={cn(
          "text-gray-700",
          hasSelection && "text-blue-700 font-medium"
        )}>
          {displayText}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 z-20 mt-1 p-4 bg-white border border-gray-200 rounded-md shadow-lg min-w-[350px]">
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-900 mb-3">
                Select Date {tempRange.from && !tempRange.to ? "Range" : ""}
              </div>
              
              <div className="flex justify-center">
                <Calendar
                  rangeStart={tempRange.from}
                  rangeEnd={tempRange.to}
                  isInRange={(date) => {
                    if (!tempRange.from || !tempRange.to) return false
                    return date >= tempRange.from && date <= tempRange.to
                  }}
                  onSelect={handleDateSelect}
                  className="border rounded-md"
                />
              </div>
              
              {/* Selection status */}
              <div className="text-xs text-gray-500 text-center">
                {!tempRange.from && !tempRange.to && "Click a date to start selection"}
                {tempRange.from && !tempRange.to && "Click another date to create a range, or Apply for single date"}
                {tempRange.from && tempRange.to && "Date range selected"}
              </div>
              
              <div className="flex justify-between pt-3 border-t">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  Clear
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!tempRange.from}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
