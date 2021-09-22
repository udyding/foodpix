import { ReactElement } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Navbar from 'components/Navbar'
import Head from 'next/head'

type Props = {
  readonly children: ReadonlyArray<ReactElement>
}

export default function Layout({ children }: Props): ReactElement {
  return (
    <>
      <Head>
        <title>Foodpix</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Container style={{ paddingTop: '48px' }}>
        <Row>
          <Col>{children}</Col>
        </Row>
      </Container>
    </>
  )
}
