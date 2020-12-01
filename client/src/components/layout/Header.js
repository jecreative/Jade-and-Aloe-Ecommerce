import React from 'react'
import { useHistory } from 'react-router-dom'
//* Logo
import JadeAloeLogo from './Jade&Aloe.svg'
//* Redux
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/actions/userActions'
//* Bootstrap
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Header = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  let history = useHistory()

  const logoutHandler = () => {
    dispatch(logout())
    history.push('/login')
  }

  return (
    <header style={{ marginBottom: '75px' }}>
      <Navbar
        bg='light'
        variant='light'
        expand='lg'
        fixed='top'
        collapseOnSelect
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img src={JadeAloeLogo} alt='ProShop Logo' width='130px' />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto'>
              <LinkContainer to='/'>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              {/* <LinkContainer to='/about'>
                <Nav.Link>Our Story</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/events'>
                <Nav.Link>Events</Nav.Link>
              </LinkContainer> */}

              {userInfo && userInfo.isAdmin ? (
                <NavDropdown title={userInfo.name || 'Admin'} id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : userInfo && !userInfo.isAdmin ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Cart
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
