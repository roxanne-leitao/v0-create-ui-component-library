"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { FieldCard } from "./field-card"
import { ProductsTable } from "./products-table"
import { Button } from "@/components/button"
import { Checkbox } from "@/components/ui/checkbox"
import { getBadgeStyles } from "@/lib/badge-utils"
import { useToast } from "@/hooks/use-toast"

interface FieldValue {
  crm_value?: string
  extracted_value?: string
  value?: string
  source?: string
  status: "reviewed" | "needs_review"
  selected_source?: string
}

interface Product {
  line_item_id: string
  product_name: FieldValue
  your_product?: FieldValue
  description?: FieldValue
  unit_price: FieldValue
  quantity: FieldValue
  discount?: FieldValue
  total_fees: FieldValue
}

interface DealData {
  deal_id: string
  account_name: string
  deal_name: string
  crm_source: string
  documents: any[]
  fields: Record<string, FieldValue>
  products: Product[]
  status: string
  last_updated: string
}

interface FieldReviewAreaProps {
  dealData: DealData
  searchQuery: string
  fieldFilter: string
  fieldsFilter?: string[]
  onValueClick: (value: string, source?: string) => void
  className?: string
}

export function FieldReviewArea({
  dealData,
  searchQuery,
  fieldFilter,
  fieldsFilter = [],
  onValueClick,
  className,
}: FieldReviewAreaProps) {
  const [showProducts, setShowProducts] = useState(true)
  const [updatedFields, setUpdatedFields] = useState<Record<string, FieldValue>>(dealData.fields)
  const [updatedProducts, setUpdatedProducts] = useState<Product[]>(dealData.products)
  const [saveToSalesforce, setSaveToSalesforce] = useState(true)
  const [saveToNetsuite, setSaveToNetsuite] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(false)
  const { toast } = useToast()

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

  // Filter fields based on search and filter
  const filterFields = (fields: [string, FieldValue][]) => {
    return fields.filter(([fieldName, fieldValue]) => {
      const displayName = formatFieldName(fieldName)

      // Apply fieldsFilter logic based on fieldFilter mode
      let matchesFieldsFilter = true
      if (fieldFilter === "filtered_fields") {
        // In filtered_fields mode, only show fields that match the dashboard filter
        matchesFieldsFilter = fieldsFilter.includes(displayName)
      }
      // For other modes (all, needs_review, reviewed), don't apply fieldsFilter restriction

      // Search filter
      const matchesSearch =
        !searchQuery ||
        fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fieldValue.crm_value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fieldValue.extracted_value?.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter (only apply for non-filtered_fields modes)
      let matchesStatusFilter = true
      if (fieldFilter !== "filtered_fields") {
        matchesStatusFilter =
          fieldFilter === "all" ||
          (fieldFilter === "needs_review" && fieldValue.status === "needs_review") ||
          (fieldFilter === "reviewed" && fieldValue.status === "reviewed")
      }

      return matchesFieldsFilter && matchesSearch && matchesStatusFilter
    })
  }

  // Get regular fields in document order (mock order for now)
  const documentFieldOrder = ["start_date", "end_date", "total_contract_value", "billing_frequency"]
  const regularFields = Object.entries(updatedFields)
  const orderedFields = [
    ...documentFieldOrder.map((key) => [key, updatedFields[key]]).filter(([_, value]) => value),
    ...regularFields.filter(([key]) => !documentFieldOrder.includes(key)).sort(([a], [b]) => a.localeCompare(b)),
  ] as [string, FieldValue][]

  const filteredFields = filterFields(orderedFields)

  const handleFieldUpdate = (fieldName: string, newValue: FieldValue) => {
    console.log("FieldReviewArea - Field updated:", fieldName, newValue)
    setUpdatedFields((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }))
    setHasUnsavedChanges(true)
    setIsSaveDisabled(false)
  }

  const handleProductUpdate = (productId: string, fieldName: string, newValue: FieldValue) => {
    console.log("FieldReviewArea - Product updated:", productId, fieldName, newValue)
    setUpdatedProducts((prev) =>
      prev.map((product) => (product.line_item_id === productId ? { ...product, [fieldName]: newValue } : product)),
    )
    setHasUnsavedChanges(true)
    setIsSaveDisabled(false)
  }

  const handleSave = async () => {
    if (!saveToSalesforce && !saveToNetsuite) return

    console.log("FieldReviewArea - Saving to:", { saveToSalesforce, saveToNetsuite })

    // Simulate save operation
    setIsSaveDisabled(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const savedTo = []
      if (saveToSalesforce) savedTo.push("Salesforce")
      if (saveToNetsuite) savedTo.push("Netsuite")

      toast({
        title: "Changes saved successfully",
        description: `Data has been saved to ${savedTo.join(" and ")}.`,
        variant: "default",
      })

      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Save failed:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      })
      setIsSaveDisabled(false)
    }
  }

  // Helper function to highlight search terms in filtered fields
  const highlightSearchTerm = (text: string, searchTerm: string, isInFilteredField: boolean) => {
    if (!searchTerm || !isInFilteredField) return text

    const regex = new RegExp(`(${searchTerm})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  // Determine if Products section should be shown
  const shouldShowProducts = () => {
    if (fieldFilter === "filtered_fields") {
      // In filtered_fields mode, only show if "Products" is in fieldsFilter
      return fieldsFilter.includes("Products")
    } else {
      // In other modes, show products if they match the status filter
      return fieldFilter === "all" || fieldFilter === "needs_review"
    }
  }

  // Determine the status of the Products section
  const getProductsStatus = () => {
    // Check if any product has needs_review status
    const hasNeedsReview = updatedProducts.some((product) =>
      Object.values(product).some(
        (field) => typeof field === "object" && field !== null && "status" in field && field.status === "needs_review",
      ),
    )
    return hasNeedsReview ? "needs_review" : "reviewed"
  }

  const productsStatus = getProductsStatus()
  const isSaveButtonDisabled = isSaveDisabled || (!saveToSalesforce && !saveToNetsuite)

  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <div className="p-4 space-y-4">
        {/* Regular Fields */}
        {filteredFields.map(([fieldName, fieldValue]) => (
          <FieldCard
            key={`${fieldName}-${fieldValue.status}-${fieldValue.source}-${fieldValue.value}`}
            fieldName={formatFieldName(fieldName)}
            fieldValue={fieldValue}
            onUpdate={(newValue) => handleFieldUpdate(fieldName, newValue)}
            onValueClick={onValueClick}
          />
        ))}

        {/* Products Section */}
        {shouldShowProducts() && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowProducts(!showProducts)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                {showProducts ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-medium text-gray-900">Products</span>
                <span
                  className={cn(
                    productsStatus === "needs_review" ? getBadgeStyles("needs_review") : getBadgeStyles("reviewed"),
                  )}
                >
                  {productsStatus === "needs_review" ? "Needs Review" : "Reviewed"}
                </span>
              </div>
            </button>

            {showProducts && (
              <div className="border-t border-gray-200 p-4">
                <ProductsTable
                  products={updatedProducts}
                  onProductUpdate={handleProductUpdate}
                  searchQuery={searchQuery}
                  onValueClick={onValueClick}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Save CTA Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-end space-x-4">
          <Button
            onClick={handleSave}
            disabled={isSaveButtonDisabled}
            className="bg-blue-900 hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save to
          </Button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-salesforce"
                checked={saveToSalesforce}
                onCheckedChange={(checked) => setSaveToSalesforce(checked as boolean)}
              />
              <label htmlFor="save-salesforce" className="text-sm font-medium text-gray-700 cursor-pointer">
                Salesforce
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-netsuite"
                checked={saveToNetsuite}
                onCheckedChange={(checked) => setSaveToNetsuite(checked as boolean)}
              />
              <label htmlFor="save-netsuite" className="text-sm font-medium text-gray-700 cursor-pointer">
                Netsuite
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
