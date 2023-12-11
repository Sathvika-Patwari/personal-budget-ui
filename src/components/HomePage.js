import React, { useState } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";

const HomePage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <div>
      <center>
      <h1 id="main-content" style={{
      backgroundImage: `url(/bg.jpg)`, 
      backgroundSize: "cover",
      minHeight: "60vh", 
      color: "white",
      paddingTop:"20vh"
    }}>PERSONAL BUDGET APP</h1>
<a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-10000px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            margin: "20vh 0 0",
          }}
        >
          Skip to Content
        </a>
        {showSignUp ? <SignUp /> : <LogIn />}

        <p>
          {showSignUp ? (
            <>
              Already a User?{" "}
              <span
                onClick={handleToggleSignUp}
                style={{ cursor: "pointer", color: "blue" }}
                aria-expanded={showSignUp}
              >
                LOGIN
              </span>
            </>
          ) : (
            <>
              Not a User?{" "}
              <span
                onClick={handleToggleSignUp}
                style={{ cursor: "pointer", color: "blue" }}
                aria-expanded={showSignUp}
              >
                SIGN UP
              </span>
            </>
          )}
        </p>
      </center>
    </div>
  );
};

export default HomePage;
