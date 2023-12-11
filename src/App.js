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
        const tokenExpirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const timeUntilExpiration = tokenExpirationTime - Date.now();

        if (timeUntilExpiration > 0 && timeUntilExpiration < 20000) {
          // Show alert 20 seconds before token expiration
          setShowAlert(true);
        } else {
          // Hide the alert if not within the 20-second window
          setShowAlert(false);
        }
      } catch (error) {
        // Handle decoding error (e.g., invalid token)
        console.error("Error decoding token:", error);
      }
    }
  };

  const logout = () => {
    // Clear the token and navigate to the login page
    localStorage.removeItem('jwt');
    window.location.href = '/'; // Redirect to the homepage
  };

  const extendToken = () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      // Make an API call to extend the token
      axios
        .post('http://localhost:3001/api/extend-token', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          // Assuming the API returns an updated token
          const updatedToken = response.data.token;

          // Update the token in localStorage
          localStorage.setItem("jwt", updatedToken);

          // Check for token expiration again after extending
          checkTokenExpiration();
          console.log("Token Extended",updatedToken);
          // Close the alert
          setShowAlert(false);
        })
        .catch((error) => {
          console.error("Error extending token:", error);
          // Handle error (e.g., show an error message to the user)
        });
    }
  };

  useEffect(() => {
    // Set up a timer to check for token expiration every minute
    const intervalId = setInterval(checkTokenExpiration, 60 * 1000);

    // Clear the timer on component unmount
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
      {/* Pop-up alert */}
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
