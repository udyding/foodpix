const session = {
  user: { name: 'Test User', email: 'test@gmail.com', image: 'test' },
  accessToken: 'testToken',
  expires: 'time',
  id: 'testId',
}

export const getSession = jest.fn(async () => {
  return Promise.resolve({})
})
