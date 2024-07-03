export function matchWords(
  sentence: string,
  wordsArray: {
    word: string
    start: number
    end: number
  }[]
) {
  let result = []
  let sentenceWords = sentence
    .match(/\b\w+(?:'\w+)?\b/g)
    .map(word => word.toLowerCase())
  let i = 0
  let j = 0

  try {
    while (i < sentenceWords.length && j < wordsArray.length) {
      let cleanWord = wordsArray[j].word.toLowerCase().replace(/[^a-z']/g, '')
      if (cleanWord === sentenceWords[i]) {
        let sequence = true
        for (let k = 1; k < sentenceWords.length - i; k++) {
          if (
            j + k >= wordsArray.length ||
            wordsArray[j + k].word.toLowerCase().replace(/[^a-z']/g, '') !==
              sentenceWords[i + k]
          ) {
            sequence = false
            break
          }
        }
        if (sequence) {
          result = wordsArray.slice(j, j + sentenceWords.length - i)
          break
        }
      }
      j++
    }
  } catch (error) {
    console.log(error)
    console.log('sentenceWords: ', sentenceWords)
  }

  return result
}
