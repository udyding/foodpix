import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'

export default async (req, res) => {
  const { pictureId } = req.query

  await dbConnect()

  const pictureDetails = await PictureModel.findOne({ _id: pictureId }).lean() // find all pictures with owner id matching
  return res.json({ pictureDetails })
}
