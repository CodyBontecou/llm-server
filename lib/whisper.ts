import OpenAI, { toFile } from 'openai'
import * as fs from 'fs'

const openai = new OpenAI()

const audioFile = 'mocks/output_000.mp3'
const audioData = fs.readFileSync(audioFile)

async function whisperTranscribe(audioBuffer) {
  const transcription = await openai.audio.transcriptions.create({
    file: await toFile(audioBuffer, 'speech.mp3'),
    model: 'whisper-1',
  })
  return transcription
}

whisperTranscribe(audioData).then(res => console.log(res))
