import React from 'react'
import { Link } from 'react-router-dom'

//* Components
import Rating from './Rating'
import Tooltips from '../utils/Tooltips'

//* Bootstrap
import { Card } from 'react-bootstrap'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product.productId}`}>
        <Card.Img src={product.images[0]} variant='top' />
      </Link>

      <Card.Body>
        <Card.Title as='div'>
          <Tooltips
            productId={product.productId}
            productName={product.name}
            productDesc={product.description}
            productPrice={product.price}
          />
        </Card.Title>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as='h3'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
