"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from "@/components/button"

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
  fields: Record<string, any>
  products: any[]
  status: string
  last_updated: string
}

interface DocumentViewerProps {
  document: Document
  dealData: DealData
  highlightedValue?: string | null
  className?: string
}

export function DocumentViewer({ document, dealData, highlightedValue, className }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(75)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))

  // Auto-scroll to highlighted value
  useEffect(() => {
    if (highlightedValue) {
      // In a real implementation, this would scroll to the highlighted text
      console.log('Scrolling to:', highlightedValue)
    }
  }, [highlightedValue])

  return (
    <div className={cn("flex flex-col h-full bg-gray-50", className)}>
      {/* Document Controls */}
      <div className="flex items-center p-3 bg-white border-b border-gray-200 justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto p-4">
        <div 
          className="bg-white shadow-lg mx-auto"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: '8.5in',
            minHeight: '11in',
            padding: '0.75in',
            maxWidth: '100%'
          }}
        >
          {/* Mock Document Content */}
          <div className="space-y-6 text-sm">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <h1 className="text-xl font-bold text-gray-900">SERVICE ORDER</h1>
              <p className="text-gray-600 mt-2">Document Envelope ID: ADF8E8DK-CF3B-4B94-AB78-DEF947F8F7AC</p>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Client Name: {dealData.account_name}</h3>
                <div className="text-gray-700 space-y-1">
                  <p>Address: 639 Granite St, Suite 408,</p>
                  <p>Braintree, MA 02184, United States</p>
                  <p>Billing Contact: accounts@redsift.io</p>
                  <p>accounting@redsift.io</p>
                </div>
              </div>
              <div>
                <div className="text-gray-700 space-y-1">
                  <p><strong>Service Order Number:</strong> Q-92887</p>
                  <p><strong>Service Order Effective Date:</strong> <span className={highlightedValue === "June 24, 2025" ? "bg-yellow-200" : ""}>June 24, 2025</span></p>
                  <p><strong>Offer Valid Through:</strong> July 1, 2025</p>
                  <p><strong>Account Executive:</strong> security@redsift.io</p>
                  <p><strong>Additional Billing Contact:</strong></p>
                </div>
              </div>
            </div>

            {/* Service Description */}
            <div className="space-y-3">
              <p className="text-gray-700">
                By executing this Service Order, Client agrees to purchase the Services below. The Master Service Agreement 
                ("Agreement"), Service Descriptions, Privacy Policy and Terms of Use are incorporated herein by reference and are each 
                available at https://www.g2.com/static/legal.
              </p>
            </div>

            {/* Products Table */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Co-term Add on</h3>
              <div className="border border-gray-300 overflow-hidden">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-1 text-left font-semibold w-[20%]">Name</th>
                      <th className="border border-gray-300 p-1 text-left font-semibold w-[15%]">Your Product</th>
                      <th className="border border-gray-300 p-1 text-left font-semibold w-[25%]">Description</th>
                      <th className="border border-gray-300 p-1 text-left font-semibold w-[12%]">List Price</th>
                      <th className="border border-gray-300 p-1 text-left font-semibold w-[8%]">Quantity</th>
                      <th className="border border-gray-300 p-1 text-left font-semibold w-[10%]">Discount</th>
                      <th className="border border-gray-300 p-1 text-left font-semibold w-[10%]">Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-1 text-xs leading-tight">
                        <span className={highlightedValue?.includes("G2 Content: Regional Content Subscription") ? "bg-yellow-200" : ""}>
                          G2 Content: Regional Content Subscription
                        </span>
                      </td>
                      <td className="border border-gray-300 p-1 text-xs">Red Sift OnDMARC</td>
                      <td className="border border-gray-300 p-1 text-xs leading-tight">
                        <span className={highlightedValue?.includes("Convert more leads") ? "bg-yellow-200" : ""}>
                          Convert more leads with trusted third-party content powered by real reviews. See full feature list here.
                        </span>
                      </td>
                      <td className="border border-gray-300 p-1 text-xs">$15,000.00</td>
                      <td className="border border-gray-300 p-1 text-xs">1</td>
                      <td className="border border-gray-300 p-1 text-xs">39.92%</td>
                      <td className="border border-gray-300 p-1 text-xs">$5,000.00</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-1 text-xs leading-tight">
                        G2 Content: Social Asset Creation
                      </td>
                      <td className="border border-gray-300 p-1 text-xs">Red Sift OnDMARC</td>
                      <td className="border border-gray-300 p-1 text-xs leading-tight">
                        Transform reviews into three (3) review-based ad units optimized for sharing to LinkedIn & Facebook.
                      </td>
                      <td className="border border-gray-300 p-1 text-xs">Included</td>
                      <td className="border border-gray-300 p-1 text-xs">1</td>
                      <td className="border border-gray-300 p-1 text-xs"></td>
                      <td className="border border-gray-300 p-1 text-xs">Included</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-gray-50 p-2 text-right border-t border-gray-300">
                  <strong className="text-xs">Co-term Add on Total Fees: $5,000.00</strong>
                </div>
                <div className="bg-gray-100 p-2 text-right border-t border-gray-300">
                  <strong className="text-xs">Grand Total Fees: $5,000.00</strong>
                </div>
              </div>
            </div>

            {/* Subscription Terms */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Subscription Term:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-300 p-2">
                  <strong>Term Start:</strong> <span className={highlightedValue === "June 24, 2025" ? "bg-yellow-200" : ""}>June 24, 2025</span>
                </div>
                <div className="border border-gray-300 p-2">
                  <strong>Term End:</strong> <span className={highlightedValue === "January 12, 2026" ? "bg-yellow-200" : ""}>January 12, 2026</span>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-300 p-2">
                  <strong>Billing Frequency:</strong> <span className={highlightedValue?.includes("Annual Up Front") ? "bg-yellow-200" : ""}>Annual Up Front</span>
                </div>
                <div className="border border-gray-300 p-2">
                  <strong>Year 1:</strong> $5,000.00
                </div>
                <div className="border border-gray-300 p-2">
                  <strong>Year 2:</strong> N/A
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="space-y-3">
              <p className="text-gray-700 text-xs leading-relaxed">
                <strong>Payment Terms:</strong> Except as otherwise provided, (a) G2 will invoice Client for the initial fees upon execution of this Service 
                Order and (b) for a multi-year subscription Term, G2 will invoice Client before each anniversary Term. G2 will invoice Client 
                before each anniversary Term. All invoices for Services are due and payable Net 15 days from the date of invoice. Client will pay all 
                amounts due hereunder via Automated Clearing House (ACH), wire, payment portal, or check. Client is responsible for 
                paying all taxes associated with this Service Order except for taxes on G2's net income. Renewal pricing is not dependent 
                upon the fees above. Except as provided in Sections 6 and 10.1 of the Agreement, all amounts paid are nonrefundable. 
                Service Order fees are non-cancelable and non-terminable.
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Notes:</h3>
              <p className="text-gray-700 text-xs">
                As of the Term Start above, this Service Order hereby co-terms the products listed above to Service Order Q-87977. Any 
                Fees listed above are in addition to any Fees owed under Service Order Q-87977. All other terms and conditions of Service 
                Order Q-87977, including all Fees due and payable by You thereunder, remain in full force and effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
