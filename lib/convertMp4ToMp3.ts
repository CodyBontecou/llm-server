import ffmpeg from 'fluent-ffmpeg'

const inputFilePath = 'mocks/10min.mp4'
const outputFilePath = 'mocks/output.mp3'

export function convertMp4ToMp3(inputFilePath, outputFilePath) {
  ffmpeg(inputFilePath)
    .toFormat('mp3')
    .save(outputFilePath)
    .on('end', () => {
      console.log('Conversion complete')
    })
    .on('error', err => {
      console.error(`Error: ${err.message}`)
    })
}
