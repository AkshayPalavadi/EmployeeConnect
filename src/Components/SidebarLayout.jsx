import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import defaultAvatar from "../assets/logo.jpg";

function SidebarLayout() {
  const [showMenu, setShowMenu] = useState(false);
  const [apiPhoto, setApiPhoto] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const empName = localStorage.getItem("employeeName");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");  // You should already store email on login

    if (!email) return;

    fetch(`https://internal-website-rho.vercel.app/api/employee/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setApiPhoto(data.personal?.photo || null);
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <div className="sidebarlayout-layout">
      {/* Sidebar */}
      <button
        className="sidebarlayout-hamburger"
        onClick={() => setShowMenu(!showMenu)}
      >
        ☰
      </button>
      <aside className={`sidebarlayout-sidebar-inner ${showMenu ? "sidebar-open" : ""}`}>
        <div className="sidebarlayout-profile-section">
          <div className="sidebarlayout-photo-name-container">
            <div className="sidebarlayout-photo-wrapper">
              <img 
                src={apiPhoto || defaultAvatar} 
                alt="Profile"
              />
            </div>
            <div className="sidebarlayout-username-section">
              {empName}
            </div>
          </div>
        </div>

        {/* Sidebar Links */}
        <ul className="sidebarlayout-sidebar-links">
          <li>
            <Link
              to="home"
              className={pathname === "/employee/home" ? "sidebarlayout-homeActive" : "sidebarlayout-homeInactive"}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="dashboard"
              className={pathname === "/employee/dashboard" ? "sidebarlayout-dashboardActive" : "sidebarlayout-dashboardInactive"}
            >
              My Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="profile"
              className={pathname === "/employee/profile" ? "sidebarlayout-profileActive" : "sidebarlayout-profileInactive"}
            >
              Profile
            </Link>
          </li>

          <li>
            <Link
              to="leaves"
              className={pathname === "/employee/leaves" ? "sidebarlayout-leaveActive" : "sidebarlayout-leaveInactive"}
            >
              Leaves
            </Link>
          </li>

          {/* Timesheet */}
          <li>
            <Link
              to="timesheet"
              className={pathname === "/employee/timesheet" ? "sidebarlayout-timesheetActive" : "sidebarlayout-timesheetInactive"}
            >
              Timesheet
            </Link>
          </li>

          {/* Performance */}
          <li>
            <Link
              to="performancemanagement"
              className={pathname === "/employee/performancemanagement" ? "sidebarlayout-performanceActive" : "sidebarlayout-performanceInactive"}
            >
              Performance
            </Link>
          </li>

          {/* Training and Development */}
          {/* <li>
            <Link
              to="traininganddevelopment"
              className={pathname === "/employee/traininganddevelopment" ? "sidebarlayout-performanceActive" : "sidebarlayout-performanceInactive"}
            >
              Training & Development
            </Link>
          </li> */}
        </ul>

        {/* Logout Button */}
        <div className="sidebarlayout-logout-button">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      {/* 🔥 Overlay goes HERE */}
      {showMenu && (
        <div
          className="sidebarlayout-overlay"
          onClick={() => setShowMenu(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="sidebarlayout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
