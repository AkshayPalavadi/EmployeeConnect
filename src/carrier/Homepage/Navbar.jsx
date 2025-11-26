import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import Logo from "../assets/dhatvi.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdOutlinePhotoCamera } from "react-icons/md";

const Navbar = ({ scrollToAbout, scrollToJobs, scrollToSubscribe }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false); 
  const [tempName, setTempName] = useState("");

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName") || "User";
    const pic = localStorage.getItem("profilePic");
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setUserEmail(email || "");
      setUserName(name);
      setProfilePic(pic);
    }

    setAppliedJobsCount(appliedJobs.length);
    setSavedJobsCount(savedJobs.length);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("profilePic");
    setIsLoggedIn(false);
    navigate("/");
  };

 const handleFileChange = (e) => {
  console.log("upload photo")
  const file = e.target.files[0];
 
   if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setProfilePic(newImageUrl);
      console.log(newImageUrl)
    }
};


  const handleEditClick = () => {
    setIsEditingName(true);
    setTempName(userName);
  };

  const handleNameSave = () => {
    if (tempName.trim() !== "") {
      setUserName(tempName);
      localStorage.setItem("userName", tempName);
    }
    setIsEditingName(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Logo} alt="DhaTvi Logo" className="logo-img" />
        <div className="logo-text">
          <span className="dhativi-text">DhaTvi</span>
          <div className="green-line"></div>
          <span className="business-text">BUSINESS SOLUTIONS PVT. LTD</span>
        </div>
      </div>

      <ul className="nav-links">
       <li>
          {isLoggedIn ? (
            <Link to={"/carrier/jobs"}>Careers</Link>
          ) : (
            <span
              className="disabled-link-nav"
              onClick={() => navigate("/carrier/login")}
            >
              Careers
            </span>
          )}
        </li>

        <li onClick={scrollToAbout}>What we do</li>
        <li onClick={scrollToSubscribe}>Join Talent Network</li>

        <li ref={dropdownRef}>
          {!isLoggedIn ? (
            <button className="login-btn-nav" onClick={() => navigate("/carrier/login")}>
              Login →
            </button>
          ) : (
            <div
              className="profile-dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              
            >
              <div className="profile-pic-container">

             {profilePic ? <img src={profilePic} className="profile-pic-img"/>: <FaUserCircle size={25} className="profile-icon" />}
              </div>
             

              {dropdownOpen && (
                <div onClick={(e)=> e.stopPropagation()} className="dropdown-menu modern-profile-dropdown">
                  
                  <div className="profile-header">
                    <div className="profile-pic-container-dd">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="profile-pic-img"
                        />
                      ) : (
                        <FaUserCircle className="profile-pic" />
                      )}
                      <label
                      htmlFor="fileInput"
                        className="camera-icon"
                        // onClick={() => fileInputRef.current.click()}
                      >
                        <MdOutlinePhotoCamera />
                      </label>
                      <input
                      id="fileInput"
                        type="file"
                        ref={fileInputRef}
                        // accept="image/*"
                        style={{ display:"none" }}
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="profile-info">
                      <div className="profile-name-section">
                        {isEditingName ? (
                          <>
                            <input
                              type="text"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              onBlur={handleNameSave}
                              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                              autoFocus
                              className="edit-name-input"
                            />
                          </>
                        ) : (
                          <>
                            <span className="profile-name-text">{userName}</span>
                            <FiEdit
                              className="edit-icon"
                              onClick={() => {
                                setDropdownOpen(false);
                                navigate("/carrier/quickdetails");  
                              }}
                            />
                          </>
                        )}
                      </div>
                      <p className="profile-email">{userEmail}</p>
                    </div>
                  </div>

                  <div className="job-stats">
                    <div
                      className="job-box"
                      onClick={() => navigate("/carrier/appliedjoblist")}
                    >
                      <span className="job-number">{appliedJobsCount}</span>
                      <span className="job-label">Applied Jobs</span>
                    </div>
                    <div
                      className="job-box"
                      onClick={() => navigate("/carrier/savedjoblist")}
                    >
                      <span className="job-number">{savedJobsCount}</span>
                      <span className="job-label">Saved Jobs</span>
                    </div>
                  </div>

                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;