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
  const [images, setImages] = useState([])
  const router = useRouter()

  const submitPictureForm = async (event) => {
    event.preventDefault()
    if (!file) {
      throw new Error('Please select a file.')
    }
    try {
      const result = await postPictureFormData({
        picture: file,
        title,
        description,
      })
      setImages([result.image, ...images])
      router.push('/')
    } catch (err) {
      throw new Error(
        'Invalid file input: make sure file is jpeg, png, or gif and less than 1MB in size.'
      )
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
          placeholder="Dish Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br></br>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Tell us more!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
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
        <button type="submit">Send</button>
      </form>
    </>
  )
}

export default UploadPicture
