import React from 'react'
import ReactDOM from 'react-dom'
import './styles/bootstrap.min.css'
import './styles/index.css'
import App from './App'
//* Redux
import { Provider } from 'react-redux'
import store from './redux/store'

//* Stripe Elements
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHASBLE_KEY)

ReactDOM.render(
  <Provider store={store}>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </Provider>,
  document.getElementById('root')
)
