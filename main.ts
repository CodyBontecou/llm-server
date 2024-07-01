import * as fs from 'fs'
import aiStrings from './mocks/response.json'
import { extractRealStrings } from './lib/extractRealStrings'

let transcript = ''

fs.readFile('./mocks/transcript.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  transcript = data

  const realStrings = extractRealStrings(transcript, aiStrings.response)
  console.log(realStrings)
})
