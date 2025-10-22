"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SourceBadge } from "./source-badge"
import { getSourceInfo } from "@/lib/source-utils"
import { groupProductsBySimilarity } from "@/lib/fuzzy-matching"

export interface FieldValue {
  crm_value?: string
  extracted_value?: string
  value?: string
  source?: string
  status: "reviewed" | "needs_review"
}

export interface Product {
  line_item_id: string
  product_name: FieldValue
  your_product?: FieldValue
  description?: FieldValue
  unit_price: FieldValue
  quantity: FieldValue
  discount?: FieldValue
  total_fees: FieldValue
}

interface ProductsTableProps {
  products: Product[]
  onProductUpdate: (productId: string, fieldName: string, newValue: FieldValue) => void
  searchQuery: string
  onValueClick: (value: string, source?: string) => void
  className?: string
}

export function ProductsTable({ products, onProductUpdate, searchQuery, onValueClick, className }: ProductsTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({}) // groupIndex -> productId

  // Column widths in pixels
  const columnWidths = {
    source: 114,
    product: 150,
    yourProduct: 150,
    description: 264,
    listPrice: 80,
    quantity: 80,
    discount: 80,
    fees: 80,
  }

  // Group products by similarity with balanced threshold
  console.log("ProductsTable - Input products:", products.length)
  products.forEach((product, index) => {
    console.log(`ProductsTable - Product ${index}:`, {
      id: product.line_item_id,
      name: product.product_name.extracted_value || product.product_name.crm_value || product.product_name.value,
      source: product.product_name.source,
    })
  })

  const productGroups = groupProductsBySimilarity(products, 0.85) // Balanced threshold

  console.log("ProductsTable - Product groups created:", productGroups.length)
  productGroups.forEach((group, index) => {
    console.log(`ProductsTable - Group ${index} (${group.length} products):`)
    group.forEach((product, productIndex) => {
      console.log(`  Product ${productIndex}:`, {
        id: product.line_item_id,
        name: product.product_name.extracted_value || product.product_name.crm_value || product.product_name.value,
        source: product.product_name.source,
      })
    })
  })

  // Reset scroll position when products change
  useEffect(() => {
    console.log("ProductsTable - Products changed, resetting scroll positions")
    setSelectedProducts({})
  }, [products])

  const handleProductSelect = (groupIndex: number, productId: string) => {
    console.log("ProductsTable - Product selected:", { groupIndex, productId })
    setSelectedProducts((prev) => ({
      ...prev,
      [groupIndex]: productId,
    }))
  }

  const handleConfirm = () => {
    const allGroupsSelected = productGroups.every((_, index) => selectedProducts[index])
    if (!allGroupsSelected) {
      console.log("ProductsTable - Not all groups have selections")
      return
    }

    console.log("ProductsTable - Confirmed selections:", selectedProducts)
  }

  const getDisplayValue = (fieldValue: FieldValue) => {
    if (fieldValue.value) return fieldValue.value
    return fieldValue.extracted_value || fieldValue.crm_value || ""
  }

  // Filter products based on search query
  const filteredProductGroups = productGroups
    .map((group) =>
      group.filter((product) => {
        if (!searchQuery) return true

        const searchLower = searchQuery.toLowerCase()
        return (
          product.product_name.crm_value?.toLowerCase().includes(searchLower) ||
          product.product_name.extracted_value?.toLowerCase().includes(searchLower) ||
          product.your_product?.value?.toLowerCase().includes(searchLower) ||
          product.description?.crm_value?.toLowerCase().includes(searchLower) ||
          product.description?.extracted_value?.toLowerCase().includes(searchLower)
        )
      }),
    )
    .filter((group) => group.length > 0)

  const isConfirmDisabled = !productGroups.every((_, index) => selectedProducts[index])

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-4">
        {/* Product Groups */}
        <div className="space-y-3">
          {filteredProductGroups.map((group, groupIndex) => {
            const productLineName =
              group[0]?.product_name.extracted_value ||
              group[0]?.product_name.crm_value ||
              group[0]?.product_name.value ||
              `Product Line ${groupIndex + 1}`

            console.log(`ProductsTable - Rendering group ${groupIndex}:`, {
              productLineName,
              productCount: group.length,
              products: group.map((p) => ({
                id: p.line_item_id,
                name: p.product_name.extracted_value || p.product_name.crm_value || p.product_name.value,
              })),
            })

            return (
              <div key={`group-${groupIndex}`} className="bg-slate-100 rounded-lg p-3">
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    {productLineName} ({group.length} item{group.length !== 1 ? "s" : ""})
                  </h3>
                </div>
                <div className="bg-white rounded-md border border-gray-200 overflow-x-auto">
                  <Table
                    className="border-collapse"
                    style={{
                      minWidth: Object.values(columnWidths).reduce((sum, width) => sum + width, 0) + "px",
                    }}
                  >
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.source + "px", width: columnWidths.source + "px" }}
                        >
                          Source
                        </TableHead>
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.product + "px", width: columnWidths.product + "px" }}
                        >
                          Product
                        </TableHead>
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.yourProduct + "px", width: columnWidths.yourProduct + "px" }}
                        >
                          Your Product
                        </TableHead>
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.description + "px", width: columnWidths.description + "px" }}
                        >
                          Description
                        </TableHead>
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.listPrice + "px", width: columnWidths.listPrice + "px" }}
                        >
                          List Price
                        </TableHead>
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.quantity + "px", width: columnWidths.quantity + "px" }}
                        >
                          Quantity
                        </TableHead>
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.discount + "px", width: columnWidths.discount + "px" }}
                        >
                          Discount
                        </TableHead>
                        <TableHead
                          className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider p-2 bg-white"
                          style={{ minWidth: columnWidths.fees + "px", width: columnWidths.fees + "px" }}
                        >
                          Fees
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.map((product) => {
                        const isSelected = selectedProducts[groupIndex] === product.line_item_id
                        const sourceInfo = getSourceInfo(product.product_name)

                        console.log(`ProductsTable - Rendering product ${product.line_item_id}:`, {
                          sourceInfo,
                          productName: product.product_name,
                          rawSource: product.product_name.source,
                        })

                        return (
                          <TableRow
                            key={product.line_item_id}
                            className={cn(
                              "cursor-pointer transition-colors hover:bg-gray-50",
                              isSelected
                                ? "border-2 border-blue-500 bg-blue-50"
                                : "border-b border-gray-100 last:border-b-0",
                            )}
                            onClick={() => handleProductSelect(groupIndex, product.line_item_id)}
                          >
                            <TableCell className="p-3" style={{ minWidth: columnWidths.source + "px" }}>
                              <SourceBadge source={sourceInfo.label} />
                            </TableCell>

                            <TableCell className="p-3" style={{ minWidth: columnWidths.product + "px" }}>
                              <button
                                className="text-sm font-medium text-blue-600 hover:underline text-left w-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onValueClick(getDisplayValue(product.product_name), product.product_name.source)
                                }}
                              >
                                <div className="break-words text-left">{getDisplayValue(product.product_name)}</div>
                              </button>
                            </TableCell>

                            <TableCell className="p-3" style={{ minWidth: columnWidths.yourProduct + "px" }}>
                              <div className="text-sm text-gray-900 break-words text-left">
                                {getDisplayValue(product.your_product || { status: "reviewed" })}
                              </div>
                            </TableCell>

                            <TableCell className="p-3" style={{ minWidth: columnWidths.description + "px" }}>
                              <button
                                className="text-sm text-blue-600 hover:underline text-left w-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onValueClick(
                                    getDisplayValue(product.description || { status: "reviewed" }),
                                    product.description?.source,
                                  )
                                }}
                              >
                                <div className="break-words text-left">
                                  {getDisplayValue(product.description || { status: "reviewed" })}
                                </div>
                              </button>
                            </TableCell>

                            <TableCell className="p-3" style={{ minWidth: columnWidths.listPrice + "px" }}>
                              <span className="text-sm text-gray-900">{getDisplayValue(product.unit_price)}</span>
                            </TableCell>

                            <TableCell className="p-3" style={{ minWidth: columnWidths.quantity + "px" }}>
                              <span className="text-sm text-gray-900">{getDisplayValue(product.quantity)}</span>
                            </TableCell>

                            <TableCell className="p-3" style={{ minWidth: columnWidths.discount + "px" }}>
                              <span className="text-sm text-gray-900">
                                {getDisplayValue(product.discount || { status: "reviewed" })}
                              </span>
                            </TableCell>

                            <TableCell className="p-3" style={{ minWidth: columnWidths.fees + "px" }}>
                              <span className="text-sm text-gray-900">{getDisplayValue(product.total_fees)}</span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline">Cancel</Button>
          <Button
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
