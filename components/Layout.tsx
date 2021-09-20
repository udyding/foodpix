import { ReactElement } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Navbar from 'components/Navbar'

type Props = {
  readonly children: ReadonlyArray<ReactElement>
}

export default function Layout({ children }: Props): ReactElement {
  return (
    <>
      <Navbar />
      <Container style={{ paddingTop: '48px' }}>
        <Row>
          <Col>{children}</Col>
        </Row>
      </Container>
    </>
  )
}
