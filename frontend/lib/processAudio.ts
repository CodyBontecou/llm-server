import { cutVideoAndAddSubtitles } from './cutVideoAndAddSubtitles'
import { extractRealStrings } from './extractRealStrings'
import { matchWords } from './matchWords'
import { chatRequest, whisperTranscribe } from './whisper'
import * as path from 'path'
import * as fs from 'fs'

export async function processAudio(audioData: Buffer, fileName: string) {
  console.log('processing audio')
  const totalStartTime = performance.now()

  try {
    const whisperStartTime = performance.now()
    const whisperRes = await whisperTranscribe(audioData)
    console.log(
      `whisperTranscribe took ${performance.now() - whisperStartTime} ms`
    )

    const chatStartTime = performance.now()
    const chatRes = await chatRequest(whisperRes.text)
    console.log(`chatRequest took ${performance.now() - chatStartTime} ms`)

    const realStringsStartTime = performance.now()
    const content = JSON.parse(chatRes.choices[0].message.content)

    console.log(content)
    const realStrings = extractRealStrings(whisperRes.text, content.sections)
    console.log(
      `chatRequest took ${performance.now() - realStringsStartTime} ms`
    )

    await Promise.all(
      realStrings.map(async (s, index) => {
        const iterationStartTime = performance.now()

        const matchedWords = matchWords(s, whisperRes.words)

        const startTime = matchedWords[0].start
        const endTime = matchedWords[matchedWords.length - 1].end

        const inputFilePath = '/storage/userFiles/' + fileName
        const outputFilePath = '/storage/userFiles/output-' + fileName

        if (!fs.existsSync(inputFilePath)) {
          console.error(`Input file not found: ${inputFilePath}`)
          throw new Error(`Input file not found: ${inputFilePath}`)
        }

        await cutVideoAndAddSubtitles(
          inputFilePath,
          outputFilePath,
          startTime,
          endTime,
          matchedWords
        )

        console.log(
          `File should be created at: /storage/userFiles/output-${fileName}`
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
