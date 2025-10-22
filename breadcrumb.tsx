import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

// Breadcrumb component for navigation hierarchy
interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />}
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
            ) : (
              <a href={item.href} className="text-sm font-medium text-primary hover:text-primary/80">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
