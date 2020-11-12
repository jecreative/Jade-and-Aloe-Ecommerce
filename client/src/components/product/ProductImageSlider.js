import React, { useState } from 'react'

//* Bootstrap
import { Container, Row, Image } from 'react-bootstrap'

const ProductImageSlider = ({ images, alt }) => {
  const [activeImage, setActiveImage] = useState()

  const handleImageChange = (e) => {
    setActiveImage(e.target.src)
  }

  return (
    <Container>
      <Row
        style={{
          maxHeight: '400px',
          overflow: 'hidden',
        }}
      >
        <Image
          src={activeImage ? activeImage : images && images[0]}
          alt={alt}
          fluid
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Row>
      <Row style={{ display: 'flex', marginTop: '1rem' }}>
        {images ? (
          images.map((displayImage, index) => (
            <Image
              src={displayImage}
              alt={alt}
              key={index}
              onClick={handleImageChange}
              fluid
              thumbnail
              style={{
                width: '70px',
                height: '70px',
                marginRight: '1rem',
                cursor: 'pointer',
              }}
            />
          ))
        ) : (
          <p>No product images at the moment</p>
        )}
      </Row>
    </Container>
  )
}

export default ProductImageSlider
