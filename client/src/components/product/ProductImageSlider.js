import React, { useState } from 'react'
//* Bootstrap
import { Container, Row, Image } from 'react-bootstrap'
//* Emotion Styling
import styled from '@emotion/styled'

const ProductImageSlider = ({ images, alt }) => {
  const [activeImage, setActiveImage] = useState()

  const handleImageChange = (e) => {
    setActiveImage(e.target.src)
  }

  return (
    <Container>
      <ImageContainer
        style={{
          maxHeight: '400px',
          overflow: 'hidden',
        }}
      >
        <StyledImage
          src={activeImage ? activeImage : images && images[0]}
          alt={alt}
          fluid
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            maxHeight: '400px',
          }}
        />
      </ImageContainer>
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

const ImageContainer = styled(Row)`
  @media (max-width: 768px) {
    height: 250px;
  }
`

const StyledImage = styled(Image)`
  @media (max-width: 768px) {
    height: 250px;
  }
`

export default ProductImageSlider
