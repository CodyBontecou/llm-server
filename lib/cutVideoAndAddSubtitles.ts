import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

export function cutVideoAndAddSubtitles(
  inputFile,
  outputFile,
  startTime,
  endTime,
  words
) {
  return new Promise((resolve, reject) => {
    // Ensure the output directory exists
    const outputDir = path.dirname(outputFile)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    let command = ffmpeg(inputFile)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)

    const drawTextArray = []

    words.forEach((wordObj, index) => {
      const { word, start, end } = wordObj
      const adjustedStart = start - startTime
      const adjustedEnd = end - startTime

      const formattedWord = word.replace(/'/g, '')
      let generatedText =
        `drawtext=fontfile=Roboto-Regular.ttf:text='${formattedWord}':` +
        `enable='between(t,${adjustedStart.toFixed(2)},${adjustedEnd.toFixed(
          2
        )})':` +
        `x=(w-tw)/2:y=(h-th)/2:fontsize=96:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=4`

      drawTextArray.push(generatedText)
    })

    command
      .videoFilters(drawTextArray.join(', '))
      .output(outputFile)
      .videoCodec('libx264')
      .audioCodec('copy')
      .on('start', commandLine => {
        console.log('Spawned FFmpeg with command: ' + commandLine)
      })
      .on('progress', progress => {
        console.log('Processing: ' + progress.percent + '% done')
      })
      .on('end', () => {
        console.log('Video cut and subtitles added successfully')
        resolve()
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Error:', err)
        console.error('ffmpeg stdout:', stdout)
        console.error('ffmpeg stderr:', stderr)
        reject(err)
      })
      .run()
  })
}
