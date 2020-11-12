import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
//* Bootstrap
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../../redux/actions/userActions'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'
import FormContainer from '../../components/layout/FormContainer'
// import { useAuth } from '../contexts/AuthContext'

const ForgotPassword = ({ location }) => {
  const emailRef = useRef()
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const userForgotPassword = useSelector((state) => state.userForgotPassword)
  const {
    loading: forgotPasswordLoading,
    error: forgotPasswordError,
    payload: forgotPasswordPayload,
    success: forgotPasswordSuccess,
  } = userForgotPassword

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (forgotPasswordPayload && forgotPasswordSuccess === true) {
      setMessage(forgotPasswordPayload.general)
      setTimeout(() => {
        setMessage(null)
      }, 6000)
    }
    if (forgotPasswordError) {
      setError(forgotPasswordError)
      setTimeout(() => {
        setError('')
      }, 6000)
    }
  }, [
    forgotPasswordPayload,
    forgotPasswordSuccess,
    forgotPasswordError,
    setMessage,
    setError,
  ])

  const submitHandler = async (e) => {
    e.preventDefault()
    dispatch(forgotPassword(emailRef.current.value))
  }
  return (
    <Container style={{ marginTop: '50px' }}>
      <FormContainer>
        <h1>Reset Password</h1>

        {message && <Message variant='success'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {forgotPasswordLoading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              autoComplete='username'
              ref={emailRef}
              required
            ></Form.Control>
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
            disabled={forgotPasswordLoading}
          >
            Reset Password
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            Have an Account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Login
            </Link>
            <br />
            Need an Account?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Sign Up
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </Container>
  )
}

export default ForgotPassword
