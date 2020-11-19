import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

//* Components/Layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

//* Home View
import HomeView from './views/HomeView'

//* User Views
import LoginView from './views/userViews/LoginView'
import RegisterView from './views/userViews/RegisterView'
import ForgotPasswordView from './views/userViews/ForgotPasswordView'
import ResetPasswordView from './views/userViews/ResetPasswordView'
import ProfileView from './views/userViews/ProfileView'

//* Product Views
import ProductView from './views/productViews/ProductView'
import ProductListView from './views/productViews/ProductListView'
import ProductCreateView from './views/productViews/ProductCreateView'
import ProductEditView from './views/productViews/ProductEditView'

//* Order Views
import OrderListView from './views/orderViews/OrderListView'
import OrderDetailsView from './views/orderViews/OrderDetailsView'

//* Checkout/Stripe Views
import CartView from './views/checkoutViews/CartView'
import StripeSuccessView from './views/checkoutViews/StripeSuccessView'
import PaymentView from './views/checkoutViews/PaymentView'
import ShippingView from './views/checkoutViews/ShippingView'

//* Bootstrap
import { Container } from 'react-bootstrap'

//* Utils
import ScrollToTop from './utils/ScrollToTop'

const App = ({ children, title }) => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className='py-3'>
        <Route path='/' exact component={HomeView} />
        <Container>
          <Route path='/login' component={LoginView} />
          <Route path='/register' component={RegisterView} />
          <Route path='/forgot-password' component={ForgotPasswordView} />
          <Route path='/reset-password' component={ResetPasswordView} />
          <Route path='/profile' component={ProfileView} />
          <Route path='/order/:id' component={OrderDetailsView} />
          <Route path='/product/:id' exact component={ProductView} />
          <Route path='/admin/productlist' exact component={ProductListView} />
          <Route path='/admin/orderlist' component={OrderListView} />
          <Route
            path='/admin/product/create'
            exact
            component={ProductCreateView}
          />
          <Route
            path='/admin/product/:id/edit'
            excat
            component={ProductEditView}
          />
          <Route path='/cart/:id?' component={CartView} />
          <Route path='/checkout/success' component={StripeSuccessView} />
          <Route path='/payment' component={PaymentView} />
          <Route path='/shipping' component={ShippingView} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
