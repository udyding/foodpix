import mongoose, { Schema } from 'mongoose'
import { User } from '../interfaces/index'

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  name: { type: String, required: true },
})

export const UserModel = mongoose.model<User>('User', userSchema)
