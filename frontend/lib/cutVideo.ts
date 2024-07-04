import ffmpeg from 'fluent-ffmpeg'

export function cutVideo(inputFile, outputFile, startTime, endTime) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputFile)
      .on('end', () => {
        console.log('Cutting finished successfully')
        resolve()
      })
      .on('error', err => {
        console.error('Error occurred: ' + err.message)
        reject(err)
      })
      .run()
  })
}
