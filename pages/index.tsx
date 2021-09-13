import { signIn, signOut, useSession } from 'next-auth/client'

const Home = (): JSX.Element => {
  const [session, loading] = useSession()
  return (
    <div>
      <h1>Foodpix</h1>
      {loading && <p>Loading..</p>}
      {!session && (
        <>
          <button
            onClick={() =>
              signIn('google', { callbackUrl: 'http://localhost:3000/' })
            }
          >
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          Welcome, {session.user.name}!<br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  )
}

export default Home
