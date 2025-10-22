import React from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

// Typography component for consistent text styling
interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "large" | "small" | "muted"
  text: string
  className?: string
}

export function Typography({ variant, text, className }: TypographyProps) {
  const variants = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    lead: "text-xl text-muted-foreground",
    large: "text-lg font-semibold",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  }

  const Component = variant.startsWith("h") ? (variant as keyof JSX.IntrinsicElements) : "p"

  return React.createElement(Component, { className: cn(variants[variant], className) }, text)
}
