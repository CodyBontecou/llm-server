import ffmpeg from 'fluent-ffmpeg'

export function convertMp4ToMp3(inputFilePath: string, outputFilePath: string) {
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
