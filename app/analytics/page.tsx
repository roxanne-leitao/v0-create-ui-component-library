"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/button"
import { FilterDropdown } from "@/components/filter-dropdown"
import { DateRangePicker } from "@/components/date-range-picker"
import { AppNavigationMenu } from "@/components/navigation-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Filter, Info, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react"
import {
  generateMockOpportunities,
  filterOpportunities,
  calculateMetrics,
  calculateFieldDiscrepancies,
  getUpcomingRenewals,
  type ChartData,
} from "@/lib/data"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export default function Analytics() {
  const [showFilters, setShowFilters] = useState(false)
  const [progressFilter, setProgressFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [showAllRenewals, setShowAllRenewals] = useState(false)

  // Centralized mock data generation
  const allOpportunities = useMemo(() => generateMockOpportunities(), [])

  // Filter opportunities based on current filters
  const filteredOpportunities = useMemo(() => {
    return filterOpportunities(allOpportunities, "", progressFilter, typeFilter, [], dateRange)
  }, [allOpportunities, progressFilter, typeFilter, dateRange])

  // Generate chart data from filtered opportunities
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

  // Calculate field discrepancies
  const fieldDiscrepancies = useMemo(() => calculateFieldDiscrepancies(filteredOpportunities), [filteredOpportunities])
  const topFieldDiscrepancies = fieldDiscrepancies.slice(0, 4)

  // Calculate summary metrics
  const metrics = useMemo(() => calculateMetrics(filteredOpportunities, chartData), [filteredOpportunities, chartData])

  // Get upcoming renewals
  const upcomingRenewals = useMemo(() => getUpcomingRenewals(allOpportunities), [allOpportunities])

  // Calculate displayed renewals based on showAllRenewals state
  const displayedRenewals = useMemo(() => {
    if (showAllRenewals || upcomingRenewals.length <= 10) {
      return upcomingRenewals
    }
    return upcomingRenewals.slice(0, 10)
  }, [upcomingRenewals, showAllRenewals])

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

  const handleClearFilters = () => {
    setProgressFilter([])
    setTypeFilter([])
    setDateRange({ from: undefined, to: undefined })
  }

  const hasActiveFilters = () => {
    return progressFilter.length > 0 || typeFilter.length > 0 || dateRange.from || dateRange.to
  }

  const hasData = chartData.some((data) => data.totalOpportunities > 0)

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

    const isUpward = change > 0
    const shouldShowUpIcon = isPositiveGood ? isUpward : !isUpward

    return shouldShowUpIcon ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />
  }

  // Prepare critical field chart data (sorted ascending)
  const criticalFieldChartData = [
    {
      field: "Discount Rate",
      displayField: "Discount Rate",
      rate: Math.round(chartData.reduce((sum, d) => sum + d.discountRateMatch, 0) / chartData.length) || 0,
    },
    {
      field: "Renewal Date",
      displayField: "Renewal Date",
      rate: Math.round(chartData.reduce((sum, d) => sum + d.renewalDateMatch, 0) / chartData.length) || 0,
    },
    {
      field: "Contract Value",
      displayField: "Contract Value",
      rate: Math.round(chartData.reduce((sum, d) => sum + d.contractValueMatch, 0) / chartData.length) || 0,
    },
    {
      field: "Payment Terms",
      displayField: "Payment Terms",
      rate: Math.round(chartData.reduce((sum, d) => sum + d.paymentTermsMatch, 0) / chartData.length) || 0,
    },
  ].sort((a, b) => a.rate - b.rate) // Ascending order

  // Prepare top discrepancy chart data (sorted ascending)
  const topDiscrepancyChartData = topFieldDiscrepancies
    .map((field) => ({
      field: field.fieldName,
      displayField: field.fieldName.length > 12 ? field.fieldName.substring(0, 12) + "..." : field.fieldName,
      rate: field.discrepancyRate,
    }))
    .sort((a, b) => a.rate - b.rate) // Ascending order

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

    return `in ${diffDays} days, ${formattedDate}`
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
          {/* Page Header with Filters */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-500">Performance metrics and trends over the last 6 months.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                className="flex items-center space-x-2 bg-blue-950 text-white hover:bg-blue-900"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 text-white" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="flex items-center space-x-3 mb-8 p-4 bg-gray-50 rounded-lg">
              <FilterDropdown
                label="Progress"
                placeholder="Review Progress"
                value={progressFilter}
                options={progressOptions}
                onSelect={setProgressFilter}
              />

              <FilterDropdown
                label="Type"
                placeholder="Opportunity Type"
                value={typeFilter}
                options={typeOptions}
                onSelect={setTypeFilter}
              />

              <DateRangePicker value={dateRange} onSelect={setDateRange} placeholder="Date Range" />

              <div className="flex-1" />

              <Button variant="ghost" onClick={handleClearFilters} disabled={!hasActiveFilters()}>
                Clear
              </Button>
            </div>
          )}

          {/* No Data Message */}
          {!hasData && (
            <div className="text-center py-8 mb-8">
              <p className="text-gray-500 text-lg">No data to display. Try changing your Filters.</p>
            </div>
          )}

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Total Opportunities */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-gray-900">Total Opportunities</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" className="max-w-xs">
                      <p>All Opportunities imported from Salesforce over the last 6 months.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{metrics.totalOpportunities}</div>
                <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.opportunitiesChange, true)}`}>
                  {getTrendIcon(metrics.opportunitiesChange, true)}
                  <span>{formatTrendChange(metrics.opportunitiesChange)} over the last 6 months</span>
                </div>
              </div>
              <div className="h-64">
                <ChartContainer
                  config={{
                    totalOpportunities: {
                      label: "Total Opportunities",
                      color: "#2563eb",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                      />
                      <YAxis hide />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-sm text-gray-600">{`Total Opportunities: ${payload[0].value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="totalOpportunities" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            {/* Opportunities Reviewed */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-gray-900">Opportunities Reviewed</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" className="max-w-xs">
                      <p>Number of Opportunities that have been fully reviewed over the last 6 months.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{metrics.totalReviewed}</div>
                <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.reviewedChange, true)}`}>
                  {getTrendIcon(metrics.reviewedChange, true)}
                  <span>{formatTrendChange(metrics.reviewedChange)} over the last 6 months</span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ChartContainer
                  config={{
                    reviewedOpportunities: {
                      label: "Opportunities Reviewed",
                      color: "#2563eb",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                      />
                      <YAxis hide />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-sm text-gray-600">{`Opportunities Reviewed: ${payload[0].value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="reviewedOpportunities" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            {/* Field Match Rate */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-gray-900">Field Match Rate</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" className="max-w-xs">
                      <p>
                        Percentage of fields where the Salesforce value matches the value(s) extracted from associated
                        documents, over the last 6 months.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{metrics.fieldMatchRate}%</div>
                <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.matchRateChange, true)}`}>
                  {getTrendIcon(metrics.matchRateChange, true)}
                  <span>{formatTrendChange(metrics.matchRateChange)}% over the last 6 months</span>
                </div>
              </div>
              <div className="h-64">
                <ChartContainer
                  config={{
                    fieldMatchRate: {
                      label: "Field Match Rate",
                      color: "#2563eb",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                      />
                      <YAxis hide />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-sm text-gray-600">{`Field Match Rate: ${payload[0].value}%`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="fieldMatchRate" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            {/* Field Discrepancies - Stacked Bar Chart */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-gray-900">Field Discrepancies</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" className="max-w-xs">
                      <p>
                        Fields where Salesforce values do not match extracted values with Fields where values match.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{metrics.totalDiscrepancies}</div>
                <div className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.discrepanciesChange, false)}`}>
                  {getTrendIcon(metrics.discrepanciesChange, false)}
                  <span>{formatTrendChange(metrics.discrepanciesChange)} over the last 6 months</span>
                </div>
              </div>
              <div className="h-64">
                <ChartContainer
                  config={{
                    matchingFields: {
                      label: "Matching Fields",
                      color: "#2563eb",
                    },
                    nonMatchingFields: {
                      label: "Non-matching Fields",
                      color: "#f97316",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                      />
                      <YAxis hide />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-sm text-gray-600">{`Non-matching Fields: ${payload.find((p) => p.dataKey === "nonMatchingFields")?.value || 0}`}</p>
                                <p className="text-sm text-gray-600">{`Matching Fields: ${payload.find((p) => p.dataKey === "matchingFields")?.value || 0}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="matchingFields" stackId="fields" fill="#2563eb" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="nonMatchingFields" stackId="fields" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            {/* Critical Field Match Rate */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-gray-900">Critical Field Match Rate</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" className="max-w-xs">
                      <p>
                        Field Match Rate for critical fields: Discount Rate, Renewal Date, Contract Value, and Payment
                        Terms.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {Math.round(
                    criticalFieldChartData.reduce((sum, d) => sum + d.rate, 0) / criticalFieldChartData.length,
                  ) || 0}
                  %
                </div>
                <div
                  className={`text-sm flex items-center gap-1 ${getTrendColor(metrics.criticalFieldMatchRateChange, true)}`}
                >
                  {getTrendIcon(metrics.criticalFieldMatchRateChange, true)}
                  <span>{formatTrendChange(metrics.criticalFieldMatchRateChange)}% over the last 6 months</span>
                </div>
              </div>
              <div className="h-64">
                <ChartContainer
                  config={{
                    rate: {
                      label: "Match Rate",
                      color: "#2563eb",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={criticalFieldChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <XAxis
                        dataKey="displayField"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        interval={0}
                      />
                      <YAxis hide />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const originalField =
                              criticalFieldChartData.find((d) => d.displayField === label)?.field || label
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{originalField}</p>
                                <p className="text-sm text-gray-600">{`Match Rate: ${payload[0].value}%`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            {/* Top Fields by Discrepancy Rate */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-gray-900">Top Fields by Discrepancy Rate</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" className="max-w-xs">
                      <p>The 4 fields with the highest discrepancy rates between Salesforce and extracted values.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {topDiscrepancyChartData.length > 0
                    ? Math.round(
                        topDiscrepancyChartData.reduce((sum, d) => sum + d.rate, 0) / topDiscrepancyChartData.length,
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm flex items-center gap-1 text-red-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>26% over the last 6 months</span>
                </div>
              </div>
              <div className="h-64">
                <ChartContainer
                  config={{
                    rate: {
                      label: "Discrepancy Rate",
                      color: "#2563eb",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topDiscrepancyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <XAxis
                        dataKey="displayField"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        interval={0}
                      />
                      <YAxis hide />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const originalField =
                              topDiscrepancyChartData.find((d) => d.displayField === label)?.field || label
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{originalField}</p>
                                <p className="text-sm text-gray-600">{`Discrepancy Rate: ${payload[0].value}%`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>
          </div>

          {/* Upcoming Renewals Table */}
          <div className="bg-white">
            <div className="py-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4 px-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming renewals</h2>
                  <p className="text-sm text-gray-500">Opportunities coming up for renewal in the next 90 days.</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[300px] h-[52px] align-middle">
                      Opportunity
                    </th>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[180px] h-[52px] align-middle">
                      Customer
                    </th>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[180px] h-[52px] align-middle">
                      Total Contract Value
                    </th>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 tracking-wider min-w-[200px] h-[52px] align-middle">
                      Renewal Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedRenewals.map((opportunity, index) => (
                    <tr
                      key={opportunity.id}
                      className={`hover:bg-gray-50 transition-all duration-300 ease-in-out ${
                        index >= 10 && showAllRenewals ? "animate-fadeIn" : ""
                      }`}
                      style={{
                        animationDelay: index >= 10 ? `${(index - 10) * 50}ms` : "0ms",
                      }}
                    >
                      <td className="p-2 relative min-w-[300px] h-[52px] align-middle">
                        <div className="text-sm font-medium text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis">
                          {opportunity.name}
                        </div>
                      </td>
                      <td className="p-2 relative min-w-[180px] h-[52px] align-middle">
                        <div className="text-sm text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis">
                          {opportunity.accountName}
                        </div>
                      </td>
                      <td className="p-2 relative min-w-[180px] h-[52px] align-middle">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatCurrency(opportunity.totalContractValue)}
                        </div>
                      </td>
                      <td className="p-2 relative min-w-[200px] h-[52px] align-middle">
                        <div className="text-sm text-gray-900">{formatDate(opportunity.renewalDate)}</div>
                      </td>
                    </tr>
                  ))}
                  {upcomingRenewals.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        No upcoming renewals in the next 90 days.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* See All CTA */}
            {upcomingRenewals.length > 10 && (
              <div className="flex justify-center py-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => setShowAllRenewals(!showAllRenewals)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <span>{showAllRenewals ? "Show less" : `See all ${upcomingRenewals.length} renewals`}</span>
                  {showAllRenewals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Add CSS for fade-in animation */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </TooltipProvider>
  )
}
