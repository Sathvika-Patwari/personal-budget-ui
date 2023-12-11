import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [signupStatus, setSignupStatus] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== reEnterPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    setPasswordMatchError("");

    try {
      const response = await axios.post("http://143.244.178.101:3001/api/signup", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        console.log("Sign up successful!");
        setSignupStatus("Sign up successful!");
        navigate("/login");
      } else {
        console.error("Unexpected status code:", response.status);
        setSignupStatus(response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.status);
        setSignupStatus(error.response.data.error);
      } else if (error.request) {
        console.error("No response from the server");
        setSignupStatus("No response from the server");
      } else {
        console.error("Error setting up the request:", error.message);
        setSignupStatus(error.message);
      }
    }
  };

  return (
    <div>
      <h2 className="heading">SIGNUP</h2>
      <form onSubmit={handleSignUp}>
        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-labelledby="username"
          className="input"
        />
        <br />
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-labelledby="password"
          className="input"
        />
        <br />
        <label htmlFor="reEnterPassword" className="label">
          Re-enter Password
        </label>
        <input
          type="password"
          placeholder="Re-enter Password"
          required
          value={reEnterPassword}
          onChange={(e) => setReEnterPassword(e.target.value)}
          aria-labelledby="reEnterPassword"
          className="input"
        />
        <br />
        {passwordMatchError && (
          <p role="alert" style={{ color: "red" }}>
            {passwordMatchError}
          </p>
        )}
        <button type="submit" role="button" tabIndex="0" className="button">
          SignUp
        </button>
      </form>
      {signupStatus && <p style={{ color: "red" }}>{signupStatus}</p>}
    </div>
  );
};

export default SignUp;
