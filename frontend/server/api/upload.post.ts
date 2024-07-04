import { processAudio } from '~/lib/processAudio'
import { PassThrough } from 'stream'
import fs from 'fs'

interface File {
  name: string
  content: string
  size: string
  type: string
  lastModified: string
}

export default defineEventHandler(async event => {
  const { files } = await readBody<{ files: File[] }>(event)
  let fName = ''
  for (const file of files) {
    const filename = await storeFileLocally(
      file, // the file object
      8, // you can add a name for the file or length of Unique ID that will be automatically generated!
      '/userFiles' // the folder the file will be stored in
    )
    fName = filename
    const { binaryString, ext } = parseDataUrl(file.content)
    await processAudio(binaryString, filename)
  }

  // const outputFilePath = `/storage/userFiles/output-${fName}`

  // // Check if file exists
  // if (!fs.existsSync(outputFilePath)) {
  //   console.error(`File not found at path: ${outputFilePath}`)

  //   throw createError({
  //     statusCode: 404,
  //     statusMessage: `Processed file not found: ${outputFilePath}`,
  //   })
  // }

  // // Set appropriate headers
  // setHeader(event, 'Content-Type', 'video/mp4')
  // setHeader(
  //   event,
  //   'Content-Disposition',
  //   `attachment; filename="${outputFilePath}"`
  // )

  // // Create a read stream from the file
  // const fileStream = fs.createReadStream(outputFilePath)

  // // Send the file stream
  // return sendStream(event, fileStream)
})
