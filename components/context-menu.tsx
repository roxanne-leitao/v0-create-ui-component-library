"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// Context menu component for right-click interactions
interface ContextMenuItem {
  label: string
  shortcut?: string
  onClick?: () => void
  disabled?: boolean
}

interface ContextMenuProps {
  trigger: React.ReactNode
  items: ContextMenuItem[]
  className?: string
}

export function ContextMenu({ trigger, items, className }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }

  return (
    <>
      <div onContextMenu={handleContextMenu}>{trigger}</div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              "fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200",
              className,
            )}
            style={{ left: position.x, top: position.y }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.()
                  setIsOpen(false)
                }}
                disabled={item.disabled}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 w-full justify-between"
              >
                <span>{item.label}</span>
                {item.shortcut && <span className="ml-auto text-xs tracking-widest opacity-60">{item.shortcut}</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
