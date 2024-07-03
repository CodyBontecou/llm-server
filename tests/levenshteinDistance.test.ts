import { describe, it, expect } from 'vitest'
import { levenshteinDistance } from '../lib/levenshteinDistance'

describe('levenshteinDistance', () => {
  it('should return 0 for identical strings', () => {
    expect(levenshteinDistance('kitten', 'kitten')).toBe(0)
    expect(levenshteinDistance('', '')).toBe(0)
  })

  it('should return the correct distance for simple transformations', () => {
    expect(levenshteinDistance('kitten', 'sitten')).toBe(1) // substitution
    expect(levenshteinDistance('kitten', 'kitty')).toBe(2) // substitution + deletion
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3) // substitution + insertion
  })

  it('should handle empty strings correctly', () => {
    expect(levenshteinDistance('', 'a')).toBe(1)
    expect(levenshteinDistance('a', '')).toBe(1)
    expect(levenshteinDistance('abc', '')).toBe(3)
  })

  it('should work with strings of different lengths', () => {
    expect(levenshteinDistance('book', 'back')).toBe(2)
    expect(levenshteinDistance('book', 'books')).toBe(1)
    expect(levenshteinDistance('book', 'bookkeeper')).toBe(6)
  })

  it('should handle case sensitivity', () => {
    expect(levenshteinDistance('book', 'Book')).toBe(1)
    expect(levenshteinDistance('case', 'CASE')).toBe(4)
  })

  it('should work with longer strings', () => {
    expect(levenshteinDistance('implementation', 'implementation')).toBe(0)
    expect(levenshteinDistance('implementation', 'implementing')).toBe(4)
  })

  it('should handle special characters and spaces', () => {
    expect(levenshteinDistance('hello world', 'hello-world')).toBe(1)
    expect(levenshteinDistance('!@#$%', '@#$%^')).toBe(2)
  })
})
