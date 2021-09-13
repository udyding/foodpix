import { Types } from 'mongoose'

export type Picture = {
  owner: Types.ObjectId
  title: string
  description: string
  keywords: string[]
}

export type User = {
  email: string
  name: string
}