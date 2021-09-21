import { ReactElement } from 'react'
import { Container, Row, Button } from 'react-bootstrap'
import { GetServerSideProps } from 'next'
import { useSession, getSession } from 'next-auth/client'
import axios from 'axios'
import Picture from 'components/Picture'
import Layout from 'components/Layout'
import Landing from 'components/Landing'
import styles from 'styles/Home.module.css'

type Props = {
  readonly pictures: ReadonlyArray<
    [
      {
        readonly _id: string
        readonly title: string
        readonly restaurant: string
      },
      string
    ]
  >
}

const Home = ({ pictures }: Props): ReactElement => {
  const [session, loading] = useSession()
  return (
    <Layout>
      {!session && !loading && (
        <>
          <Landing />
        </>
      )}
      {session && (
        <>
          <h1>Welcome, {session.user.name}!</h1>
          <br />
          <Button variant="warning">
            <a className={styles.addPicture} href="/addPicture">
              Add new picture
            </a>
          </Button>
          <br />
          <h2 className={styles.myPictures}>My pictures</h2>
          {pictures.length === 0 && (
            <>
              <h3>No pictures yet!</h3>
            </>
          )}
          <Container className={styles.picturesContainer}>
            <Row sm={1} md={2}>
              {pictures.map((picture, i) => (
                <Picture
                  key={i}
                  picture={picture[0]}
                  presignedUrl={picture[1]}
                />
              ))}
            </Row>
          </Container>
        </>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context)
  if (!session) {
    return {
      props: {
        pictures: [],
      },
    }
  }

  try {
    const res = await axios({
      method: 'GET',
      url: '/api/managePictures/getUsersPictures',
      headers: {
        cookie: context.req.headers.cookie,
      },
    })

    return {
      props: {
        pictures: res.data.picturesWithPresignedUrls,
      },
    }
  } catch (err) {
    console.log(err)
    return { props: { pictures: [] } }
  }
}

export default Home
