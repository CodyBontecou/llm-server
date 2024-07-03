import OpenAI, { toFile } from 'openai'
import * as fs from 'fs'

const openai = new OpenAI()

const audioFile = 'mocks/output.mp3'
const audioData = fs.readFileSync(audioFile)

export async function whisperTranscribe(audioBuffer) {
  const transcription = await openai.audio.transcriptions.create({
    file: await toFile(audioBuffer, 'speech.mp3'),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  })
  return transcription
}

export async function chatRequest(transcript: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a proficient AI with a specialty in distilling information into key points. Based on the following text, identify and list the main points that were discussed or brought up. These should be the most important ideas, findings, or topics that are crucial to the essence of the discussion. Your goal is to provide a list that someone could read to quickly understand what was talked about.',
      },
      {
        role: 'user',
        content:
          `Transcript: ${transcript}\n\n` +
          'Extract 3-5 interesting sections from this transcript that are worth sharing. Each section should be at least 50 words long. Return your response as a valid JSON array of strings, where each string is an extracted section. Do not include any explanations or additional text outside the JSON array. Ensure the JSON is properly formatted and can be parsed by JSON.parse().',
      },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  })
  return completion
}

// whisperTranscribe(audioData).then(res => {
//   console.log(res)
//   fs.writeFile('output.json', JSON.stringify(res), err => {
//     if (err) {
//       console.error('Error writing to file:', err)
//       return
//     }
//     console.log('Data has been written to output.json')
//   })
//   chatRequest(res.text).then(chatRes => {
//     const jsonData = JSON.stringify(chatRes.choices[0])
//     fs.writeFile('output.json', jsonData, err => {
//       if (err) {
//         console.error('Error writing to JSON file:', err)
//         return
//       }
//       console.log('Data has been written to output.json')
//     })
//   })
// })

// import output from '../output.json'

// chatRequest(output.text).then(res =>
//   console.log(res.choices[0].message.content)
// )
