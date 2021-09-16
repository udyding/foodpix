import { getSession } from 'next-auth/client'
import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'

export default async (req, res) => {
  const user = await getSession({ req })
  const { pictureId } = req.query

  await dbConnect()

  if (!user) {
    return res.json({ error: 'not logged in' })
  }

  const pictureDetails = await PictureModel.findOne({ _id: pictureId }).lean() // find all pictures with owner id matching
  return res.json({ pictureDetails })
}
