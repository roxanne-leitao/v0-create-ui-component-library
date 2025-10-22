import type { Opportunity } from "@/app/page"

export interface ChartData {
  month: string
  totalOpportunities: number
  reviewedOpportunities: number
  fieldMatchRate: number
  matchingFields: number
  nonMatchingFields: number
  criticalFieldMatchRate: number
  discountRateMatch: number
  renewalDateMatch: number
  contractValueMatch: number
  paymentTermsMatch: number
}

export interface FieldDiscrepancy {
  fieldName: string
  discrepancyRate: number
  totalFields: number
  discrepancies: number
}

/**
 * Formats a timestamp into a human-readable relative time string
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date()
  const syncTime = new Date(timestamp)
  const diffMs = now.getTime() - syncTime.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    if (diffMinutes < 5) return "Just now"
    return `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    if (diffHours < 6) return `${diffHours} hours ago`
    if (diffHours < 12) return "This morning"
    return "Earlier today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return syncTime.toLocaleDateString()
  }
}

/**
 * Generates a comprehensive mock dataset of opportunities for the last 6 months.
 * Follows realistic business patterns with seasonal variations matching financial quarters.
 */
export const generateMockOpportunities = (): Opportunity[] => {
  const months = [
    { name: "Mar", index: 0, year: 2025, isQuarterEnd: true }, // Q1 end - high activity
    { name: "Apr", index: 1, year: 2025, isQuarterEnd: false },
    { name: "May", index: 2, year: 2025, isQuarterEnd: false },
    { name: "Jun", index: 3, year: 2025, isQuarterEnd: true }, // Q2 end - high activity
    { name: "Jul", index: 4, year: 2025, isQuarterEnd: false },
    { name: "Aug", index: 5, year: 2025, isQuarterEnd: false },
  ]

  const progressTypes: ("For Review" | "Syncing" | "Completed")[] = ["For Review", "Syncing", "Completed"]
  const opportunityTypes: (
    | "Early Renewal"
    | "Existing Customer - Upgrade"
    | "New Customer"
    | "Existing Customer - Replacement"
  )[] = ["Early Renewal", "Existing Customer - Upgrade", "New Customer", "Existing Customer - Replacement"]
  const possibleFields = [
    "Start Date",
    "End Date",
    "Billing Frequency",
    "Total Contract Value",
    "Contract Terms",
    "Discounts",
    "Payment Terms",
    "Termination Clause",
    "Products",
    "Discount Rate",
    "Renewal Date",
    "Contract Value",
    "Service Location",
    "Contract Term Length",
    "Service Start Date",
  ]

  const criticalFields = ["Discount Rate", "Renewal Date", "Contract Value", "Payment Terms"]

  const companyNames = [
    "Acme Corp",
    "TechStart Inc",
    "Global Solutions",
    "Innovation Labs",
    "DataFlow Systems",
    "CloudTech",
    "NextGen Solutions",
    "Digital Dynamics",
    "Enterprise Systems",
    "Future Tech",
    "Smart Solutions",
    "Quantum Corp",
    "Velocity Inc",
    "Pinnacle Group",
    "Synergy Systems",
    "Apex Technologies",
    "CloudSync Solutions",
    "InnovateTech",
    "FlexiCRM LTD",
    "NextGen SaaS",
    "TechWave Solutions",
  ]

  const opportunities: Opportunity[] = []
  let idCounter = 1

  months.forEach(({ name, index, year, isQuarterEnd }) => {
    // Seasonal business patterns - quarter ends have more activity
    const baseOpportunities = isQuarterEnd ? 55 + Math.floor(Math.random() * 15) : 35 + Math.floor(Math.random() * 10)

    // Realistic review patterns with ups and downs
    const reviewPatterns = [
      { reviewed: 15, rate: 0.25 }, // Mar - Q1 end, moderate reviews
      { reviewed: 28, rate: 0.35 }, // Apr - post-quarter cleanup
      { reviewed: 22, rate: 0.3 }, // May - mid-quarter dip
      { reviewed: 45, rate: 0.5 }, // Jun - Q2 end, high reviews
      { reviewed: 31, rate: 0.4 }, // Jul - post-quarter
      { reviewed: 38, rate: 0.45 }, // Aug - steady improvement
    ]

    const monthPattern = reviewPatterns[index]

    const monthDistributions = {
      0: {
        // March - Q1 end
        progress: [0.4, 0.35, 0.25],
        type: [0.3, 0.25, 0.35, 0.1],
        avgFieldMatches: 8,
        avgFieldDiscrepancies: 12,
        criticalFieldMatches: 6,
        criticalFieldDiscrepancies: 8,
      },
      1: {
        // April - post-quarter
        progress: [0.35, 0.3, 0.35],
        type: [0.25, 0.3, 0.35, 0.1],
        avgFieldMatches: 11,
        avgFieldDiscrepancies: 10,
        criticalFieldMatches: 8,
        criticalFieldDiscrepancies: 6,
      },
      2: {
        // May - mid-quarter
        progress: [0.45, 0.25, 0.3],
        type: [0.2, 0.35, 0.35, 0.1],
        avgFieldMatches: 9,
        avgFieldDiscrepancies: 11,
        criticalFieldMatches: 7,
        criticalFieldDiscrepancies: 7,
      },
      3: {
        // June - Q2 end
        progress: [0.25, 0.25, 0.5],
        type: [0.35, 0.3, 0.25, 0.1],
        avgFieldMatches: 15,
        avgFieldDiscrepancies: 7,
        criticalFieldMatches: 11,
        criticalFieldDiscrepancies: 3,
      },
      4: {
        // July - post-quarter
        progress: [0.3, 0.2, 0.5],
        type: [0.4, 0.25, 0.25, 0.1],
        avgFieldMatches: 13,
        avgFieldDiscrepancies: 8,
        criticalFieldMatches: 10,
        criticalFieldDiscrepancies: 4,
      },
      5: {
        // August - steady
        progress: [0.28, 0.22, 0.5],
        type: [0.35, 0.3, 0.25, 0.1],
        avgFieldMatches: 14,
        avgFieldDiscrepancies: 7,
        criticalFieldMatches: 11,
        criticalFieldDiscrepancies: 3,
      },
    }

    const distribution = monthDistributions[index as keyof typeof monthDistributions]

    for (let i = 0; i < baseOpportunities; i++) {
      // Assign progress based on distribution
      const progressRand = Math.random()
      let progress: "For Review" | "Syncing" | "Completed"
      if (progressRand < distribution.progress[0]) {
        progress = "For Review"
      } else if (progressRand < distribution.progress[0] + distribution.progress[1]) {
        progress = "Syncing"
      } else {
        progress = "Completed"
      }

      // Assign type based on distribution
      const typeRand = Math.random()
      let type: "Early Renewal" | "Existing Customer - Upgrade" | "New Customer" | "Existing Customer - Replacement"
      if (typeRand < distribution.type[0]) {
        type = "Early Renewal"
      } else if (typeRand < distribution.type[0] + distribution.type[1]) {
        type = "Existing Customer - Upgrade"
      } else if (typeRand < distribution.type[0] + distribution.type[1] + distribution.type[2]) {
        type = "New Customer"
      } else {
        type = "Existing Customer - Replacement"
      }

      // Generate field matches and discrepancies with realistic variation
      const fieldMatches = Math.max(1, Math.round(distribution.avgFieldMatches + (Math.random() - 0.5) * 6))
      const fieldDiscrepancies = Math.max(0, Math.round(distribution.avgFieldDiscrepancies + (Math.random() - 0.5) * 4))

      // Generate critical field data
      const criticalFieldMatches = Math.max(
        1,
        Math.round(distribution.criticalFieldMatches + (Math.random() - 0.5) * 4),
      )
      const criticalFieldDiscrepancies = Math.max(
        0,
        Math.round(distribution.criticalFieldDiscrepancies + (Math.random() - 0.5) * 3),
      )

      const unresolvedFields = fieldDiscrepancies
      const totalFields = fieldMatches + fieldDiscrepancies
      const reviewProgress = totalFields > 0 ? Math.round((fieldMatches / totalFields) * 100) : 100

      // Reviewed status: true if no unresolved fields OR if it's a completed opportunity
      const reviewed = unresolvedFields === 0 || progress === "Completed"

      // Generate dates with good spread throughout the month (not just boundaries)
      const daysInMonth = new Date(year, index + 1, 0).getDate()
      const day = Math.floor(Math.random() * daysInMonth) + 1
      const hour = Math.floor(Math.random() * 24)
      const minute = Math.floor(Math.random() * 60)

      const closedWonDate = new Date(year, index, day, hour, minute).toISOString().split("T")[0]

      // Generate renewal date distributed across next 12 months
      let renewalDate: string
      const today = new Date()
      const monthsFromNow = Math.floor(Math.random() * 12) + 1 // 1-12 months from now
      const daysOffset = Math.floor(Math.random() * 30) // Random day within the month
      const renewal = new Date(today)
      renewal.setMonth(renewal.getMonth() + monthsFromNow)
      renewal.setDate(
        Math.min(renewal.getDate() + daysOffset, new Date(renewal.getFullYear(), renewal.getMonth() + 1, 0).getDate()),
      )
      renewalDate = renewal.toISOString().split("T")[0]

      // Generate total contract value
      const contractValues = [5000, 12000, 25000, 50000, 75000, 100000, 150000, 250000, 500000]
      const totalContractValue = contractValues[Math.floor(Math.random() * contractValues.length)]

      let reviewCompletionDate: string | undefined = undefined
      if (reviewed) {
        // Generate a random reviewCompletionDate between closedWonDate and end of current month
        const endOfMonth = new Date(year, index + 1, 0)
        const closedDate = new Date(year, index, day, hour, minute) // Declare closedDate here
        const randomTime = closedDate.getTime() + Math.random() * (endOfMonth.getTime() - closedDate.getTime())
        reviewCompletionDate = new Date(randomTime).toISOString().split("T")[0]
      }

      // Generate realistic lastSyncedTimestamp
      const now = new Date()
      const maxDaysAgo = 7 // Max 7 days ago
      const randomDaysAgo = Math.random() * maxDaysAgo
      const randomHoursAgo = Math.random() * 24
      const randomMinutesAgo = Math.random() * 60

      const lastSyncedTimestamp = new Date(
        now.getTime() -
          randomDaysAgo * 24 * 60 * 60 * 1000 -
          randomHoursAgo * 60 * 60 * 1000 -
          randomMinutesAgo * 60 * 1000,
      ).toISOString()

      // Generate display version
      const lastSynced = formatRelativeTime(lastSyncedTimestamp)

      // Randomly select a subset of fields for display
      const numFields = Math.floor(Math.random() * 4) + 2
      const selectedFields = Array.from(
        { length: numFields },
        () => possibleFields[Math.floor(Math.random() * possibleFields.length)],
      ).filter((value, idx, self) => self.indexOf(value) === idx)

      const companyName = companyNames[Math.floor(Math.random() * companyNames.length)]
      const opportunityPrefix = type.includes("New") ? "New Business" : "Renewal"

      opportunities.push({
        id: `opp_${idCounter.toString().padStart(3, "0")}`,
        name: `${opportunityPrefix} - ${companyName} ${year}`,
        accountName: companyName,
        type,
        reviewProgress,
        unresolvedFields,
        lastSynced,
        lastSyncedTimestamp,
        closedWonDate,
        renewalDate,
        totalContractValue,
        status: reviewed ? "Reviewed" : undefined,
        progress,
        fields: selectedFields,
        month: name,
        monthIndex: index,
        fieldMatches,
        fieldDiscrepancies,
        criticalFieldMatches,
        criticalFieldDiscrepancies,
        reviewed,
        reviewCompletionDate,
      })

      idCounter++
    }
  })

  return opportunities
}

/**
 * Filters a list of opportunities based on provided filter criteria.
 */
export const filterOpportunities = (
  opportunities: Opportunity[],
  searchQuery: string,
  progressFilter: string[],
  typeFilter: string[],
  fieldsFilter: string[],
  dateRange: { from: Date | undefined; to: Date | undefined },
): Opportunity[] => {
  return opportunities.filter((opp) => {
    const matchesSearch =
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.accountName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesProgress = progressFilter.length === 0 || (opp.progress && progressFilter.includes(opp.progress))
    const matchesType = typeFilter.length === 0 || typeFilter.includes(opp.type)
    const matchesFields = fieldsFilter.length === 0 || fieldsFilter.some((field) => opp.fields?.includes(field))

    // Date range filtering by closedWonDate
    let matchesDateRange = true
    if (dateRange.from || dateRange.to) {
      const oppDate = new Date(opp.closedWonDate)
      if (dateRange.from && oppDate < dateRange.from) matchesDateRange = false
      if (dateRange.to && oppDate > dateRange.to) matchesDateRange = false
    }

    return matchesSearch && matchesProgress && matchesType && matchesFields && matchesDateRange
  })
}

/**
 * Gets opportunities with renewals in the next 90 days, sorted by renewal date (soonest first)
 */
export const getUpcomingRenewals = (opportunities: Opportunity[]): Opportunity[] => {
  const today = new Date()
  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(today.getDate() + 90)

  return opportunities
    .filter((opp) => {
      const renewalDate = new Date(opp.renewalDate)
      return renewalDate >= today && renewalDate <= ninetyDaysFromNow
    })
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
}

/**
 * Calculates field discrepancy rates for all fields
 */
export const calculateFieldDiscrepancies = (opportunities: Opportunity[]): FieldDiscrepancy[] => {
  const fieldStats: Record<string, { total: number; discrepancies: number }> = {}

  // Initialize with common fields
  const allFields = [
    "Start Date",
    "End Date",
    "Billing Frequency",
    "Total Contract Value",
    "Contract Terms",
    "Discounts",
    "Payment Terms",
    "Termination Clause",
    "Products",
    "Discount Rate",
    "Renewal Date",
    "Contract Value",
    "Service Location",
    "Contract Term Length",
    "Service Start Date",
  ]

  allFields.forEach((field) => {
    fieldStats[field] = { total: 0, discrepancies: 0 }
  })

  // Calculate discrepancies based on opportunity data
  opportunities.forEach((opp) => {
    // Simulate field-specific discrepancy rates
    allFields.forEach((field) => {
      const hasField = Math.random() > 0.3 // 70% chance opportunity has this field
      if (hasField) {
        fieldStats[field].total += 1

        // Different fields have different discrepancy rates
        let discrepancyChance = 0.2 // default 20%
        switch (field) {
          case "Service Location":
            discrepancyChance = 0.45
            break
          case "Contract Term Length":
            discrepancyChance = 0.35
            break
          case "Service Start Date":
            discrepancyChance = 0.3
            break
          case "Billing Frequency":
            discrepancyChance = 0.25
            break
          case "Discount Rate":
            discrepancyChance = 0.2
            break
          case "Renewal Date":
            discrepancyChance = 0.15
            break
          case "Contract Value":
            discrepancyChance = 0.1
            break
          case "Payment Terms":
            discrepancyChance = 0.12
            break
        }

        if (Math.random() < discrepancyChance) {
          fieldStats[field].discrepancies += 1
        }
      }
    })
  })

  return Object.entries(fieldStats)
    .map(([fieldName, stats]) => ({
      fieldName,
      discrepancyRate: stats.total > 0 ? Math.round((stats.discrepancies / stats.total) * 100) : 0,
      totalFields: stats.total,
      discrepancies: stats.discrepancies,
    }))
    .filter((field) => field.totalFields > 0)
    .sort((a, b) => b.discrepancyRate - a.discrepancyRate) // Sort by highest discrepancy rate first
}

/**
 * Calculates summary metrics from a list of opportunities.
 */
export const calculateMetrics = (opportunities: Opportunity[], chartData: ChartData[]) => {
  const totalOpportunities = opportunities.length
  const totalReviewed = opportunities.filter((opp) => opp.reviewed).length

  if (chartData.length === 0) {
    return {
      totalOpportunities: 0,
      totalReviewed: 0,
      opportunitiesChange: 0,
      reviewedChange: 0,
      matchRateChange: 0,
      totalDiscrepancies: 0,
      discrepanciesChange: 0,
      fieldMatchRate: 0,
      criticalFieldMatchRateChange: 0,
    }
  }

  // Calculate actual first month vs last month percentage changes
  const firstMonthData = chartData[0]
  const lastMonthData = chartData[chartData.length - 1]

  const opportunitiesChange =
    firstMonthData.totalOpportunities > 0
      ? ((lastMonthData.totalOpportunities - firstMonthData.totalOpportunities) / firstMonthData.totalOpportunities) *
        100
      : 0

  const reviewedChange =
    firstMonthData.reviewedOpportunities > 0
      ? ((lastMonthData.reviewedOpportunities - firstMonthData.reviewedOpportunities) /
          firstMonthData.reviewedOpportunities) *
        100
      : 0

  const matchRateChange = lastMonthData.fieldMatchRate - firstMonthData.fieldMatchRate
  const criticalFieldMatchRateChange = lastMonthData.criticalFieldMatchRate - firstMonthData.criticalFieldMatchRate

  const totalDiscrepancies = opportunities.reduce((sum, opp) => sum + opp.fieldDiscrepancies, 0)
  const discrepanciesChange =
    firstMonthData.nonMatchingFields > 0
      ? ((lastMonthData.nonMatchingFields - firstMonthData.nonMatchingFields) / firstMonthData.nonMatchingFields) * 100
      : 0

  return {
    totalOpportunities,
    totalReviewed,
    opportunitiesChange: Math.round(opportunitiesChange * 10) / 10,
    reviewedChange: Math.round(reviewedChange * 10) / 10,
    matchRateChange: Math.round(matchRateChange),
    totalDiscrepancies,
    discrepanciesChange: Math.round(discrepanciesChange * 10) / 10,
    fieldMatchRate: lastMonthData.fieldMatchRate,
    criticalFieldMatchRateChange: Math.round(criticalFieldMatchRateChange),
  }
}
