import S3 from 'aws-sdk/clients/s3'
import { ReadStream } from 'fs'

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
})

export const uploadPictureToS3 = async (
  fileContent: ReadStream,
  fileName: string
): Promise<S3.ManagedUpload.SendData> => {
  try {
    const params = {
      Body: fileContent,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    }
    return s3.upload(params).promise()
  } catch (err) {
    console.log(err)
  }
}

export const getPresignedUrl = async (fileKey: string): Promise<string> => {
  const params = {
    Key: fileKey,
    Bucket: process.env.AWS_BUCKET_NAME,
    Expires: 100, // seconds
  }
  return s3.getSignedUrlPromise('getObject', params)
}
