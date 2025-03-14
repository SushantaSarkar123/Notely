import React, { useState, useContext, useCallback } from 'react'
import { Nav, Navbar, Container, Button, Form, FormControl } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faRightToBracket, faRightFromBracket, faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import NoteContext from "../context/notes/NoteContext";
import { ReminderContext } from "../context/reminders/ReminderContext"; // Import ReminderContext
import { debounce } from 'lodash';

// Inline AppLogo component
const AppLogo = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <path d="M10.2892 21.9614H9.39111C6.14261 21.9614 4.51836 21.9614 3.50918 20.9363C2.5 19.9111 2.5 18.2612 2.5 14.9614V9.96139C2.5 6.66156 2.5 5.01165 3.50918 3.98653C4.51836 2.9614 6.14261 2.9614 9.39111 2.9614H12.3444C15.5929 2.9614 17.4907 3.01658 18.5 4.04171C19.5092 5.06683 19.5 6.66156 19.5 9.96139V11.1478" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.9453 2V4M10.9453 2V4M5.94531 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 15H11M7 10H15" stroke="currentColor" strokeWidth="1.5" />
    <path opacity="0.93" d="M20.7598 14.8785C19.8544 13.8641 19.3112 13.9245 18.7076 14.1056C18.2851 14.166 16.8365 15.8568 16.2329 16.3952C15.2419 17.3743 14.2464 18.3823 14.1807 18.5138C13.9931 18.8188 13.8186 19.3592 13.7341 19.963C13.5771 20.8688 13.3507 21.8885 13.6375 21.9759C13.9242 22.0632 14.7239 21.8954 15.6293 21.7625C16.2329 21.6538 16.6554 21.533 16.9572 21.3519C17.3797 21.0983 18.1644 20.2046 19.5164 18.8761C20.3644 17.9833 21.1823 17.3664 21.4238 16.7626C21.6652 15.8568 21.3031 15.3737 20.7598 14.8785Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const NavigationBar = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const noteContext = useContext(NoteContext);
  const reminderContext = useContext(ReminderContext);
  const { searchNotes: searchNotesReminders } = reminderContext;
  const { searchNotes: searchNotesNotes, getAllNotes } = noteContext;
  const [searchTerm, setSearchTerm] = useState('');

  const logoutHandler = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const performSearch = useCallback((term) => {
    if (term.trim() !== '') {
      if (location.pathname === '/') {
        searchNotesNotes(term); // Search in notes
      } else if (location.pathname === '/notify') {
        searchNotesReminders(term); // Search in reminders
      }
    } else {
      if (location.pathname === '/') {
        getAllNotes(); // Reset to all notes if search term is empty
      } else if (location.pathname === '/notify') {
        reminderContext.fetchReminders(); // Reset to all reminders if search term is empty
      }
    }
  }, [searchNotesNotes, searchNotesReminders, getAllNotes, reminderContext, location.pathname]);

  const debouncedSearch = useCallback(
    debounce(performSearch, 300),
    [performSearch]
  );

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  }

  return (
    <Navbar expand="lg" bg="light" data-bs-theme="light" className="fixed-top w-100">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <AppLogo width={30} height={30} className="me-2" />  {/* Add the logo here */}
          Notely
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Nav.Link>
            <Nav.Link as={Link} to="/notify" className={location.pathname === '/notify' ? 'active' : ''}>Notify</Nav.Link> {/* Add Notify link */}
            <Nav.Link as={Link} to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Nav.Link>
          </Nav>
          <Form className="d-flex me-2" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline-success" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>
          {localStorage.getItem('token')?
           <><b className='mx-2' style={{color:'#198754'}}><FontAwesomeIcon icon={faUser} /> {props.loggedUser ? props.loggedUser.name : 'User'}</b>
          <Button onClick={logoutHandler} variant="danger"><FontAwesomeIcon icon={faRightFromBracket} /></Button></>
          :
          <Nav className="d-flex">
              <Nav.Link as={Link} to='/signup' className='mx-3'><Button variant="success"><FontAwesomeIcon icon={faUserPlus} /></Button></Nav.Link>
              <Nav.Link as={Link} to='/login' className='mx-3'><Button variant="primary"><FontAwesomeIcon icon={faRightToBracket} /></Button></Nav.Link>
            </Nav>
            }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar
