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
    restaurant: { type: String, required: true },
    fileName: { type: String, required: true },
    keywords: [{ type: String }],
  },
  { timestamps: true }
)

export const PictureModel =
  mongoose.models.Picture || mongoose.model<Picture>('Picture', pictureSchema)
