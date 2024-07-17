import "./App.css";
import About from "./components/About";
import Home from "./components/Home";
import NavigationBar from "./components/NavigationBar";
import { Routes, Route, useNavigate } from "react-router-dom";
import NoteState from "./context/notes/NoteState";
import { Container } from "react-bootstrap";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import Alert from "./components/Alert";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser();
    } else navigate("/signup");
    // eslint-disable-next-line
  }, [localStorage]);
  const fetchUser = async () => {
    const resp = await fetch("http://localhost:5000/api/auth/getuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await resp.json();
    setLoggedUser(json);
  };

  const [loggedUser, setLoggedUser] = useState({
    name: "",
    email: "",
    date: "",
  });

  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <NoteState>
      <Container>
        <Routes>
          <Route
            exact
            path="/signup"
            element={
              <>
                <NavigationBar loggedUser={loggedUser} />
                <Alert alert={alert} />
                <Signup showAlert={showAlert} />
              </>
            }
          />
          <Route
            exact
            path="/login"
            element={
              <>
                <NavigationBar loggedUser={loggedUser} />
                <Alert alert={alert} />
                <Login showAlert={showAlert} />
              </>
            }
          />
          <Route
            exact
            path="/about"
            element={
              <>
                <NavigationBar loggedUser={loggedUser} />
                <Alert alert={alert} />
                <About />
              </>
            }
          />
          <Route
            exact
            path="/"
            element={
              <>
                <NavigationBar loggedUser={loggedUser} />
                <Alert alert={alert} />
                <Home showAlert={showAlert} />
              </>
            }
          />
        </Routes>
      </Container>
    </NoteState>
  );
}

export default App;
