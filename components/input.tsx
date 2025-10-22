import type React from "react"
import { cn } from "@/lib/utils"

// Input component for text input fields
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
}

export function Input({ className, type = "text", error, errorMessage, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded border bg-white px-3 py-2 text-sm font-inter text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:placeholder:text-slate-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-900",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-200",
          className,
        )}
        {...props}
      />
      {errorMessage && <p className="mt-1 text-sm text-red-600 font-inter">{errorMessage}</p>}
    </div>
  )
}
