import React, { useRef } from 'react'
//* Bootstrap
import { Form, Button, Col } from 'react-bootstrap'
//* Stripe Elements
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
//* Emotion Styling
import styled from '@emotion/styled'
//* Redux
import { useDispatch } from 'react-redux'
import { stripeCharge } from '../../redux/actions/stripeActions'
// import Message from '../utils/Message'

const CheckoutForm = ({ order }) => {
  const dispatch = useDispatch()
  const nameRef = useRef()
  const emailRef = useRef()
  const addressRef = useRef()
  const cityRef = useRef()
  const stateRef = useRef()
  const postalCodeRef = useRef()
  const phoneRef = useRef()
  const loading = false
  // const [message, setMessage] = useState(null)

  //* Set default billing address values
  //* with shippping address from local storage
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))

  //* Get prices from local storage
  const orderInfo = JSON.parse(localStorage.getItem('orderInfo'))
  const { total_price } = orderInfo

  //* Stripe Elements
  const stripe = useStripe()
  const elements = useElements()

  const CardElementContainer = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f7f7f9;

    & .StripeElement {
      width: 100%;
      padding: 15px;
    }
  `

  const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#fff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#fce883' },
        '::placeholder': { color: '#87bbfd' },
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee',
      },
    },
  }
  const cardElementOpts = {
    iconStyle: 'solid',
    style: CARD_OPTIONS,
    hidePostalCode: true,
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        address: {
          line1: addressRef.current.value,
          city: cityRef.current.value,
          state: stateRef.current.value,
          postal_code: postalCodeRef.current.value,
        },
      },
    })

    if (!error) {
      const { id } = paymentMethod
      if (orderInfo) {
        dispatch(stripeCharge(id, Math.trunc(total_price * 100)))
      }
    }
  }

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <h3>Checkout</h3>
        <Form.Row>
          <Form.Group as={Col} md='12' controlId='name'>
            <Form.Label>Full name</Form.Label>
            <Form.Control
              required
              type='text'
              ref={nameRef}
              defaultValue={shippingAddress.name && shippingAddress.name}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md='6' controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type='email'
              placeholder='janedoe@example.com'
              ref={emailRef}
            />
          </Form.Group>
          <Form.Group as={Col} md='6' controlId='phone'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              placeholder='(941) 555-0123'
              ref={phoneRef}
              defaultValue={
                shippingAddress.phoneNumber && shippingAddress.phoneNumber
              }
              required
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md='12' controlId='address'>
            <Form.Label>Billing Address</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter billing address'
              ref={addressRef}
              defaultValue={
                shippingAddress.line1 &&
                shippingAddress.line2 &&
                shippingAddress.line1 + ', ' + shippingAddress.line2
              }
              required
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md='4' controlId='city'>
            <Form.Label>City</Form.Label>
            <Form.Control
              type='text'
              placeholder='City'
              ref={cityRef}
              defaultValue={shippingAddress.city && shippingAddress.city}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md='4' controlId='state'>
            <Form.Label>State</Form.Label>
            <Form.Control
              type='text'
              placeholder='State'
              ref={stateRef}
              defaultValue={shippingAddress.state && shippingAddress.state}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md='4' controlId='postal_code'>
            <Form.Label>Zip</Form.Label>
            <Form.Control
              type='text'
              placeholder='Zip'
              ref={postalCodeRef}
              defaultValue={
                shippingAddress.postalCode && shippingAddress.postalCode
              }
              required
            />
          </Form.Group>
        </Form.Row>

        <Form.Label>Card</Form.Label>
        <fieldset className='FormGroup'>
          <div className='FormRow'>
            <CardElementContainer>
              <CardElement options={cardElementOpts} />
            </CardElementContainer>
          </div>
        </fieldset>
        <br />
        <p style={{ color: 'red', fontWeight: '600' }}>
          This is a demo payment form. If you would like to submit the form
          please use the test card informtaion below.
        </p>

        <p>
          Card Number:{' '}
          <span style={{ color: '#5EBED7', fontWeight: '600' }}>
            4242 4242 4242 4242
          </span>{' '}
          | MM/YY:{' '}
          <span style={{ color: '#5EBED7', fontWeight: '600' }}>01/12</span> |
          CVC: <span style={{ color: '#5EBED7', fontWeight: '600' }}>123</span>
        </p>

        <Button
          className='my-4'
          type='submit'
          variant='primary'
          disabled={loading}
        >
          Submit Payment
        </Button>
      </Form>
    </>
  )
}

export default CheckoutForm
