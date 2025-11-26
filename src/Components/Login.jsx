import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logo from "../assets/logo.jpg";

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Keep user logged in if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    if (token && storedRole) {
      // navigate("/");
    }
  }, []);

  // ✅ Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@dhatvibs.com")) {
      setError("Only @dhatvibs.com email addresses are allowed.");
      return;
    }

    try {
      // Step 1: Login API
      const response = await fetch("https://internal-website-rho.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("📦 Login API Response:", result);

      if (response.ok && result.token) {
        // ✅ Save token
        localStorage.setItem("token", result.token);

        const user = result.employee;

        if (user) {
          // ✅ Store user details
          localStorage.setItem("employeeName", `${user.firstName} ${user.lastName}`);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userRole", role);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("mustFillPersonalDetails", result.mustFillPersonalDetails);
localStorage.setItem("mustFillEducationDetails", result.mustFillEducationDetails);
localStorage.setItem("mustFillProfessionalDetails", result.mustFillProfessionalDetails);
          setIsLoggedIn(true);
          setUserRole(role);
          if (role === "employee") {

            navigate("/employee/home");
              window.location.reload();

          } else if (role === "admin") {
            navigate("/admin");
          }

          // Step 3: Fetch Full Employee Details to get employeeId & experience
          try {
            const empFullRes = await fetch(
              `https://internal-website-rho.vercel.app/api/employee/${user.email}`
            );

            const empFullData = await empFullRes.json();
            console.log("📌 Full Employee Details:", empFullData);

            if (empFullRes.ok && empFullData.professional) {
              const professional = empFullData.professional;

              // Save Employee ID
              if (professional.employeeId) {
                localStorage.setItem("employeeId", professional.employeeId);
                console.log("✔ Employee ID Saved:", professional.employeeId);
              }

              // Save Department
              if (professional.department) {
                localStorage.setItem("employeeDepartment", professional.department);
              }

              // Save Date of Joining
              if (professional.dateOfJoining) {
                localStorage.setItem("employeeDateOfJoining", professional.dateOfJoining);
              }

              // ⭐ Calculate Experience from dateOfJoining to today
              if (professional.dateOfJoining) {
                const joiningDate = new Date(professional.dateOfJoining);
                const today = new Date();

                // Calculate difference in milliseconds → convert to years
                const diffInMs = today - joiningDate;
                const years = diffInMs / (1000 * 60 * 60 * 24 * 365);

                // Round to 2 decimals
                const experienceYears = years.toFixed(2);

                localStorage.setItem("employeeExperience", experienceYears);
                console.log("📅 Experience Saved:", experienceYears, "years");
              }
            } else {
              console.warn("❌ Employee details not found in response");
            }
          } catch (error) {
            console.error("❌ Error fetching full employee details:", error);
          }
        } else {
          setError("User data not found in employee list.");
        }
      } else {
        setError(result.msg || "Invalid email or password.");
      }
    } catch (err) {
      console.error("🚨 Error:", err);
      setError("Server not reachable. Please try again later.");
    }
  };

  return (
    <div className="loginpage-login-main-container">
      <div className="loginpage-headerlogin">
        <img src={logo} alt="logo" />
        <div className="loginpage-title">
          <h1>DhaTvi Business Solutions Pvt. Ltd.</h1>
          <p style={{ paddingTop: "15px" }}>
            <i>Driving Technology Delivering Trust</i>
          </p>
        </div>
      </div>
      <hr />
      <div className="loginpage-login-container-employee">
        <form className="loginpage-login-form-employee" onSubmit={handleSubmit}>
          <h1 className="loginpage-heading-employee">Login</h1>

          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <label>Email Id :</label>
          <div className="loginpage-email-input">
            <input
              type="email"
              placeholder="Mail ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <label>Password :</label>
          <div className="loginpage-password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <span
              className="loginpage-eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="loginpage-reset-password-link">
            <Link to="/reset-password">Reset Password?</Link>
          </div>

          {error && <p className="loginpage-error">{error}</p>}

          <button type="submit">Login</button>

          <p className="loginpage-register-link-text">
            Don't have an account?{" "}
            <span
              className="loginpage-register-link"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;