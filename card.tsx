import type React from "react"
import { cn } from "@/lib/utils"

// Card component for displaying content in a contained format
interface CardProps {
  className?: string
  title?: string
  description?: string
  content?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}

export function Card({ className, title, description, content, footer, children }: CardProps) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white shadow-none", className)}>
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 p-6">
          {title && <h3 className="text-lg font-semibold text-slate-900 leading-none">{title}</h3>}
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
      )}
      {(content || children) && <div className="p-6 pt-0 text-left pl-0 pr-0 pb-0">{content || children}</div>}
      {footer && <div className="flex items-center p-6 pt-0">{footer}</div>}
    </div>
  )
}
