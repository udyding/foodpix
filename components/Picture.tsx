import Link from 'next/link'

const Picture = ({ id, title, stream }) => {
  return (
    <div>
      <Link href={`/picture/${id}`}>
        <a>
          <h3>{title}</h3>
          <img src={stream}></img>
        </a>
      </Link>
    </div>
  )
}

export default Picture
