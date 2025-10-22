"use client"

import { useState } from "react"
import { FieldCardFigma } from "./field-card-figma"

interface FieldValue {
  crm_value?: string
  extracted_value?: string
  value?: string
  source?: string
  status: "reviewed" | "needs_review"
}

export function FieldCardDemo() {
  const [endDateField, setEndDateField] = useState<FieldValue>({
    crm_value: "January 1, 2022",
    extracted_value: "January 1, 2026",
    source: "Order Form",
    status: "reviewed",
    value: "January 1, 2026"
  })

  const [billingField, setBillingField] = useState<FieldValue>({
    crm_value: "Annual Up Front",
    extracted_value: "Annually Upfront",
    source: "Order Form",
    status: "needs_review"
  })

  const [startDateField, setStartDateField] = useState<FieldValue>({
    crm_value: "June 24, 2025",
    extracted_value: "June 24, 2025",
    source: "Order Form",
    status: "reviewed",
    value: "June 24, 2025"
  })

  const handleValueClick = (value: string, source?: string) => {
    console.log(`Clicked value: ${value} from ${source}`)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2 font-inter">
            Field Review Cards - Figma Design System
          </h1>
          <p className="text-[#64748B] font-inter">
            Precisely replicated field cards matching the Figma design specifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* End Date Field - Reviewed State */}
          <FieldCardFigma
            fieldName="End Date"
            fieldValue={endDateField}
            onUpdate={setEndDateField}
            onValueClick={handleValueClick}
          />

          {/* Billing Frequency Field - Needs Review State */}
          <FieldCardFigma
            fieldName="Billing Frequency"
            fieldValue={billingField}
            onUpdate={setBillingField}
            onValueClick={handleValueClick}
          />

          {/* Start Date Field - Reviewed State */}
          <FieldCardFigma
            fieldName="Start Date"
            fieldValue={startDateField}
            onUpdate={setStartDateField}
            onValueClick={handleValueClick}
          />
        </div>

        {/* Design System Documentation */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-6 shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4 font-inter">
            Design System Specifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#374151] mb-2 font-inter">Colors</h3>
              <div className="space-y-2 text-sm font-inter">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#0F172A] rounded"></div>
                  <span>Primary Text: #0F172A</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#64748B] rounded"></div>
                  <span>Secondary Text: #64748B</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#2563EB] rounded"></div>
                  <span>Primary Blue: #2563EB</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#DCFCE7] rounded"></div>
                  <span>Success Background: #DCFCE7</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-[#374151] mb-2 font-inter">Typography</h3>
              <div className="space-y-2 text-sm font-inter">
                <div>Field Name: 14px, Font Weight 500</div>
                <div>Main Value: 16px, Font Weight 600</div>
                <div>Labels: 12px, Font Weight 400</div>
                <div>Buttons: 14px, Font Weight 500</div>
                <div>Font Family: Inter</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-[#374151] mb-2 font-inter">Spacing & Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-inter">
              <div>
                <div>Container Padding: 16px</div>
                <div>Border Radius: 8px</div>
                <div>Element Gap: 12px</div>
              </div>
              <div>
                <div>Button Padding: 6px 12px</div>
                <div>Input Padding: 8px 12px</div>
                <div>Badge Padding: 2px 8px</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
