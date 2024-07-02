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
    let currentGroup = []
    let currentGroupLength = 0
    let groupStartTime = 0

    words.forEach((wordObj, index) => {
      const { word, start, end } = wordObj
      const formattedWord = word.replace(/'/g, '')

      if (currentGroupLength + formattedWord.length <= 15) {
        if (currentGroup.length === 0) {
          groupStartTime = start
        }
        currentGroup.push(formattedWord)
        currentGroupLength += formattedWord.length
      } else {
        // Add the current group to drawTextArray
        addGroupToDrawTextArray(currentGroup, groupStartTime, start, startTime)
        // Start a new group with the current word
        currentGroup = [formattedWord]
        currentGroupLength = formattedWord.length
        groupStartTime = start
      }

      // If it's the last word, add the remaining group
      if (index === words.length - 1) {
        addGroupToDrawTextArray(currentGroup, groupStartTime, end, startTime)
      }
    })

    function addGroupToDrawTextArray(
      group,
      groupStart,
      groupEnd,
      videoStartTime
    ) {
      const groupText = group.join(' ')
      const adjustedStart = groupStart - videoStartTime
      const adjustedEnd = groupEnd - videoStartTime

      let generatedText =
        `drawtext=fontfile=Roboto-Regular.ttf:text='${groupText}':` +
        `enable='between(t,${adjustedStart.toFixed(2)},${adjustedEnd.toFixed(
          2
        )})':` +
        `x=(w-tw)/2:y=(h-th)/2:fontsize=96:fontcolor=white:box=1:boxcolor=black@0.8:boxborderw=4`

      drawTextArray.push(generatedText)
    }

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
