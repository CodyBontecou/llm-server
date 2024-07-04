export function levenshteinDistance(
  a: string,
  b: string,
  threshold = Infinity
): number {
  // Ensure 'a' is the longer string for consistency
  if (a.length < b.length) {
    ;[a, b] = [b, a]
  }

  // Early exit for empty strings
  if (b.length === 0) return a.length

  let previousRow: number[] = new Array(b.length + 1)
  let currentRow: number[] = new Array(b.length + 1)

  // Initialize the first row
  for (let i = 0; i <= b.length; i++) {
    previousRow[i] = i
  }

  for (let i = 0; i < a.length; i++) {
    currentRow[0] = i + 1

    for (let j = 0; j < b.length; j++) {
      const insertCost = currentRow[j] + 1
      const deleteCost = previousRow[j + 1] + 1
      const substituteCost = previousRow[j] + (a[i] !== b[j] ? 1 : 0)

      currentRow[j + 1] = Math.min(insertCost, deleteCost, substituteCost)
    }

    // Early termination check
    if (Math.min(...currentRow) > threshold) {
      return Infinity
    }

    // Swap rows
    ;[previousRow, currentRow] = [currentRow, previousRow]
  }

  return previousRow[b.length]
}
