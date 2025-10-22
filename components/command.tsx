"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Search } from 'lucide-react'

// Command component for searchable command palette
interface CommandItem {
  value: string
  label: string
}

interface CommandProps {
  placeholder?: string
  items: CommandItem[]
  onSelect?: (value: string) => void
  className?: string
}

export function Command({ placeholder = "Type a command or search...", items, onSelect, className }: CommandProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase()),
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(Math.min(selectedIndex + 1, filteredItems.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(Math.max(selectedIndex - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        onSelect?.(filteredItems[selectedIndex].value)
      }
    }
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-black",
        className,
      )}
    >
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
        <div className="p-1">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm">No results found.</div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={item.value}
                onClick={() => onSelect?.(item.value)}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none w-full text-left",
                  index === selectedIndex
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 hover:text-gray-700",
                )}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
