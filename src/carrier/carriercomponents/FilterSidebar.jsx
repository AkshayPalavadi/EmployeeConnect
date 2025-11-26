import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUserTie,
  FaGraduationCap,
  FaRupeeSign,
  FaTimesCircle,
} from "react-icons/fa";
import "./FilterSidebar.css";
import Select from "react-select";

const FilterSidebar = ({ updateFilters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState("All");
  const [salaryRange, setSalaryRange] = useState(150000);

  const handleUpdate = (key, value) => {
    updateFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleUpdate("searchTerm", e.target.value);
  };

  const handleCheckboxChange = (e, list, setList, key) => {
    const { checked, value } = e.target;
    const updatedList = checked
      ? [...list, value]
      : list.filter((v) => v !== value);

    setList(updatedList);
    handleUpdate(key, updatedList);
  };

  const handleEducationChange = (e) => {
    setEducation(e.target.value);
    handleUpdate("education", e.target.value); 
  };

  const handleSalaryChange = (e) => {
    const value = Number(e.target.value);
    setSalaryRange(value);
    handleUpdate("salaryRange", value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocation([]);
    setJobTypes([]);
    setExperiences([]);
    setEducation("All");
    setSalaryRange(150000);

    updateFilters({
      searchTerm: "",
      locations: [],
      jobTypes: [],
      experiences: [],
      education: "All",
      salaryRange:150000
    });
  };

  return (
    <aside className="sidebar-fs">
      {/* Search */}
      <div className="filter-section-fs">
        <h3><FaSearch className="filter-icon-fs" /> Search</h3>
        <input
          type="text"
          placeholder="Search by job title..."
          className="search-input-fs"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Location */}
      <div className="filter-section-fs">
        <h3><FaMapMarkerAlt className="filter-icon-fs" /> Location</h3>

        <Select
          options={[
            { value: "Hyderabad", label: "Hyderabad" },
            { value: "Chennai", label: "Chennai" },
            { value: "Bengaluru", label: "Bengaluru" },
            { value: "Pune", label: "Pune" },
            { value: "Mumbai", label: "Mumbai" },
            { value: "Delhi", label: "Delhi" },
          ]}
          value={location.map((loc) => ({ value: loc, label: loc }))}
          onChange={(selectedOptions) => {
            const values = selectedOptions ? selectedOptions.map((o) => o.value) : [];
            setLocation(values);
            handleUpdate("locations", values);
          }}
          isMulti
          isSearchable
          placeholder="Select cities..."
          className="react-select-location"
        />
      </div>

      {/* Job Type */}
      <div className="filter-section-fs">
        <h3><FaBriefcase className="filter-icon-fs" /> Job Type</h3>
        <ul>
          {["Full Time", "Intern", "Part Time", "Contract"].map((type) => (
            <li key={type}>
              <input
                type="checkbox"
                value={type}
                checked={jobTypes.includes(type)}
                onChange={(e) =>
                  handleCheckboxChange(e, jobTypes, setJobTypes, "jobTypes")
                }
              />
              {type}
            </li>
          ))}
        </ul>
      </div>

      {/* Experience */}
      <div className="filter-section-fs">
        <h3><FaUserTie className="filter-icon-fs" /> Experience Level</h3>
        <ul>
          {["Fresher", "1 Years", "2 Years", "3 Years", "4 Years", "5+ Years"].map((exp) => (
            <li key={exp}>
              <input
                type="checkbox"
                value={exp}
                checked={experiences.includes(exp)}
                onChange={(e) =>
                  handleCheckboxChange(
                    e,
                    experiences,
                    setExperiences,
                    "experiences"
                  )
                }
              />
              {exp}
            </li>
          ))}
        </ul>
      </div>

      {/* Education */}
      <div className="filter-section-fs">
        <h3><FaGraduationCap className="filter-icon-fs" /> Education</h3>
        <select
          className="dropdown-fs"
          value={education}
          onChange={handleEducationChange}
        >
          <option value="All">All</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
          <option value="B.Sc">B.Sc</option>
          <option value="MBA">MBA</option>
        </select>
      </div>

      {/* Salary */}
      <div className="filter-section-fs-fs">
        <h3>
          <FaRupeeSign className="filter-icon-fs" /> 
          Min Salary: {salaryRange >= 500000 ? "₹5,00,000+" : `₹${salaryRange.toLocaleString()}`}
        </h3>

        <input
          className="slider"
          type="range"
          min="150000"
          max="500000"
          step="50000"
          value={salaryRange}
          onChange={handleSalaryChange}
        />
      </div>

      {/* Clear */}
      <div className="filter-section-fs">
        <button className="clear-btn-fs" onClick={clearFilters}>
          <FaTimesCircle className="filter-icon-fs" /> Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;