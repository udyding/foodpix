import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
const PictureModel = require('../models/Picture')

const memoryDb = new MongoMemoryServer()

export const connectToDb = async () => {
  // const memoryDb = await MongoMemoryServer.create() // testing database which disappears upon app termination
  const uri = await memoryDb.getUri()
  console.log(uri)
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
  }
  await mongoose.connect(uri, options)
  // return memoryDb
}

export const closeDb = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await memoryDb.stop()
}

export const clearDb = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}
