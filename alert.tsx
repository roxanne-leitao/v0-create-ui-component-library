import type React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

// Alert component for displaying important messages
interface AlertProps {
  variant?: "default" | "destructive"
  className?: string
  title?: string
  description?: string
  children?: React.ReactNode
}

export function Alert({ variant = "default", className, title, description, children }: AlertProps) {
  const variants = {
    default: "bg-blue-50 text-blue-900 border-blue-200",
    destructive: "bg-red-50 text-red-900 border-red-200",
  }

  const Icon = variant === "destructive" ? AlertCircle : CheckCircle2

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
        variants[variant],
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      {description && <div className="text-sm [&_p]:leading-relaxed">{description}</div>}
      {children}
    </div>
  )
}
