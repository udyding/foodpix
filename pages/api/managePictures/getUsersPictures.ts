import { getSession } from 'next-auth/client'
import { PictureModel } from '../../../models/Picture'
import { getPresignedUrl } from './s3PictureService'
import dbConnect from '../../../middleware/dbConnect'

export default async (req, res) => {
  const user = await getSession({ req })

  await dbConnect()

  if (!user) {
    return res.json({ error: 'not logged in' })
  }

  const usersPictures = await PictureModel.find({ owner: user.id }).lean() // find all pictures with owner id matching
  // now need to append the file stream to all pictures
  const usersPicturesLen = usersPictures.length
  const presignedUrls = []
  for (let i = 0; i < usersPicturesLen; i++) {
    const presignedUrl = await getPresignedUrl(usersPictures[i].fileName)
    presignedUrls.push(presignedUrl)
  }
  const picturesWithStreams = usersPictures.map((pictureDetails, i) => [
    pictureDetails,
    presignedUrls[i],
  ])

  return res.json({ picturesWithStreams })
}
