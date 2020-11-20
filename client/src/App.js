//* React
import React from 'react'
//* React Router Dom
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
//* Bootstrap
import { Container } from 'react-bootstrap'
//* Utils
import ScrollToTop from './utils/ScrollToTop'
//* Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
//* Views
import HomeView from './views/HomeView'
import LoginView from './views/userViews/LoginView'
import RegisterView from './views/userViews/RegisterView'
import ForgotPasswordView from './views/userViews/ForgotPasswordView'
import ResetPasswordView from './views/userViews/ResetPasswordView'
import ProfileView from './views/userViews/ProfileView'
import ProductView from './views/productViews/ProductView'
import ProductListView from './views/productViews/ProductListView'
import ProductCreateView from './views/productViews/ProductCreateView'
import ProductEditView from './views/productViews/ProductEditView'
import OrderListView from './views/orderViews/OrderListView'
import OrderDetailsView from './views/orderViews/OrderDetailsView'
import CartView from './views/checkoutViews/CartView'
import StripeSuccessView from './views/checkoutViews/StripeSuccessView'
import PaymentView from './views/checkoutViews/PaymentView'
import ShippingView from './views/checkoutViews/ShippingView'

const App = ({ children, title }) => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className='py-3'>
        <Route path='/' exact component={HomeView} />
        <Container>
          {/* <Redirect to='/' /> */}
          <Route path='/login' exact component={LoginView} />
          <Route path='/register' exact component={RegisterView} />
          <Route path='/forgot-password' exact component={ForgotPasswordView} />
          <Route path='/reset-password' exact component={ResetPasswordView} />
          <Route path='/profile' exact component={ProfileView} />
          <Route path='/order/:id' exact component={OrderDetailsView} />
          <Route path='/product/:id' exact component={ProductView} />
          <Route path='/admin/productlist' exact component={ProductListView} />
          <Route path='/admin/orderlist' exact component={OrderListView} />
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
          <Route path='/payment' exact component={PaymentView} />
          <Route path='/shipping' exact component={ShippingView} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
