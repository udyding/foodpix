import type { NextApiRequest, NextApiResponse } from 'next'
import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'
import { getPresignedUrl } from '../managePictures/s3PictureService'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { keyword } = req.query
  const decodedKeyword = decodeURIComponent(keyword as string)

  await dbConnect()
  let searchResults
  if (keyword === '') {
    searchResults = await PictureModel.find().lean()
  } else {
    searchResults = await PictureModel.find({
      keywords: decodedKeyword,
    }).lean()
  }

  // now need to append the file stream to all pictures
  const searchResultsLen = searchResults.length
  const presignedUrls = []
  for (let i = 0; i < searchResultsLen; i++) {
    const presignedUrl = await getPresignedUrl(searchResults[i].fileName)
    presignedUrls.push(presignedUrl)
  }
  const picturesWithPresignedUrls = searchResults.map((pictureDetails, i) => [
    pictureDetails,
    presignedUrls[i],
  ])
  return res.json({ picturesWithPresignedUrls })
}
