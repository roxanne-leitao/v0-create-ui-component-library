interface Product {
  line_item_id: string
  product_name: {
    crm_value?: string
    extracted_value?: string
    value?: string
    source?: string
    status: "reviewed" | "needs_review"
  }
  [key: string]: any
}

// Simple Jaro-Winkler similarity implementation
function jaroWinklerSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0

  const len1 = s1.length
  const len2 = s2.length

  if (len1 === 0 || len2 === 0) return 0.0

  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1
  if (matchWindow < 0) return 0.0

  const s1Matches = new Array(len1).fill(false)
  const s2Matches = new Array(len2).fill(false)

  let matches = 0
  let transpositions = 0

  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow)
    const end = Math.min(i + matchWindow + 1, len2)

    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue
      s1Matches[i] = true
      s2Matches[j] = true
      matches++
      break
    }
  }

  if (matches === 0) return 0.0

  // Find transpositions
  let k = 0
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue
    while (!s2Matches[k]) k++
    if (s1[i] !== s2[k]) transpositions++
    k++
  }

  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3.0

  // Winkler modification
  let prefix = 0
  for (let i = 0; i < Math.min(len1, len2, 4); i++) {
    if (s1[i] === s2[i]) prefix++
    else break
  }

  return jaro + 0.1 * prefix * (1 - jaro)
}

// Remove common prefixes and normalize product names for comparison
function normalizeProductName(productName: string): string {
  console.log("fuzzy-matching - Original product name:", productName)

  // Common prefixes to remove (company names, brand prefixes, etc.)
  const commonPrefixes = [
    /^G2\s+Content:\s*/i,
    /^Microsoft\s*/i,
    /^Adobe\s*/i,
    /^Salesforce\s*/i,
    /^Oracle\s*/i,
    /^SAP\s*/i,
    /^IBM\s*/i,
    /^Amazon\s*/i,
    /^Google\s*/i,
    /^Apple\s*/i,
    // Generic patterns
    /^[A-Z][a-z]+\s+[A-Z][a-z]+:\s*/, // "Company Name: "
    /^[A-Z][a-z]+\s*/, // Single company name at start
  ]

  let normalized = productName.trim()

  // Try to remove each prefix pattern
  for (const prefix of commonPrefixes) {
    const beforeRemoval = normalized
    normalized = normalized.replace(prefix, "").trim()
    if (beforeRemoval !== normalized) {
      console.log("fuzzy-matching - Removed prefix, now:", normalized)
      break // Only remove one prefix
    }
  }

  // Additional cleanup
  normalized = normalized
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with spaces
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  console.log("fuzzy-matching - Normalized product name:", normalized)
  return normalized
}

// Token-based similarity with prefix normalization
function tokenBasedSimilarity(s1: string, s2: string): number {
  console.log("fuzzy-matching - Comparing products:", { s1, s2 })

  // Normalize both product names by removing prefixes
  const normalized1 = normalizeProductName(s1)
  const normalized2 = normalizeProductName(s2)

  console.log("fuzzy-matching - Normalized comparison:", { normalized1, normalized2 })

  // If normalized names are identical, they're the same product
  if (normalized1 === normalized2) {
    console.log("fuzzy-matching - Exact match after normalization")
    return 1.0
  }

  const tokenize = (str: string) =>
    str
      .split(/\s+/)
      .filter((token) => token.length > 0)
      .sort()

  const tokens1 = tokenize(normalized1)
  const tokens2 = tokenize(normalized2)

  console.log("fuzzy-matching - Normalized tokens:", { tokens1, tokens2 })

  if (tokens1.length === 0 || tokens2.length === 0) return 0.0

  // Check if one is a subset of the other (handles "Regional Content Subscription" vs "G2 Content: Regional Content Subscription")
  const isSubset = (smaller: string[], larger: string[]) => {
    return smaller.every((token) => larger.includes(token))
  }

  if (isSubset(tokens1, tokens2) || isSubset(tokens2, tokens1)) {
    console.log("fuzzy-matching - One is subset of other, high similarity")
    return 0.95
  }

  // For products to be considered similar after normalization:
  // 1. High overall similarity (>= 0.85)
  // 2. Similar number of tokens (within 1-2)
  // 3. Core product descriptors should match

  const tokenCountDiff = Math.abs(tokens1.length - tokens2.length)
  if (tokenCountDiff > 2) {
    console.log("fuzzy-matching - Token count difference too large:", tokenCountDiff)
    return 0.0
  }

  let totalSimilarity = 0
  let comparisons = 0

  for (const token1 of tokens1) {
    let maxSim = 0
    for (const token2 of tokens2) {
      const sim = jaroWinklerSimilarity(token1, token2)
      maxSim = Math.max(maxSim, sim)
    }
    totalSimilarity += maxSim
    comparisons++
  }

  const avgSimilarity = comparisons > 0 ? totalSimilarity / comparisons : 0.0
  console.log("fuzzy-matching - Average similarity:", avgSimilarity)

  // Check for conflicting descriptors in the normalized tokens
  const hasConflictingDescriptors = checkConflictingDescriptors(tokens1, tokens2)
  if (hasConflictingDescriptors) {
    console.log("fuzzy-matching - Conflicting descriptors found, returning 0")
    return 0.0
  }

  return avgSimilarity
}

// Check for conflicting descriptors that indicate different products
function checkConflictingDescriptors(tokens1: string[], tokens2: string[]): boolean {
  const descriptorGroups = [
    ["regional", "social", "global", "local", "national", "international"],
    ["content", "subscription", "creation", "management", "analytics", "reporting"],
    ["basic", "premium", "enterprise", "standard", "professional", "starter"],
    ["monthly", "yearly", "annual", "quarterly", "weekly"],
    ["small", "medium", "large", "xl", "enterprise"],
  ]

  for (const descriptorGroup of descriptorGroups) {
    const found1 = tokens1.filter((token) => descriptorGroup.includes(token))
    const found2 = tokens2.filter((token) => descriptorGroup.includes(token))

    // If both have descriptors from this group but they're different, it's a conflict
    if (found1.length > 0 && found2.length > 0 && !found1.some((d) => found2.includes(d))) {
      console.log("fuzzy-matching - Conflicting descriptors:", { found1, found2, descriptorGroup })
      return true
    }
  }

  return false
}

function getProductName(product: Product): string {
  const name =
    product.product_name.extracted_value || product.product_name.crm_value || product.product_name.value || ""
  console.log("fuzzy-matching - Product name extracted:", name)
  return name
}

export function groupProductsBySimilarity(products: Product[], threshold = 0.85): Product[][] {
  console.log("fuzzy-matching - Starting grouping with threshold:", threshold)
  console.log("fuzzy-matching - Total products to group:", products.length)

  const groups: Product[][] = []
  const used = new Set<string>()

  for (const product of products) {
    if (used.has(product.line_item_id)) continue

    const group = [product]
    used.add(product.line_item_id)

    const productName = getProductName(product)
    console.log("fuzzy-matching - Starting new group with product:", productName)

    for (const otherProduct of products) {
      if (used.has(otherProduct.line_item_id)) continue

      const otherName = getProductName(otherProduct)
      const similarity = tokenBasedSimilarity(productName, otherName)

      console.log("fuzzy-matching - Similarity check:", {
        product1: productName,
        product2: otherName,
        similarity,
        threshold,
        willGroup: similarity >= threshold,
      })

      if (similarity >= threshold) {
        group.push(otherProduct)
        used.add(otherProduct.line_item_id)
        console.log("fuzzy-matching - Added to group:", otherName)
      }
    }

    groups.push(group)
    console.log("fuzzy-matching - Group completed with", group.length, "products")
  }

  console.log("fuzzy-matching - Final groups:", groups.length)
  groups.forEach((group, index) => {
    console.log(
      `fuzzy-matching - Group ${index}:`,
      group.map((p) => getProductName(p)),
    )
  })

  return groups
}
