"use client"
import { cn } from "@/lib/utils"

// Radio button component for single selection from multiple options
interface RadioButtonProps {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
  disabled?: boolean
  className?: string
}

export function RadioButton({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: RadioButtonProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        id={id}
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(value)}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        {checked && (
          <div className="flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-current" />
          </div>
        )}
      </button>
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  )
}
