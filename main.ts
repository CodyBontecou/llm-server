import * as fs from 'fs'
import aiStrings from './mocks/response.json'
import { extractRealStrings } from './lib/extractRealStrings'
import { matchWords } from './lib/matchWords'
import { realStrings } from './mocks/realStrings'
import { cutVideo } from './lib/cutVideo'

fs.readFile('./output.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const transcript = JSON.parse(data)

  // const realStrings = extractRealStrings(transcript.text, aiStrings.response)
  // console.log(realStrings)

  realStrings.forEach((s, index) => {
    const matchedWords = matchWords(s, transcript.words)
    // console.log(matchedWords)
    const startTime = matchedWords[0].start
    const endTime = matchedWords[matchedWords.length - 1].end

    console.log(startTime, endTime)

    cutVideo('mocks/10min.mp4', `${index}.mp4`, startTime, endTime)
      .then(() => console.log('Video cut successfully'))
      .catch(err => console.error('Error cutting video:', err))
  })
})
