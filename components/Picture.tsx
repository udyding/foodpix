import { ReactElement } from 'react'
import { Col, Card } from 'react-bootstrap'

type Props = {
  readonly picture: {
    title: string
    restaurant: string
  }
  readonly presignedUrl: string
}

export default function Picture({
  picture: { title, restaurant },
  presignedUrl,
}: Props): ReactElement {
  return (
    <Col style={{ marginBottom: '24px' }}>
      <Card>
        <Card.Img variant="top" src={presignedUrl} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{restaurant}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}
