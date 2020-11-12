import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
//* Bootstrap
import { Container, Table, Button, Row, Col } from 'react-bootstrap'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import {
  listAllProducts,
  createProduct,
} from '../../redux/actions/productActions'
import { PRODUCT_CREATE_RESET } from '../../redux/types/productTypes'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'

const ProductListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    // dispatch({ type: PRODUCT_CREATE_RESET })
    if (!userInfo.isAdmin) {
      history.push('/login')
    }
    dispatch(listAllProducts())
  }, [dispatch, history, userInfo])

  const createProductHandler = () => {
    dispatch(createProduct())
  }
  return (
    <Container style={{ marginTop: '50px' }}>
      <Row className='align-items-center'>
        <Col>
          <h1>Products - In Stock</h1>
        </Col>
        <Col className='text-right'>
          <Link to='/admin/product/create'>
            <Button className='my-3'>
              <i className='fas fa-plus'></i> Create Product
            </Button>
          </Link>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>BRAND</th>
                <th>DESCRIPTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(
                (product) =>
                  product.active === true && (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.brand}</td>
                      <td>{product.description}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/product/${product.productId}/edit`}
                        >
                          <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>

          <Col>
            <h1>Products - Out Of Stock</h1>
          </Col>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>BRAND</th>
                <th>DESCRIPTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(
                (product) =>
                  product.active === false && (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.brand}</td>
                      <td>{product.description}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/product/${product.productId}/edit`}
                        >
                          <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  )
}

export default ProductListScreen
