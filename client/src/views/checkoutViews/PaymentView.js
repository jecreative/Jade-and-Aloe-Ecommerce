import { useEffect } from 'react'
import { Link } from 'react-router-dom'

//* Redux
import { useDispatch, useSelector } from 'react-redux'

//* Bootstrap
import { Container, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'

//* Components
import Message from '../../components/utils/Message'
import CheckoutForm from '../../components/CheckoutForm'

const PaymentView = ({
  location,
  history,
  match,
  price,
  onSuccessfulCheckout,
}) => {
  const dispatch = useDispatch()
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const userRegister = useSelector((state) => state.userRegister)
  const { userInfo } = userRegister

  //* Shipping Address from localStorage
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))

  //* Get orderInfo
  const orderInfo = JSON.parse(localStorage.getItem('orderInfo'))
  const { shipping_price, tax_price, total_price } = orderInfo

  //* Get Cart Items from Redux Store and Construct Line Items for Stripe
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  const order_line_items = []
  if (cartItems) {
    cartItems.map(function (item) {
      const { name, images, price, qty } = item
      const single_line_item = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: name,
            images: images,
          },
          unit_amount: price * 100,
        },
        quantity: qty,
        description: `Free Shipping`,
      }

      order_line_items.push(single_line_item)
    })
  }
  //* Get logged in user details from localStorage
  const loggedInUserInfo = JSON.parse(localStorage.getItem('userInfo'))
  //* Create an order from CartItems
  const order = {
    stripeCustomerId: loggedInUserInfo && loggedInUserInfo.stripeCustomerId,
    line_items: order_line_items,
  }

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect, dispatch, productId, qty])

  /**
   // Todo: Set programatic value to change navbar/header on checkout page
   */

  /**
   * Product Data
   * a) Name
   * c) Images[0]
   * b) Quantity
   * c) Totla Price
   * d) Shipping Price -> Free Shipping
   * e) Tax Price -> 7.25%
   * f) Checkbox to change quantity
   *
   */
  /**
   * Form Fields
   * a) Name
   * b) Shipping Address
   * - line1, line2, city, state, postal_code, country
   * c) Checkbox -> Billing Address Same as Shipping Address
   * d) Stripe Elements Card Input
   */

  return (
    <Container style={{ marginTop: '75px' }}>
      <Row>
        <Col md={6}>
          {/* Stripe Checkout Component */}
          <CheckoutForm />
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
                    <strong>${shipping_price.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>
                    <strong>${tax_price.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    <strong>${total_price.toFixed(2)}</strong>
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
