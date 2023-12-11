import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        console.log("Login successful!");
        const id = response.data.id;
        const token = response.data.token;
        localStorage.setItem("jwt", token);
        console.log(token);
        setLoginStatus("Login successful!");
        navigate("/dash/" + id);
      } else {
        console.error("Unexpected status code:", response.status);
        setLoginStatus(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data.message);
        setLoginStatus(error.response.data.message);
      } else {
        console.error("Error during login:", error.message);
        setLoginStatus(error.message);
      }
    }
  };

  return (
    <main className="container">
      <center>
        <h2 className="heading">LOGIN</h2>
        <form onSubmit={handleLogIn} role="form">
          <label htmlFor="userLogin" className="label">
            Username:
          </label>
          <input
            type="text"
            id="userLogin"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <br />
          <label htmlFor="passwordLogin" className="label">
            Password:
          </label>
          <input
            type="password"
            id="passwordLogin"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <br />
          {loginStatus && <p className="status">{loginStatus}</p>}
          <button type="submit" className="button">
            LogIn
          </button>
        </form>
      </center>
    </main>
  );
};


export default LogIn;
