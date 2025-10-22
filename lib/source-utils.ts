import type { FieldValue } from "@/components/products-table"

export interface SourceInfo {
  label: string
  icon: "salesforce" | "netsuite" | "document"
}

export function getSourceInfo(fieldValue: FieldValue): SourceInfo {
  const source = fieldValue.source?.toLowerCase() || ""

  // Check for Salesforce
  if (source.includes("salesforce") || fieldValue.crm_value) {
    return {
      label: "Salesforce",
      icon: "salesforce",
    }
  }

  // Check for NetSuite
  if (source.includes("netsuite")) {
    return {
      label: "NetSuite",
      icon: "netsuite",
    }
  }

  // Default to document source
  if (source.includes("order form")) {
    return {
      label: "Order Form",
      icon: "document",
    }
  }

  if (source.includes("master service agreement")) {
    return {
      label: "Master Service Agreement",
      icon: "document",
    }
  }

  // Fallback
  return {
    label: fieldValue.source || "Document",
    icon: "document",
  }
}
