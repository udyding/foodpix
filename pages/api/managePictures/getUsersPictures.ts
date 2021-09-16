import { getSession } from 'next-auth/client'
import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'

export default async (req, res) => {
  const user = await getSession({ req })

  await dbConnect()

  if (!user) {
    return res.json({ error: 'not logged in' })
  }

  const usersPictures = await PictureModel.find({ owner: user.id }).lean() // find all pictures with owner id matching
  return res.json({ usersPictures })
}
