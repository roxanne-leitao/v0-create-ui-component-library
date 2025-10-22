"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// Menubar component for application-level navigation
interface MenubarItem {
  label: string
  shortcut?: string
  onClick?: () => void
  disabled?: boolean
}

interface MenubarMenu {
  trigger: string
  items: MenubarItem[]
}

interface MenubarProps {
  menus: MenubarMenu[]
  className?: string
}

export function Menubar({ menus, className }: MenubarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <div className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)}>
      {menus.map((menu) => (
        <div key={menu.trigger} className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === menu.trigger ? null : menu.trigger)}
            className="flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            {menu.trigger}
          </button>

          {activeMenu === menu.trigger && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
              <div className="absolute top-full z-50 mt-1 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200">
                {menu.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.()
                      setActiveMenu(null)
                    }}
                    disabled={item.disabled}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 w-full justify-between"
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-xs tracking-widest opacity-60">{item.shortcut}</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
