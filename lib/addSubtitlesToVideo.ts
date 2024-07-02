import ffmpeg from 'fluent-ffmpeg'

export function addSubtitlesToVideo(
  inputFile,
  outputFile,
  words,
  videoStartTime
) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputFile)

    words.forEach(wordObj => {
      const { word, start, end } = wordObj
      const adjustedStart = start - videoStartTime
      const adjustedEnd = end - videoStartTime

      const drawtext =
        `drawtext=fontfile=Roboto-Regular.ttf:text='${word}':` +
        `enable='between(t,${adjustedStart.toFixed(2)},${adjustedEnd.toFixed(
          2
        )})':` +
        `x=(w-tw)/2:y=h-th-20:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5`

      command = command.videoFilters(drawtext)
    })

    command
      .output(outputFile)
      .videoCodec('libx264')
      .audioCodec('copy')
      .on('end', () => {
        console.log('Subtitles added successfully')
        resolve()
      })
      .on('error', err => {
        console.error('Error occurred: ' + err.message)
        reject(err)
      })
      .run()
  })
}
