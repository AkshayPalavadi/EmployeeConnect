import React from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import "./JobList.css";

const jobs = [
  { id: 1, title: "Frontend Developer", category: "Software IT", experience: "2 Years", education: "B.Tech", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Full Time" },
  { id: 2, title: "Content Writer", category: "Media", experience: "1 Year", education: "B.Sc", salary: "₹3,00,000 - ₹4,00,000", location: "Bengaluru", jobType: "Part Time" },
  { id: 3, title: "Backend Developer", category: "Software IT", experience: "3 Years", education: "B.Tech", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Full Time" },
  { id: 4, title: "Web Developer", category: "Software IT", experience: "1 Year", education: "M.Tech", salary: "₹3,50,000 - ₹5,00,000", location: "Chennai", jobType: "Full Time" },
  { id: 5, title: "UI/UX Designer", category: "Design", experience: "2 Years", education: "MBA", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Part Time" },
  { id: 6, title: "Python Developer", category: "Software IT", experience: "4 Years", education: "B.Tech", salary: "₹4,00,000 - ₹6,00,000", location: "Hyderabad", jobType: "Full Time" },
];

const JobList = ({ filters = {} }) => {
  const {
  searchTerm = "",
  locations = [],
  jobTypes = [],
  experiences = [],
  education = "All",
  salaryRange = 150000,
} = filters;


  const navigate = useNavigate();

  // Convert salary string → number (min salary)
  const extractMinSalary = (salaryStr) => {
    const clean = salaryStr.replace(/[₹,]/g, "");
    return parseInt(clean.split(" - ")[0]);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locations.length === 0 || locations.includes(job.location);
    const matchesJobType = jobTypes.length === 0 || jobTypes.includes(job.jobType);

    // normalize both sides (1 Year === 1 Years)
    const matchesExperience =
      experiences.length === 0 ||
      experiences.some((exp) =>
        job.experience.toLowerCase().startsWith(exp.toLowerCase())
      );

    const matchesEducation =
      education === "All" || job.education === education;


    const matchesSalary =
      salaryRange === 0 ||
      extractMinSalary(job.salary) >= salaryRange;



    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesExperience &&
      matchesEducation &&
      matchesSalary
    );
  });


 


console.log("filteredJObs",filteredJobs)
 



  return (
    <div className="joblist">
      {filteredJobs.length > 0 ? (
        <>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </>
      ) : (
        <p className="no-jobs">No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;
