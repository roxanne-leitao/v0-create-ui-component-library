import type React from "react"
import { cn } from "@/lib/utils"

// Textarea component for multi-line text input
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  errorMessage?: string
}

export function Textarea({ className, error, errorMessage, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded border bg-white px-3 py-2 text-sm font-inter text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:placeholder:text-gray-300 resize-none",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
          className,
        )}
        {...props}
      />
      {errorMessage && <p className="mt-1 text-sm text-red-600 font-inter">{errorMessage}</p>}
    </div>
  )
}
