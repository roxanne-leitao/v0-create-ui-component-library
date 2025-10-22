"use client"

import type React from "react"
import { cn } from "@/lib/utils"

// Input OTP component for one-time password entry
interface InputOTPProps {
  value: string
  onChange: (value: string) => void
  length: number
  error?: boolean
  errorMessage?: string
  className?: string
}

export function InputOTP({ value, onChange, length, error, errorMessage, className }: InputOTPProps) {
  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) return

    const newValue = value.split("")
    newValue[index] = digit
    onChange(newValue.join(""))

    // Auto-focus next input
    if (digit && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="w-full">
      <div className={cn("flex gap-2", className)}>
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded border bg-white text-center text-sm font-inter transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            )}
          />
        ))}
      </div>
      {errorMessage && <p className="mt-1 text-sm text-red-600 font-inter">{errorMessage}</p>}
    </div>
  )
}
