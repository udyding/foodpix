import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Row, Form, Button, Container, Alert } from 'react-bootstrap'
import { GetServerSideProps } from 'next'
import Picture from 'components/Picture'
import Layout from 'components/Layout'
import styles from '/styles/Browse.module.css'

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/managePictures/getAllPictures',
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

const getSimilarPictures = async ({ picture }) => {
  const formData = new FormData()
  formData.append('picture', picture)

  try {
    // send form data to API endpoint to be sent to AWS
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/browsePictures/searchByImage',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.picturesWithPresignedUrls
    // handle success
  } catch (err) {
    // handle error
    console.log(err)
  }
}

type Props = {
  pictures: Array<
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

const Browse = ({ pictures: picturesData }: Props): JSX.Element => {
  const [file, setFile] = useState<FileList | null>(null) // FileList from TypeScript
  const scrollAmount = 12
  const [keyword, setKeyword] = useState<string>('')
  const [pictures, setPictures] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(true)
  const [visiblePictures, setVisiblePictures] = useState(scrollAmount)
  const [index, setIndex] = useState(0)
  const [picturesExist, setPicturesExist] = useState(true)
  const [error, setError] = useState('')

  const handleShowMorePictures = () => {
    const newIndex = index + scrollAmount
    const newShowMore = newIndex < pictures.length - 1
    setShowMore(newShowMore)
    setVisiblePictures((prevVisiblePosts) => prevVisiblePosts + scrollAmount)
  }

  useEffect(() => {
    const getAllPicturesFirst = async () => {
      setPictures(picturesData)
      if (picturesData.length == 0) {
        setPicturesExist(false)
      }
      setIndex(picturesData.length)
    }
    getAllPicturesFirst()
  }, [])

  const submitKeywordSearch = async (event) => {
    setPicturesExist(true)
    event.preventDefault()
    setLoading(true)
    setError('')

    if (!/^[a-zA-Z0-9 ]*/.test(keyword)) {
      setError('Keyword can only contain letters and numbers')
    }
    try {
      const encodedKeyword = encodeURIComponent(keyword.trim().toLowerCase())
      const response = await axios({
        method: 'GET',
        url: `http://localhost:3000/api/browsePictures/searchByKeyword?keyword=${encodedKeyword}`,
      })
      const picturesWithPresignedUrls = response.data.picturesWithPresignedUrls
      setPictures(picturesWithPresignedUrls)
      setIndex(picturesWithPresignedUrls.length)
      setVisiblePictures(scrollAmount)
      setShowMore(picturesWithPresignedUrls.length > scrollAmount)
      if (picturesWithPresignedUrls.length == 0) {
        setPicturesExist(false)
      }
    } catch (err) {
      console.log(err)
      setError('Error: could not complete keyword search')
    } finally {
      setLoading(false)
    }
  }

  const submitImageSearch = async (event) => {
    setPicturesExist(true)
    event.preventDefault()
    setLoading(true)
    setError('')

    if (!file) {
      setError('Please select a file.')
    }
    try {
      const picturesWithPresignedUrls = await getSimilarPictures({
        picture: file,
      })
      setPictures(picturesWithPresignedUrls)
      setIndex(picturesWithPresignedUrls.length)
      setVisiblePictures(scrollAmount)
      setShowMore(picturesWithPresignedUrls.length > scrollAmount)
      if (picturesWithPresignedUrls.length == 0) {
        setPicturesExist(false)
      }
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
      <Layout>
        <h1>Browse pictures</h1>
        <br />
        <div className={styles.searchForm}>
          <h3 className={styles.searchBy}>Search by:</h3>
          <div className={styles.searchMethods}>
            <div className={styles.searchByKeyword}>
              <Form onSubmit={submitKeywordSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>Keyword</Form.Label>
                  <Form.Control
                    id="keyword"
                    name="keyword"
                    type="text"
                    placeholder="E.g.: Baozi"
                    onChange={(e) => setKeyword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button variant="warning" disabled={loading} type="submit">
                  Search
                </Button>
              </Form>
            </div>
            <div className={styles.or}>
              <h2>or</h2>
            </div>
            <div className={styles.searchByImage}>
              <Form onSubmit={submitImageSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>Image (max 1mb)</Form.Label>
                  <Form.Control
                    type="file"
                    id="file"
                    name="file"
                    onChange={selectedFile}
                    accept="image/*"
                  />
                </Form.Group>
                <Button variant="warning" disabled={loading} type="submit">
                  Search
                </Button>
              </Form>
            </div>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>

        {!picturesExist && <h1>No pictures yet!</h1>}
        {picturesExist && (
          <>
            <Container className={styles.picturesContainer}>
              <Row sm={1} md={2}>
                {pictures &&
                  pictures
                    .slice(0, visiblePictures)
                    .map((picture, i) => (
                      <Picture
                        key={i}
                        picture={picture[0]}
                        presignedUrl={picture[1]}
                      />
                    ))}
              </Row>
              <div>
                {showMore && pictures && pictures.length > scrollAmount && (
                  <button onClick={handleShowMorePictures}>Load more</button>
                )}
              </div>
            </Container>
          </>
        )}
      </Layout>
    </>
  )
}

export default Browse
