import {
  UPLOAD_REQUEST,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL,
} from '../types/uploadTypes'

export const uploadProductImageReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_REQUEST:
      return {
        loading: true,
      }
    case UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        payload: action.payload,
      }
    case UPLOAD_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}
