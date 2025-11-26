import React, { useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import defaultAvatar from "../assets/logo.jpg";

function SidebarLayout({ userName, setUserName, userPhoto, setUserPhoto }) {
  const [showMenu, setShowMenu] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ---------- PHOTO ----------
  const handlePhotoClick = () => setShowMenu(!showMenu);
  const handleAddPhoto = () => {
    fileInputRef.current.click();
    setShowMenu(false);
  };
  const handleRemovePhoto = () => {
    setUserPhoto(null);
    setShowMenu(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUserPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ---------- NAME ----------
  const handleEditName = () => {
    setEditingName(true);
    setTempName(userName);
  };
  const handleSaveName = () => {
    setUserName(tempName);
    setEditingName(false);
  };
  const handleCancelEdit = () => {
    setEditingName(false);
    setTempName(userName);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

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
            <div className="sidebarlayout-photo-wrapper" onClick={handlePhotoClick}>
              <img src={userPhoto || defaultAvatar} alt="Profile" />
              {showMenu && (
                <div className="sidebarlayout-photo-menu">
                  <button onClick={handleAddPhoto}>Add Photo</button>
                  {userPhoto && <button onClick={handleRemovePhoto}>Remove Photo</button>}
                </div>
              )}
            </div>

            <div className="sidebarlayout-username-section">
              {editingName ? (
                <div className="sidebarlayout-edit-name-box">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                  />
                  <div className="sidebarlayout-name-buttons">
                    <button onClick={handleSaveName}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="sidebarlayout-name-display">
                  <p>{userName}</p>
                  <button className="sidebarlayout-edit-name-btn" onClick={handleEditName}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
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
