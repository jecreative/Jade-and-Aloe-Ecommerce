import axios from 'axios'
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,

  // TODO:
  USER_DETAILS_SUCCESS,
  USER_DETAILS_REQUEST,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_COMPLETE,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from '../types/userTypes'

// import { ORDER_CREATE_RESET, ORDER_LIST_MY_RESET } from '../types/orderTypes'
import { CART_RESET } from '../types/cartTypes'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      'https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users/login',
      { email, password },
      config
    )

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

//TODO: Perform necessary resets here on logout
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })
  dispatch({ type: USER_DETAILS_RESET })
  dispatch({ type: USER_LIST_RESET })
  dispatch({ type: CART_RESET })
  localStorage.clear()
}

export const register = (name, email, password, confirmPassword) => async (
  dispatch
) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      'https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users',
      { name, email, password, confirmPassword },
      config
    )

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      `https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users/forgot-password`,
      { email },
      config
    )

    dispatch({
      type: USER_FORGOT_PASSWORD_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload: error.response.data.error,
    })
  }
}

export const resetPassword = (newPassword, mode, actionCode, lang) => async (
  dispatch
) => {
  try {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      `https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users/reset-password`,
      { newPassword, mode, actionCode, lang },
      config
    )

    dispatch({
      type: USER_RESET_PASSWORD_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload: error.response.data.error,
    })
  }
}

export const getUserDetails = (userId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(
      `https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users/${userId}`,
      config
    )

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// TODO: Work to do below

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users/profile`,
      user,
      config
    )

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))

    setTimeout(() => {
      dispatch({
        type: USER_UPDATE_PROFILE_COMPLETE,
      })
    }, 3000)
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(
      `https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users`,
      config
    )

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(
      `https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users/${id}`,
      config
    )

    dispatch({ type: USER_DELETE_SUCCESS })
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `https://us-central1-jade-and-aloe-ecommerce.cloudfunctions.net/api/users/${user._id}`,
      user,
      config
    )

    dispatch({ type: USER_UPDATE_SUCCESS })

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
