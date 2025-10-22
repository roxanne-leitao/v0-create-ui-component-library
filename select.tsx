"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// Select component for dropdown selection
interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  className?: string
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select an option...",
  disabled = false,
  error = false,
  errorMessage,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded border bg-white px-3 py-2 text-sm font-inter transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
          selectedOption ? "text-gray-900" : "text-gray-400",
          className,
        )}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value)
                setIsOpen(false)
              }}
              className="relative flex w-full cursor-default select-none items-center px-3 py-2 text-sm font-inter text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {errorMessage && <p className="mt-1 text-sm text-red-600 font-inter">{errorMessage}</p>}
    </div>
  )
}
