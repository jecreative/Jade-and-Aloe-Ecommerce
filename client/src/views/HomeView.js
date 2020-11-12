import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import {
  listAllProducts,
  clearProductDetails,
} from '../redux/actions/productActions'
//* Bootstrap
import { Container, Row, Col } from 'react-bootstrap'
//* Data
import { carouselImages } from '../data/CarouselComponentData'
//* Components
import CarouselComponent from '../components/product/CarouselComponent'
import Product from '../components/product/Product'
import Message from '../components/utils/Message'
import Loader from '../components/utils/Loader'
import Tooltips from '../components/utils/Tooltips'
// import ProductCarousel from '../components/product/ProductCarousel'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(clearProductDetails())
    dispatch(listAllProducts())
  }, [dispatch])

  return (
    <>
      <CarouselComponent {...carouselImages} />
      <Container className='mt-5'>
        <h1>Featured Products</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            {/* 
          //* Map through products and display in UI
          */}
            <Row>
              {products.map(
                (product) =>
                  product.active && (
                    <Col key={product.productId} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product} />
                    </Col>
                  )
              )}
            </Row>
          </>
        )}
      </Container>
      <Tooltips />
    </>
  )
}

export default HomeScreen
