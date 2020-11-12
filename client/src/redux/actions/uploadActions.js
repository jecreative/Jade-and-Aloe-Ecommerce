import axios from 'axios'
import {
  UPLOAD_REQUEST,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL,
} from '../types/uploadTypes'

//* Upload Product Image
export const uploadProductImages = (formData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: UPLOAD_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/uploads`, formData, config)

    dispatch({
      type: UPLOAD_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
