import React, { useState } from "react";
import "./AppliedJobList.css";

const AppliedJobList = () => {
  const [appliedJobs] = useState([
    { title: "Fronend Developer", type: "Full Time", date: "12/06/2022", category: "Technology" },
    { title: "Web Developer", type: "Internship", date: "12/06/2022", category: "Technology" },
    { title: "UI/UX Design", type: "Part time", date: "12/06/2022", category: "Technology" },
    { title: "Content Writer", type: "Full Time", date: "12/06/2022", category: "Technology" },
  ]);

  return (
    <div className="applied-job-container">
      <h3 className="applied-job-title">My Applied Job List</h3>

      <table className="applied-job-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Job Type</th>
            <th>Applied Date</th>
            <th>Job Category</th>
          </tr>
        </thead>

        <tbody>
          {appliedJobs.map((job, index) => (
            <tr key={index}>
              <td>{job.title}</td>
              <td>{job.type}</td>
              <td>{job.date}</td>
              <td>{job.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJobList;