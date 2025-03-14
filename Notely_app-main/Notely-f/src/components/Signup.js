import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";

function Signup(props) {

  const history = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    cpassword: ""
  });

  const onChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSignup = async (event) => {
    // event.preventDefault(); is used to prevent the default form submission behavior,
    // which would cause the page to reload.
    event.preventDefault(); 
    if (user.cpassword !== user.password) {
      props.showAlert('Password does not match', 'danger');
    } else {
      const resp = await fetch('http://localhost:5000/api/auth/createuser', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, email: user.email, password: user.password })
      });

      const json = await resp.json();
      
      if (json.success) {
        localStorage.setItem("token", json.AUTH_TOKEN);
        history('/login'); // Redirect to login after successful signup
        props.showAlert('Signup successful', 'success');
      } else {
        props.showAlert('Invalid Credentials', 'danger');
      }
    }
  };

  return (
    <MDBContainer className="gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column align-items-center">
            <img src="logo_top.png" style={{ width: '120px' }} alt="logo" />
            <h4 className="mt-1 mb-4">Create Your Account</h4>
            <p>Please fill in the details to create an account</p>
            <MDBInput 
              wrapperClass='mb-4' 
              placeholder='Username' 
              id='form1' 
              type='text' 
              name='name' 
              onChange={onChange} 
              style={{ width: '100%' }} // Set width to 100% for alignment
            />
            <MDBInput 
              wrapperClass='mb-4' 
              placeholder='Email address' 
              id='form2' 
              type='email' 
              name='email' 
              onChange={onChange} 
              style={{ width: '100%' }} // Set width to 100% for alignment
            />
            <MDBInput 
              wrapperClass='mb-4' 
              placeholder='Password' 
              id='form3' 
              type='password' 
              name='password' 
              onChange={onChange} 
              style={{ width: '100%' }} // Set width to 100% for alignment
            />
            <MDBInput 
              wrapperClass='mb-4' 
              placeholder='Re-Enter Password' 
              id='form4' 
              type='password' 
              name='cpassword' 
              onChange={onChange} 
              style={{ width: '100%' }} // Set width to 100% for alignment
            />
            <button 
              className="mb-4 w-25 btn" 
              style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '0.25rem' }} // Maintain rounded corners and no border
              onClick={handleSignup}
            >
              Sign up
            </button>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <p className="mb-0">Already have an account?</p>
              <button className='btn btn-outline-danger mx-2' onClick={() => history('/login')}>
                Login
              </button>
            </div>
          </div>
        </MDBCol>
        <MDBCol col='6' className="mb-5 gradient-custom-2">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="text-white px-3 py-4 gradient-bg">
              <h4 className="mb-4">Join the Notely Community!</h4>
              <p className="small mb-0" style={{ color: 'white' }}>
                Experience seamless note-taking and reminders. Stay organized and never miss a deadline!
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Signup;
