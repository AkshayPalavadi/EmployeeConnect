import React from "react";
import "./AboutSection.css";
import AboutImage from "../assets/about.jpg"; // use your image file here

const AboutSection = () => {
  return (
    <div className="about-section">
      <div className="about-image">
        <img src={AboutImage} alt="Team Collaboration" />
      </div>

      <div className="about-content">
        <h2 className="heading-job">Discover who we are and what drives us.</h2>
        <p className="description">
          We help businesses grow by merging technology and customer experience
          into one seamless journey. From smart software and e-commerce
          platforms to reliable IT operations and voice support, we’ve got you
          covered.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
