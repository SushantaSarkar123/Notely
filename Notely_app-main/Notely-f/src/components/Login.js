import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const history = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.AUTH_TOKEN);
      history("/"); // Redirect to home after successful login
      props.showAlert("Login successful", "success");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  return (
    <MDBContainer className="gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column align-items-center">
            <img src="logo_top.png" style={{ width: "120px" }} alt="logo" />
            <h4 className="mt-1 mb-4">Welcome Back!</h4>
            <p>Please login to your account</p>
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Email address"
              id="form1"
              type="email"
              name="email"
              onChange={onChange}
            />
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Password"
              id="form2"
              type="password"
              name="password"
              onChange={onChange}
            />
            <button
              className="mb-4 w-25 btn"
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
              }} // Maintain rounded corners and no border
              onClick={handleLogin}
            >
              Log In
            </button>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <p className="mb-0">Don't have an account?</p>
              <button
                className="btn btn-outline-danger mx-2"
                onClick={() => history("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </MDBCol>
        <MDBCol col="6" className="mb-5 gradient-custom-2">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="text-white px-3 py-4">
              <h4 className="mb-4">Unlock Your Potential with Notely!</h4>
              <p className="small mb-0" style={{ color: "white" }}>
                Join a community of organized thinkers and creative minds. With
                Notely, you can effortlessly manage your notes, set reminders,
                and stay on top of your tasks. Let's make productivity a breeze!
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
