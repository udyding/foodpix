import type { NextApiRequest, NextApiResponse } from 'next'
import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { pictureId } = req.query

  await dbConnect()

  const pictureDetails = await PictureModel.findOne({ _id: pictureId }).lean() // find all pictures with owner id matching
  return res.json({ pictureDetails })
}
