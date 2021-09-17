import Link from 'next/link'
// import { useRouter } from 'next/router'

const Picture = ({ id, title }) => {
  //   const router = useRouter();

  //   const sendDelete = async () => {
  //     const res = await fetch(`/api/notes/delete/${id}`, {
  //       method: "DELETE",
  //     });
  //     router.push("/");
  //   };

  return (
    <div>
      <Link href={`/picture/${id}`}>
        <a>
          <h3>{title}</h3>
        </a>
      </Link>
    </div>
  )
}

export default Picture
