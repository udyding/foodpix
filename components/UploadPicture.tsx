import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const postPictureFormData = async ({ picture, title, description }) => {
  const formData = new FormData()
  formData.append('picture', picture)
  formData.append('title', title)
  formData.append('description', description)

  console.log(formData)
  try {
    // send form data to API endpoint to be sent to AWS
    const response = await axios({
      method: 'POST',
      url: '/api/managePictures/addPicture',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
    // handle success
  } catch (err) {
    // handle error
    console.log(err)
  }
}

const UploadPicture = () => {
  const [file, setFile] = useState<FileList | null>(null) // FileList from TypeScript
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [restaurant, setRestaurant] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submitPictureForm = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!file) {
      throw new Error('Please select a file.')
    }
    try {
      await postPictureFormData({
        picture: file,
        title,
        description,
      })
      router.push('/')
    } catch (err) {
      throw new Error(
        'Invalid file input: make sure file is jpeg, png, or gif and less than 1MB in size.'
      )
    } finally {
      setLoading(false)
    }
  }

  const selectedFile = (event) => {
    const file = event.target.files[0]
    setFile(file)
  }

  return (
    <>
      <form onSubmit={submitPictureForm}>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Strawberry Milkshake"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br></br>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="A milkshake good enough for three!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br></br>
        <input
          id="restaurant"
          name="restaurant"
          type="text"
          placeholder="Pop's Chock'lit Shoppe"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          required
        ></input>
        <br></br>
        <label>Upload file (max 1mb)</label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={selectedFile}
          accept="image/*"
        />
        <br></br>
        <button disabled={loading} type="submit">
          Send
        </button>
      </form>
    </>
  )
}

export default UploadPicture
