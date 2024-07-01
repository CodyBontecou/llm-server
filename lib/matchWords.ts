export function matchWords(sentence, wordsArray) {
  let result = []
  let sentenceWords = sentence
    .match(/\b\w+(?:'\w+)?\b/g)
    .map(word => word.toLowerCase())
  let i = 0

  for (let wordObj of wordsArray) {
    if (i < sentenceWords.length) {
      let cleanWord = wordObj.word.toLowerCase().replace(/[^a-z']/g, '')
      if (cleanWord === sentenceWords[i]) {
        result.push(wordObj)
        i++
      }
    }
  }

  return result
}
