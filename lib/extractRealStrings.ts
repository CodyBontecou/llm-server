import { findBestMatch } from './findBestMatch'

export function extractRealStrings(
  transcript: string,
  aiStrings: string[]
): string[] {
  const realStrings: string[] = []

  // for (const aiString of aiStrings) {
  const [bestMatch, ratio] = findBestMatch(aiStrings[0], transcript)
  realStrings.push(bestMatch)
  console.log(`Match ratio: ${ratio.toFixed(2)}`)
  // }

  return realStrings
}
