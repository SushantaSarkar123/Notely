import React from 'react'
import { Nav, Navbar, Container, NavLink, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus , faRightToBracket, faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const NavigationBar = (props) => {
  const history = useNavigate()
  const location = useLocation()
  const logoutHandler = () => {
    localStorage.removeItem('token')
    history('/login')
  }
  return (
    <Navbar expand="lg" bg="light" data-bs-theme="light">
    <Container>
      <Navbar.Brand href="/">iNotes</Navbar.Brand>
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavLink className={`${location.pathname} === '/'? 'active' : ''`} href="/">Home</NavLink>
          <NavLink className={`${location.pathname} === '/about'? 'active' : ''`} href="/about">About</NavLink>
        </Nav>
        {localStorage.getItem('token')?
         <><b className='mx-2' style={{color:'#198754'}}><FontAwesomeIcon icon={faUser} /> {props.loggedUser.name}</b>
        <Button onClick={logoutHandler} variant="danger"><FontAwesomeIcon icon={faRightFromBracket} /></Button></>
        :
        <Nav className="d-flex">
            <NavLink className='mx-3' href='/signup' role='button'><Button variant="success"><FontAwesomeIcon icon={faUserPlus} /></Button></NavLink>
            <NavLink className='mx-3' href='/login' role='button'><Button variant="primary"><FontAwesomeIcon icon={faRightToBracket} /></Button></NavLink>
          </Nav>
          }
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default NavigationBar
