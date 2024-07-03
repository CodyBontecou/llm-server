import * as fs from 'fs'
import aiStrings from './mocks/response.json'
import { extractRealStrings } from './lib/extractRealStrings'
import { matchWords } from './lib/matchWords'
import { realStrings } from './mocks/realStrings'
import { cutVideo } from './lib/cutVideo'
import { addSubtitlesToVideo } from './lib/addSubtitlesToVideo'
import { cutVideoAndAddSubtitles } from './lib/cutVideoAndAddSubtitles'
import { chatRequest, whisperTranscribe } from './lib/whisper'

const startTime = performance.now()

const audioFile = 'mocks/output.mp3'
const audioData = fs.readFileSync(audioFile)

whisperTranscribe(audioData).then(whisperRes => {
  chatRequest(whisperRes.text).then(chatRes => {
    const jsonData = JSON.stringify(chatRes.choices[0])
    const transcript = JSON.parse(jsonData)
    const content = JSON.parse(transcript.message.content)

    const realStrings = extractRealStrings(whisperRes.text, content.sections)

    realStrings.forEach((s, index) => {
      const matchedWords = matchWords(s, whisperRes.words)
      console.log('matchedWords: ', matchedWords)

      const startTime = matchedWords[0].start
      const endTime = matchedWords[matchedWords.length - 1].end

      cutVideoAndAddSubtitles(
        'mocks/10min.mp4',
        `${index}-fullrun.mp4`,
        startTime,
        endTime,
        matchedWords
      )
        .then(() =>
          console.log('Video processing completed: ', `${index}-fullrun.mp4`)
        )
        .finally(() => {
          const endTime = performance.now()
          const duration = endTime - startTime
          console.log(`Function chain completed in ${duration} milliseconds`)
        })
        .catch(err => console.error('Error processing video:', err))
    })
  })
})

// fs.readFile('./output.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }

//   const transcript = JSON.parse(data)

//   // const realStrings = extractRealStrings(transcript.text, aiStrings.response)
//   // console.log(realStrings)

//   realStrings.forEach((s, index) => {
//     const matchedWords = matchWords(s, transcript.words)
//     // console.log(matchedWords)
//     const startTime = matchedWords[0].start
//     const endTime = matchedWords[matchedWords.length - 1].end

//     console.log(startTime, endTime)

//     // cutVideo('mocks/10min.mp4', `${index}.mp4`, startTime, endTime)
//     //   .then(() => console.log('Video cut successfully'))
//     //   .catch(err => console.error('Error cutting video:', err))
//     cutVideoAndAddSubtitles(
//       'mocks/10min.mp4',
//       `${index}-subtitles.mp4`,
//       startTime,
//       endTime,
//       matchedWords
//     )
//       .then(() =>
//         console.log('Video processing completed: ', `${index}-subtitles.mp4`)
//       )
//       .catch(err => console.error('Error processing video:', err))
//   })
// })
