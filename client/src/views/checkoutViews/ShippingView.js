import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
//* Bootstrap
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
//* Redux
import { useDispatch } from 'react-redux'
import { saveShippingAddress } from '../../redux/actions/cartActions'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'

const ShippingScreen = ({ history, location }) => {
  const nameRef = useRef('')
  const line1Ref = useRef()
  const line2Ref = useRef()
  const cityRef = useRef()
  const stateRef = useRef()
  const postalCodeRef = useRef()
  const phoneNumberRef = useRef()
  const instructionsRef = useRef()
  const [message, setMessage] = useState(null)
  const dispatch = useDispatch()

  //* Get Shipping Address if already in local storage
  const currentShippingAddress = JSON.parse(
    localStorage.getItem('shippingAddress')
  )

  const submitHandler = (e) => {
    e.preventDefault()
    if (
      nameRef === '' ||
      line1Ref === '' ||
      cityRef === '' ||
      stateRef === '' ||
      postalCodeRef === ''
    ) {
      setMessage('Please complete required fields')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } else {
      const newShippingAddress = {
        name: nameRef.current.value,
        line1: line1Ref.current.value,
        line2: line2Ref.current.value ? line2Ref.current.value : '',
        city: cityRef.current.value,
        state: stateRef.current.value,
        postalCode: postalCodeRef.current.value,
        phoneNumber: phoneNumberRef.current.value
          ? phoneNumberRef.current.value
          : '',
        instructions: instructionsRef.current.value
          ? instructionsRef.current.value
          : '',
      }

      dispatch(saveShippingAddress(newShippingAddress))
      history.push('/payment')
    }
  }

  return (
    <div style={{ marginTop: '75px' }}>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Row xs={2} className='py-2'>
          <Col xs={12}>
            <h1>Enter Shipping Address</h1>
            {message && <Message variant='danger'>{message}</Message>}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Full name *</Form.Label>
                <Form.Control
                  type='name'
                  ref={nameRef}
                  defaultValue={
                    currentShippingAddress && currentShippingAddress.name
                  }
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='line1'>
                <Form.Label>Address line 1 *</Form.Label>
                <Form.Control
                  type='line1'
                  placeholder='Street address, P.O. box, company name, c/o'
                  ref={line1Ref}
                  defaultValue={
                    currentShippingAddress && currentShippingAddress.line1
                  }
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='line2'>
                <Form.Label>Address line 2</Form.Label>
                <Form.Control
                  type='line2'
                  placeholder='Apartment, suite, unit, building, floor, etc.'
                  ref={line2Ref}
                  defaultValue={
                    currentShippingAddress && currentShippingAddress.line2
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='city'>
                <Form.Label>City *</Form.Label>
                <Form.Control
                  type='city'
                  ref={cityRef}
                  defaultValue={
                    currentShippingAddress && currentShippingAddress.city
                  }
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='state'>
                <Form.Label>State / Province / Region *</Form.Label>
                <Form.Control
                  type='state'
                  ref={stateRef}
                  required
                  defaultValue={
                    currentShippingAddress && currentShippingAddress.state
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='postal_code'>
                <Form.Label>Zip Code *</Form.Label>
                <Form.Control
                  type='postal_code'
                  ref={postalCodeRef}
                  required
                  defaultValue={
                    currentShippingAddress && currentShippingAddress.postalCode
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='phone_number'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='phone_number'
                  ref={phoneNumberRef}
                  defaultValue={
                    currentShippingAddress && currentShippingAddress.phoneNumber
                  }
                ></Form.Control>
              </Form.Group>
              <p className='muted'>May be used to assist delivery</p>

              <hr />

              <h4>Add delivery instructions (optional)</h4>
              <Form.Group controlId='additional_instructions'>
                <Form.Label>
                  Do we need additional instructions to find this address?
                </Form.Label>
                <Form.Control
                  type='additional_instructions'
                  ref={instructionsRef}
                  defaultValue={
                    currentShippingAddress &&
                    currentShippingAddress.instructions
                  }
                  placeholder='Provide details such as building description, a nearby landmark, or other navigation instructions'
                  as='textarea'
                  rows={3}
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary'>
                Add Address
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ShippingScreen
