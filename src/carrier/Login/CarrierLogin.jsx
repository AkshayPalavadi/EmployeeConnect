import React, { useState } from "react";
import logo from "../assets/dhatvi.jpg";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import WelcomeImg from "../assets/team.jpg";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ✅ Validate email or 10-digit mobile
  const validateInput = (value) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isMobile = /^\d{10}$/.test(value);

    if (value === "") setError("");
    else if (isEmail || isMobile) setError("");
    else setError("Please enter a valid 10-digit mobile number or email.");

    setUserInput(value);
  };

  // ✅ Password validation
  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (value === "") setPasswordError("");
    else if (!passwordRegex.test(value))
      setPasswordError(
        "Password must have at least 8 characters, including uppercase, lowercase, number & special character."
      );
    else setPasswordError("");

    setPassword(value);
  };

  // ✅ Handle Login
  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput);
    const isMobile = /^\d{10}$/.test(userInput);

    if (!isEmail && !isMobile) {
      setError("Enter a valid email or 10-digit mobile number.");
      return;
    }

    if (passwordError || password === "") {
      setPasswordError("Please enter a valid password format.");
      return;
    }

    // ✅ Save login info
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", userInput);

    if (onLoginSuccess) onLoginSuccess();

    // ✅ Check if this specific user's details were already submitted
    const detailsSubmitted = localStorage.getItem(`detailsSubmitted_${userInput}`);

    if (detailsSubmitted === "true") {
      navigate("/carrier"); // Go directly to main page
    } else {
      navigate("/carrier/quickdetails"); // Go to form if not filled
    }
  };

  return (
    <div className="container">
      <div className="left-job">
        <div className="header-job">
          <img src={logo} alt="DhaTvi Logo" className="logo-img" />
          <h1>
            Login to <br />
            <span className="highlight">Unlock Opportunities</span>
          </h1>
        </div>
        <img src={WelcomeImg} alt="Welcome" className="welcomeimg" />
      </div>

      <div className="right">
        <h1>DhaTvi Business Solutions</h1>
        <p className="sub-text">Driving Technology Delivering Trust</p>

        <form className="login-form-job" onSubmit={handleSubmit}>
          <label>Email / Mobile Number</label>
          <input
            type="text"
            placeholder="Enter your email or mobile"
            value={userInput}
            onChange={(e) => validateInput(e.target.value)}
            required
          />
          {error && <p className="error-msg">{error}</p>}

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
            />
            <span
              className="view-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <p className="error-msg">{passwordError}</p>}

          <div className="forgot">
            <a href="#">Forgot Password?</a>
          </div>

          <button
            className="login-btn-Login"
            type="submit"
            disabled={!!error || !!passwordError}
          >
            Login
          </button>
        </form>

        <p className="create-account">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="link">
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
