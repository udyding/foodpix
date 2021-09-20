import type { NextApiRequest, NextApiResponse } from 'next'
import { PictureModel } from '../../../models/Picture'
import { getPresignedUrl } from './s3PictureService'
import dbConnect from '../../../middleware/dbConnect'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await dbConnect()

  const allPictures = await PictureModel.find().lean() // find all pictures with owner id matching
  // now need to append the file stream to all pictures
  const allPicturesLen = allPictures.length
  const presignedUrls = []
  for (let i = 0; i < allPicturesLen; i++) {
    const presignedUrl = await getPresignedUrl(allPictures[i].fileName)
    presignedUrls.push(presignedUrl)
  }
  const picturesWithPresignedUrls = allPictures.map((pictureDetails, i) => [
    pictureDetails,
    presignedUrls[i],
  ])

  return res.json({ picturesWithPresignedUrls })
}
