import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { url } from "../../baseUrl";
import { AuthContext } from "../../context/Auth";
import { Disabled } from "../disabled/Disabled";

export const SignupCard = () => {
  const context = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isUsernameValid = (username) => {
    return username.length >= 3 && username.length <= 15; // Example: between 3 and 15 characters
  };

  const isPasswordValid = (password) => {
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    ); // Example: at least 8 characters, one uppercase letter, and one number
  };

  const signup = async () => {
    // Clear previous error messages
    setError("");

    // Validate inputs
    if (!isEmailValid(email)) {
      setError("Invalid email format");
      return;
    }
    if (!isUsernameValid(username)) {
      setError("Username must be between 3 and 15 characters");
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter and one number"
      );
      return;
    }

    // Proceed with the signup process
    try {
      const response = await axios.post(
        `${url}/auth/register`,
        { email, password, username, name },
        { timeout: 5000 }
      );

      console.log("API Response:", response);

      if (response && response.data) {
        context.setAuth(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
      } else {
        console.error("Response data is not in the expected format");
        context.throwErr("Unexpected response structure");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      if (err.response && err.response.data && err.response.data.message) {
        context.throwErr(err.response.data.message);
      } else {
        console.log("API URL: ", url);
        context.throwErr("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="right-login">
      <div className="signup-box border">
        <img
          style={{ width: "60%", margin: "35px 0", marginBottom: "25px" }}
          src={logo}
          alt=""
        />
        <p
          style={{
            marginTop: "0px",
            color: "gray",
            fontSize: "15px",
            marginBottom: "25px",
            width: "70%",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Sign up to see photos and videos from your friends
        </p>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border"
          style={{
            marginTop: "15px",
            width: "75%",
            height: "37px",
            fontSize: "13px",
            backgroundColor: "#fafafa ",
            padding: "0 9px",
            outline: "none",
            borderRadius: "5px",
          }}
          type="text"
          placeholder="Email address"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border"
          style={{
            marginTop: "15px",
            width: "75%",
            height: "37px",
            fontSize: "13px",
            backgroundColor: "#fafafa ",
            padding: "0 9px",
            outline: "none",
            borderRadius: "5px",
          }}
          type="text"
          placeholder="Full Name"
        />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border"
          style={{
            marginTop: "15px",
            width: "75%",
            height: "37px",
            fontSize: "13px",
            backgroundColor: "#fafafa ",
            padding: "0 9px",
            outline: "none",
            borderRadius: "5px",
          }}
          type="text"
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border"
          style={{
            marginTop: "15px",
            width: "75%",
            height: "37px",
            fontSize: "13px",
            backgroundColor: "#fafafa ",
            padding: "0 9px",
            outline: "none",
            borderRadius: "5px",
          }}
          type="password"
          placeholder="Password"
        />
        <button
          onClick={signup}
          className="btn"
          style={{
            marginTop: "20px",
            width: "75%",
            height: "37px",
            backgroundColor: "#0095f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};
