import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../../redux/actions/cartActions'
import {
  setOrder,
  createOrder,
  updateOrder,
  getOrderDetails,
} from '../../redux/actions/orderActions'
//* Bootstrap
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
//* Components
import StripeCheckout from '../../components/StripeCheckout'
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  const dispatch = useDispatch()

  const stripePay = useSelector((state) => state.stripePay)
  const { loading: stripePayLoading } = stripePay

  //* Get user data
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  //* Get cart data
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    //* Handles increasing the quantitiy of items in the cart
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId))
    history.push('/cart')
  }

  //* Calculate the items, tax, shipping, & total prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : (5).toFixed(2))
  const taxPrice = addDecimals(Number((0.0725 * itemsPrice).toFixed(2)))
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2)

  //* Create order object
  const newOrder = {
    customerId: userInfo ? userInfo.stripeCustomerId : '',
    items_price: Number(itemsPrice),
    tax_price: Number(taxPrice),
    shipping_price: Number(shippingPrice),
    total_price: Number(totalPrice),
    orderItems: cartItems,
  }

  const handleCreateOrder = (e) => {
    e.preventDefault()
    if (!userInfo) {
      history.push('/login?redirect=cart')
    } else {
      dispatch(setOrder(newOrder))
      history.push('/shipping')
    }
  }

  return stripePayLoading ? (
    <Loader />
  ) : (
    <Container style={{ marginTop: '75px' }}>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.name}>
                  <Row>
                    <Col md={2}>
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
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        style={{ width: '100px' }}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.productId, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeFromCartHandler(item.productId)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
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

              <Button
                variant='primary'
                disabled={cartItems.length === 0}
                onClick={handleCreateOrder}
              >
                Proceed To Checkout
              </Button>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CartScreen
