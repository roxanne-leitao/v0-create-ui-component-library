import { cn } from "@/lib/utils"

// Avatar component for displaying user profile images
interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "default" | "lg"
  className?: string
}

export function Avatar({ src, alt, fallback, size = "default", className }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizes[size], className)}>
      {src ? (
        <img src={src || "/placeholder.svg"} alt={alt} className="aspect-square h-full w-full" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <span className="text-sm font-medium">{fallback}</span>
        </div>
      )}
    </div>
  )
}
