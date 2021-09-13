import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  database: process.env.MONGODB_URI,
  callbacks: {
    session: async (session, user) => {
      session.id = user.id
      return Promise.resolve(session)
    },
  },
})
