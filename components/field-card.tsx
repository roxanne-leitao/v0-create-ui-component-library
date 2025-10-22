"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { getBadgeStyles } from "@/lib/badge-utils"
import { SourceBadge } from "./source-badge"

interface FieldValue {
  crm_value?: string
  extracted_value?: string
  netsuite_value?: string
  value?: string
  source?: string
  selected_source?: string
  status: "reviewed" | "needs_review"
}

interface FieldCardProps {
  fieldName: string
  fieldValue: FieldValue
  onUpdate: (newValue: FieldValue) => void
  onValueClick: (value: string, source?: string) => void
  className?: string
}

export function FieldCard({ fieldName, fieldValue, onUpdate, onValueClick, className }: FieldCardProps) {
  const [isEditing, setIsEditing] = useState(fieldValue.status === "needs_review")
  const [editValue, setEditValue] = useState("")
  const [selectedValue, setSelectedValue] = useState<"document" | "crm" | "netsuite" | "combined" | "custom" | null>(
    () => {
      if (fieldValue.status === "reviewed" && fieldValue.selected_source) {
        switch (fieldValue.selected_source) {
          case "Order Form":
          case "Service Agreement":
            return "document"
          case "Salesforce":
            return "crm"
          case "Netsuite":
            return "netsuite"
          case "Combined":
            return "combined"
          case "Custom":
            return "custom"
          default:
            return null
        }
      }
      return null
    },
  )
  const [showCustomInput, setShowCustomInput] = useState(false)

  const isReviewed = fieldValue.status === "reviewed"

  // Helper function to group values by their content
  const getValueGroups = () => {
    const groups: Array<{
      value: string
      sources: Array<{ source: string; key: "extracted_value" | "crm_value" | "netsuite_value" }>
      selectionKey: "document" | "crm" | "netsuite" | "combined"
    }> = []

    const values = {
      extracted_value: fieldValue.extracted_value,
      crm_value: fieldValue.crm_value,
      netsuite_value: fieldValue.netsuite_value,
    }

    const sourceMap = {
      extracted_value: "Order Form",
      crm_value: "Salesforce",
      netsuite_value: "Netsuite",
    }

    // Group values that are the same
    Object.entries(values).forEach(([key, value]) => {
      if (!value) return

      const existingGroup = groups.find((group) => group.value === value)
      if (existingGroup) {
        existingGroup.sources.push({
          source: sourceMap[key as keyof typeof sourceMap],
          key: key as keyof typeof values,
        })
        // Update selection key to "combined" if multiple sources
        if (existingGroup.sources.length > 1) {
          existingGroup.selectionKey = "combined"
        }
      } else {
        groups.push({
          value,
          sources: [
            {
              source: sourceMap[key as keyof typeof sourceMap],
              key: key as keyof typeof values,
            },
          ],
          selectionKey: key === "extracted_value" ? "document" : key === "crm_value" ? "crm" : "netsuite",
        })
      }
    })

    return groups
  }

  const valueGroups = getValueGroups()

  const handleConfirm = () => {
    let updatedFieldValue = { ...fieldValue, status: "reviewed" as const }

    if (selectedValue === "custom" && editValue.trim()) {
      updatedFieldValue = {
        ...updatedFieldValue,
        value: editValue.trim(),
        selected_source: "Custom",
      }
    } else if (selectedValue === "crm") {
      updatedFieldValue = {
        ...updatedFieldValue,
        value: fieldValue.crm_value,
        selected_source: "Salesforce",
      }
    } else if (selectedValue === "document") {
      updatedFieldValue = {
        ...updatedFieldValue,
        value: fieldValue.extracted_value,
        selected_source: "Order Form",
      }
    } else if (selectedValue === "netsuite") {
      updatedFieldValue = {
        ...updatedFieldValue,
        value: fieldValue.netsuite_value,
        selected_source: "Netsuite",
      }
    } else if (selectedValue === "combined") {
      // Find the combined group and use its value
      const combinedGroup = valueGroups.find((group) => group.selectionKey === "combined")
      if (combinedGroup) {
        updatedFieldValue = {
          ...updatedFieldValue,
          value: combinedGroup.value,
          selected_source: "Combined",
        }
      }
    }

    onUpdate(updatedFieldValue)
    setIsEditing(false)
    setSelectedValue(null)
    setEditValue("")
    setShowCustomInput(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedValue(null)
    setEditValue("")
    setShowCustomInput(false)
  }

  const handleCardClick = () => {
    if (isReviewed && !isEditing) {
      setIsEditing(true)
      setEditValue(
        fieldValue.value || fieldValue.extracted_value || fieldValue.crm_value || fieldValue.netsuite_value || "",
      )
      // Set the selected value based on the current selection
      if (fieldValue.selected_source) {
        switch (fieldValue.selected_source) {
          case "Order Form":
          case "Service Agreement":
            setSelectedValue("document")
            break
          case "Salesforce":
            setSelectedValue("crm")
            break
          case "Netsuite":
            setSelectedValue("netsuite")
            break
          case "Combined":
            setSelectedValue("combined")
            break
          case "Custom":
            setSelectedValue("custom")
            setShowCustomInput(true)
            break
        }
      }
    }
  }

  const getDisplayValue = () => {
    if (fieldValue.value) return fieldValue.value
    return fieldValue.extracted_value || fieldValue.crm_value || fieldValue.netsuite_value
  }

  const handleCustomValueClick = () => {
    if (showCustomInput) {
      // Collapse custom input
      setShowCustomInput(false)
      setSelectedValue(null)
      setEditValue("")
    } else {
      // Expand custom input
      setShowCustomInput(true)
      setSelectedValue("custom")
      setEditValue(getDisplayValue())
    }
  }

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 space-y-3",
        isReviewed && !isEditing && "cursor-pointer hover:bg-gray-50",
        className,
      )}
      onClick={handleCardClick}
    >
      {/* 1st Row: Field Name and Status Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 text-left">{fieldName}</h3>
        <span className={cn(isReviewed ? getBadgeStyles("reviewed") : getBadgeStyles("needs_review"))}>
          {isReviewed ? "Reviewed" : "Needs Review"}
        </span>
      </div>

      {/* Content Section */}
      {!isEditing ? (
        <div className="space-y-3">
          {/* 2nd Row: Selected Value with Slate 50 Background - Only show for reviewed fields */}
          {isReviewed && (
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SourceBadge source={fieldValue.selected_source || "Order Form"} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1 text-right">Selected value</div>
                  <div className="text-sm font-medium text-gray-900 text-right">{getDisplayValue()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* 2nd Row: Selected Value with Slate 50 Background - Only show for reviewed fields */}
          {isReviewed && (
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SourceBadge source={fieldValue.selected_source || "Order Form"} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1 text-right">Selected value</div>
                  <div className="text-sm font-medium text-gray-900 text-right">{getDisplayValue()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Value Group Options */}
          {valueGroups.map((group, index) => (
            <label
              key={`${group.value}-${index}`}
              className={cn(
                "flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors",
                selectedValue === group.selectionKey
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              )}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`${fieldName}-value`}
                  checked={selectedValue === group.selectionKey}
                  onChange={() => setSelectedValue(group.selectionKey)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-2">
                  {group.sources.map((sourceInfo, sourceIndex) => (
                    <div key={sourceIndex} className={sourceIndex > 0 ? "ml-2" : ""}>
                      <SourceBadge source={sourceInfo.source} />
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-right"
                onClick={(e) => {
                  e.stopPropagation()
                  onValueClick(group.value, group.sources[0].source)
                }}
              >
                <div className="text-right break-words">{group.value}</div>
              </button>
            </label>
          ))}

          {/* Use Custom Value Link */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              onClick={handleCustomValueClick}
            >
              Use a custom value
            </button>
          </div>

          {/* Custom Value Input (shown when custom is selected) */}
          {showCustomInput && (
            <div className="p-3 border border-blue-500 bg-blue-50 rounded-md">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Enter custom value"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                autoFocus
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedValue || (selectedValue === "custom" && !editValue.trim())}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
