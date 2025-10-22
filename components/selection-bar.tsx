"use client"

import { Button } from "@/components/button"

interface SelectionBarProps {
  selectedCount: number
  onUnselect: () => void
  onDelete: () => void
}

export function SelectionBar({ selectedCount, onUnselect, onDelete }: SelectionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-900">
            {selectedCount} {selectedCount === 1 ? "opportunity" : "opportunities"} selected
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onUnselect} className="text-gray-600 hover:text-gray-900">
            Unselect
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            {selectedCount === 1 ? "Delete" : `Delete ${selectedCount} Opportunities`}
          </Button>
        </div>
      </div>
    </div>
  )
}
