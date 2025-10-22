"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Tooltip } from "./tooltip"

interface FieldPillsProps {
  fields: string[]
  className?: string
}

export function FieldPills({ fields, className }: FieldPillsProps) {
  const [visibleFields, setVisibleFields] = useState<string[]>([])
  const [overflowCount, setOverflowCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current || fields.length === 0) return

      const container = containerRef.current
      const containerWidth = container.offsetWidth
      setContainerWidth(containerWidth)

      // Create temporary elements to measure pill widths
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.visibility = 'hidden'
      tempContainer.style.whiteSpace = 'nowrap'
      document.body.appendChild(tempContainer)

      let totalWidth = 0
      let visibleCount = 0
      const pillWidths: number[] = []

      // Measure each field pill
      for (let i = 0; i < fields.length; i++) {
        const tempPill = document.createElement('div')
        tempPill.className = 'inline-flex items-center px-2 py-1 text-xs border border-slate-200 rounded-md mr-1'
        tempPill.style.fontFamily = "'Fragment Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
        tempPill.textContent = fields[i]
        tempContainer.appendChild(tempPill)
        
        const pillWidth = tempPill.offsetWidth + 4 // Add margin
        pillWidths.push(pillWidth)
        
        // Check if we need overflow indicator
        const overflowWidth = i < fields.length - 1 ? 32 : 0 // Width for "+X" pill
        
        if (totalWidth + pillWidth + overflowWidth <= containerWidth) {
          totalWidth += pillWidth
          visibleCount++
        } else {
          break
        }
      }

      document.body.removeChild(tempContainer)

      setVisibleFields(fields.slice(0, visibleCount))
      setOverflowCount(fields.length - visibleCount)
    }

    updateLayout()

    // Update on resize
    const resizeObserver = new ResizeObserver(updateLayout)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [fields, containerWidth])

  if (fields.length === 0) {
    return <div className={className}></div>
  }

  const overflowFields = fields.slice(visibleFields.length)

  return (
    <div ref={containerRef} className={cn("flex items-center flex-wrap gap-1", className)}>
      {visibleFields.map((field, index) => (
        <div
          key={index}
          className="inline-flex items-center px-2 py-1 text-xs border border-slate-200 rounded-md"
          style={{
            fontFamily: "'Fragment Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
          }}
        >
          {field}
        </div>
      ))}
      {overflowCount > 0 && (
        <Tooltip content={overflowFields.join(', ')}>
          <div
            className="inline-flex items-center px-2 py-1 text-xs border border-slate-200 rounded-md cursor-help"
            style={{
              fontFamily: "'Fragment Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
            }}
          >
            +{overflowCount}
          </div>
        </Tooltip>
      )}
    </div>
  )
}
