import React, { ReactElement } from 'react'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { signIn, signOut, useSession } from 'next-auth/client'

const Header = (): ReactElement => {
  const [session] = useSession()
  console.log(session)
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand
            href="/"
            style={{ fontSize: '24px', marginRight: '30px' }}
          >
            Foodpix
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/browse">Browse</Nav.Link>
            {session && <Nav.Link href="/">My pictures</Nav.Link>}
          </Nav>
          <Nav className="ml-auto">
            {session ? (
              <Button
                variant="outline-warning"
                onClick={() =>
                  signOut({ callbackUrl: 'http://localhost:3000/' })
                }
              >
                Sign out
              </Button>
            ) : (
              <Button
                variant="outline-warning"
                onClick={() =>
                  signIn('google', { callbackUrl: 'http://localhost:3000/' })
                }
              >
                Sign in
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
