import type React from "react"
import { cn } from "@/lib/utils"

// Button component with multiple variants and sizes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export function Button({ className, variant = "default", size = "default", children, ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-inter"

  const variants = {
    default:
      "bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-blue-500 disabled:bg-slate-300 disabled:text-slate-500",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300 disabled:text-red-100",
    outline:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-blue-500 disabled:border-slate-200 disabled:text-slate-400 disabled:bg-slate-50",
    secondary:
      "bg-slate-500 text-white hover:bg-slate-600 focus-visible:ring-slate-400 disabled:bg-slate-300 disabled:text-slate-500",
    ghost: "text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400 disabled:text-slate-400",
    link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 focus-visible:ring-blue-500 disabled:text-blue-300",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-xs",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
