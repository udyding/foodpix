import axios from 'axios'

export default function Picture({ data }) {
  return (
    <>
      {data.pictureDetails && (
        <div>
          <h1>{data.pictureDetails.title}</h1>
          <p>{data.pictureDetails.description}</p>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:3000/api/managePictures/getPictureDetails?pictureId=${context.params.id}`,
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
