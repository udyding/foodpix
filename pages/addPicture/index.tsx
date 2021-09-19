import { useSession } from 'next-auth/client'
// import { useRouter } from 'next/router'
// import axios from 'axios'
import UploadPicture from '../../components/UploadPicture'

export default function AddPicture(): JSX.Element {
  const [session, loading] = useSession()

  return (
    <div>
      {loading && <p>Loading..</p>}
      {session ? <UploadPicture /> : <p>Not logged in to view this resource</p>}
    </div>
  )
}
