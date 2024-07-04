import { findBestMatch } from './findBestMatch'

export function extractRealStrings(
  transcript: string,
  segments: string[]
): string[] {
  const realStrings: string[] = []

  for (const segment of segments) {
    try {
      const [bestMatch, ratio] = findBestMatch(segment, transcript)
      realStrings.push(bestMatch)
      console.log(`Match ratio: ${ratio.toFixed(2)}`)
    } catch (error) {
      console.log(`Error: ${error} from segment ${segment}`)
    }
  }

  return realStrings
}
