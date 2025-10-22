"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Search, ChevronDown, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/input"
import { DocumentViewer } from "./document-viewer"
import { FieldReviewArea } from "./field-review-area"
import type { Product, FieldValue } from "./products-table"

interface Document {
  document_id: string
  type: string
  file_name: string
  upload_date: string
}

interface DealData {
  deal_id: string
  account_name: string
  deal_name: string
  crm_source: string
  documents: Document[]
  fields: Record<string, FieldValue>
  products: Product[]
  status: string
  last_updated: string
}

interface ReviewPanelProps {
  isOpen: boolean
  onClose: () => void
  dealData: DealData
  fieldsFilter?: string[]
  className?: string
}

export function ReviewPanel({ isOpen, onClose, dealData, fieldsFilter = [], className }: ReviewPanelProps) {
  const [activeDocument, setActiveDocument] = useState(2) // Default to Order Form
  const [searchQuery, setSearchQuery] = useState("")
  const [fieldFilter, setFieldFilter] = useState("all")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null)

  // Enhanced mock data with more product variations for better grouping testing
  const enhancedDealData = {
    ...dealData,
    products: [
      {
        line_item_id: "li_001_master",
        product_name: {
          extracted_value: "G2 Content: Regional Content Subscription",
          source: "Order Form",
          status: "needs_review" as const,
        },
        your_product: {
          value: "Red Sift OnDMARC",
          status: "reviewed" as const,
        },
        description: {
          extracted_value:
            "Convert more leads with trusted third-party content powered by real reviews. See full feature list here.",
          source: "Order Form",
          status: "needs_review" as const,
        },
        unit_price: {
          extracted_value: "$15,000",
          status: "reviewed" as const,
        },
        quantity: {
          extracted_value: "1",
          status: "reviewed" as const,
        },
        discount: {
          extracted_value: "39.92%",
          status: "reviewed" as const,
        },
        total_fees: {
          extracted_value: "$5,000",
          status: "reviewed" as const,
        },
      },
      {
        line_item_id: "li_001_salesforce",
        product_name: {
          crm_value: "Regional Content Subscription",
          source: "Salesforce",
          status: "needs_review" as const,
        },
        your_product: {
          value: "Red Sift OnDMARC",
          status: "reviewed" as const,
        },
        description: {
          crm_value: "Convert more leads with trusted third-party content.",
          source: "Salesforce",
          status: "needs_review" as const,
        },
        unit_price: {
          crm_value: "$15,000",
          status: "reviewed" as const,
        },
        quantity: {
          crm_value: "1",
          status: "reviewed" as const,
        },
        discount: {
          crm_value: "39.92%",
          status: "reviewed" as const,
        },
        total_fees: {
          crm_value: "$5,000",
          status: "reviewed" as const,
        },
      },
      {
        line_item_id: "li_002_master",
        product_name: {
          extracted_value: "G2 Content: Social Asset Creation",
          source: "Order Form",
          status: "needs_review" as const,
        },
        your_product: {
          value: "Red Sift OnDMARC",
          status: "reviewed" as const,
        },
        description: {
          extracted_value: "Transform reviews into social media-based ad units optimized for LinkedIn & Facebook.",
          source: "Order Form",
          status: "needs_review" as const,
        },
        unit_price: {
          extracted_value: "Included",
          status: "reviewed" as const,
        },
        quantity: {
          extracted_value: "1",
          status: "reviewed" as const,
        },
        total_fees: {
          extracted_value: "$0",
          status: "reviewed" as const,
        },
      },
      {
        line_item_id: "li_002_salesforce",
        product_name: {
          crm_value: "Social Asset Creation",
          source: "Salesforce",
          status: "needs_review" as const,
        },
        your_product: {
          value: "Red Sift OnDMARC",
          status: "reviewed" as const,
        },
        description: {
          crm_value: "Transform reviews into ad units optimized for Facebook.",
          source: "Salesforce",
          status: "needs_review" as const,
        },
        unit_price: {
          crm_value: "Included",
          status: "reviewed" as const,
        },
        quantity: {
          crm_value: "1",
          status: "reviewed" as const,
        },
        total_fees: {
          crm_value: "$0",
          status: "reviewed" as const,
        },
      },
      {
        line_item_id: "li_003_single",
        product_name: {
          crm_value: "Premium Support Package",
          source: "Salesforce",
          status: "reviewed" as const,
        },
        your_product: {
          value: "Red Sift OnDMARC",
          status: "reviewed" as const,
        },
        description: {
          crm_value: "24/7 premium support with dedicated account manager.",
          source: "Salesforce",
          status: "needs_review" as const,
        },
        unit_price: {
          crm_value: "$2,500",
          status: "reviewed" as const,
        },
        quantity: {
          crm_value: "1",
          status: "reviewed" as const,
        },
        total_fees: {
          crm_value: "$2,500",
          status: "reviewed" as const,
        },
      },
    ],
    fields: {
      ...dealData.fields,
      start_date: {
        crm_value: "2023-01-01",
        extracted_value: "2025-01-01",
        netsuite_value: "2025-01-01",
        status: "needs_review" as const,
      },
      billing_frequency: {
        crm_value: "Annually Upfront",
        extracted_value: "Annually Upfront",
        netsuite_value: "Quarterly",
        status: "needs_review" as const,
      },
    },
  }

  // Set default fieldFilter based on fieldsFilter
  useEffect(() => {
    if (fieldsFilter.length > 0) {
      setFieldFilter("filtered_fields")
    } else {
      setFieldFilter("all")
    }
  }, [fieldsFilter])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Helper function to format field names
  const formatFieldName = (fieldName: string) => {
    const fieldNameMap: Record<string, string> = {
      start_date: "Start Date",
      end_date: "End Date",
      billing_frequency: "Billing Frequency",
      total_contract_value: "Total Contract Value",
      contract_terms: "Contract Terms",
      discounts: "Discounts",
      payment_terms: "Payment Terms",
      termination_clause: "Termination Clause",
    }

    return (
      fieldNameMap[fieldName] ||
      fieldName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
  }

  // Calculate review progress
  const getAllFields = () => {
    const regularFields = Object.entries(enhancedDealData.fields)
    const productFields = enhancedDealData.products.flatMap((product) =>
      Object.entries(product)
        .filter(([key]) => key !== "line_item_id")
        .map(([key, value]) => [`${product.line_item_id}_${key}`, value]),
    )
    return [...regularFields, ...productFields]
  }

  const allFields = getAllFields()
  const reviewedFields = allFields.filter(([_, field]) => field.status === "reviewed")
  const totalFields = allFields.length
  const reviewedCount = reviewedFields.length

  // Calculate filtered fields count (fields that match the dashboard filter)
  const getFilteredFieldsCount = () => {
    if (fieldsFilter.length === 0) return 0

    let count = 0

    // Count regular fields that match the filter
    Object.entries(enhancedDealData.fields).forEach(([fieldName, fieldValue]) => {
      const displayName = formatFieldName(fieldName)
      if (fieldsFilter.includes(displayName)) {
        count++
      }
    })

    // Count products if "Products" is in filter
    if (fieldsFilter.includes("Products")) {
      count += enhancedDealData.products.length
    }

    return count
  }

  const filteredFieldsCount = getFilteredFieldsCount()

  const handleValueClick = (value: string, source?: string) => {
    if (source?.toLowerCase().includes("document") || source?.toLowerCase().includes("order form")) {
      setHighlightedValue(value)
      // Auto-scroll would be implemented here
    }
  }

  // Get display text and count for the filter dropdown button
  const getFilterDisplayInfo = () => {
    switch (fieldFilter) {
      case "filtered_fields":
        return { text: "Filtered Fields", count: filteredFieldsCount }
      case "needs_review":
        return { text: "Needs Review", count: totalFields - reviewedCount }
      case "reviewed":
        return { text: "Reviewed", count: reviewedCount }
      default:
        return { text: "All Fields", count: totalFields }
    }
  }

  const filterDisplayInfo = getFilterDisplayInfo()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-opacity-20 bg-transparent" onClick={onClose} />

      {/* Panel with slide-in animation */}
      <div
        className={cn(
          "w-[90%] bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            {/* Close Panel Icon */}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Opportunity Name */}
            <span className="font-medium text-gray-900">{enhancedDealData.deal_name}</span>

            {/* Review/View Toggle */}
            <div className="flex items-center">
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-900 rounded-l border border-gray-300 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Review</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-white text-gray-600 rounded-r border border-l-0 border-gray-300 text-sm font-medium hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>View</span>
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            {/* List/Review Icon */}
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* AI Icon */}
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            {/* Chat Icon */}
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            {/* Settings Icon */}
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Document Tabs with Search and Filter */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 bg-white">
          <div className="flex items-center">
            {enhancedDealData.documents.map((doc, index) => (
              <button
                key={doc.document_id}
                onClick={() => setActiveDocument(index)}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeDocument === index
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-gray-600 hover:text-gray-900",
                )}
              >
                {doc.type}
              </button>
            ))}
            <button className="px-4 py-3 text-sm text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search Fields"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50"
              >
                <span>{filterDisplayInfo.text}</span>
                <span className="font-medium">{filterDisplayInfo.count}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                  <div className="absolute top-full right-0 z-20 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setFieldFilter("all")
                          setShowFilterDropdown(false)
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        <span>All Fields</span>
                        <span className="text-gray-500">{totalFields}</span>
                      </button>
                      <button
                        onClick={() => {
                          setFieldFilter("needs_review")
                          setShowFilterDropdown(false)
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        <span>Needs Review</span>
                        <span className="text-gray-500">{totalFields - reviewedCount}</span>
                      </button>
                      <button
                        onClick={() => {
                          setFieldFilter("reviewed")
                          setShowFilterDropdown(false)
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        <span>Reviewed</span>
                        <span className="text-gray-500">{reviewedCount}</span>
                      </button>
                      {/* Only show Filtered Fields option when fieldsFilter has values */}
                      {fieldsFilter.length > 0 && (
                        <button
                          onClick={() => {
                            setFieldFilter("filtered_fields")
                            setShowFilterDropdown(false)
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                        >
                          <span>Filtered Fields</span>
                          <span className="text-gray-500">{filteredFieldsCount}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Document Viewer */}
          <div className="w-1/2 border-r border-gray-200">
            <DocumentViewer
              document={enhancedDealData.documents[activeDocument]}
              dealData={enhancedDealData}
              highlightedValue={highlightedValue}
            />
          </div>

          {/* Right Column - Field Review (handles both regular fields AND products) */}
          <div className="w-1/2 flex flex-col">
            <FieldReviewArea
              dealData={enhancedDealData}
              searchQuery={searchQuery}
              fieldFilter={fieldFilter}
              fieldsFilter={fieldsFilter}
              onValueClick={handleValueClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
