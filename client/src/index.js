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
const stripePromise = loadStripe(
  'pk_test_51HgIrOAs4fA7BMN8fDy2gFlVV7OtOvVlQm0gpbG8jZyOHcuQKHON9CCD03ajPIxFKht659A2BOZ9b7Y40thlSXbm003uDpU3c2'
)

ReactDOM.render(
  <Provider store={store}>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </Provider>,
  document.getElementById('root')
)
