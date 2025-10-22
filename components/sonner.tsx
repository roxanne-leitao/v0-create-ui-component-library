import { cn } from "@/lib/utils"

// Sonner toast component for notifications
interface SonnerProps {
  className?: string
}

export function Sonner({ className }: SonnerProps) {
  return (
    <div className={cn("fixed bottom-0 right-0 z-[100] max-h-screen w-full md:max-w-[420px] p-4", className)}>
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm font-medium">Sonner Toast</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">This is a Sonner toast notification component.</p>
      </div>
    </div>
  )
}
