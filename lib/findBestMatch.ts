import { similarity } from './similarity'

export function findBestMatch(query: string, text: string): [string, number] {
  // Split the text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/)

  let bestMatch = ''
  let bestRatio = 0

  // Iterate through combinations of sentences
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i; j < sentences.length; j++) {
      const segment = sentences.slice(i, j + 1).join(' ')
      const ratio = similarity(query, segment)

      if (ratio > bestRatio) {
        bestRatio = ratio
        bestMatch = segment
      }
    }
  }

  return [bestMatch, bestRatio]
}
