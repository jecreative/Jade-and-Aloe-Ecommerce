import React, { useState } from 'react'
//* Redux
import { useDispatch } from 'react-redux'
import { stripeCheckout } from '../redux/actions/stripeActions'
import { createOrder } from '../redux/actions/orderActions'
//* Bootstrap
import { Button, ListGroup } from 'react-bootstrap'

const StripeCheckout = ({ order, history }) => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')

  // const makePayment = async () => {
  //   if (!order.stripeCustomerId) {
  //     history.push('/login')
  //   } else {
  //     dispatch(stripeCheckout(order))
  //   }
  // }
  const makePayment = async () => {
    if (!order.stripeCustomerId) {
      history.push('/login')
    } else {
      dispatch(createOrder(order))
      // dispatch(stripeCheckout(order))
    }
  }

  return (
    <>
      {message && <p>{message}</p>}
      <ListGroup.Item>
        <Button
          id='checkout-button'
          role='link'
          type='button'
          className='btn-block'
          onClick={makePayment}
        >
          Proceed to Checkout
        </Button>
      </ListGroup.Item>
    </>
  )
}

export default StripeCheckout
