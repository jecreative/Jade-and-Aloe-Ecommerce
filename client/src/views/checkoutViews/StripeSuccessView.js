import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
//* Bootstrap
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
} from 'react-bootstrap'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { getStripeSessionData } from '../../redux/actions/stripeActions'

//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'

const StripeSuccessScreen = () => {
  const dispatch = useDispatch()

  //* Get stripe session data from redux
  const stripeSessionData = useSelector((state) => state.stripeSessionData)
  const {
    payload: stripeSessionDataPayload,
    loading: stripeSessionDataLoading,
    error: stripeSessionDataError,
  } = stripeSessionData

  //* Set stripe session Id
  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('id')

  useEffect(() => {
    dispatch(getStripeSessionData(sessionId))
    //* Dispatch Update Order
  }, [dispatch, sessionId])

  if (stripeSessionDataPayload) {
    console.log(stripeSessionDataPayload)
  }

  /**
 *  amount_total: 799
    customer: "cus_ILeLSW3YTyyyCf"
    id: "cs_test_a0cxWOXymWeDxfthSjVc6sNFiO12hiGs2YWBlPDhEGW6w21pxk6bItmMri"
    payment_intent: "pi_1Hm8ywAs4fA7BMN8XLbPK6Ir"
    payment_method_types: ["card"]
    payment_status: "paid"
    line_items.data.quantity
    product: "prod_IMsk9XvzCgrF37"
    unit_amount: 799
 */

  //* Get cart items from localStorage
  const orderItems = JSON.parse(localStorage.getItem('cartItems'))
  console.log(orderItems)

  //! CLEAR CART ITEMS FROM LOCAL STOREAGE WHEN LEAVING THIS PAGE !//
  //! CLEAR CART ITEMS FROM LOCAL STOREAGE WHEN LEAVING THIS PAGE !//
  //! CLEAR CART ITEMS FROM LOCAL STOREAGE WHEN LEAVING THIS PAGE !//
  //! CLEAR CART ITEMS FROM LOCAL STOREAGE WHEN LEAVING THIS PAGE !//
  //! CLEAR CART ITEMS FROM LOCAL STOREAGE WHEN LEAVING THIS PAGE !//
  //! CLEAR CART ITEMS FROM LOCAL STOREAGE WHEN LEAVING THIS PAGE !//

  return (
    <Container style={{ marginTop: '50px' }}>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <h3>Payment Confirmation</h3>
            <ListGroup.Item>
              <h2>Shipping Address</h2>
              {stripeSessionDataLoading ? (
                <Loader />
              ) : stripeSessionDataPayload ? (
                <p>
                  <strong>{stripeSessionDataPayload.shipping.name}</strong>
                  <br />
                  <strong>
                    {stripeSessionDataPayload.shipping.address.line1}
                  </strong>
                  {', '}
                  {stripeSessionDataPayload.shipping.address.line2 && (
                    <strong>
                      {stripeSessionDataPayload.shipping.address.line2}
                      {', '}
                    </strong>
                  )}
                  <strong>
                    {stripeSessionDataPayload.shipping.address.city}
                  </strong>
                  <br />
                  <strong>
                    {stripeSessionDataPayload.shipping.address.state}
                  </strong>
                  {', '}
                  <strong>
                    {stripeSessionDataPayload.shipping.address.postal_code}
                  </strong>
                  <br />
                </p>
              ) : (
                <p>No Shipping Information Available</p>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Status</h2>
              <strong>
                Method:{' '}
                {stripeSessionDataPayload &&
                  stripeSessionDataPayload.payment_method_types[0]
                    .charAt(0)
                    .toUpperCase() +
                    stripeSessionDataPayload.payment_method_types[0].slice(1)}
              </strong>
              <br />
              <strong>
                Status:{' '}
                {stripeSessionDataPayload &&
                  stripeSessionDataPayload.payment_status
                    .charAt(0)
                    .toUpperCase() +
                    stripeSessionDataPayload.payment_status.slice(1)}
              </strong>
              <br />
              <strong>
                Confirmation ID:{' '}
                {stripeSessionDataPayload &&
                  stripeSessionDataPayload.id.split('_').pop()}
              </strong>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup variant='flush'>
                {orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fluid
                          rounded
                          width='100px'
                          height='100px'
                        />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    <strong>Free Shipping</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {/* <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Tax Price</Col>
                </Row>
              </ListGroup.Item> */}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    {stripeSessionDataPayload &&
                      stripeSessionDataPayload.amount_total.toFixed(0)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {stripeSessionDataError && (
                  <Message variant='danger'>{stripeSessionDataError}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  // disabled={cart.cartItems === 0}
                  // onClick={placeOrderHandler}
                >
                  Go to Customer Portal
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default StripeSuccessScreen
