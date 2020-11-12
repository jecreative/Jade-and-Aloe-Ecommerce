import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
//* Bootstrap
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/actions/userActions'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'
import FormContainer from '../../components/layout/FormContainer'

const Login = ({ location, history }) => {
  const [errorMsg, setErrorMsg] = useState()
  const emailRef = useRef()
  const passwordRef = useRef()
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }

    if (error) {
      setErrorMsg('Invalid credentials, please try again.')
      setTimeout(() => {
        setErrorMsg('')
      }, 4000)
    }
  }, [history, userInfo, error, redirect])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(emailRef.current.value, passwordRef.current.value))
  }

  return (
    <Container style={{ marginTop: '50px' }}>
      <FormContainer>
        <h1>Sign In</h1>
        {errorMsg && <Message variant='danger'>{errorMsg}</Message>}
        {loading && <Loader />}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              autoComplete='username'
              ref={emailRef}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              autoComplete='current-password'
              ref={passwordRef}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' disabled={loading} variant='primary'>
            Sign In
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            New Customer?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Register
            </Link>
            <br />
            <Link to='/forgot-password'>Forgot Password?</Link>
          </Col>
        </Row>
      </FormContainer>
    </Container>
  )
}

export default Login
