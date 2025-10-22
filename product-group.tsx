"use client"
import { cn } from "@/lib/utils"

interface FieldValue {
  crm_value?: string
  extracted_value?: string
  value?: string
  source?: string
  status: "reviewed" | "needs_review"
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

interface ProductGroupProps {
  products: Product[]
  selectedProductId: string | null
  onProductSelect: (productId: string) => void
  onValueClick: (value: string, source?: string) => void
  searchQuery: string
  className?: string
}

export function ProductGroup({
  products,
  selectedProductId,
  onProductSelect,
  onValueClick,
  searchQuery,
  className,
}: ProductGroupProps) {
  const getDisplayValue = (fieldValue: FieldValue) => {
    if (fieldValue.value) return fieldValue.value
    return fieldValue.extracted_value || fieldValue.crm_value || ""
  }

  const getSourceIcon = (source?: string) => {
    if (source?.toLowerCase().includes("salesforce")) {
      return (
        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )
    }
    return (
      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    )
  }

  const getSourceLabel = (product: Product) => {
    // Determine if this is from document extraction or CRM
    if (product.product_name.extracted_value && !product.product_name.crm_value) {
      return "Master..."
    }
    if (product.product_name.crm_value && !product.product_name.extracted_value) {
      return "Salesforce"
    }
    // If both exist, we need to determine which row this represents
    // This would typically be determined by the data structure
    return "Master..."
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      product.product_name.crm_value?.toLowerCase().includes(searchLower) ||
      product.product_name.extracted_value?.toLowerCase().includes(searchLower) ||
      product.your_product?.value?.toLowerCase().includes(searchLower) ||
      product.description?.crm_value?.toLowerCase().includes(searchLower) ||
      product.description?.extracted_value?.toLowerCase().includes(searchLower)
    )
  })

  if (filteredProducts.length === 0) return null

  // If only one product in group, render without group styling
  if (products.length === 1) {
    const product = filteredProducts[0]
    const isSelected = selectedProductId === product.line_item_id

    return (
      <div
        className={cn(
          "border rounded-lg cursor-pointer transition-colors",
          isSelected ? "border-blue-500 bg-white" : "border-slate-200 bg-white hover:bg-slate-50",
          className,
        )}
        onClick={() => onProductSelect(product.line_item_id)}
      >
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 items-start">
            {/* Source */}
            <div className="flex items-center space-x-2">
              {getSourceIcon(product.product_name.source)}
              <span className="text-sm text-gray-600 truncate">{getSourceLabel(product)}</span>
            </div>

            {/* Product Name */}
            <div>
              <button
                className="text-sm font-medium text-blue-600 hover:underline text-left truncate w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onValueClick(getDisplayValue(product.product_name), product.product_name.source)
                }}
                title={getDisplayValue(product.product_name)}
              >
                {getDisplayValue(product.product_name)}
              </button>
            </div>

            {/* Your Product */}
            <div>
              <span
                className="text-sm text-gray-900 truncate block"
                title={getDisplayValue(product.your_product || { status: "reviewed" })}
              >
                {getDisplayValue(product.your_product || { status: "reviewed" })}
              </span>
            </div>

            {/* Description */}
            <div>
              <button
                className="text-sm text-blue-600 hover:underline text-left w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onValueClick(
                    getDisplayValue(product.description || { status: "reviewed" }),
                    product.description?.source,
                  )
                }}
                title={getDisplayValue(product.description || { status: "reviewed" })}
              >
                <div className="truncate">{getDisplayValue(product.description || { status: "reviewed" })}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render as group with slate background
  return (
    <div className={cn("bg-slate-100 rounded-lg p-3 space-y-2", className)}>
      {filteredProducts.map((product) => {
        const isSelected = selectedProductId === product.line_item_id

        return (
          <div
            key={product.line_item_id}
            className={cn(
              "border rounded cursor-pointer transition-colors",
              isSelected ? "border-blue-500 bg-white" : "border-slate-200 bg-white hover:bg-slate-50",
            )}
            onClick={() => onProductSelect(product.line_item_id)}
          >
            <div className="p-3">
              <div className="grid grid-cols-4 gap-4 items-start">
                {/* Source */}
                <div className="flex items-center space-x-2">
                  {getSourceIcon(product.product_name.source)}
                  <span className="text-sm text-gray-600 truncate">{getSourceLabel(product)}</span>
                </div>

                {/* Product Name */}
                <div>
                  <button
                    className="text-sm font-medium text-blue-600 hover:underline text-left truncate w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onValueClick(getDisplayValue(product.product_name), product.product_name.source)
                    }}
                    title={getDisplayValue(product.product_name)}
                  >
                    {getDisplayValue(product.product_name)}
                  </button>
                </div>

                {/* Your Product */}
                <div>
                  <span
                    className="text-sm text-gray-900 truncate block"
                    title={getDisplayValue(product.your_product || { status: "reviewed" })}
                  >
                    {getDisplayValue(product.your_product || { status: "reviewed" })}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <button
                    className="text-sm text-blue-600 hover:underline text-left w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onValueClick(
                        getDisplayValue(product.description || { status: "reviewed" }),
                        product.description?.source,
                      )
                    }}
                    title={getDisplayValue(product.description || { status: "reviewed" })}
                  >
                    <div className="truncate">{getDisplayValue(product.description || { status: "reviewed" })}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
