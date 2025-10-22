"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog } from "@/components/dialog"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DropdownMenu } from "@/components/dropdown-menu"
import { Tabs } from "@/components/tabs"
import { DateRangePicker } from "@/components/date-range-picker"
import { ReviewPanel } from "@/components/review-panel"
import { SelectionBar } from "@/components/selection-bar"
import { AppNavigationMenu } from "@/components/navigation-menu"
import { Search, Filter, MoreHorizontal, Info, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FieldPills } from "@/components/field-pills"
import { generateMockOpportunities, filterOpportunities, calculateMetrics, type ChartData } from "@/lib/data"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface Opportunity {
  id: string
  name: string
  accountName: string
  type: "Early Renewal" | "Existing Customer - Upgrade" | "New Customer" | "Existing Customer - Replacement"
  reviewProgress: number
  unresolvedFields: number
  lastSynced: string
  lastSyncedTimestamp: string // New: ISO timestamp for sorting
  closedWonDate: string // YYYY-MM-DD format
  renewalDate: string // YYYY-MM-DD format
  totalContractValue: number
  status?: "Reviewed"
  progress?: "For Review" | "Syncing" | "Completed"
  fields?: string[]
  month: string
  monthIndex: number
  fieldMatches: number
  fieldDiscrepancies: number
  criticalFieldMatches: number
  criticalFieldDiscrepancies: number
  reviewed: boolean
  reviewCompletionDate?: string // New: YYYY-MM-DD
}

interface SavedFilter {
  id: string
  name: string
  filters: {
    progress: string[]
    type: string[]
    fields: string[]
    dateRange: string
  }
}

interface SortConfig {
  key: string | null
  direction: "asc" | "desc"
}

