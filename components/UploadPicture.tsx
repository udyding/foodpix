import React, { useState, FunctionComponent } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useRouter } from 'next/router'

const postPictureFormData = async ({ picture, title, restaurant }) => {
  const formData = new FormData()
  formData.append('picture', picture)
  formData.append('title', title)
  formData.append('restaurant', restaurant)

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
    throw new Error('Unable to add picture')
  }
}

const UploadPicture: FunctionComponent = () => {
  const [file, setFile] = useState<FileList | null>(null) // FileList from TypeScript
  const [title, setTitle] = useState<string>('')
  const [restaurant, setRestaurant] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const submitPictureForm = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    if (!file) {
      throw new Error('Please select a file.')
    }
    try {
      await postPictureFormData({
        picture: file,
        title,
        restaurant,
      })
      router.push('/')
    } catch (err) {
      setError(
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
      <div style={{ maxWidth: '800px', marginLeft: '50px' }}>
        <h1>Add a picture</h1>
        <br />
        <Form onSubmit={submitPictureForm}>
          <Form.Group className="mb-3">
            <Form.Label>Dish title</Form.Label>
            <Form.Control
              size="lg"
              id="title"
              name="title"
              type="text"
              placeholder="E.g.: Strawberry Milkshake"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              size="lg"
              id="restaurant"
              name="restaurant"
              type="text"
              placeholder="E.g.: Pop's Chock'lit Shoppe"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              maxLength={60}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Upload picture (max 1mb)</Form.Label>
            <Form.Control
              type="file"
              size="lg"
              id="file"
              name="file"
              onChange={selectedFile}
              accept="image/*"
            />
          </Form.Group>
          <Button size="lg" variant="warning" disabled={loading} type="submit">
            Send
          </Button>
        </Form>
        <br />
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </>
  )
}

export default UploadPicture
