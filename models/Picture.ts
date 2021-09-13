import mongoose, { Schema } from 'mongoose'
import { Picture } from '../interfaces/index'

const pictureSchema = new Schema<Picture>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    keywords: [{ type: String }],
  },
  { timestamps: true }
)

export const PictureModel = mongoose.model<Picture>('Picture', pictureSchema)
