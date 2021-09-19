import { signIn, signOut, useSession } from 'next-auth/client'
import axios from 'axios'
import Picture from '../components/Picture'

export async function getServerSideProps(context) {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/managePictures/getUsersPictures',
      headers: {
        cookie: context.req.headers.cookie,
      },
    })
    const data = res.data
    return {
      props: {
        data: data,
      },
    }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }
}

const Home = ({ data }): JSX.Element => {
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
          <button>
            <a href="/addPicture">New picture</a>
          </button>
          <h1>My gallery</h1>
          {data.picturesWithStreams.map((picture) => (
            <>
              <Picture
                id={picture[0]._id}
                title={picture[0].title}
                stream={picture[1]}
              />
            </>
          ))}
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  )
}

export default Home
