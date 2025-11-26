import React, { useState } from "react";
import Header from "../carriercomponents/Header";
import FilterSidebar from "../carriercomponents/FilterSidebar";
import JobList from "./JobList";
import "./Job.css"; // make sure you have layout styling

const Job = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    locations: [],
    jobTypes: [],
    experiences: [],
    education: [],
    maxSalary: 0,
  });

  return (
    <div>
      <Header />
      <div className="main-container-job">
        {/* ✅ One single FilterSidebar */}
        <FilterSidebar updateFilters={setFilters} />

        {/* ✅ JobList gets filters */}
        <JobList filters={filters} />
      </div>
    </div>
  );
};

export default Job;
