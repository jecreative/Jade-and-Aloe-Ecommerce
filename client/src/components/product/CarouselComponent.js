import React from 'react'

// Bootstrap
import { Carousel, Image, Card, Button } from 'react-bootstrap'

const CarouselComponent = ({ img01, img02, img03 }) => {
  return (
    <div
      className='carousel-container'
      style={{
        overflow: 'hidden',
        backgroundPosition: 'center',
      }}
    >
      <Carousel touch={true} controls={false} indicators={false}>
        <Carousel.Item>
          <Image
            className='d-block w-100'
            src={img01}
            fluid
            alt='First slide'
          />

          <Carousel.Caption
            className='d-none d-lg-block'
            style={{ marginBottom: '50px' }}
          >
            <Card
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                color: 'black',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '75%',
                margin: '0 auto',
                padding: '0 3rem',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
              }}
            >
              <h2>Decorative Cacti and Succulents</h2>
              <p style={{ fontSize: '1.2rem' }}>
                Make a statement in your garden with our beautiful succulents.
              </p>
              <Button
                id='shop-button'
                role='link'
                type='button'
                className='btn-md w-25'
              >
                Shop
              </Button>
            </Card>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            className='d-block w-100'
            src={img02}
            fluid
            alt='Second slide'
          />
          <Carousel.Caption
            className='d-none d-lg-block'
            style={{ marginBottom: '50px' }}
          >
            <Card
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                color: 'black',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '75%',
                margin: '0 auto',
                padding: '0 3rem',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
              }}
            >
              <h2>Workshops</h2>
              <p style={{ fontSize: '1.2rem' }}>
                Join us for one of our upcoming Virtual Workshops.
              </p>
              <Button
                id='shop-button'
                role='link'
                type='button'
                className='btn-md w-25'
              >
                Upcoming Events
              </Button>
            </Card>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            className='d-block w-100'
            src={img03}
            fluid
            alt='Third slide'
          />
          <Carousel.Caption
            className='d-none d-lg-block'
            style={{ marginBottom: '50px' }}
          >
            <Card
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                color: 'black',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '75%',
                margin: '0 auto',
                padding: '0 3rem',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
              }}
            >
              <h2>Decorative Cacti and Succulents</h2>
              <p style={{ fontSize: '1.2rem' }}>
                Make a statement in your garden with our beautiful handcrafted
                cacti and succulents
              </p>
            </Card>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  )
}

export default CarouselComponent
