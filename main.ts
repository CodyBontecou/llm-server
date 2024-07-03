import * as fs from 'fs'
import { extractRealStrings } from './lib/extractRealStrings'
import { matchWords } from './lib/matchWords'
import { cutVideoAndAddSubtitles } from './lib/cutVideoAndAddSubtitles'
import { chatRequest, whisperTranscribe } from './lib/whisper'

async function processAudio(audioData) {
  const totalStartTime = performance.now()

  try {
    const whisperRes = await whisperTranscribe(audioData)
    console.log(
      `whisperTranscribe took ${performance.now() - totalStartTime} ms`
    )

    const chatRes = await chatRequest(whisperRes.text)
    console.log(`chatRequest took ${performance.now() - totalStartTime} ms`)

    const jsonData = JSON.stringify(chatRes.choices[0])
    const transcript = JSON.parse(jsonData)
    const content = JSON.parse(transcript.message.content)

    const realStrings = extractRealStrings(whisperRes.text, content.sections)

    await Promise.all(
      realStrings.map(async (s, index) => {
        const iterationStartTime = performance.now()

        const matchedWords = matchWords(s, whisperRes.words)
        console.log('matchedWords: ', matchedWords)

        const startTime = matchedWords[0].start
        const endTime = matchedWords[matchedWords.length - 1].end

        await cutVideoAndAddSubtitles(
          'mocks/10min.mp4',
          `${index}-fullrun.mp4`,
          startTime,
          endTime,
          matchedWords
        )

        console.log(
          `Video processing for index ${index} completed in ${
            performance.now() - iterationStartTime
          } ms`
        )
      })
    )
  } catch (error) {
    console.error('Error:', error)
  } finally {
    console.log(
      `Total execution time: ${performance.now() - totalStartTime} ms`
    )
  }
}

const audioFile = 'mocks/output.mp3'
const audioData = fs.readFileSync(audioFile)
processAudio(audioData)
