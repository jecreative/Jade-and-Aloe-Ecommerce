import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
// Bootstrap
import { Container, Form, Button } from 'react-bootstrap'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../../redux/actions/productActions'
import { uploadProductImages } from '../../redux/actions/uploadActions'
// import { PRODUCT_UPDATE_RESET } from '../redux/types/productTypes'
// Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'
import FormContainer from '../../components/layout/FormContainer'

const ProductCreateView = ({ location, history }) => {
  const nameRef = useRef()
  const priceRef = useRef()
  const descriptionRef = useRef()
  const countInStockRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState('Choose File')

  const dispatch = useDispatch()
  console.log(uploading)
  const uploadProductImage = useSelector((state) => state.uploadProductImage)
  const {
    loading: uploadImageLoading,
    payload: uploadImagePayload,
  } = uploadProductImage

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: productCreateLoading,
    error: productCreateError,
    success: productCreateSuccess,
  } = productCreate

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (productCreateSuccess) {
      history.push(redirect)
    }
  }, [history, productCreateSuccess, redirect])

  const uploadFileHandler = async (e) => {
    e.preventDefault()
    const fileList = e.target.files

    //* Label for input
    setFileName(
      fileList.length === 1 ? fileList[0].name : fileList.length + ' images'
    )

    //* Init formData instance
    const formData = new FormData()

    //* Convert fileList into Array
    Array.from(fileList).forEach((file) => {
      formData.append('image', file)
    })

    setUploading(true)
    dispatch(uploadProductImages(formData))
    setUploading(false)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProduct({
        name: nameRef.current.value,
        unit_amount: priceRef.current.value,
        images: uploadImagePayload.message.split(','),
        brand: 'Jade & Aloe',
        description: descriptionRef.current.value,
        countInStock: Number(countInStockRef.current.value),
        numReviews: 0,
        rating: 0,
      })
    )
  }

  return (
    <Container style={{ marginTop: '50px' }}>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {/* {loadingUpdate && <Loader />} */}
        {/* {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>} */}
        {productCreateLoading ? (
          <Loader />
        ) : productCreateError ? (
          <Message variant='danger'>{productCreateError}</Message>
        ) : (
          <>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter name'
                  ref={nameRef}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='description'
                  placeholder='Enter description'
                  ref={descriptionRef}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter price'
                  ref={priceRef}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='countInStock'>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter Count In Stock'
                  ref={countInStockRef}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='image'>
                <Form.Label>Image</Form.Label>
                <Form.File
                  id='image-file'
                  label={fileName}
                  custom
                  multiple
                  onChange={uploadFileHandler}
                ></Form.File>
                {uploadImageLoading && <Loader />}
              </Form.Group>

              <Button
                type='submit'
                variant='primary'
                disabled={uploadImageLoading}
              >
                Create
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </Container>
  )
}

export default ProductCreateView
