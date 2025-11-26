import React, { useState } from "react";
import "./work.css";
const WorkExperienceForm = ({ experience, setExperience, errors,updateFormData }) => {
  const [experiences, setExperiences] = useState(
    experience.length
      ? experience
      : [
          {
            companyName: "",
            companyLocation: "",
            jobTitle: "",
            startDate: "",
            endDate: "",
            duration: "",
            roles: "",
            projects: "",
            skills: "",
            salary: "",
            
          },
        ]
  );

  const handleChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;

    // Auto-calc duration
    if (field === "startDate" || field === "endDate") {
      const start = new Date(updatedExperiences[index].startDate);
      const end = new Date(updatedExperiences[index].endDate);

      if (!isNaN(start) && !isNaN(end) && end >= start) {
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
          years--;
          months += 12;
        }

        updatedExperiences[index].duration =
          years > 0 && months > 0
            ? `${years} years ${months} months`
            : years > 0
            ? `${years} years`
            : `${months} months`;
      } else {
        updatedExperiences[index].duration = "";
      }
    }

    setExperiences(updatedExperiences);
    setExperience(updatedExperiences); // sync with parent
  };

  const handleFileChange = (index, field, file) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = file;
    setExperiences(updatedExperiences);
    setExperience(updatedExperiences); // sync with parent
  };

  const addExperience = () => {
  const newExperience = {
    companyName: "",
    companyLocation: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    duration: "",
    roles: "",
    projects: "",
    skills: "",
    salary: "",

  };

  const updatedExperiences = [...experiences, newExperience];
  setExperiences(updatedExperiences);
  setExperience(updatedExperiences); // 🔥 ensures parent sees latest data
  updateFormData("experiences", updatedExperiences); // 🔥 ensures validation will catch new empty fields
};


  const removeExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    setExperience(updatedExperiences); // sync after removal
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Work Experience</h1>
      <form className="experience-form">
        {experiences.map((exp, index) => (
          <div key={index} className="experience-card">
            <h2 className="section-title">
              {index === 0 ? "Current Company" : `Previous Company ${index}`}
            </h2>

            {/* Company Name */}
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                value={exp.companyName}
                onChange={(e) => {
  handleChange(index, "companyName", e.target.value);
  updateFormData(`experiences.${index}.companyName`, e.target.value);
}}

              />
              {errors?.[`experiences.${index}.companyName`] && (
                <p className="error-text">
                  {errors[`experiences.${index}.companyName`]}
                </p>
              )}
            </div>

            {/* Company Location */}
            <div className="form-group">
              <label>Company Location</label>
              <input
                type="text"
                value={exp.companyLocation}
                onChange={(e) =>{
                  handleChange(index, "companyLocation", e.target.value);
                  updateFormData(`experiences.${index}.companyLocation`, e.target.value);

                }}
              />
              {errors?.[`experiences.${index}.companyLocation`] && (
                <p className="error-text">
                  {errors[`experiences.${index}.companyLocation`]}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) =>{
                  handleChange(index, "jobTitle", e.target.value);
                    updateFormData(`experiences.${index}.jobTitle`, e.target.value);

                }}
              />
              {errors?.[`experiences.${index}.jobTitle`] && (
                <p className="error-text">
                  {errors[`experiences.${index}.jobTitle`]}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>{
                    handleChange(index, "startDate", e.target.value);
                      updateFormData(`experiences.${index}.startDate`, e.target.value);

                  }}
                />
                {errors?.[`experiences.${index}.startDate`] && (
                  <p className="error-text">
                    {errors[`experiences.${index}.startDate`]}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) =>{
                    handleChange(index, "endDate", e.target.value);
                      updateFormData(`experiences.${index}.endDate`, e.target.value);

                  }}
                />
                {errors?.[`experiences.${index}.endDate`] && (
                  <p className="error-text">
                    {errors[`experiences.${index}.endDate`]}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input type="text" value={exp.duration} disabled />
              </div>
            </div>

            {/* Roles */}
            <div className="form-group">
              <label>Roles & Responsibilities</label>
              <textarea
                value={exp.roles}
                onChange={(e) =>{
                   handleChange(index, "roles", e.target.value);
                     updateFormData(`experiences.${index}.roles`, e.target.value);

                  }}
              ></textarea>
              {errors?.[`experiences.${index}.roles`] && (
                <p className="error-text">
                  {errors[`experiences.${index}.roles`]}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="form-group">
              <label>Key Projects Worked</label>
              <textarea
                value={exp.projects}
                onChange={(e) =>{
                   handleChange(index, "projects", e.target.value);
                     updateFormData(`experiences.${index}.projects`, e.target.value);

                  }}

              ></textarea>
              {errors?.[`experiences.${index}.projects`] && (
                <p className="error-text">
                  {errors[`experiences.${index}.projects`]}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="form-group">
              <label>Skills & Technologies Used</label>
              <input
                type="text"
                value={exp.skills}
                onChange={(e) =>{
                   handleChange(index, "skills", e.target.value);
                     updateFormData(`experiences.${index}.skills`, e.target.value);


                }}
              />
              {errors?.[`experiences.${index}.skills`] && (
                <p className="error-text">
                  {errors[`experiences.${index}.skills`]}
                </p>
              )}
            </div>

            {/* Salary & Docs */}
            <div className="form-row">
              <div className="form-group">
                <label>Salary Details (Last Drawn CTC)</label>
                <input
                  type="text"
                  value={exp.salary}
                  onChange={(e) => {
                    handleChange(index, "salary", e.target.value);
                      updateFormData(`experiences.${index}.salary`, e.target.value);


                  }}
                />
                {errors?.[`experiences.${index}.salary`] && (
                  <p className="error-text">
                    {errors[`experiences.${index}.salary`]}
                  </p>
                )}
              </div>

              
              
              
            </div>

            


            {experiences.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeExperience(index)}
              >
                Remove This Experience
              </button>
            )}
          </div>
        ))}

        
      </form>
    </div>
  );
};

export default WorkExperienceForm;
