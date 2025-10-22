"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { FileText, Database, Check, X } from 'lucide-react'

interface FieldValue {
  crm_value?: string
  extracted_value?: string
  value?: string
  source?: string
  status: "reviewed" | "needs_review"
}

interface FieldCardProps {
  fieldName: string
  fieldValue: FieldValue
  onUpdate: (newValue: FieldValue) => void
  onValueClick: (value: string, source?: string) => void
  className?: string
}

export function FieldCardFigma({ fieldName, fieldValue, onUpdate, onValueClick, className }: FieldCardProps) {
  const [isEditing, setIsEditing] = useState(fieldValue.status === "needs_review")
  const [editValue, setEditValue] = useState("")
  const [selectedValue, setSelectedValue] = useState<"crm" | "extracted" | "custom" | null>(null)

  const isReviewed = fieldValue.status === "reviewed"

  const handleConfirm = () => {
    if (selectedValue === "custom" && editValue.trim()) {
      onUpdate({
        ...fieldValue,
        value: editValue.trim(),
        status: "reviewed"
      })
    } else if (selectedValue === "crm") {
      onUpdate({
        ...fieldValue,
        value: fieldValue.crm_value,
        status: "reviewed"
      })
    } else if (selectedValue === "extracted") {
      onUpdate({
        ...fieldValue,
        value: fieldValue.extracted_value,
        status: "reviewed"
      })
    }
    setIsEditing(false)
    setSelectedValue(null)
    setEditValue("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedValue(null)
    setEditValue("")
  }

  const handleCardClick = () => {
    if (isReviewed && !isEditing) {
      setIsEditing(true)
      setEditValue(fieldValue.value || fieldValue.crm_value || fieldValue.extracted_value || "")
    }
  }

  const getDisplayValue = () => {
    if (fieldValue.value) return fieldValue.value
    if (isReviewed) return fieldValue.crm_value || fieldValue.extracted_value
    return fieldValue.extracted_value || fieldValue.crm_value
  }

  return (
    <div className={cn(
      // Base container styles matching Figma
      "bg-white border border-[#E2E8F0] rounded-[8px] p-4 transition-all duration-200 ease-out",
      // Shadow matching Figma design
      "shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]",
      // Interactive states
      isReviewed && !isEditing && "cursor-pointer hover:bg-[#F8FAFC] hover:border-[#CBD5E1]",
      className
    )}>
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        {/* Field Name */}
        <h3 className="text-[14px] font-[500] leading-[20px] text-[#0F172A] font-inter">
          {fieldName}
        </h3>
        
        {/* Status Badge */}
        <div className={cn(
          "inline-flex items-center px-[8px] py-[2px] rounded-[12px] text-[12px] font-[500] leading-[16px] font-inter border",
          isReviewed 
            ? "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]" 
            : "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
        )}>
          {isReviewed ? "Reviewed" : "Needs Review"}
        </div>
      </div>

      {/* Content Section */}
      {!isEditing ? (
        <div className="space-y-3">
          {/* Selected Value Label */}
          <div className="text-[12px] font-[400] leading-[16px] text-[#64748B] font-inter">
            Selected value
          </div>
          
          {/* Main Value Display */}
          <div className="text-[16px] font-[600] leading-[24px] text-[#0F172A] font-inter">
            {getDisplayValue()}
          </div>

          {/* Source Indicators */}
          <div className="flex items-center gap-4">
            {/* Document Source */}
            {(fieldValue.source?.toLowerCase().includes('document') || 
              fieldValue.source?.toLowerCase().includes('order form') ||
              fieldValue.extracted_value) && (
              <div className="flex items-center gap-[6px]">
                <FileText className="w-4 h-4 text-[#64748B]" />
                <span className="text-[12px] font-[400] leading-[16px] text-[#64748B] font-inter">
                  Order Form
                </span>
              </div>
            )}
            
            {/* CRM Source */}
            {fieldValue.crm_value && (
              <div className="flex items-center gap-[6px]">
                <Database className="w-4 h-4 text-[#2563EB]" />
                <span className="text-[12px] font-[400] leading-[16px] text-[#64748B] font-inter">
                  Salesforce
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Selection Instructions */}
          <div className="text-[14px] font-[500] leading-[20px] text-[#374151] font-inter">
            Select the correct value:
          </div>
          
          {/* Value Options */}
          <div className="space-y-3">
            {/* CRM Value Option */}
            {fieldValue.crm_value && (
              <label className={cn(
                "flex items-center gap-3 p-3 border rounded-[6px] cursor-pointer transition-all duration-150",
                selectedValue === "crm" 
                  ? "border-[#2563EB] bg-[#EFF6FF]" 
                  : "border-[#D1D5DB] hover:bg-[#F8FAFC]"
              )}>
                <input
                  type="radio"
                  name={`${fieldName}-value`}
                  checked={selectedValue === "crm"}
                  onChange={() => setSelectedValue("crm")}
                  className="w-4 h-4 text-[#2563EB] border-[#D1D5DB] focus:ring-[#2563EB] focus:ring-2 focus:ring-offset-0"
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Database className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span className="text-[14px] font-[400] text-[#64748B] font-inter flex-shrink-0">
                    Salesforce:
                  </span>
                  <button 
                    type="button"
                    className="text-[14px] font-[500] text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-inter truncate text-left"
                    onClick={(e) => {
                      e.stopPropagation()
                      onValueClick(fieldValue.crm_value!, "Salesforce")
                    }}
                  >
                    {fieldValue.crm_value}
                  </button>
                </div>
              </label>
            )}

            {/* Extracted Value Option */}
            {fieldValue.extracted_value && (
              <label className={cn(
                "flex items-center gap-3 p-3 border rounded-[6px] cursor-pointer transition-all duration-150",
                selectedValue === "extracted" 
                  ? "border-[#2563EB] bg-[#EFF6FF]" 
                  : "border-[#D1D5DB] hover:bg-[#F8FAFC]"
              )}>
                <input
                  type="radio"
                  name={`${fieldName}-value`}
                  checked={selectedValue === "extracted"}
                  onChange={() => setSelectedValue("extracted")}
                  className="w-4 h-4 text-[#2563EB] border-[#D1D5DB] focus:ring-[#2563EB] focus:ring-2 focus:ring-offset-0"
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                  <span className="text-[14px] font-[400] text-[#64748B] font-inter flex-shrink-0">
                    Document:
                  </span>
                  <button 
                    type="button"
                    className="text-[14px] font-[500] text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-inter truncate text-left"
                    onClick={(e) => {
                      e.stopPropagation()
                      onValueClick(fieldValue.extracted_value!, "Order Form")
                    }}
                  >
                    {fieldValue.extracted_value}
                  </button>
                </div>
              </label>
            )}

            {/* Custom Value Option */}
            <label className={cn(
              "flex items-center gap-3 p-3 border rounded-[6px] cursor-pointer transition-all duration-150",
              selectedValue === "custom" 
                ? "border-[#2563EB] bg-[#EFF6FF]" 
                : "border-[#D1D5DB] hover:bg-[#F8FAFC]"
            )}>
              <input
                type="radio"
                name={`${fieldName}-value`}
                checked={selectedValue === "custom"}
                onChange={() => setSelectedValue("custom")}
                className="w-4 h-4 text-[#2563EB] border-[#D1D5DB] focus:ring-[#2563EB] focus:ring-2 focus:ring-offset-0"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[14px] font-[400] text-[#64748B] font-inter flex-shrink-0">
                  Custom:
                </span>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value)
                    setSelectedValue("custom")
                  }}
                  placeholder="Enter custom value"
                  className="flex-1 min-w-0 px-3 py-2 text-[14px] font-[400] text-[#0F172A] placeholder-[#94A3B8] bg-white border border-[#D1D5DB] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] font-inter"
                />
              </div>
            </label>
          </div>

          {/* Custom Value Link */}
          <div className="flex justify-end">
            <button 
              type="button"
              className="text-[14px] font-[400] text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-inter"
              onClick={() => {
                setSelectedValue("custom")
                setEditValue(getDisplayValue())
              }}
            >
              Use a custom value
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-[6px] text-[14px] font-[500] text-[#374151] bg-white border border-[#D1D5DB] rounded-[6px] hover:bg-[#F8FAFC] hover:border-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 transition-all duration-150 font-inter"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleConfirm}
              disabled={!selectedValue || (selectedValue === "custom" && !editValue.trim())}
              className="inline-flex items-center px-3 py-[6px] text-[14px] font-[500] text-white bg-[#2563EB] border border-transparent rounded-[6px] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 font-inter"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
