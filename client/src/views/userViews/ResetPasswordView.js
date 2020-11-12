import React, { useRef } from 'react'
//* Bootstrap
import { Container, Form, Button } from 'react-bootstrap'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../../redux/actions/userActions'
//* Components
import Message from '../../components/utils/Message'
import Loader from '../../components/utils/Loader'
import FormContainer from '../../components/layout/FormContainer'
// import { useAuth } from '../contexts/AuthContext'

const ForgotPassword = ({ location }) => {
  const passwordRef = useRef()
  const dispatch = useDispatch()

  const userResetPassword = useSelector((state) => state.userResetPassword)
  const {
    loading: resetPasswordLoading,
    error: resetPasswordError,
    payload: resetPasswordPayload,
    success: resetPasswordSuccess,
  } = userResetPassword

  //* Function to get paramaters for firebase password reset
  const getParameterByName = (queryName) => {
    let params = new URL(document.location).searchParams
    let queryResult
    switch (queryName) {
      case 'mode':
        queryResult = params.get('mode')
        return queryResult
      case 'oobCode':
        queryResult = params.get('oobCode')
        return queryResult
      case 'lang':
        queryResult = params.get('lang')
        return queryResult
      default:
        return 'Error'
    }
  }
  // //* Get the query params for reset password
  const mode = getParameterByName('mode')
  const actionCode = getParameterByName('oobCode')
  // const apiKey = getParameterByName('apiKey')
  const lang = getParameterByName('lang') || 'en'

  const submitHandler = async (e) => {
    e.preventDefault()
    dispatch(resetPassword(passwordRef.current.value, mode, actionCode, lang))
  }
  return resetPasswordLoading ? (
    <Loader />
  ) : (
    <Container style={{ marginTop: '50px' }}>
      <FormContainer>
        <h1>Reset Password</h1>

        {resetPasswordSuccess && (
          <Message variant='success'>{resetPasswordPayload.message}</Message>
        )}
        {resetPasswordError && (
          <Message variant='danger'>
            "Failed to reset password. Please try again or contact our support
            team."
          </Message>
        )}

        <Form onSubmit={submitHandler}>
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

          <Button type='submit' variant='primary'>
            Reset Password
          </Button>
        </Form>
      </FormContainer>
    </Container>
  )
}

export default ForgotPassword
