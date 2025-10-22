import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"
import { SalesforceLogo, NetSuiteLogo } from "./company-logos"
import { getBadgeStyles } from "@/lib/badge-utils"

interface SourceBadgeProps {
  source: string
  className?: string
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  console.log("=== SourceBadge Debug Start ===")
  console.log("SourceBadge - Raw source prop:", JSON.stringify(source))
  console.log("SourceBadge - Source type:", typeof source)
  console.log("SourceBadge - Source length:", source?.length)
  console.log(
    "SourceBadge - Source char codes:",
    source?.split("").map((c) => c.charCodeAt(0)),
  )

  const getSourceIcon = () => {
    console.log("SourceBadge - getSourceIcon called with source:", source)

    // Normalize the source string
    const normalizedSource = (source || "").toString().toLowerCase().trim()
    console.log("SourceBadge - Normalized source:", JSON.stringify(normalizedSource))

    // Check for Salesforce (multiple variations)
    const salesforceVariations = ["salesforce", "sales force", "sf"]
    const isSalesforce = salesforceVariations.some((variation) => normalizedSource.includes(variation))

    console.log("SourceBadge - Salesforce check:", {
      normalizedSource,
      salesforceVariations,
      isSalesforce,
      includes_salesforce: normalizedSource.includes("salesforce"),
      includes_sales_force: normalizedSource.includes("sales force"),
      includes_sf: normalizedSource.includes("sf"),
    })

    if (isSalesforce) {
      console.log("SourceBadge - ✅ MATCHED SALESFORCE - Using Salesforce logo")
      return <SalesforceLogo className="w-3 h-3" />
    }

    // Check for NetSuite (multiple variations)
    const netsuiteVariations = ["netsuite", "net suite", "ns"]
    const isNetsuite = netsuiteVariations.some((variation) => normalizedSource.includes(variation))

    console.log("SourceBadge - NetSuite check:", {
      normalizedSource,
      netsuiteVariations,
      isNetsuite,
      includes_netsuite: normalizedSource.includes("netsuite"),
      includes_net_suite: normalizedSource.includes("net suite"),
      includes_ns: normalizedSource.includes("ns"),
    })

    if (isNetsuite) {
      console.log("SourceBadge - ✅ MATCHED NETSUITE - Using NetSuite logo")
      return <NetSuiteLogo className="w-3 h-3" />
    }

    console.log("SourceBadge - ❌ NO MATCH - Using default FileText icon")
    console.log("=== SourceBadge Debug End ===")
    return <FileText className="w-3 h-3 text-gray-400" />
  }

  const icon = getSourceIcon()
  console.log("SourceBadge - Final icon component:", icon)

  return (
    <div className={cn(getBadgeStyles("source"), "inline-flex items-center", className)}>
      {icon}
      <span className="ml-1">{source}</span>
    </div>
  )
}
