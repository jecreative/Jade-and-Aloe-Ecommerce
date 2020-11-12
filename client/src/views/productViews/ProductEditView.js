import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
// Bootstrap
import { Container, Form, Button } from 'react-bootstrap'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import {
  updateProduct,
  listProductDetails,
  clearProductDetails,
} from '../../redux/actions/productActions'
import { uploadProductImages } from '../../redux/actions/uploadActions'
// import { PRODUCT_UPDATE_RESET } from '../redux/types/productTypes'
// Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'
import FormContainer from '../../components/layout/FormContainer'

const ProductEditView = ({ location, history, match }) => {
  //* Data from redux store (useSelector)
  const uploadProductImage = useSelector((state) => state.uploadProductImage)
  const {
    loading: uploadImageLoading,
    error: uploadImageError,
    success: uploadImageSuccess,
    payload: uploadImagePayload,
  } = uploadProductImage

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: productUpdateLoading,
    error: productUpdateError,
    success: productUpdateSuccess,
  } = productUpdate

  const productDetails = useSelector((state) => state.productDetails)
  const {
    product,
    loading: productDetailsLoading,
    error: productDetailsError,
  } = productDetails
  const {
    name,
    description,
    price,
    countInStock,
    numReviews,
    rating,
    active,
    brand,
    images,
  } = product

  //* useRef's and useState's
  const nameRef = useRef()
  const priceRef = useRef()
  const descriptionRef = useRef()
  const countInStockRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState('Choose File')
  const dispatch = useDispatch()
  const [activeStatus, setActiveStatus] = useState(active)

  //* Redirect for after success
  const redirect = location.search
    ? location.search.split('=')[1]
    : '/admin/productlist'

  //* useEffect to list product details and redirect on success
  useEffect(() => {
    dispatch(listProductDetails(match.params.id))

    if (productUpdateSuccess) {
      history.push(redirect)
    }
  }, [history, productUpdateSuccess, redirect, dispatch, match.params.id])

  //* Handle back button to reset data
  const handleBackButton = () => {
    dispatch(clearProductDetails())
  }
  //* Handle change for setting the active status of a product with it's check box
  const handleChange = (e) => {
    setActiveStatus(e.target.checked)
  }

  //* Function to handle the uploading of files
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

  //* Submit handler to submit the updated data
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        productId: match.params.id,
        name: nameRef.current.value,
        price: priceRef.current.value,
        images: images,
        brand: brand,
        description: descriptionRef.current.value,
        countInStock: Number(countInStockRef.current.value),
        numReviews: numReviews,
        rating: rating,
        active: activeStatus,
      })
    )
  }

  return (
    <Container style={{ marginTop: '50px' }}>
      <Link
        to='/admin/productlist'
        className='btn btn-light my-3'
        onClick={handleBackButton}
      >
        Go Back
      </Link>
      <FormContainer>
        <h1>Update Product</h1>
        {/* {productDetailsLoading && <Loader />} */}
        {/* {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>} */}
        {productDetailsLoading ? (
          <Loader />
        ) : productDetailsError ? (
          <Message variant='danger'>{productUpdateError}</Message>
        ) : productUpdateLoading ? (
          <Loader />
        ) : (
          <>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  defaultValue={name}
                  ref={nameRef}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='description'
                  defaultValue={description}
                  ref={descriptionRef}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  defaultValue={price && (price * 100).toFixed()}
                  ref={priceRef}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='countInStock'>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type='number'
                  defaultValue={countInStock}
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

              <Form.Group controlId='formBasicCheckbox'>
                <Form.Check
                  defaultChecked={activeStatus}
                  type='checkbox'
                  label='In Stock'
                  onChange={handleChange}
                />
              </Form.Group>

              <Button
                type='submit'
                variant='primary'
                disabled={uploadImageLoading}
              >
                Update
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </Container>
  )
}

export default ProductEditView
