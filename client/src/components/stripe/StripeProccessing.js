import { useEffect } from 'react'
import { Link } from 'react-router-dom'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../../redux/actions/orderActions'
import { cartReset } from '../../redux/actions/cartActions'
//* Bootstrap
import { Button } from 'react-bootstrap'
//* Components
import Message from '../utils/Message'
import Loader from '../utils/Loader'

const StripeProccessing = ({ history }) => {
  const dispatch = useDispatch()

  //* Get stripe data from redux
  const stripeCharge = useSelector((state) => state.stripeCharge)
  const { loading, error, success, payload } = stripeCharge

  //* Get order info from redux
  const orderSet = useSelector((state) => state.orderSet)

  const { loading: orderSetLoading } = orderSet

  //* Get shipping address from localStorage
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))

  useEffect(() => {
    if (success && orderSet) {
      const { customerId, items_price, tax_price, shipping_price, orderItems } =
        orderSet.order || orderSet.orderInfo
      const order = {
        paymentId: success && payload ? payload.paymentId : null,
        customerId: customerId,
        items_price: items_price,
        tax_price: tax_price,
        shipping_price: shipping_price,
        orderItems: orderItems,
        amount_received: success && payload ? payload.amount_received : null,
        billing_details:
          success && payload ? payload.charges.data[0].billing_details : null,
        shippingAddress: shippingAddress,
        currency: success && payload ? payload.charges.data[0].currency : null,
        description:
          success && payload ? payload.charges.data[0].description : null,
        paid: success && payload ? payload.charges.data[0].paid : null,
        payment_method:
          success && payload
            ? payload.charges.data[0].payment_method_details.card
            : null,
        receipt_url:
          success && payload ? payload.charges.data[0].receipt_url : null,
      }
      dispatch(createOrder(order))
      dispatch(cartReset())
    }
  })

  return loading && orderSetLoading ? (
    <Loader />
  ) : error ? (
    <div>{error && <Message variant='danger'>{error}</Message>}</div>
  ) : success ? (
    <div>
      {success && (
        <>
          <Message variant='success'>Payment proccessed successfully!</Message>
          <Link to='/profile'>
            <Button variant='primary'>Go to Customer Portal</Button>
          </Link>
        </>
      )}
    </div>
  ) : (
    ''
  )
}

export default StripeProccessing
