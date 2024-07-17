import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Signup(props) {
  const history = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: "",
    name:"",
    cpassword:""
  });
  const onChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const loginUser = async (event)=>{
    event.preventDefault();
    if(user.cpassword !== user.password){
      props.showAlert('Password does not match','danger');
    }else{
    const resp = await fetch('http://localhost:5000/api/auth/createuser',{
      method : 'POST',
      headers : {
        "Content-Type": "application/json"
      } ,
      body: JSON.stringify({name:user.name, email:user.email, password:user.password})
    });
    const json = await resp.json();
    if(json.success){
      localStorage.setItem("token", json.AUTH_TOKEN);
      history('/')
      props.showAlert('Signup successful', 'success')
    }else{
      props.showAlert('Invalid Credentials', 'danger')
    }
  }
  }
  return (
    <div className="container">
      <form onSubmit={loginUser}>
      <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Username
          </label>
          <input onChange={onChange} required minLength={5}name='name'
          value={user.name}
            type="name"
            className="form-control"
            id="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input onChange={onChange} required name='email'
          value={user.email}
            type="email"
            className="form-control"
            id="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input onChange={onChange} required minLength={5}name='password' type="password" className="form-control" id="password" value={user.password}/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Re-Enter Password
          </label>
          <input onChange={onChange} required minLength={5}name='cpassword' type="password" className="form-control" id="cpassword" value={user.cpassword}/>
        </div>
        <button type="submit" className="btn btn-primary" >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Signup;
