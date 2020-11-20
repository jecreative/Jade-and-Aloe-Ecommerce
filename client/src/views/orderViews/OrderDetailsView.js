import React, { useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails } from '../../redux/actions/orderActions'
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
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'

const PaymentView = ({ location, history, match }) => {
  const dispatch = useDispatch()

  //* Get logged in user from
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  //* Get OrderId from location
  const orderId = location.pathname.split('/')[2]

  //* Get order details
  const orderDetails = useSelector((state) => state.orderDetails)
  const { loading: orderDetailsLoading, order: orderDetailsData } = orderDetails

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    dispatch(getOrderDetails(orderId))
  }, [dispatch, orderId, history, userInfo])

  return orderDetailsLoading ? (
    <Loader />
  ) : orderDetailsData && !orderDetailsLoading ? (
    <Container style={{ marginTop: '75px' }}>
      <Row>
        <Col md={6}>
          {/* <Link to='/profile'> */}
          <Link
            to={userInfo && userInfo.isAdmin ? '/admin/orderlist' : '/profile'}
          >
            <Button variant='primary' className='mb-3'>
              Back to Dashboard
            </Button>
          </Link>
          <hr />
          <ListGroup variant='flush'>
            <h3>Items Ordered</h3>
            {orderDetailsData.order_items.map((item) => (
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
                  <Col md={5}>
                    <p>{item.name}</p>
                  </Col>
                  <Col md={4}>
                    ${item.price} | Qty {item.qty}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={6}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Charge Details</h2>
                <Row>
                  <Col md={6}>
                    Total Price: $
                    {orderDetailsData &&
                      (orderDetailsData.total_price / 100).toFixed(2)}{' '}
                    <br />
                    Card:{' '}
                    {orderDetailsData &&
                      orderDetailsData.payment_method.brand.toUpperCase()}{' '}
                    {orderDetailsData && orderDetailsData.payment_method.last4}{' '}
                  </Col>
                  <Col md={6}>
                    <a
                      href={orderDetailsData && orderDetailsData.receipt_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ color: '#5EBED7' }}
                    >
                      Click to View Receipt
                    </a>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <hr />
          <h3>Shipping Details</h3>
          <Row>
            <Col md={8}>
              Name: {orderDetailsData.shippingAddress.name}
              <hr />
              Address: {orderDetailsData.shippingAddress.line1}
              {orderDetailsData.shippingAddress.line2
                ? `, ${orderDetailsData.shippingAddress.line2}`
                : ''}
              <br />
              {orderDetailsData.shippingAddress.city}
              {', '}
              {orderDetailsData.shippingAddress.state}
              {', '}
              {orderDetailsData.shippingAddress.postalCode}
              {orderDetailsData.shippingAddress.phoneNumber ? (
                <>
                  <hr />
                  Phone Number: {orderDetailsData.shippingAddress.phoneNumber}
                </>
              ) : (
                ''
              )}
              {orderDetailsData.shippingAddress.instructions ? (
                <>
                  <hr />
                  Additional Instruction:{' '}
                  {orderDetailsData.shippingAddress.instructions}
                </>
              ) : (
                ''
              )}
            </Col>
          </Row>
          <hr />
        </Col>
      </Row>
    </Container>
  ) : (
    <Message variant='danger'>Order not found</Message>
  )
}

export default PaymentView
