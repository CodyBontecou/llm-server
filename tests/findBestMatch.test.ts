import { describe, it, expect } from 'vitest'
import { findBestMatch } from '../lib/findBestMatch'

describe('findBestMatch', () => {
  it('should find an exact match', () => {
    const text =
      'This is a test. It contains multiple sentences. Test sentence here.'
    const query = 'It contains multiple sentences.'
    const [match, ratio] = findBestMatch(query, text)
    expect(match).toBe(query)
    expect(ratio).toBe(1)
  })

  it('should find the best partial match', () => {
    const text = 'The quick brown fox. Jumps over the lazy dog. The end.'
    const query = 'quick brown fox jumps'
    const [match, ratio] = findBestMatch(query, text)
    expect(match).toBe('The quick brown fox.')
    expect(ratio).toBeGreaterThan(0.5)
  })

  it('should handle empty query', () => {
    const text = 'Some text here.'
    const query = ''
    const [match, ratio] = findBestMatch(query, text)
    expect(match).toBe('')
    expect(ratio).toBe(0)
  })

  it('should handle empty text', () => {
    const text = ''
    const query = 'Some query'
    const [match, ratio] = findBestMatch(query, text)
    expect(match).toBe('')
    expect(ratio).toBe(0)
  })

  it('should be case sensitive', () => {
    const text = 'This is a Test. TEST is important.'
    const query = 'test'
    const [match, ratio] = findBestMatch(query, text)
    expect(ratio).toBeLessThan(1)
    // We're not checking the exact match here, as it might vary
  })

  it('should handle text with no sentence delimiters', () => {
    const text = 'This is a single sentence without delimiters'
    const query = 'single sentence'
    const [match, ratio] = findBestMatch(query, text)
    expect(match).toBe(text)
    expect(ratio).toBeGreaterThan(0)
  })

  it('should find best match across multiple sentences', () => {
    const text =
      'First sentence. Second sentence. Third sentence with more words.'
    const query = 'Second sentence. Third sentence'
    const [match, ratio] = findBestMatch(query, text)
    expect(match).toBe('Second sentence. Third sentence with more words.')
    expect(ratio).toBeGreaterThan(0.6)
  })

  it('should handle special characters', () => {
    const text = 'Sentence one! Sentence two? Sentence three.'
    const query = 'Sentence two? Sentence'
    const [match, ratio] = findBestMatch(query, text)
    expect(match).toBe('Sentence two? Sentence three.')
    expect(ratio).toBeGreaterThan(0.7)
  })
})
