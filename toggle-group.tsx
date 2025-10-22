"use client"
import { cn } from "@/lib/utils"

// Toggle group component for mutually exclusive selections
interface ToggleGroupItem {
  value: string
  label: string
}

interface ToggleGroupProps {
  type: "single" | "multiple"
  value: string | string[]
  onValueChange: (value: string | string[]) => void
  items: ToggleGroupItem[]
  className?: string
}

export function ToggleGroup({ type, value, onValueChange, items, className }: ToggleGroupProps) {
  const handleToggle = (itemValue: string) => {
    if (type === "single") {
      onValueChange(value === itemValue ? "" : itemValue)
    } else {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue]
      onValueChange(newValues)
    }
  }

  const isSelected = (itemValue: string) => {
    if (type === "single") {
      return value === itemValue
    }
    return Array.isArray(value) && value.includes(itemValue)
  }

  return (
    <div className={cn("inline-flex rounded-md shadow-sm", className)} role="group">
      {items.map((item, index) => (
        <button
          key={item.value}
          onClick={() => handleToggle(item.value)}
          className={cn(
            "inline-flex items-center px-3 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            index === 0 && "rounded-l-md",
            index === items.length - 1 && "rounded-r-md",
            index > 0 && "border-l-0",
            isSelected(item.value)
              ? "bg-accent text-accent-foreground"
              : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
