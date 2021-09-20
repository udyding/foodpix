import { useSession } from 'next-auth/client'
import UploadPicture from 'components/UploadPicture'
import Layout from 'components/Layout'
import Landing from 'components/Landing'

export default function AddPicture(): JSX.Element {
  const [session, loading] = useSession()

  return (
    <Layout>
      {!session && !loading && (
        <>
          <Landing />
        </>
      )}

      {session && <UploadPicture />}
    </Layout>
  )
}
