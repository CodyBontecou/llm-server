import * as fs from 'fs'
import { processAudio } from './lib/processAudio'

// TODO: Split main mp4 into multiple mp3s
// iterate over mp3s and run them into processAudio
const audioFile = 'mocks/output.mp3'
const audioData = fs.readFileSync(audioFile)
processAudio(audioData)
