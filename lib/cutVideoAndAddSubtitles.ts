import ffmpeg from 'fluent-ffmpeg'
import * as fs from 'fs'
import * as path from 'path'

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

    const filterComplex = []
    let currentGroup = []
    let currentGroupLength = 0
    let groupStartTime = 0

    // Add a single black box for the entire duration
    const boxFilter = 'drawbox=y=(ih-136)/2:w=iw:h=136:color=black@0.8:t=fill'
    filterComplex.push(boxFilter)

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
        // Add the current group to filterComplex
        addGroupToFilterComplex(currentGroup, groupStartTime, start, startTime)
        // Start a new group with the current word
        currentGroup = [formattedWord]
        currentGroupLength = formattedWord.length
        groupStartTime = start
      }

      // If it's the last word, add the remaining group
      if (index === words.length - 1) {
        addGroupToFilterComplex(currentGroup, groupStartTime, end, startTime)
      }
    })

    function addGroupToFilterComplex(
      group,
      groupStart,
      groupEnd,
      videoStartTime
    ) {
      const groupText = group.join(' ')
      const adjustedStart = groupStart - videoStartTime
      const adjustedEnd = groupEnd - videoStartTime

      let textFilter =
        `drawtext=fontfile=Roboto-Regular.ttf:` +
        `text='${groupText}':fontsize=96:fontcolor=white:` +
        `x=(w-tw)/2:y=(h-th)/2:` +
        `enable='between(t,${adjustedStart.toFixed(2)},${adjustedEnd.toFixed(
          2
        )})'`

      filterComplex.push(textFilter)
    }

    command
      .videoFilters(filterComplex)
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
