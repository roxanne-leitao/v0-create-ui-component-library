"use client"

import type React from "react"
import { cn } from "@/lib/utils"

// Tabs component for organizing content into sections
interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className={cn("w-full text-center", className)}>
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {activeTabContent}
      </div>
    </div>
  )
}