// Mock deal data for the review panel (specific to this component's needs)
const mockDealData = {
  deal_id: "oppty_00123",
  account_name: "Red Sift Ltd",
  deal_name: "Red Sift 2025 Subscription Renewal",
  crm_source: "Salesforce",
  documents: [
    {
      document_id: "doc_abc123",
      type: "Order Form",
      file_name: "RedSift_OrderForm_2025.pdf",
      upload_date: "2025-08-01",
    },
    {
      document_id: "doc_def456",
      type: "Master Service Agreement",
      file_name: "RedSift_MSA_2023.pdf",
      upload_date: "2023-06-15",
    },
  ],
  fields: {
    start_date: {
      crm_value: "2025-01-01",
      extracted_value: "2025-01-01",
      source: "Order Form",
      selected_source: "Order Form",
      status: "reviewed" as const,
    },
    end_date: {
      crm_value: "2026-01-01",
      extracted_value: "2026-01-01",
      source: "Order Form",
      selected_source: "Order Form",
      status: "reviewed" as const,
    },
    billing_frequency: {
      crm_value: "Annual Up Front",
      extracted_value: "Annually Upfront",
      source: "Order Form",
      selected_source: "Salesforce",
      status: "needs_review" as const,
    },
    total_contract_value: {
      crm_value: "5000.00",
      extracted_value: "5000.00",
      source: "Order Form",
      selected_source: "Salesforce",
      status: "reviewed" as const,
    },
    contract_terms: {
      crm_value: "Standard 12-month subscription with auto-renewal",
      extracted_value: "12-month subscription term with automatic renewal clause",
      source: "Order Form",
      status: "needs_review" as const,
    },
    discounts: {
      crm_value: "15% early payment discount",
      extracted_value: "15% discount for payment within 10 days",
      source: "Order Form",
      status: "needs_review" as const,
    },
    payment_terms: {
      crm_value: "Net 30",
      extracted_value: "Payment due within 30 days of invoice",
      source: "Order Form",
      status: "needs_review" as const,
    },
    termination_clause: {
      crm_value: "Either party may terminate with 90 days written notice",
      extracted_value: "90-day termination notice required by either party",
      source: "Order Form",
      status: "needs_review" as const,
    },
  },
  products: [
    {
      line_item_id: "li_001",
      product_name: {
        crm_value: "Regional Content Subscription",
        extracted_value: "G2 Content: Regional Content Subscription",
        source: "Order Form",
        status: "needs_review" as const,
      },
      your_product: {
        value: "Red Sift OnDMARC",
      },
      description: {
        crm_value: "Convert more leads with trusted third-party content.",
        extracted_value: "Convert more leads content powered by feature list here.",
        status: "needs_review" as const,
      },
      unit_price: {
        crm_value: "15000.00",
        extracted_value: "15000.00",
        status: "reviewed" as const,
      },
      quantity: {
        crm_value: "1",
        extracted_value: "1",
        status: "reviewed" as const,
      },
      discount: {
        crm_value: "39.92%",
        extracted_value: "39.92%",
        status: "reviewed" as const,
      },
      total_fees: {
        crm_value: "5000.00",
        extracted_value: "5000.00",
        status: "reviewed" as const,
      },
    },
    {
      line_item_id: "li_002",
      product_name: {
        crm_value: "Social Asset Creation",
        extracted_value: "G2 Content: Social Asset Creation",
        status: "needs_review" as const,
      },
      description: {
        crm_value: "Transform reviews into ads",
        extracted_value: "Transform reviews into ad units optimized for Facebook.",
        status: "needs_review" as const,
      },
      unit_price: {
        crm_value: "Included",
        extracted_value: "Included",
        status: "reviewed" as const,
      },
      quantity: {
        crm_value: "1",
        extracted_value: "1",
        status: "reviewed" as const,
      },
      total_fees: {
        crm_value: "0",
        extracted_value: "0",
        status: "reviewed" as const,
      },
    },
  ],
  status: "in_review",
  last_updated: "2025-08-06T10:45:00Z",
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showReviewPanel, setShowReviewPanel] = useState(false)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  // Add state to track the selected opportunity
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)

  // Filter states
  const [progressFilter, setProgressFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [fieldsFilter, setFieldsFilter] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "lastSyncedTimestamp",
    direction: "desc",
  })

  // Saved filters
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])

  // Add these new state variables after the existing state declarations
  const [hasFilterChanges, setHasFilterChanges] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [filterToDelete, setFilterToDelete] = useState<SavedFilter | null>(null)
  const [tabFilterStates, setTabFilterStates] = useState<
    Record<
      string,
      {
        progressFilter: string[]
        typeFilter: string[]
        fieldsFilter: string[]
        dateRange: DateRange
      }
    >
  >({})

  // Centralized mock data generation
  const allOpportunities = useMemo(() => generateMockOpportunities(), [])

  // Filter opportunities based on current filters
  const filteredOpportunities = useMemo(() => {
    return filterOpportunities(allOpportunities, searchQuery, progressFilter, typeFilter, fieldsFilter, dateRange)
  }, [allOpportunities, searchQuery, progressFilter, typeFilter, fieldsFilter, dateRange])

  // Sort opportunities based on current sort configuration
  const sortedOpportunities = useMemo(() => {
    if (!sortConfig.key) return filteredOpportunities

    const sorted = [...filteredOpportunities].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortConfig.key) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "accountName":
          aValue = a.accountName.toLowerCase()
          bValue = b.accountName.toLowerCase()
          break
        case "type":
          aValue = a.type.toLowerCase()
          bValue = b.type.toLowerCase()
          break
        case "reviewProgress":
          // Treat "Reviewed" status as 100%
          aValue = a.status === "Reviewed" ? 100 : a.reviewProgress
          bValue = b.status === "Reviewed" ? 100 : b.reviewProgress
          break
        case "unresolvedFields":
          aValue = a.unresolvedFields
          bValue = b.unresolvedFields
          break
        case "lastSyncedTimestamp":
          aValue = new Date(a.lastSyncedTimestamp).getTime()
          bValue = new Date(b.lastSyncedTimestamp).getTime()
          break
        default:
          return 0
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      // Compare values
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1

      // Tie breaker: use opportunity name
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      if (aName < bName) return -1
      if (aName > bName) return 1
      return 0
    })

    return sorted
  }, [filteredOpportunities, sortConfig])

  // Generate chart data from filtered opportunities for metric calculation
  const chartData = useMemo((): ChartData[] => {
    const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"]

    return months.map((month) => {
      const monthOpps = filteredOpportunities.filter((opp) => opp.month === month)
      const reviewedOpps = monthOpps.filter((opp) => opp.reviewed)

      const totalMatches = monthOpps.reduce((sum, opp) => sum + opp.fieldMatches, 0)
      const totalDiscrepancies = monthOpps.reduce((sum, opp) => sum + opp.fieldDiscrepancies, 0)
      const totalFields = totalMatches + totalDiscrepancies

      const fieldMatchRate = totalFields > 0 ? Math.round((totalMatches / totalFields) * 100) : 0

      // Critical field calculations
      const totalCriticalMatches = monthOpps.reduce((sum, opp) => sum + opp.criticalFieldMatches, 0)
      const totalCriticalDiscrepancies = monthOpps.reduce((sum, opp) => sum + opp.criticalFieldDiscrepancies, 0)
      const totalCriticalFields = totalCriticalMatches + totalCriticalDiscrepancies

      const criticalFieldMatchRate =
        totalCriticalFields > 0 ? Math.round((totalCriticalMatches / totalCriticalFields) * 100) : 0

      // Individual critical field rates (simulated for chart display)
      const discountRateMatch = Math.max(20, criticalFieldMatchRate + Math.floor(Math.random() * 20) - 10)
      const renewalDateMatch = Math.max(30, criticalFieldMatchRate + Math.floor(Math.random() * 15) - 5)
      const contractValueMatch = Math.max(70, criticalFieldMatchRate + Math.floor(Math.random() * 25) - 5)
      const paymentTermsMatch = Math.max(60, criticalFieldMatchRate + Math.floor(Math.random() * 20) - 10)

      return {
        month,
        totalOpportunities: monthOpps.length,
        reviewedOpportunities: reviewedOpps.length,
        fieldMatchRate,
        matchingFields: totalMatches,
        nonMatchingFields: totalDiscrepancies,
        criticalFieldMatchRate,
        discountRateMatch,
        renewalDateMatch,
        contractValueMatch,
        paymentTermsMatch,
      }
    })
  }, [filteredOpportunities])

  // Calculate metrics based on filtered opportunities and chart data
  const metrics = useMemo(() => calculateMetrics(filteredOpportunities, chartData), [filteredOpportunities, chartData])

  // Helper function to compare date ranges
  const dateRangesEqual = (range1: DateRange, range2: DateRange) => {
    return range1.from?.getTime() === range2.from?.getTime() && range1.to?.getTime() === range2.to?.getTime()
  }

  // Helper function to check if current filters have any values
  const hasActiveFilters = () => {
    return (
      progressFilter.length > 0 || typeFilter.length > 0 || fieldsFilter.length > 0 || dateRange.from || dateRange.to
    )
  }

  // Check for filter changes function
  useEffect(() => {
    if (activeTab === "all") {
      setHasFilterChanges(false)
      return
    }

    const originalState = tabFilterStates[activeTab]

    if (!originalState) {
      setHasFilterChanges(false)
      return
    }

    const progressChanged =
      JSON.stringify([...progressFilter].sort()) !== JSON.stringify([...originalState.progressFilter].sort())
    const typeChanged = JSON.stringify([...typeFilter].sort()) !== JSON.stringify([...originalState.typeFilter].sort())
    const fieldsChanged =
      JSON.stringify([...fieldsFilter].sort()) !== JSON.stringify([...originalState.fieldsFilter].sort())
    const dateChanged = !dateRangesEqual(dateRange, originalState.dateRange)

    const hasChanges = progressChanged || typeChanged || fieldsChanged || dateChanged

    setHasFilterChanges(hasChanges)
  }, [progressFilter, typeFilter, fieldsFilter, dateRange, activeTab, tabFilterStates])

  // Sorting functions
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Toggle direction if same column
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        }
      } else {
        // New column - use default direction
        const defaultDirection = key === "lastSyncedTimestamp" ? "desc" : "asc"
        return {
          key,
          direction: defaultDirection,
        }
      }
    })
  }

  const getSortIcon = (columnKey: string) => {
    // If this column is actively sorted, show the blue arrow
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="w-3 h-3 text-blue-500" />
      ) : (
        <ArrowDown className="w-3 h-3 text-blue-500" />
      )
    }

    // If this column is being hovered and it's not the active sort column, show preview arrow
    if (hoveredColumn === columnKey) {
      // Show default direction for the column type
      const defaultDirection = columnKey === "lastSyncedTimestamp" ? "desc" : "asc"
      return defaultDirection === "asc" ? (
        <ArrowUp className="w-3 h-3 text-gray-400" />
      ) : (
        <ArrowDown className="w-3 h-3 text-gray-400" />
      )
    }

    return null
  }

  const getSortableHeaderClass = (columnKey: string) => {
    return "cursor-pointer hover:bg-gray-50 transition-colors"
  }

  const getMockDealData = (opportunity: Opportunity) => {
    const baseDocuments = [
      {
        document_id: "doc_msa_001",
        type: "Master Service Agreement",
        file_name: `${opportunity.accountName.replace(/[^a-zA-Z0-9]/g, "_")}_MSA_2023.pdf`,
        upload_date: "2023-06-15",
      },
      {
        document_id: "doc_order_001",
        type: "Order Form",
        file_name: `${opportunity.accountName.replace(/[^a-zA-Z0-9]/g, "_")}_OrderForm_2025.pdf`,
        upload_date: "2025-08-01",
      },
    ]

    // This is a simplified mock for the review panel, not directly tied to the main opportunity data
    // In a real app, this would fetch detailed field data for the specific opportunity
    return {
      deal_id: opportunity.id,
      account_name: opportunity.accountName,
      deal_name: opportunity.name,
      crm_source: "Salesforce",
      documents: baseDocuments,
      fields: {
        start_date: {
          crm_value: "2025-01-01",
          extracted_value: "2025-01-01",
          netsuite_value: "2025-01-01",
          source: "Order Form",
          selected_source: "Order Form",
          status: "reviewed" as const,
        },
        end_date: {
          crm_value: "2026-01-01",
          extracted_value: "2026-01-01",
          netsuite_value: "2026-01-01",
          source: "Order Form",
          selected_source: "Order Form",
          status: "reviewed" as const,
        },
        billing_frequency: {
          crm_value: "Annual Up Front",
          extracted_value: "Annually Upfront",
          netsuite_value: "Annual",
          source: "Order Form",
          selected_source: "Salesforce",
          status: "needs_review" as const,
        },
        total_contract_value: {
          crm_value: "5000.00",
          extracted_value: "5000.00",
          netsuite_value: "5000.00",
          source: "Order Form",
          selected_source: "Salesforce",
          status: "reviewed" as const,
        },
        contract_terms: {
          crm_value: "Standard 12-month subscription with auto-renewal",
          extracted_value: "12-month subscription term with automatic renewal clause",
          netsuite_value: "Standard 12-month subscription with auto-renewal",
          source: "Order Form",
          selected_source: "Salesforce",
          status: "needs_review" as const,
        },
        discounts: {
          crm_value: "15% early payment discount",
          extracted_value: "15% discount for payment within 10 days",
          netsuite_value: "15% early payment discount",
          source: "Order Form",
          selected_source: "Salesforce",
          status: "needs_review" as const,
        },
        payment_terms: {
          crm_value: "Net 30",
          extracted_value: "Payment due within 30 days of invoice",
          netsuite_value: "Net 30",
          source: "Order Form",
          selected_source: "Salesforce",
          status: "needs_review" as const,
        },
        termination_clause: {
          crm_value: "Either party may terminate with 90 days written notice",
          extracted_value: "90-day termination notice required by either party",
          netsuite_value: "Either party may terminate with 90 days written notice",
          source: "Order Form",
          selected_source: "Salesforce",
          status: "needs_review" as const,
        },
      },
      products: [
        {
          line_item_id: "li_001",
          product_name: {
            crm_value: "Regional Content Subscription",
            extracted_value: "G2 Content: Regional Content Subscription",
            netsuite_value: "Regional Content Subscription",
            source: "Order Form",
            status: "needs_review" as const,
          },
          your_product: {
            value: "Red Sift OnDMARC",
          },
          description: {
            crm_value: "Convert more leads with trusted third-party content.",
            extracted_value: "Convert more leads content powered by feature list here.",
            netsuite_value: "Convert more leads with trusted third-party content.",
            source: "Order Form",
            status: "needs_review" as const,
          },
          unit_price: {
            crm_value: "15000.00",
            extracted_value: "15000.00",
            netsuite_value: "15000.00",
            status: "reviewed" as const,
          },
          quantity: {
            crm_value: "1",
            extracted_value: "1",
            netsuite_value: "1",
            status: "reviewed" as const,
          },
          discount: {
            crm_value: "39.92%",
            extracted_value: "39.92%",
            netsuite_value: "39.92%",
            status: "reviewed" as const,
          },
          total_fees: {
            crm_value: "5000.00",
            extracted_value: "5000.00",
            netsuite_value: "5000.00",
            status: "reviewed" as const,
          },
        },
        {
          line_item_id: "li_002",
          product_name: {
            crm_value: "Social Asset Creation",
            extracted_value: "G2 Content: Social Asset Creation",
            netsuite_value: "Social Asset Creation",
            status: "needs_review" as const,
          },
          description: {
            crm_value: "Transform reviews into ads",
            extracted_value: "Transform reviews into ad units optimized for Facebook.",
            netsuite_value: "Transform reviews into ads",
            status: "reviewed" as const,
          },
          unit_price: {
            crm_value: "Included",
            extracted_value: "Included",
            netsuite_value: "Included",
            status: "reviewed" as const,
          },
          quantity: {
            crm_value: "1",
            extracted_value: "1",
            netsuite_value: "1",
            status: "reviewed" as const,
          },
          total_fees: {
            crm_value: "0",
            extracted_value: "0",
            netsuite_value: "0",
            status: "reviewed" as const,
          },
        },
      ],
      status: "in_review",
      last_updated: "2025-08-06T10:45:00Z",
    }
  }

  const progressOptions = [
    { value: "For Review", label: "For Review" },
    { value: "Syncing", label: "Syncing" },
    { value: "Completed", label: "Completed" },
  ]

  const typeOptions = [
    { value: "Early Renewal", label: "Early Renewal" },
    { value: "Existing Customer - Upgrade", label: "Existing Customer - Upgrade" },
    { value: "New Customer", label: "New Customer" },
    { value: "Existing Customer - Replacement", label: "Existing Customer - Replacement" },
  ]

  const fieldOptions = [
    { value: "Start Date", label: "Start Date" },
    { value: "End Date", label: "End Date" },
    { value: "Billing Frequency", label: "Billing Frequency" },
    { value: "Total Contract Value", label: "Total Contract Value" },
    { value: "Contract Terms", label: "Contract Terms" },
    { value: "Discounts", label: "Discounts" },
    { value: "Payment Terms", label: "Payment Terms" },
    { value: "Termination Clause", label: "Termination Clause" },
    { value: "Products", label: "Products" },
  ]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOpportunities(sortedOpportunities.map((opp) => opp.id))
    } else {
      setSelectedOpportunities([])
    }
  }

  const handleSelectOpportunity = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOpportunities([...selectedOpportunities, id])
    } else {
      setSelectedOpportunities(selectedOpportunities.filter((oppId) => oppId !== id))
    }
  }

  const handleUnselectAll = () => {
    setSelectedOpportunities([])
  }

  const handleDeleteSelected = () => {
    // In a real app, this would delete the selected opportunities
    console.log("Deleting opportunities:", selectedOpportunities)
    setSelectedOpportunities([])
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-blue-600"
    if (progress >= 50) return "bg-blue-500"
    return "bg-blue-400"
  }

  const getUnresolvedFieldsColor = (count: number) => {
    if (count === 0) return "text-green-600"
    if (count < 10) return "text-orange-500"
    if (count < 50) return "text-orange-600"
    return "text-red-600"
  }

  const handleSaveFilters = () => {
    if (filterName.trim()) {
      const newFilter: SavedFilter = {
        id: Date.now().toString(),
        name: filterName.trim(),
        filters: {
          progress: progressFilter,
          type: typeFilter,
          fields: fieldsFilter,
          dateRange: `${dateRange.from?.toISOString() || ""}-${dateRange.to?.toISOString() || ""}`,
        },
      }
      setSavedFilters([...savedFilters, newFilter])

      // Store the filter state for the new tab
      setTabFilterStates((prev) => ({
        ...prev,
        [newFilter.id]: {
          progressFilter: [...progressFilter],
          typeFilter: [...typeFilter],
          fieldsFilter: [...fieldsFilter],
          dateRange: { ...dateRange },
        },
      }))

      setShowSaveDialog(false)
      setFilterName("")
      setActiveTab(newFilter.id)
      setHasFilterChanges(false)
    }
  }

  const handleClearFilters = () => {
    setProgressFilter([])
    setTypeFilter([])
    setFieldsFilter([])
    setDateRange({ from: undefined, to: undefined })
  }

  const handleProgressFilterSelect = (values: string[]) => {
    setProgressFilter(values)
  }

  const handleTypeFilterSelect = (values: string[]) => {
    setTypeFilter(values)
  }

  const handleFieldsSelect = (values: string[]) => {
    setFieldsFilter(values)
  }

  const applyFilter = (filter: SavedFilter) => {
    setProgressFilter([...filter.filters.progress])
    setTypeFilter([...filter.filters.type])
    setFieldsFilter([...filter.filters.fields])

    // Parse saved date range
    let parsedDateRange = { from: undefined, to: undefined }
    if (filter.filters.dateRange) {
      const [fromStr, toStr] = filter.filters.dateRange.split("-")
      parsedDateRange = {
        from: fromStr ? new Date(fromStr) : undefined,
        to: toStr ? new Date(toStr) : undefined,
      }
    }
    setDateRange(parsedDateRange)

    // Store the original state for this tab
    setTabFilterStates((prev) => ({
      ...prev,
      [filter.id]: {
        progressFilter: [...filter.filters.progress],
        typeFilter: [...filter.filters.type],
        fieldsFilter: [...filter.filters.fields],
        dateRange: { ...parsedDateRange },
      },
    }))

    setHasFilterChanges(false)
  }

  const handleUpdateFilters = () => {
    const filterToUpdate = savedFilters.find((f) => f.id === activeTab)
    if (filterToUpdate) {
      const updatedFilter: SavedFilter = {
        ...filterToUpdate,
        filters: {
          progress: [...progressFilter],
          type: [...typeFilter],
          fields: [...fieldsFilter],
          dateRange: `${dateRange.from?.toISOString() || ""}-${dateRange.to?.toISOString() || ""}`,
        },
      }

      setSavedFilters((prev) => prev.map((f) => (f.id === activeTab ? updatedFilter : f)))

      // Update the stored state for this tab
      setTabFilterStates((prev) => ({
        ...prev,
        [activeTab]: {
          progressFilter: [...progressFilter],
          typeFilter: [...typeFilter],
          fieldsFilter: [...fieldsFilter],
          dateRange: { ...dateRange },
        },
      }))

      setHasFilterChanges(false)
    }
  }

  const handleDeleteFilter = () => {
    const filterToDelete = savedFilters.find((f) => f.id === activeTab)
    if (filterToDelete) {
      setFilterToDelete(filterToDelete)
      setShowDeleteDialog(true)
    }
  }

  const confirmDeleteFilter = () => {
    if (filterToDelete) {
      setSavedFilters((prev) => prev.filter((f) => f.id !== filterToDelete.id))
      setTabFilterStates((prev) => {
        const newState = { ...prev }
        delete newState[filterToDelete.id]
        return newState
      })
      setActiveTab("all")
      handleClearFilters()
      setShowDeleteDialog(false)
      setFilterToDelete(null)
    }
  }

  const tabs = [
    { id: "all", label: "All", content: null },
    ...savedFilters.map((filter) => ({
      id: filter.id,
      label: filter.name.length > 10 ? filter.name.substring(0, 10) + "..." : filter.name,
      content: null,
    })),
  ]

  const handleRowClick = (opportunityId: string) => {
    const opportunity = allOpportunities.find((opp) => opp.id === opportunityId) // Use allOpportunities to get full data
    if (opportunity) {
      setSelectedOpportunity(opportunity)
      setShowReviewPanel(true)
    }
  }

  // Trend formatting and icon functions
  const formatTrendChange = (change: number) => {
    if (change === 0) return "0%"
    return `${Math.abs(change)}%`
  }

  const getTrendColor = (change: number, isPositiveGood = true) => {
    if (change === 0) return "text-gray-600"

    if (isPositiveGood) {
      // For metrics where positive change is good (opportunities, reviewed, match rates)
      return change > 0 ? "text-green-600" : "text-red-600"
    } else {
      // For metrics where positive change is bad (discrepancies)
      return change > 0 ? "text-red-600" : "text-green-600"
    }
  }

  const getTrendIcon = (change: number, isPositiveGood = true) => {
    if (change === 0) return null

    const iconClass = "w-3 h-3"

    if (isPositiveGood) {
      return change > 0 ? (
        <TrendingUp className={`${iconClass} text-green-600`} />
      ) : (
        <TrendingDown className={`${iconClass} text-red-600`} />
      )
    } else {
      return change > 0 ? (
        <TrendingUp className={`${iconClass} text-red-600`} />
      ) : (
        <TrendingDown className={`${iconClass} text-green-600`} />
      )
    }
  }

  // Navigation menu items
  const navigationItems = [
    { label: "Deals", href: "/" },
    { label: "Analytics", href: "/analytics" },
    { label: "Settings", href: "#" },
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img src="/logo.svg" alt="trustedIQ" className="h-5" />
              <AppNavigationMenu items={navigationItems} />
            </div>
            <div className="text-gray-900 font-semibold text-xs leading-none">Sarah Chen</div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 text-left">Total Opportunities</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center" className="max-w-xs">
                    <p>Total number of opportunities matching the current filters.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-gray-900">{metrics.totalOpportunities}</div>
              </div>
              <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.opportunitiesChange, true)}`}>
                {getTrendIcon(metrics.opportunitiesChange, true)}
                {formatTrendChange(metrics.opportunitiesChange)} over the last 6 months
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Need Review</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center" className="max-w-xs">
                    <p>Number of opportunities that still have unresolved fields matching the current filters.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-gray-900">
                  {metrics.totalOpportunities - metrics.totalReviewed}
                </div>
              </div>
              <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.discrepanciesChange, false)}`}>
                {getTrendIcon(metrics.discrepanciesChange, false)}
                {formatTrendChange(metrics.discrepanciesChange)} over the last 6 months
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Reviewed</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center" className="max-w-xs">
                    <p>
                      Number of opportunities that have been fully reviewed and have no unresolved fields matching the
                      current filters.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-gray-900">{metrics.totalReviewed}</div>
              </div>
              <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.reviewedChange, true)}`}>
                {getTrendIcon(metrics.reviewedChange, true)}
                {formatTrendChange(metrics.reviewedChange)} over the last 6 months
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Field Match Rate</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center" className="max-w-xs">
                    <p>
                      Percentage of fields where the Salesforce value matches the value(s) extracted from associated
                      documents, for opportunities matching the current filters.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-gray-900">{metrics.fieldMatchRate}%</div>
              </div>
              <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.matchRateChange, true)}`}>
                {getTrendIcon(metrics.matchRateChange, true)}
                {formatTrendChange(metrics.matchRateChange)}% over the last 6 months
              </div>
            </Card>
          </div>

          {/* Tabs for saved filters */}
          {savedFilters.length > 0 && (
            <div className="mb-6">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(tabId) => {
                  // Store current filter state before switching
                  if (activeTab !== "all") {
                    setTabFilterStates((prev) => ({
                      ...prev,
                      [activeTab]: {
                        progressFilter: [...progressFilter],
                        typeFilter: [...typeFilter],
                        fieldsFilter: [...fieldsFilter],
                        dateRange: { ...dateRange },
                      },
                    }))
                  }

                  setActiveTab(tabId)
                  if (tabId === "all") {
                    handleClearFilters()
                  } else {
                    const filter = savedFilters.find((f) => f.id === tabId)
                    if (filter) {
                      // Check if we have stored state for this tab
                      const storedState = tabFilterStates[tabId]
                      if (storedState) {
                        setProgressFilter([...storedState.progressFilter])
                        setTypeFilter([...storedState.typeFilter])
                        setFieldsFilter([...storedState.fieldsFilter])
                        setDateRange({ ...storedState.dateRange })
                      } else {
                        applyFilter(filter)
                      }
                    }
                  }
                }}
              />
            </div>
          )}

          {/* Opportunities Section */}
          <div className="bg-white">
            <div className="py-6">
              <div className="flex items-center justify-between mb-4 px-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Opportunities</h2>
                  <p className="text-sm text-gray-500">All Opportunities being loaded from Salesforce.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    className="flex items-center space-x-2 bg-blue-950 text-white hover:bg-blue-900"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 text-white" />
                    <span>{savedFilters.length > 0 && activeTab !== "all" ? "Edit Filters" : "Filters"}</span>
                  </Button>
                </div>
              </div>

              {/* Filter Controls */}
              {showFilters && (
                <div className="flex items-center space-x-3 mb-6 px-0">
                  <FilterDropdown
                    label="Progress"
                    placeholder="Review Progress"
                    value={progressFilter}
                    options={progressOptions}
                    onSelect={handleProgressFilterSelect}
                  />

                  <FilterDropdown
                    label="Type"
                    value={typeFilter}
                    options={typeOptions}
                    onSelect={handleTypeFilterSelect}
                  />

                  <FilterDropdown
                    label="Fields"
                    placeholder="All Fields"
                    value={fieldsFilter}
                    options={fieldOptions}
                    onSelect={handleFieldsSelect}
                  />

                  <DateRangePicker value={dateRange} onSelect={setDateRange} placeholder="Date Range" />

                  <div className="flex-1" />

                  {activeTab === "all" ? (
                    // Show Clear and Save Filters for "All" tab
                    <div className="flex space-x-3">
                      <Button variant="ghost" onClick={handleClearFilters} disabled={!hasActiveFilters()}>
                        Clear
                      </Button>
                      <Button onClick={() => setShowSaveDialog(true)} disabled={!hasActiveFilters()}>
                        Save Filters
                      </Button>
                    </div>
                  ) : (
                    // Show Delete and Update Filters for saved filter tabs
                    <div className="flex space-x-3">
                      <Button
                        variant="ghost"
                        onClick={handleDeleteFilter}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                      <Button onClick={handleUpdateFilters} disabled={!hasFilterChanges}>
                        Update Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-white">
                  <tr className="group border-b border-gray-200">
                    <th className="p-2 w-12 h-[52px] align-middle text-left">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={
                            selectedOpportunities.length === sortedOpportunities.length &&
                            sortedOpportunities.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                          className={`${
                            selectedOpportunities.length > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          } transition-opacity`}
                        />
                      </div>
                    </th>
                    <th
                      className={`p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[300px] h-[52px] align-middle ${getSortableHeaderClass("name")}`}
                      onClick={() => handleSort("name")}
                      onMouseEnter={() => setHoveredColumn("name")}
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Opportunity Name</span>
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      className={`p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[180px] h-[52px] align-middle ${getSortableHeaderClass("accountName")}`}
                      onClick={() => handleSort("accountName")}
                      onMouseEnter={() => setHoveredColumn("accountName")}
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Account Name</span>
                        {getSortIcon("accountName")}
                      </div>
                    </th>
                    <th
                      className={`p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[240px] h-[52px] align-middle ${getSortableHeaderClass("type")}`}
                      onClick={() => handleSort("type")}
                      onMouseEnter={() => setHoveredColumn("type")}
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Opportunity Type</span>
                        {getSortIcon("type")}
                      </div>
                    </th>
                    <th
                      className={`p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[144px] h-[52px] align-middle ${getSortableHeaderClass("reviewProgress")}`}
                      onClick={() => handleSort("reviewProgress")}
                      onMouseEnter={() => setHoveredColumn("reviewProgress")}
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Review Progress</span>
                        {getSortIcon("reviewProgress")}
                      </div>
                    </th>
                    <th
                      className={`p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[120px] h-[52px] align-middle ${getSortableHeaderClass("unresolvedFields")}`}
                      onClick={() => handleSort("unresolvedFields")}
                      onMouseEnter={() => setHoveredColumn("unresolvedFields")}
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Unresolved Fields</span>
                        {getSortIcon("unresolvedFields")}
                      </div>
                    </th>
                    <th
                      className={`p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[120px] h-[52px] align-middle ${getSortableHeaderClass("lastSyncedTimestamp")}`}
                      onClick={() => handleSort("lastSyncedTimestamp")}
                      onMouseEnter={() => setHoveredColumn("lastSyncedTimestamp")}
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Last Synced</span>
                        {getSortIcon("lastSyncedTimestamp")}
                      </div>
                    </th>
                    {fieldsFilter.length > 0 && (
                      <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[200px] h-[52px] align-middle">
                        Fields
                      </th>
                    )}
                    <th className="p-2 w-12 h-[52px] align-middle"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOpportunities.map((opportunity) => {
                    // Filter opportunity fields to only show those that match the current filter
                    const matchingFields = opportunity.fields?.filter((field) => fieldsFilter.includes(field)) || []
                    const isSelected = selectedOpportunities.includes(opportunity.id)

                    return (
                      <tr
                        key={opportunity.id}
                        className="group hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(opportunity.id)}
                      >
                        <td className="p-2 w-12 h-[52px] align-middle" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectOpportunity(opportunity.id, checked)}
                              className={`${
                                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              } transition-opacity`}
                            />
                          </div>
                        </td>
                        <td className="p-2 relative min-w-[300px] h-[52px] align-middle">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm font-medium text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
                                {opportunity.name}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start">
                              <p>{opportunity.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-2 relative min-w-[180px] h-[52px] align-middle">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
                                {opportunity.accountName}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start">
                              <p>{opportunity.accountName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-2 relative min-w-[240px] h-[52px] align-middle py-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis leading-4 cursor-pointer">
                                {opportunity.type}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start">
                              <p>{opportunity.type}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-2 min-w-[144px] h-[52px] align-middle">
                          {opportunity.status === "Reviewed" ? (
                            <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
                              Reviewed
                            </Badge>
                          ) : (
                            <div className="w-24">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(opportunity.reviewProgress)}`}
                                  style={{ width: `${opportunity.reviewProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-2 min-w-[120px] h-[52px] align-middle">
                          <span
                            className={`text-sm font-medium ${getUnresolvedFieldsColor(opportunity.unresolvedFields)}`}
                          >
                            {opportunity.unresolvedFields}
                          </span>
                        </td>
                        <td className="p-2 relative min-w-[120px] h-[52px] align-middle">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
                                {opportunity.lastSynced}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start">
                              <p>{opportunity.lastSynced}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        {fieldsFilter.length > 0 && (
                          <td className="p-2 min-w-[200px] h-[52px] align-middle">
                            <FieldPills fields={matchingFields} />
                          </td>
                        )}
                        <td className="p-2 w-12 h-[52px] align-middle" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu
                            trigger={
                              <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                              </button>
                            }
                            items={[
                              { label: "View Details", onClick: () => console.log("View details") },
                              { label: "Edit", onClick: () => console.log("Edit") },
                              { label: "Delete", onClick: () => console.log("Delete") },
                            ]}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selection Bar */}
        <SelectionBar
          selectedCount={selectedOpportunities.length}
          onUnselect={handleUnselectAll}
          onDelete={handleDeleteSelected}
        />

        {/* Save Filter Dialog */}
        <Dialog
          open={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          title="Give your filters a name"
          description="Filters will be saved for future quick access."
          content={
            <div className="space-y-4">
              <Input
                placeholder="Example: New customers renewal start dates"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          }
          footer={
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFilters} disabled={!filterName.trim()}>
                Save
              </Button>
            </div>
          }
        />

        {/* Delete Filter Confirmation Dialog */}
        <Dialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title={`Delete "${filterToDelete?.name}" filter?`}
          description="This action cannot be undone."
          content={
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the '{filterToDelete?.name}' filter? This action cannot be undone.
            </p>
          }
          footer={
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteFilter}>
                Delete Filter
              </Button>
            </div>
          }
        />

        {/* Review Panel */}
        <ReviewPanel
          isOpen={showReviewPanel}
          onClose={() => setShowReviewPanel(false)}
          dealData={selectedOpportunity ? getMockDealData(selectedOpportunity) : mockDealData}
          fieldsFilter={fieldsFilter}
        />
      </div>
    </TooltipProvider>
  )
}
