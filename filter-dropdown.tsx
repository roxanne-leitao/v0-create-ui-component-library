"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  checked?: boolean
}

interface FilterDropdownProps {
  label: string
  value: string[]
  options: FilterOption[]
  onSelect: (value: string[]) => void  // Changed from (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterDropdown({ label, value, options, onSelect, placeholder, className }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOptions = options.filter(opt => value.includes(opt.value))
  const displayLabel = selectedOptions.length > 0 ? `${selectedOptions.length} selected` : (placeholder || label)

  const checkedCount = value.length
  const showBadge = checkedCount > 0

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onSelect(value.filter(val => val !== optionValue))
    } else {
      onSelect([...value, optionValue])
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          showBadge && "border-blue-500 bg-blue-50",
          className
        )}
      >
        {showBadge && (
          <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
            {checkedCount}
          </div>
        )}
        <span className={cn("text-gray-700", showBadge && "text-blue-700 font-medium")}>
          {displayLabel}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 z-20 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              <button
                onClick={() => {
                  if (value.length === options.length) {
                    onSelect([])
                  } else {
                    onSelect(options.map(opt => opt.value))
                  }
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
              >
                <span className="text-gray-900">
                  {value.length === options.length ? "Deselect All" : "Select All"}
                </span>
                {value.length === options.length && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                >
                  <span className={cn(
                    "text-gray-900",
                    value.includes(option.value) && "font-medium text-blue-700"
                  )}>
                    {option.label}
                  </span>
                  {value.includes(option.value) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
