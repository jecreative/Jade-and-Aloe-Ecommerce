import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
//* Bootstrap
import { Container, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'
import CheckoutForm from '../../components/stripe/CheckoutForm'
import StripeProccessing from '../../components/stripe/StripeProccessing'

const PaymentView = ({ location, history, match }) => {
  const dispatch = useDispatch()
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  //* Get logged in user
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  //* Shipping Address from localStorage
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))

  //* Get Order Info
  const orderInfo = JSON.parse(localStorage.getItem('orderInfo'))
  const { total_price, shipping_price, tax_price } = orderInfo

  //* Get Cart Items from Redux Store and Construct Line Items for Stripe
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  //* Get stripe data from redux
  const stripeCharge = useSelector((state) => state.stripeCharge)
  const { loading, success } = stripeCharge

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (!userInfo) {
      history.push(redirect)
    }
    if (success) {
      history.push('/profile')
    }
  }, [history, userInfo, redirect, dispatch, productId, qty, success])

  return loading ? (
    <Container style={{ marginTop: '75px' }}>
      <Loader />
    </Container>
  ) : success ? (
    <Container style={{ marginTop: '75px' }}>
      <Row>
        <Col md={6}>
          <StripeProccessing />
        </Col>
        <Col md={6}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) items
                </h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    <strong>${orderInfo && shipping_price.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>
                    <strong>${orderInfo && tax_price.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    <strong>${orderInfo && total_price.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <hr />
          <h3>Shipping Details</h3>
          <Row>
            <Col md={8}>
              Name: {shippingAddress.name}
              <hr />
              Address: {shippingAddress.line1}
              {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ''}
              <br />
              {shippingAddress.city}
              {', '}
              {shippingAddress.state}
              {', '}
              {shippingAddress.postalCode}
              {shippingAddress.phoneNumber ? (
                <>
                  <hr />
                  Phone Number: {shippingAddress.phoneNumber}
                </>
              ) : (
                ''
              )}
              {shippingAddress.instructions ? (
                <>
                  <hr />
                  Additional Instruction: {shippingAddress.instructions}
                </>
              ) : (
                ''
              )}
            </Col>
            <Col md={4}>
              <Link to='/shipping' style={{ color: '#5EBED7' }}>
                Change
              </Link>
            </Col>
          </Row>
          <hr />

          <h3>Review items</h3>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.name}>
                  <Row>
                    <Col md={3}>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fluid
                        rounded
                        width='300px'
                      />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      ${item.price} | Qty {item.qty}
                    </Col>
                    <Col md={2}>
                      <Link to='/cart' style={{ color: '#5EBED7' }}>
                        Edit
                      </Link>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  ) : (
    <Container style={{ marginTop: '75px' }}>
      <Row>
        <Col md={6}>
          {/* Stripe Checkout Component */}
          <StripeProccessing />
          <CheckoutForm order={orderInfo && orderInfo} />
        </Col>
        <Col md={6}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) items
                </h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    <strong>
                      ${orderInfo && orderInfo.shipping_price.toFixed(2)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>
                    <strong>
                      ${orderInfo && orderInfo.tax_price.toFixed(2)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    <strong>
                      ${orderInfo && orderInfo.total_price.toFixed(2)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <hr />
          <h3>Shipping Details</h3>
          <Row>
            <Col md={8}>
              Name: {shippingAddress.name}
              <hr />
              Address: {shippingAddress.line1}
              {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ''}
              <br />
              {shippingAddress.city}
              {', '}
              {shippingAddress.state}
              {', '}
              {shippingAddress.postalCode}
              {shippingAddress.phoneNumber ? (
                <>
                  <hr />
                  Phone Number: {shippingAddress.phoneNumber}
                </>
              ) : (
                ''
              )}
              {shippingAddress.instructions ? (
                <>
                  <hr />
                  Additional Instruction: {shippingAddress.instructions}
                </>
              ) : (
                ''
              )}
            </Col>
            <Col md={4}>
              <Link to='/shipping' style={{ color: '#5EBED7' }}>
                Change
              </Link>
            </Col>
          </Row>
          <hr />

          <h3>Review items</h3>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.name}>
                  <Row>
                    <Col md={3}>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fluid
                        rounded
                        width='300px'
                      />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      ${item.price} | Qty {item.qty}
                    </Col>
                    <Col md={2}>
                      <Link to='/cart' style={{ color: '#5EBED7' }}>
                        Edit
                      </Link>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default PaymentView
