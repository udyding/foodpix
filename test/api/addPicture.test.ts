import request from 'supertest'
import chai, { expect } from 'chai'
import { connectToDb, closeDb, clearDb } from '../testDbConnect'
import { Session } from 'next-auth/client'
import { getSession } from 'next-auth/client'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

// const mockedGetSession = getSession as jest.Mock(Promise<Session>)

// jest.mock('next-auth/client')
// const mockedNextAuth = NextAuth as jest.Mocked<typeof NextAuth>
// jest.mock('../__mocks__/session')

// NextAuth.getSession = jest.fn(() =>
//   Promise.resolve({
//     user: { name: 'Test User', email: 'test@gmail.com', image: 'test' },
//     accessToken: 'testToken',
//     expires: 'time',
//     id: 'testId',
//   })
// )

// jest.mock('next-auth/client', () => ({
//   getSession: () => {
//     return jest.fn(() => ({
//       user: { name: 'Test User', email: 'test@gmail.com', image: 'test' },
//       accessToken: 'testToken',
//       expires: 'time',
//       id: 'testId',
//     }))
//   },
// }))

const newPicture = {
  title: 'Test Pasta',
  restaurant: 'Test Restaurant',
  fileName: '1085c01c-2fd1-42bb-a1e0-9d0658ea8970',
  keywords: [
    'food',
    'condiment',
    'rigatoni',
    'recipe',
    'ingredient',
    'staple food',
    'mostaccioli',
    'penne',
    'pasta',
    'produce',
  ],
}

// describe('POST /api/managePictures/addPicture', () => {
//   let dbConnection
//   beforeAll(async () => {
//     dbConnection = await connectToDb()
//   })

//   afterEach(async () => {
//     await clearDb()
//   })

//   afterAll(async () => {
//     await closeDb(dbConnection)
//   })

//   describe('adding a picture', () => {
//     test('should respond 200 to authorized valid add picture request', async () => {
//       const mockSession = {
//         user: { name: 'Test User', email: 'test@gmail.com', image: 'test' },
//         accessToken: 'testToken',
//         expires: 'time',
//         id: 'testId',
//       }

//       getSession.mockImplementationOnce(() => Promise.resolve(mockSession))

//       // (getSession as jest.Mock).mockReturnValueOnce(Promise.resolve(mockSession))
//       //   mockedNextAuth.getSession.mockResolvedValue(mockSession)
//       await request('http://localhost:3000')
//         .post('/api/managePictures/addPicture')
//         .attach('picture', 'test/testPicture.jpeg')
//         .field('title', 'Test Pasta')
//         .field('restaurant', 'Test Restaurant')
//         .expect((res) => {
//           expect(res.body).to.contain(newPicture)
//         })
//         .expect(200)
//       //   const retval = await getSession({ req })
//       //   console.log('+++++++++++++++' + JSON.stringify(retval))
//       //   //   expect(mockedNextAuth.getSession).toHaveBeenCalled()
//       //   expect(retval).to.equal(mockSession)

//       //   jest.fn().mockReturnValueOnce(mockSession)
//       //   getSession.mockResolvedValue(mockSession)
//     })

//     test('should respond 500 to authorized request for invalid file greater than 1mb', (done) => {
//       request('http://localhost:3000')
//         .post('/api/managePictures/addPicture')
//         .attach('picture', 'test/testInvalidPicture.jpg')
//         .field('title', 'Test Invalid')
//         .field('restaurant', 'Invalid Restaurant')
//         .expect(500, done)
//     })
//   })
// })
