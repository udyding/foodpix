import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Picture from '../../components/Picture'

export async function getServerSideProps(context) {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/managePictures/getAllPictures',
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
    return response.data.resultsWithStreams
    // handle success
  } catch (err) {
    // handle error
    console.log(err)
  }
}

const Browse = ({ data }): JSX.Element => {
  const [file, setFile] = useState<FileList | null>(null) // FileList from TypeScript
  const scrollAmount = 3
  const [keyword, setKeyword] = useState<string>('')
  const [pictures, setPictures] = useState()
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(true)
  const [visiblePictures, setVisiblePictures] = useState(scrollAmount)
  const [index, setIndex] = useState(0)
  const [picturesExist, setPicturesExist] = useState(true)

  const handleShowMorePictures = () => {
    const newIndex = index + scrollAmount
    const newShowMore = newIndex < pictures.length - 1
    setShowMore(newShowMore)
    setVisiblePictures((prevVisiblePosts) => prevVisiblePosts + scrollAmount)
  }

  useEffect(() => {
    const getAllPicturesFirst = async () => {
      const allPictures = data.picturesWithStreams
      setPictures(allPictures)
      if (allPictures.length == 0) {
        setPicturesExist(false)
      }
      setIndex(allPictures.length)
    }
    getAllPicturesFirst()
  }, [])

  const submitKeywordSearch = async (event) => {
    setPicturesExist(true)
    event.preventDefault()
    setLoading(true)
    if (!/^[a-zA-Z0-9 ]*/.test(keyword)) {
      console.log(keyword)
      throw new Error('Keyword can only contain letters and numbers')
    }
    try {
      const encodedKeyword = encodeURIComponent(keyword.trim().toLowerCase())
      const response = await axios({
        method: 'GET',
        url: `http://localhost:3000/api/browsePictures/searchByKeyword?keyword=${encodedKeyword}`,
      })
      const picturesWithStreams = response.data.resultsWithStreams
      console.log(picturesWithStreams)
      setPictures(picturesWithStreams)
      setIndex(picturesWithStreams.length)
      setVisiblePictures(scrollAmount)
      setShowMore(picturesWithStreams.length > scrollAmount)
      if (picturesWithStreams.length == 0) {
        setPicturesExist(false)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const submitImageSearch = async (event) => {
    setPicturesExist(true)
    event.preventDefault()
    setLoading(true)
    if (!file) {
      throw new Error('Please select a file.')
    }
    try {
      const picturesWithStreams = await getSimilarPictures({
        picture: file,
      })
      setPictures(picturesWithStreams)
      setIndex(picturesWithStreams.length)
      setVisiblePictures(scrollAmount)
      setShowMore(picturesWithStreams.length > scrollAmount)
      if (picturesWithStreams.length == 0) {
        setPicturesExist(false)
      }
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
      <div>
        <h1>Foodpix</h1>
        <h1>Browse for food pictures</h1>
        <h3>Search by:</h3>
        <br></br>
        <form onSubmit={submitKeywordSearch}>
          <input
            id="keyword"
            name="keyword"
            type="text"
            placeholder="Baozi"
            onChange={(e) => setKeyword(e.target.value)}
          ></input>
          <button disabled={loading} type="submit">
            Search
          </button>
        </form>
        <br></br>
        <form onSubmit={submitImageSearch}>
          <label>Upload file (max 1mb)</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={selectedFile}
            accept="image/*"
          />
          <button disabled={loading} type="submit">
            Search
          </button>
        </form>
        {!picturesExist && <h1>No pictures yet!</h1>}
        {picturesExist && (
          <>
            <Row className="justify-content-center">
              {pictures &&
                pictures.slice(0, visiblePictures).map((picture) => {
                  return (
                    <div className={{ display: 'flex', alignItems: 'center' }}>
                      <Col md={4}>
                        <Picture
                          id={picture[0]._id}
                          title={picture[0].title}
                          stream={picture[1]}
                        />
                      </Col>
                    </div>
                  )
                })}
            </Row>
            <div>
              {showMore && pictures && pictures.length > scrollAmount && (
                <button onClick={handleShowMorePictures}>Load more</button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Browse
