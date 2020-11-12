import { useRef } from 'react'

//* Stripe Elements
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
//* Emotion Styling
import styled from '@emotion/styled'

//* Bootstrap
import { Form, Button, Col } from 'react-bootstrap'

const CheckoutForm = () => {
  const nameRef = useRef()
  const emailRef = useRef()
  const addressRef = useRef()
  const cityRef = useRef()
  const stateRef = useRef()
  const postalCodeRef = useRef()
  const phoneRef = useRef()
  const loading = false
  // const [validated, setValidated] = useState(false)

  //* Set default billing address values
  //* with shippping address from local storage
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))

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
      console.log(paymentMethod)
    }
  }

  return (
    <>
      <Form noValidate onSubmit={handleFormSubmit}>
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
              type='text'
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
              placeholder='123 Main St'
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

        <Button
          className='mt-3'
          type='submit'
          variant='primary'
          disabled={loading}
          onClick={handleFormSubmit}
        >
          Submit Payment
        </Button>
      </Form>
    </>
  )
}

export default CheckoutForm
