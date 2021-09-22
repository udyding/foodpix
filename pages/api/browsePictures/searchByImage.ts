import type { NextApiRequest, NextApiResponse } from 'next'
import { PictureModel } from '../../../models/Picture'
import dbConnect from '../../../middleware/dbConnect'
import { getPresignedUrl } from '../managePictures/s3PictureService'

import getVisionLabels from '../getPictureLabels/getVisionLabels'
import formidable from 'formidable'
import fs from 'fs'
import util from 'util'

export const config = {
  api: {
    bodyParser: false,
  },
}

const findPicturesFromKeywords = async (keywords) => {
  await dbConnect()
  // find documents that contain at least 5 common keywords
  const pictures = await PictureModel.aggregate([
    { $match: { 'keywords.4': { $exists: true } } },
    {
      $redact: {
        $cond: [
          {
            $gte: [{ $size: { $setIntersection: ['$keywords', keywords] } }, 5],
          },
          '$$KEEP',
          '$$PRUNE',
        ],
      },
    },
  ])
  return pictures
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
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
      const labels = await getVisionLabels(filePath) // get google vision API labels
      const deleteFileFromBucketFolder = util.promisify(fs.unlink)
      await deleteFileFromBucketFolder(filePath)
      const searchResults = await findPicturesFromKeywords(labels)
      const searchResultsLen = searchResults.length
      const presignedUrls = []
      for (let i = 0; i < searchResultsLen; i++) {
        const presignedUrl = await getPresignedUrl(searchResults[i].fileName)
        presignedUrls.push(presignedUrl)
      }
      const picturesWithPresignedUrls = searchResults.map(
        (pictureDetails, i) => [pictureDetails, presignedUrls[i]]
      )
      return res.json({ picturesWithPresignedUrls })
    } catch (err) {
      return res.status(500).send(err)
    }
  })
}
