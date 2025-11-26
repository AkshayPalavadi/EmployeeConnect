import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPassword.css";
import logo from "../assets/logo.jpg";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Same password regex and validation logic as Register.jsx
  const validate = (name, value) => {
    let message = "";

    switch (name) {
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@dhatvibs\.com$/.test(value)) {
          message = "Please enter a valid @dhatvibs.com email address";
        }
        break;

      case "newPassword":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/.test(value)
        ) {
          message =
            "Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character (min 12 chars)";
        }
        break;

      case "confirmPassword":
        if (value !== formData.newPassword) {
          message = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  // Run validation for all fields before submitting
  Object.keys(formData).forEach((key) => validate(key, formData[key]));
  const hasErrors = Object.values(errors).some((msg) => msg);
  if (hasErrors) {
    setMessage("❌ Please fix the highlighted errors before submitting.");
    return;
  }

  // 🧪 Simulate API
  setLoading(true);
  setTimeout(() => {
    // Fake password check
    if (formData.currentPassword === "oldpassword123") {
      setMessage("✅ Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage("❌ Current password is incorrect.");
    }
    setLoading(false);
  }, 1500);
};

  return (
    <div className="resetpassword-emp-register-container">
      <div className="resetpassword-emp-register-left">
        <img src={logo} alt="DhaTvi Logo" className="resetpassword-emp-logo" />
        <h1>
          Welcome to <span className="resetpassword-emp-highlight">DhaTvi</span>
        </h1>
        <p className="resetpassword-emp-content">
          Securely reset your password and continue your professional journey.
        </p>
      </div>

      <div className="resetpassword-emp-register-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="email"
            name="email"
            placeholder="Registered Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="resetpassword-emp-error">{errors.email}</p>}

          <div className="resetpassword-emp-password-group">
            <input
              className="resetpassword-emp-password-input"
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <span
              className="resetpassword-emp-eye-icon"
              onClick={() => setShowCurrent((prev) => !prev)}
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="resetpassword-emp-password-group">
            <input
              className="resetpassword-emp-password-input"
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <span
              className="resetpassword-emp-eye-icon"
              onClick={() => setShowNew((prev) => !prev)}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.newPassword && (
            <p className="resetpassword-emp-error">{errors.newPassword}</p>
          )}

          <div className="resetpassword-emp-password-group">
            <input
              className="resetpassword-emp-password-input"
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <span
              className="resetpassword-emp-eye-icon"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="resetpassword-emp-error">{errors.confirmPassword}</p>
          )}

          {message && (
            <p
              className="resetpassword-emp-message"
              style={{ color: message.includes("✅") ? "green" : "red" }}
            >
              {message}
            </p>
          )}

          <button className="resetpassword-submit-reg" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="resetpassword-emp-login-text">
          Back to{" "}
          <span
            className="resetpassword-emp-login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
