import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

// Bootstrap
import { Popover, Overlay } from 'react-bootstrap'

const Tooltips = ({ productId, productName, productDesc, productPrice }) => {
  const [show, setShow] = useState(false)

  const [target, setTarget] = useState(null)
  const ref = useRef(null)

  const handleEnter = (event) => {
    setShow(!show)
    setTarget(event.target)
  }

  const handleLeave = (event) => {
    setShow(!show)
    setTarget(event.target)
  }

  return (
    <div ref={ref}>
      <Link
        to={`/product/${productId}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {productName}
      </Link>

      <Overlay
        show={show}
        target={target}
        placement='right'
        container={ref.current}
        containerPadding={20}
      >
        <Popover
          id='popover-contained'
          style={{ width: window.innerWidth < 1024 ? '150px' : '250px' }}
        >
          <Popover.Title as='h3'>{productName}</Popover.Title>
          <Popover.Content>
            <p>{productDesc}</p>
            <p>${productPrice}</p>
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  )
}

export default Tooltips
