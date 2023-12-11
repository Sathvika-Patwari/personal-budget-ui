import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashBoard from "./components/DashBoard";
import Expenses from "./components/Expenses";
import HomePage from "./components/HomePage";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import axios from "axios";
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Session Expiring</h2>
        <p>Your session will expire soon. Do you want to stay on this page?</p>
        <button onClick={onConfirm}>Stay</button>
        <button onClick={onClose}>Leave</button>
      </div>
    </div>
  );
};

function App() {
  const [showAlert, setShowAlert] = useState(false);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const tokenExpirationTime = decodedToken.exp * 1000; 
        const timeUntilExpiration = tokenExpirationTime - Date.now();

        if (timeUntilExpiration > 0 && timeUntilExpiration < 20000) {
          setShowAlert(true);
        } else {
          setShowAlert(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  };

  const extendToken = () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      axios
        .post('http://localhost:3001/api/extend-token', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          const updatedToken = response.data.token;

          localStorage.setItem("jwt", updatedToken);

          checkTokenExpiration();
          console.log("Token Extended",updatedToken);
          setShowAlert(false);
        })
        .catch((error) => {
          console.error("Error extending token:", error);
        });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dash/:id" element={<DashBoard />} />
          <Route path="/expenses/:id" element={<Expenses />} />
        </Routes>
      </Router>
      {showAlert && (
        <Modal
          isOpen={showAlert}
          onClose={()=>logout()} 
          onConfirm={()=>extendToken()}
        />
      )}
    </div>
  );
}

export default App;
