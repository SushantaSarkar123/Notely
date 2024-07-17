import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const history = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const onChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const loginUser = async (event)=>{
    event.preventDefault();
    const resp = await fetch('http://localhost:5000/api/auth/login',{
      method : 'POST',
      headers : {
        "Content-Type": "application/json"
      } ,
      body: JSON.stringify(user)
    });
    const json = await resp.json();
    if(json.success){
      localStorage.setItem("token", json.AUTH_TOKEN);
      history('/')
      props.showAlert('Login successful', 'success')
    }else{
      props.showAlert('Invalid Credentials', 'danger')
    }
  }
  return (
    <div className="container">
      <form onSubmit={loginUser}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input onChange={onChange} name='email'
          value={user.email}
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input onChange={onChange} name='password' type="password" className="form-control" id="password" value={user.password}/>
        </div>
        <button type="submit" className="btn btn-primary" >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Login
