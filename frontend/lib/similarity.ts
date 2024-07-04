import { levenshteinDistance } from './levenshteinDistance'

export function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length > s2.length ? s2 : s1
  const longerLength = longer.length

  if (longerLength === 0) {
    return 1.0
  }

  return (longerLength - levenshteinDistance(longer, shorter)) / longerLength
}
