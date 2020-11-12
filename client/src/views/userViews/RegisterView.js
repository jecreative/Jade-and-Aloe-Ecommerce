import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
//* Bootstrap
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../redux/actions/userActions'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'
import FormContainer from '../../components/layout/FormContainer'

const RegisterScreen = ({ location, history }) => {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const [message, setMessage] = useState(null)
  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setMessage('Passwords do not match')
    } else {
      dispatch(
        register(
          nameRef.current.value,
          emailRef.current.value,
          passwordRef.current.value,
          confirmPasswordRef.current.value
        )
      )
    }
  }
  return (
    <Container style={{ marginTop: '50px' }}>
      <FormContainer>
        <h1>Sign Up</h1>

        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              ref={nameRef}
              required
            ></Form.Control>
          </Form.Group>
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
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              autoComplete='new-password'
              ref={passwordRef}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirmpassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              autoComplete='new-password'
              ref={confirmPasswordRef}
              required
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' disabled={loading}>
            Register
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            Have an Account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Login
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </Container>
  )
}

export default RegisterScreen
