import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import { getSession } from 'next-auth/client'
import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'
import getVisionLabels from '../getPictureLabels/getVisionLabels'
import { uploadPictureToS3 } from './s3PictureService'
import formidable from 'formidable'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import util from 'util'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const addPictureToDatabase = async (
  user: Session,
  title: string,
  restaurant: string,
  fileName: string,
  labels: string[]
): Promise<void> => {
  await dbConnect()

  // ensure given request is POST
  const newPicture = new PictureModel({
    owner: user.id,
    title: title,
    restaurant: restaurant,
    fileName: fileName,
    keywords: labels,
  })

  newPicture.save(async function (err, doc) {
    /* eslint-disable no-console */
    if (err) {
      console.log(err)
    }
    console.log(doc)
    /* eslint-enable no-console */
  })
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const user = await getSession({ req })
  if (!user) {
    return res.json({ error: 'not logged in' })
  }

  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const form = new formidable()
  form.uploadDir = 'bucketFolder/'
  form.keepExtensions = true
  form.maxFileSize = 1 * 1024 * 1024 // max 1MB
  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(500).send(err)
    }
    const fileType = file && file.picture && file.picture.type
    const acceptedFileExtensions = /(JPG|jpg|JPEG|jpeg|GIF|gif|PNG|png)$/ // need to end in
    if (!acceptedFileExtensions.test(fileType)) {
      return res.status(500).send('Invalid file type: only jpeg, png, and gif')
    }
    try {
      const filePath = file.picture.path
      const fileContent = fs.createReadStream(filePath)
      const newFileName = uuidv4() // prevents duplicate file names
      const data = await uploadPictureToS3(fileContent, newFileName)
      const labels = await getVisionLabels(filePath) // get google vision API labels
      await addPictureToDatabase(
        user,
        fields.title,
        fields.restaurant,
        newFileName,
        labels
      )
      const deleteFileFromBucketFolder = util.promisify(fs.unlink)
      await deleteFileFromBucketFolder(filePath)
      return res.status(200).send(data)
    } catch (err) {
      return res.status(500).send(err)
    }
  })
}
