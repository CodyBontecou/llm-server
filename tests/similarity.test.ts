import { describe, it, expect } from 'vitest'
import { similarity } from '../lib/similarity'

describe('similarity', () => {
  it('should return 1.0 for identical strings', () => {
    expect(similarity('hello', 'hello')).toBe(1.0)
    expect(similarity('', '')).toBe(1.0)
  })

  it('should return 0.0 for completely different strings', () => {
    expect(similarity('abc', 'def')).toBe(0.0)
  })

  it('should handle empty string comparisons', () => {
    expect(similarity('', 'a')).toBe(0.0)
    expect(similarity('abc', '')).toBe(0.0)
  })

  it('should return correct similarity for strings with small differences', () => {
    expect(similarity('kitten', 'sitten')).toBeCloseTo(0.8333, 4)
    expect(similarity('saturday', 'sunday')).toBeCloseTo(0.625, 4)
  })

  it('should be case sensitive', () => {
    expect(similarity('hello', 'Hello')).toBeCloseTo(0.8, 4)
  })

  it('should handle strings of different lengths', () => {
    expect(similarity('sit', 'sitting')).toBeCloseTo(0.4286, 4)
    expect(similarity('foo', 'foobar')).toBe(0.5)
  })

  it('should be symmetric', () => {
    const s1 = 'hello'
    const s2 = 'hallo'
    expect(similarity(s1, s2)).toBe(similarity(s2, s1))
  })

  it('should handle strings with spaces and punctuation', () => {
    expect(similarity('hello world', 'hello, world!')).toBeCloseTo(0.8462, 4)
  })

  it('should handle longer strings', () => {
    const s1 = 'implementation'
    const s2 = 'implementing'
    expect(similarity(s1, s2)).toBeCloseTo(0.7143, 4)
  })
})
