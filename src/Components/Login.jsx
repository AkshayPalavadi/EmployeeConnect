import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logo from "../assets/logo.jpg";

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
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

        // ❗ Role Mismatch Check
        if (user.role !== role) {
          setError("Role mismatch");

          localStorage.clear();  // optional
          return; // stop login
        }

        if (user) {
          // ❗ CHECK IF SELECTED ROLE MATCHES USER ROLE
          if (user.role !== role) {
            setError("Role mismatch");
            return; // stop login
          }

          // ✅ Store user details
          // localStorage.setItem("employeeName", ${user.firstName} ${user.lastName});
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userRole", user.role);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("mustFillPersonalDetails", result.mustFillPersonalDetails);
          localStorage.setItem("mustFillEducationDetails", result.mustFillEducationDetails);
          localStorage.setItem("mustFillProfessionalDetails", result.mustFillProfessionalDetails);
          setIsLoggedIn(true);
          setUserRole(user.role);

          const mustFillPersonalDetails = localStorage.getItem("mustFillPersonalDetails") === "true";
          const mustFillEducationDetails = localStorage.getItem("mustFillEducationDetails") === "true";
          const mustFillProfessionalDetails = localStorage.getItem("mustFillProfessionalDetails") === "true";
          // 2️⃣ Fetch full employee data
          if(!mustFillPersonalDetails && !mustFillEducationDetails && !mustFillProfessionalDetails){
          try {
            const empFullRes = await fetch(
              `https://internal-website-rho.vercel.app/api/employee/${user.email}`,
            );
            const empFullData = await empFullRes.json();

            if (empFullRes.ok) {
              const personal = empFullData.personal || {};
              const professional = empFullData.professional || {};
              const education = empFullData.education || {};

              // Personal
              localStorage.setItem(
                "employeeName",
                `${personal.firstName || ""} ${personal.lastName || ""}`
              );
              localStorage.setItem("employeePhoto", personal.photo || "");

              // Professional
              localStorage.setItem("employeeId", professional.employeeId || "");
              localStorage.setItem("employeeDepartment", professional.department || "");
              localStorage.setItem("employeeDateOfJoining", professional.dateOfJoining || "");

              if (professional.dateOfJoining) {
                const joiningDate = new Date(professional.dateOfJoining);
                const today = new Date();
                const diff = (today - joiningDate) / (1000 * 60 * 60 * 24 * 365);
                localStorage.setItem("employeeExperience", diff.toFixed(2));
              }
            }
          } catch (err) {
            console.error("Error fetching employee details:", err);
          }
          }

          // 3️⃣ Now navigate after storing everything
          navigate(user.role === "Employee" ? "/employee/home" : "/admin");
          window.location.reload();

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
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
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