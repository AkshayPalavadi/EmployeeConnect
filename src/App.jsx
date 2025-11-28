import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import SidebarLayout from "./Components/SidebarLayout.jsx";
import Home from "./Components/Home.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Leaves from "./Components/Leaves.jsx";
import Login from "./Components/Login.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import Register from "./Components/Register.jsx";
import EmployeeReview from "./component/EmployeeReview.jsx";
import PerformanceManagement from "./Components/PerformanceManagement.jsx";
import PersonApp from "./component/PersonApp.jsx";
import TimeSheet from "./Components/TimeSheet.jsx";
import CarrierApp from "./carrier/carrierapp.jsx";

import TrainingAndDevelopment from "./Components/TrainingAndDevelopment.jsx";


function App() {
   const [mustFill, setMustFill] = useState(false);

useEffect(() => {
  const value =
    localStorage.getItem("mustFillPersonalDetails") === "true" ||
    localStorage.getItem("mustFillEducationDetails") === "true" ||
    localStorage.getItem("mustFillProfessionalDetails") === "true";

  setMustFill(value);
}, []);

  // Sidebar/Profile
  const [userName, setUserName] = useState("User Name");
  const [userPhoto, setUserPhoto] = useState(null);

  // -------------------------------
  // Auth State
  // -------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || ""
  );
  const [employeeId, setEmployeeId] = useState(
    () => parseInt(localStorage.getItem("employeeId")) || null
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("userRole", userRole);

  
  }, [userRole]);

  // -------------------------------
  // Admin Data
  // -------------------------------
  const [adminEmployees] = useState([
    { id: 2, name: "Akshay" },
    { id: 3, name: "Sathvika" },
    { id: 4, name: "Sravani" },
  ]);

  const userEmail = localStorage.getItem("userEmail") || "";
  const getDefaultRoute = () => {
    const currentPath = window.location.pathname;

    // Carrier route handling
    if (currentPath === "/carrier" || currentPath === "/carrier/") {
      return "/carrier/jobs";
    }
    if (currentPath.startsWith("/carrier")) {
      return currentPath;
    }

    // Not logged in
    if (!isLoggedIn) return "/login";

    // Internal employees
    if (userEmail.endsWith("@dhatvibs.com")) {
      return "/employee/home";
    }

    // Default external users
    return "/register";
  };

  // -------------------------------
  // App Routes
  // -------------------------------
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
        />

        {/* Reset Password & Register */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            isLoggedIn && userRole === "Employee" ? (
              <SidebarLayout
                userName={userName}
                setUserName={setUserName}
                userPhoto={userPhoto}
                setUserPhoto={setUserPhoto}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route
            path="dashboard"
            element={<Dashboard />}
          />
          <Route path="timesheet" element={<TimeSheet />} />
          <Route
            path="performancemanagement"
            element={<PerformanceManagement />}
          />
          <Route path="leaves" element={<Leaves />} />
          <Route path="traininganddevelopment" element={<TrainingAndDevelopment />} />

<Route path="profile/:email" element={<EmployeeReview />} />



          {/* Profile Logic */}
         

<Route
  path="profile"
  element={
    mustFill
      ? (
          <PersonApp
            key="form"
          />
        )
      : (
          <EmployeeReview key="review" />
        )
  }
/>

        </Route>
        {/* Carrier Routes */}
        <Route path="/carrier/*" element={<CarrierApp />} />

{/* Catch-all route */}
<Route
  path="*"
  element={
    isLoggedIn
      ? userRole === "Admin"
        ? <Navigate to="/admin/dashboard" replace />
        : <Navigate to="/employee/home" replace />
      : <Navigate to="/login" replace />
  }
/>

      </Routes>
    </Router>
  );
}

export default App;
