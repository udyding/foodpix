import request from 'supertest'
import chai, { expect } from 'chai'
import { connectToDb, closeDb, clearDb } from '../testDbConnect'
// import { getPresignedUrl } from '../../pages/api/managePictures/s3PictureService'
jest.setTimeout(60000)

// jest.mock('../../pages/api/managePictures/s3PictureService')
// getPresignedUrl.mockImplementation(() => Promise.resolve('Test presigned url'))

const newPicture = {
  title: 'Test dish',
  restaurant: 'Test restaurant',
  fileName: '1234',
  keywords: ['food'],
}

describe.only('GET /api/managePictures/getAllPictures', () => {
  beforeAll(async () => {
    await connectToDb()
  })

  afterEach(async () => {
    await clearDb()
  })

  afterAll(async () => {
    await closeDb()
  })

  describe('getting all pictures', () => {
    test('should return all pictures with their presigned urls', (done) => {
      // getPresignedUrl.mockReturnValue(Promise.resolve('Test presigned url'))
      // first populate database
      //   const mockSession = {
      //     user: { name: 'Test User', email: 'test@gmail.com', image: 'test' },
      //     accessToken: 'testToken',
      //     expires: 'time',
      //     id: 'testId',
      //   }
      //   await addPictureToDb(
      //     mockSession,
      //     'Test dish',
      //     'Test restaurant',
      //     '1234',
      //     ['food']
      //   )
      const mockDbConnect = jest.fn()

      // will run the function and return mocked presigned url
      const req = request('/').get('/api/managePictures/getAllPictures')
      req
        .expect((res) => {
          expect(res.body).to.equal({})
        })
        .expect(200, done)
      //   expect(res.picturesWithPresignedUrls).to.equal([
      //     [newPicture, 'Test presigned url'],
      //   ])
    })
  })
})
