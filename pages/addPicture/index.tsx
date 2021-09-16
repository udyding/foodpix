import { useSession } from 'next-auth/client'
// import { useRouter } from 'next/router'
// import axios from 'axios'
import UploadPicture from '../../components/UploadPicture'

export default function AddPicture(): JSX.Element {
  //   const router = useRouter()
  const [session, loading] = useSession()

  //   const addPicture = async (event) => {
  //     event.preventDefault()

  //     await axios({
  //       method: 'POST',
  //       url: '/api/managePictures/addPicture',
  //       data: JSON.stringify({
  //         title: event.target.title.value,
  //         description: event.target.description.value,
  //       }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     router.push('/') // redirect back to home after posting
  //   }

  return (
    <div>
      {loading && <p>Loading..</p>}
      {session ? <UploadPicture /> : <p>Not logged in to view this resource</p>}
    </div>
  )
}
