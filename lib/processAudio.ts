import { cutVideoAndAddSubtitles } from './cutVideoAndAddSubtitles'
import { extractRealStrings } from './extractRealStrings'
import { matchWords } from './matchWords'
import { chatRequest, whisperTranscribe } from './whisper'

export async function processAudio(audioData) {
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
        console.log('matchedWords: ', matchedWords)

        const startTime = matchedWords[0].start
        const endTime = matchedWords[matchedWords.length - 1].end

        await cutVideoAndAddSubtitles(
          'mocks/10min.mp4',
          `output/${index}-fullrun.mp4`,
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
