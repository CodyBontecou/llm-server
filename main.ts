import * as fs from 'fs'
import aiStrings from './mocks/response.json'
import { extractRealStrings } from './lib/extractRealStrings'
import { matchWords } from './lib/matchWords'
import { realStrings } from './mocks/realStrings'

fs.readFile('./output.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const transcript = JSON.parse(data)

  // const realStrings = extractRealStrings(transcript.text, aiStrings.response)
  // console.log(realStrings)

  realStrings.forEach(s => {
    let matchedWords = matchWords(s, transcript.words)
    console.log(matchedWords)
  })
})
