import { cn } from "@/lib/utils"

// Skeleton component for loading states
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn("rounded-md bg-gray-200", className)}
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }}
    />
  )
}
