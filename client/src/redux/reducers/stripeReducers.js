import {
  STRIPE_CHECKOUT_REQUEST,
  STRIPE_CHECKOUT_SUCCESS,
  STRIPE_CHECKOUT_FAIL,
  STRIPE_SESSION_DATA_REQUEST,
  STRIPE_SESSION_DATA_SUCCESS,
  STRIPE_SESSION_DATA_FAIL,
} from '../types/stripeTypes'

export const stripePayReducer = (state = {}, action) => {
  switch (action.type) {
    case STRIPE_CHECKOUT_REQUEST:
      return {
        loading: true,
      }
    case STRIPE_CHECKOUT_SUCCESS:
      return {
        loading: false,
        success: true,
      }
    case STRIPE_CHECKOUT_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const stripeSessionDataReducer = (state = {}, action) => {
  switch (action.type) {
    case STRIPE_SESSION_DATA_REQUEST:
      return {
        loading: true,
      }
    case STRIPE_SESSION_DATA_SUCCESS:
      return {
        loading: false,
        payload: action.payload,
      }
    case STRIPE_SESSION_DATA_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}
