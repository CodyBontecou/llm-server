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

    const filterComplex = []
    let currentGroup = []
    let currentGroupLength = 0
    let groupStartTime = 0

    const newWidth = Math.round((1080 * 9) / 16) // 607.5, rounded to 608
    const xOffset = Math.round((1920 - newWidth) / 2) // 656

    const cropFilter = `crop=${newWidth}:1080:${xOffset}:0`
    filterComplex.push(cropFilter)

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

      const fontSize = 96 // Keep font size constant
      const maxWidth = Math.floor(newWidth * 0.9) // 90% of video width

      // Estimate characters that fit in maxWidth
      const avgCharWidth = fontSize * 0.6 // Approximate average character width
      const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth)

      // Split text into lines
      const words = groupText.split(' ')
      const lines = []
      let currentLine = ''

      words.forEach(word => {
        if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
          currentLine += (currentLine ? ' ' : '') + word
        } else {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        }
      })
      if (currentLine) lines.push(currentLine)

      // Create separate drawtext filter for each line
      const textFilters = lines.map((line, index) => {
        const yOffset = index * (fontSize + 10) // 10 pixels line spacing
        return (
          `drawtext=fontfile=Roboto-Regular.ttf:` +
          `text='${line}':fontsize=${fontSize}:fontcolor=white:` +
          `x=(${newWidth}-tw)/2:y=(${1080}-th)/2+${yOffset}:` +
          `enable='between(t,${adjustedStart.toFixed(2)},${adjustedEnd.toFixed(
            2
          )})':` +
          `box=1:boxcolor=black@0.5:boxborderw=5`
        )
      })

      // Add all text filters to the filterComplex
      filterComplex.push(...textFilters)
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
