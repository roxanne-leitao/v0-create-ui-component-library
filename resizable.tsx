"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// Resizable component for user-adjustable dimensions
interface ResizableProps {
  children: React.ReactNode
  defaultSize: { width: number; height: number }
  minWidth?: number
  minHeight?: number
  className?: string
}

export function Resizable({ children, defaultSize, minWidth = 100, minHeight = 100, className }: ResizableProps) {
  const [size, setSize] = useState(defaultSize)
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(minWidth, startWidth + (e.clientX - startX))
      const newHeight = Math.max(minHeight, startHeight + (e.clientY - startY))
      setSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className={cn("relative border", className)} style={{ width: size.width, height: size.height }}>
      {children}
      <div className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize bg-muted" onMouseDown={handleMouseDown} />
    </div>
  )
}
