import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
//* PRODUCT REDUCERS
import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from './reducers/productReducers'

//* UPLOAD REDUCERS
import { uploadProductImageReducer } from './reducers/uploadReducer'

//* CART REDUCERS
import { cartReducer } from './reducers/cartReducers'

//* STRIPE REDUCERS
import {
  stripePayReducer,
  stripeSessionDataReducer,
  stripeChargeReducer,
} from './reducers/stripeReducers'

//* USER REDUCERS
import {
  userLoginReducer,
  userRegisterReducer,
  userForgotPasswordReducer,
  userResetPasswordReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers'

//* ORDER REDUCERS
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderSetReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer,
} from './reducers/orderReducers'

//* ALL REDUCERS
const reducer = combineReducers({
  //* PRODUCTS
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,

  //* STRIPE
  stripePay: stripePayReducer,
  stripeSessionData: stripeSessionDataReducer,
  stripeCharge: stripeChargeReducer,

  //* UPLOADS
  uploadProductImage: uploadProductImageReducer,

  //* CART
  cart: cartReducer,

  //* USERS/CUSTOMERS
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userForgotPassword: userForgotPasswordReducer,
  userResetPassword: userResetPasswordReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,

  //* ORDERS
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderSet: orderSetReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const orderInfoFromStorage = localStorage.getItem('orderInfo')
  ? JSON.parse(localStorage.getItem('orderInfo'))
  : []

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : null

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
  orderSet: { orderInfo: orderInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
