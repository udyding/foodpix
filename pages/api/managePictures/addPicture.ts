import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import { getSession } from 'next-auth/client'
import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'
import getVisionLabels from '../getPictureLabels/getVisionLabels'
import { getPresignedUrl, uploadPictureToS3 } from './s3PictureService'
import { v4 as uuidv4 } from 'uuid'
import asyncBusboy from 'async-busboy'

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
  return newPicture
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
  const { files, fields } = await asyncBusboy(req)
  const file = files[0]
  const fileType = file && file.mimeType
  const acceptedFileExtensions = /(JPG|jpg|JPEG|jpeg|GIF|gif|PNG|png)$/ // need to end in
  if (!acceptedFileExtensions.test(fileType)) {
    return res.status(500).send('Invalid file type: only jpeg, png, and gif')
  }
  try {
    const newFileName = uuidv4() // prevents duplicate file names
    await uploadPictureToS3(file, newFileName)
    const presignedUrl = await getPresignedUrl(newFileName)

    const labels = await getVisionLabels(presignedUrl) // get google vision API labels
    const newPicture = await addPictureToDatabase(
      user,
      fields.title,
      fields.restaurant,
      newFileName,
      labels
    )
    return res.status(200).send(newPicture)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
