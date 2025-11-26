import React, { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import "./JobCard.css";
import { Link } from "react-router-dom";

const JobCard = ({ id, title, category, experience, salary, location }) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h2>{title}</h2>
        <button className="save-btn" onClick={handleSave}>
          {saved ? <FaBookmark className="saved-icon" /> : <FaRegBookmark className="save-icon" />}
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      <div className="job-details">
        <span>{category}</span> | <span>{experience}</span> | <span>{salary}</span> | <span>{location}</span>
      </div>

      {/* ✅ Link to job details using ID */}
      
      <Link to={`/carrier/job/${id}`}>
        <button className="details-btn">Job Details</button>
      </Link>
    </div>
  );
};

export default JobCard;
