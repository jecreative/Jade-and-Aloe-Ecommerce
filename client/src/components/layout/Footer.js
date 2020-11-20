import React from 'react'

// Bootstrap
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            &copy; 2020 Jordan Esguerra Creative Media
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
