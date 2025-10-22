import { cn } from "@/lib/utils"

export function getBadgeStyles(variant: "reviewed" | "needs_review" | "source"): string {
  const baseStyles = "inline-flex items-center px-2 py-1 rounded text-xs font-medium border"

  switch (variant) {
    case "reviewed":
      return cn(baseStyles, "bg-emerald-50 text-emerald-700 border-emerald-500")
    case "needs_review":
      return cn(baseStyles, "bg-orange-50 text-orange-700 border-orange-400")
    case "source":
      return cn(baseStyles, "bg-white text-slate-700 border-slate-200")
    default:
      return baseStyles
  }
}
