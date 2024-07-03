import { similarity } from './similarity'

export function findBestMatch(query: string, text: string): [string, number] {
  // Split the text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/)

  let bestMatch = ''
  let bestRatio = 0
  const queryLength = query.length

  // Iterate through combinations of sentences
  for (let i = 0; i < sentences.length; i++) {
    let segment = sentences[i]
    let segmentLength = segment.length

    for (let j = i; j < sentences.length; j++) {
      const ratio = similarity(query, segment)

      if (ratio > bestRatio) {
        bestRatio = ratio
        bestMatch = segment
      }

      // Early termination if we find a perfect match
      if (bestRatio === 1) {
        return [bestMatch, bestRatio]
      }

      // Early skip if the next segment would be too long
      if (j + 1 < sentences.length) {
        const nextSegmentLength = segmentLength + sentences[j + 1].length + 1 // +1 for space
        if (nextSegmentLength > queryLength * 2) {
          break
        }
        segment += ' ' + sentences[j + 1]
        segmentLength = nextSegmentLength
      }
    }
  }

  return [bestMatch, bestRatio]
}
