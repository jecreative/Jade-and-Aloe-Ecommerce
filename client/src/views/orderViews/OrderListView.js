import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
//* Bootstrap
import { Container, Table, Button } from 'react-bootstrap'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { listOrders } from '../../redux/actions/orderActions'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo.isAdmin) {
      history.push('/login')
    } else {
      dispatch(listOrders())
    }
  }, [dispatch, history, userInfo])

  console.log(orders)

  return (
    <Container style={{ marginTop: '50px' }}>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.billingAddress.name}</td>
                <td>{orders && order.createdAt.substring(0, 10)}</td>
                <td>${order.total_price / 100}</td>
                <td>
                  {order.isPaid === true ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered === true ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order.orderId}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default OrderListScreen
