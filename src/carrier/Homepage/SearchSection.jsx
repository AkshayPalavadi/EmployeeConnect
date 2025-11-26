import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchSection.css";
// import { Navigate } from "react-router-dom";
import {useNavigate} from "react-router-dom"

const jobsList = [
  "Sr. Web Developer",
  "Software Trainee",
  "Project Manager",
  "UI/UX Designer",
  "Frontend React Developer",
  "Frontdesk",
];

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [experience, setExperience] = useState("");
  const [skill, setSkill] = useState(""); 
  
  const navigate=useNavigate()

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredJobs([]);
      setNoResults(false);
    } else {
      const filtered = jobsList.filter((job) =>
        job.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJobs(filtered);
      setNoResults(filtered.length === 0);
    }
  };

  const handleApply = (jobId) => {
    navigate(`/carrier/job/${jobId}`)
  };

  return (
    <div className="search-section">
      <div className="search-label">
        {/* Job search input */}
        <input
          type="text"
          placeholder="Job Search By Keywords"
          value={searchTerm}
          onChange={handleChange}
        />

        {/* Search button */}
        <button className="search-btn">
          <FaSearch size={16} color="#fff" />
        </button>

        {/* Experience dropdown */}
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="1-3 Years">1-3 Years</option>
          <option value="3-5 Years">3-5 Years</option>
          <option value="5+ Years">5+ Years</option>
        </select>

        {/* Skills dropdown */}
        <select className="search-skills" value={skill} onChange={(e) => setSkill(e.target.value)}>
          <option value="">Skills</option>
          <option value="ReactJS">ReactJS</option>
          <option value="NodeJS">NodeJS</option>
          <option value="JavaScript">JavaScript</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Python">Python</option>
          <option value="HTML/CSS">HTML/CSS</option>
        </select>
      </div>

      {/* Dropdown for filtered jobs */}
      {filteredJobs.length > 0 && (
        <ul className="jobs-dropdown">
          {filteredJobs.map((job, index) => (
            <li key={index} className="job-item">
              {job}
              <button className="apply-btn" onClick={() => handleApply(index+1)}>
                Apply
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Show message when no results found */}
      {noResults && (
        <div className="no-results">
          ❌ No results found for "<strong>{searchTerm}</strong>"
        </div>
      )}
    </div>
  );
};

export default SearchSection;
