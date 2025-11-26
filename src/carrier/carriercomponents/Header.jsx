import React from "react";
import Logo from "../assets/dhatvi.jpg";
import { FaHome } from "react-icons/fa";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
   const goHome = () => {
    navigate("/carrier"); // go to Home page first
  
    // delay scrolling to ensure page renders
    setTimeout(() => {
      const jobsSection = document.getElementById("jobs-section");
      jobsSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

    return (
    <nav className="navbar">
        <div className="logo">
            <img src={Logo} alt="Logo" className="logo" />
            <div className="logo-text">
                <span className="dhatvi-text">Dhatvi</span>
                <div className="green-line-job"></div>
                <span className="business-text">BUSINESS SOLUTIONS PVT.LTD</span>
            </div>
          </div>
            <div className="header-right">
              <button className="header-home-btn" onClick={goHome}>
                <FaHome className="home-icon" />
                Home
              </button>
      </div>
        
    </nav>
  );
};

export default Header;
