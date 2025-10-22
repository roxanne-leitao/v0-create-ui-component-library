"use client"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

// Checkbox component for boolean input
interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({ id, checked = false, onCheckedChange, disabled = false, className }: CheckboxProps) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-blue-600 border-blue-600 text-white",
        className,
      )}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  )
}
