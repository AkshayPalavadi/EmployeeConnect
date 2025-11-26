import React from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";
// import Teamwork from "./assets/Teamwork.jpg";
import Teamwork from "../assets/meeting.jpg"

const HeroSection = () => {
    const navigate = useNavigate(); // ✅ initialize navigation

  return (
    <div className="hero-section">
      <div className="hero-content">
        <p className="small-text">→ Experience The Best IT Solutions</p>
        <h1>
          Grow With Us, <br /> Shape Your Future 
        </h1>
        <p className="desc">
          We are giving the best IT solutions so far and one of the best IT
          solutions ever we have the best team to make every idea possible.
        </p>
        <button 
          className="apply-btn"
          onClick={() => {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            if (isLoggedIn) {
              navigate("/carrier/jobs");
            } else {
              navigate("/carrier/login");  // redirect to login
            }
          }}
        >
          Apply Now →
        </button>
      </div>

      <div className="hero-image">
        <img
          src={Teamwork}
          alt="Team meeting"
        />
      </div>
    </div>
  );
};

export default HeroSection;


