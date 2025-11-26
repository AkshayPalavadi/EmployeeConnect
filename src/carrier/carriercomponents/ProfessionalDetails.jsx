// import React, { useState, useEffect } from 'react';
// import { simpleValidateProfessional } from './validation';

// const ProfessionalDetails = ({ data, setData, setActive, errors, setErrors }) => {
//   const [localData, setLocalData] = useState(data);

//   // Initialize default experience when jobType = "experience"
//   useEffect(() => {
//     if (localData.jobType === 'experience' && localData.experiences.length === 0) {
//       setLocalData((prev) => ({
//         ...prev,
//         experiences: [
//           {
//             companyName: "",
//             companyLocation: "",
//             jobTitle: "",
//             startDate: "",
//             endDate: "",
//             duration: "",
//             roles: "",
//             projects: "",
//             skills: "",
//             salary: "",
//           },
//         ],
//       }));
//     }
//   }, [localData.jobType]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleExperienceChange = (index, e) => {
//   const { name, value } = e.target;
//   const newExperiences = [...localData.experiences];
//   newExperiences[index][name] = value;

//   // --- Auto-calculate duration when both dates are present ---
//   const start = new Date(newExperiences[index].startDate);
//   const end = new Date(newExperiences[index].endDate);

//   if (start && end && !isNaN(start) && !isNaN(end) && end > start) {
//     const diffYears = end.getFullYear() - start.getFullYear();
//     const diffMonths = end.getMonth() - start.getMonth();
//     let years = diffYears;
//     let months = diffMonths;

//     if (months < 0) {
//       years -= 1;
//       months += 12;
//     }

//     const durationStr =
//       years > 0 && months > 0
//         ? `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`
//         : years > 0
//         ? `${years} year${years > 1 ? "s" : ""}`
//         : `${months} month${months > 1 ? "s" : ""}`;

//     newExperiences[index].duration = durationStr;
//   } else {
//     newExperiences[index].duration = "";
//   }

//   setLocalData((prev) => ({ ...prev, experiences: newExperiences }));
// };


//   const addExperience = () => {
//     setLocalData((prev) => ({
//       ...prev,
//       experiences: [
//         ...prev.experiences,
//         {
//           companyName: "",
//           companyLocation: "",
//           jobTitle: "",
//           startDate: "",
//           endDate: "",
//           duration: "",
//           roles: "",
//           projects: "",
//           skills: "",
//           salary: "",
//         },
//       ],
//     }));
//   };

//   const removeExperience = (index) => {
//     const updated = localData.experiences.filter((_, i) => i !== index);
//     setLocalData((prev) => ({ ...prev, experiences: updated }));
//   };

//   const next = () => {
//     const errs = simpleValidateProfessional(localData);
//     setErrors(errs);
//     if (Object.keys(errs).length === 0) {
//       setData(localData);
//       setActive('review');
//     }
//   };

//   return (
//     <div className="form-wrap">
//       <h3>Professional Details</h3>

//       {/* Radio Selection */}
//       <div className="radio-group-job">
//         <label>
//           <input
//             type="radio"
//             name="jobType"
//             value="fresher"
//             checked={localData.jobType === "fresher"}
//             onChange={handleChange}
//           />
//           Fresher
//         </label>
//         <label>
//           <input
//             type="radio"
//             name="jobType"
//             value="experience"
//             checked={localData.jobType === "experience"}
//             onChange={handleChange}
//           />
//           Experience
//         </label>
//       </div>

//       {/* Fresher Form */}
//       {localData.jobType === "fresher" && (
//         <div className="form-grid">
//           <div className="field">
//             <label>Resume (PDF)*</label>
//             <input
//               type="file"
//               accept=".pdf"
//               name="resume"
//               onChange={(e) => handleChange({ target: { name: 'resume', value: e.target.files[0] } })}
//             />
//             {errors.resume && <small className="err">{errors.resume}</small>}
//           </div>

//           <div className="field full">
//             <label>Skills *</label>
//             <input name="skills" value={localData.skills} onChange={handleChange} />
//             {errors.skills && <small className="err">{errors.skills}</small>}
//           </div>

//           <div className="field full">
//             <label>Projects *</label>
//             <textarea name="projects" value={localData.projects} onChange={handleChange} />
//           </div>

//           <div className="field full">
//             <label>LinkedIn Profile *</label>
//             <input name="linkedin" value={localData.linkedin} onChange={handleChange} />
//           </div>

//           <div className="field full">
//             <label>Certifications</label>
//             <input name="certifications" value={localData.certifications} onChange={handleChange} />
//           </div>

//           <div className="field full">
//             <label>Achievements</label>
//             <input name="achievements" value={localData.achievements} onChange={handleChange} />
//           </div>
//         </div>
//       )}

//       {/* Experience Form */}
//       {localData.jobType === "experience" && (
//         <div>
//           {localData.experiences.map((exp, index) => (
//             <div key={index} className="experience-block">
//               <h4>Experience {index + 1}</h4>
//               <div className="form-grid">
//                 <div className="field">
//                   <label>Company Name *</label>
//                   <input
//                     name="companyName"
//                     value={exp.companyName}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field">
//                   <label>Company Location</label>
//                   <input
//                     name="companyLocation"
//                     value={exp.companyLocation}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field">
//                   <label>Job Title *</label>
//                   <input
//                     name="jobTitle"
//                     value={exp.jobTitle}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field">
//                   <label>Start Date *</label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={exp.startDate}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field">
//                   <label>End Date *</label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={exp.endDate}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field">
//                   <label>Duration</label>
//                   <input
//   name="duration"
//   value={exp.duration}
//   readOnly
//   placeholder="Auto-calculated from dates"
// />

//                 </div>

//                 <div className="field full">
//                   <label>Roles & Responsibilities</label>
//                   <textarea
//                     name="roles"
//                     value={exp.roles}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field full">
//                   <label>Projects</label>
//                   <textarea
//                     name="projects"
//                     value={exp.projects}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field">
//                   <label>Skills *</label>
//                   <input
//                     name="skills"
//                     value={exp.skills}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>

//                 <div className="field">
//                   <label>Salary</label>
//                   <input
//                     name="salary"
//                     value={exp.salary}
//                     onChange={(e) => handleExperienceChange(index, e)}
//                   />
//                 </div>
//               </div>

//               {/* Remove Button */}
//               {localData.experiences.length > 1 && (
//                 <button
//                   type="button"
//                   className="btn remove"
//                   onClick={() => removeExperience(index)}
//                 >
//                  Remove Experience
//                 </button>
//               )}
//             </div>
//           ))}

//           {/* Add More Button */}
//           <div className="add-exp-btn-wrap">
//             <button type="button" className="btn add" onClick={addExperience}>
//              Add More Experience
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <div className="form-actions">
//         <button className="btn secondary" onClick={() => setActive('education')}>Back</button>
//         <button className="btn primary_app" onClick={next}>Next: Review & Submit</button>
//       </div>
//     </div>
//   );
// };

// export default ProfessionalDetails;









import React, { useState, useEffect } from 'react';

const ProfessionalDetails = ({ data, setData, setActive, errors, setErrors }) => {
  const [localData, setLocalData] = useState(data);
  const [resumeError, setResumeError] = useState('');
  console.log("",errors

  )

  useEffect(() => {
    if (localData.jobType === 'experience' && localData.experiences.length === 0) {
      setLocalData((prev) => ({
        ...prev,
        experiences: [
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
            resume: null,
          },
        ],
      }));
    }
  }, [localData.jobType]);

  const handleAlphabeticChange = (e) => {
    const { name, value } = e.target;
    const alphaOnly = value.replace(/[^A-Za-z\s,]/g, '');
    setLocalData((prev) => ({ ...prev, [name]: alphaOnly }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ✅ Resume file upload validation (used for both Fresher and Experience)
  const handleResumeUpload = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!validTypes.includes(file.type)) {
      setResumeError('Invalid file format. Please upload PDF or DOC/DOCX.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setResumeError('File size must be less than 3MB.');
      return;
    }

   

    if (localData.jobType === 'experience' && index !== null) {
      const newExperiences = [...localData.experiences];
      newExperiences[index].resume = file;
      setLocalData((prev) => ({ ...prev, experiences: newExperiences }));
    } else {
      setLocalData((prev) => ({ ...prev, resume: file }));
    }
    setResumeError('');
    setErrors(prev=> ({...prev, resume:""}))
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperiences = [...localData.experiences];

    const alphaFields = ['companyName', 'companyLocation', 'jobTitle', 'roles', 'projects', 'skills'];
    newExperiences[index][name] = alphaFields.includes(name)
      ? value.replace(/[^A-Za-z\s,]/g, '')
      : value;

    const start = new Date(newExperiences[index].startDate);
    const end = new Date(newExperiences[index].endDate);

    if (start && end && !isNaN(start) && !isNaN(end) && end > start) {
      const diffYears = end.getFullYear() - start.getFullYear();
      const diffMonths = end.getMonth() - start.getMonth();
      let years = diffYears;
      let months = diffMonths;

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const durationStr =
        years > 0 && months > 0
          ? `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`
          : years > 0
          ? `${years} year${years > 1 ? "s" : ""}`
          : `${months} month${months > 1 ? "s" : ""}`;

      newExperiences[index].duration = durationStr;
    } else {
      newExperiences[index].duration = "";
    }

    setLocalData((prev) => ({ ...prev, experiences: newExperiences }));
    setErrors((prev) => ({ ...prev, [`${name}_${index}`]: "" }));
  };

  const addExperience = () => {
    setLocalData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
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
          resume: null,
        },
      ],
    }));
  };

  const handleSalaryChange = (index, e) => {
  let value = e.target.value;

  // Allow only digits and commas while typing
  value = value.replace(/[^0-9,]/g, "");

  // Prevent leading comma
  if (value.startsWith(",")) {
    value = value.substring(1);
  }

  // Prevent multiple commas together
  value = value.replace(/,{2,}/g, ",");

  // Prevent leading zero unless value is "0"
  if (value.length > 1 && value.startsWith("0")) {
    value = value.replace(/^0+/, "");
  }

  const newExperiences = [...localData.experiences];
  newExperiences[index].salary = value;

  setLocalData(prev => ({ ...prev, experiences: newExperiences }));
  setErrors(prev => ({ ...prev, [`salary_${index}`]: "" }));
};


  const removeExperience = (index) => {
    const updated = localData.experiences.filter((_, i) => i !== index);
    setLocalData((prev) => ({ ...prev, experiences: updated }));
  };

  const next = () => {
    const errs = {};

    if (localData.jobType === 'fresher') {
      if (!localData.resume.name) errs.resume = 'This field is required';
      if (!localData.skills?.trim()) errs.skills = 'This field is required';
      if (!localData.projects?.trim()) errs.projects = 'This field is required';
      if (!localData.certifications?.trim()) errs.certifications = 'This field is required';
      // if (!localData.achievements?.trim()) errs.achievements = 'This field is required';
    }

    if (localData.jobType === 'experience') {
      localData.experiences.forEach((exp, i) => {
        if (!exp.companyName.trim()) errs[`companyName_${i}`] = 'This field is required';
        if (!exp.companyLocation.trim()) errs[`companyLocation_${i}`] = 'This field is required';
        if (!exp.jobTitle.trim()) errs[`jobTitle_${i}`] = 'This field is required';
         if (!exp.startDate.trim()) errs[`startDate_${i}`] = 'This field is required';
        if (!exp.endDate.trim()) errs[`endDate_${i}`] = 'This field is required';
        if (!exp.roles.trim()) errs[`roles_${i}`] = 'This field is required';
        // if (!exp.duration.trim()) errs[`duration_${i}`] = 'This field is required';
        if (!exp.projects.trim()) errs[`projects_${i}`] = 'This field is required';
        if (!exp.skills.trim()) errs[`skills_${i}`] = 'This field is required';
        if (!exp.salary.trim()) errs[`salary_${i}`] = 'This field is required';
        if (!exp.resume?.name) errs[`resume_${i}`] = 'This field is required';
      });
    }

    setErrors(errs);

    if (Object.keys(errs).length === 0 && !resumeError) {
      setData(localData);
      setActive('review');
    }
  };

  console.log(localData)
  return (
    <div className="form-wrap">
      <h3>Professional Details</h3>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="jobType"
            value="fresher"
            checked={localData.jobType === "fresher"}
            onChange={handleChange}
          />
          Fresher
        </label>
        <label>
          <input
            type="radio"
            name="jobType"
            value="experience"
            checked={localData.jobType === "experience"}
            onChange={handleChange}
          />
          Experience
        </label>
      </div>

      {/* ✅ Fresher Section */}
      {localData.jobType === "fresher" && (
        <div className="form-grid">
          <div className="field full">
            <label>Upload Resume *</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            {(errors.resume || resumeError) && (
              <small className="err">{errors.resume || resumeError}</small>
            )}
          </div>

          <div className="field full">
            <label>Skills *</label>
            <input name="skills" value={localData.skills} onChange={handleAlphabeticChange} />
            {errors.skills && <small className="err">{errors.skills}</small>}
          </div>

          <div className="field full">
            <label>Projects *</label>
            <textarea name="projects" value={localData.projects} onChange={handleAlphabeticChange} />
            {errors.projects && <small className="err">{errors.projects}</small>}
          </div>

          <div className="field full">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              placeholder="https://linkedin.com/in/yourprofile"
              value={localData.linkedin || ""}
              onChange={handleChange}
            />
          </div>

          <div className="field full">
            <label>Certifications *</label>
            <input name="certifications" value={localData.certifications} onChange={handleAlphabeticChange} />
            {errors.certifications && <small className="err">{errors.certifications}</small>}
          </div>

          <div className="field full">
            <label>Achievements </label>
            <input name="achievements" value={localData.achievements} onChange={handleAlphabeticChange} />
            {errors.achievements && <small className="err">{errors.achievements}</small>}
          </div>
        </div>
      )}

      {/* ✅ Experience Section */}
      {localData.jobType === "experience" && (
        <div>
          {localData.experiences.map((exp, index) => (
            <div key={index} className="experience-block">
              <h4>Experience {index + 1}</h4>
              <div className="form-grid">
                <div className="field">
                  <label>Company Name *</label>
                  <input name="companyName" value={exp.companyName} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`companyName_${index}`] && <small className="err">{errors[`companyName_${index}`]}</small>}
                </div>

                <div className="field">
                  <label>Company Location *</label>
                  <input name="companyLocation" value={exp.companyLocation} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`companyLocation_${index}`] && <small className="err">{errors[`companyLocation_${index}`]}</small>}
                </div>

                <div className="field">
                  <label>Job Title *</label>
                  <input name="jobTitle" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`jobTitle_${index}`] && <small className="err">{errors[`jobTitle_${index}`]}</small>}
                </div>
                  <div className="field">
                  <label>start Date *</label>
                  <input type="date" name="startDate" value={exp.startDate} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`startDate_${index}`] && <small className="err">{errors[`startDate_${index}`]}</small>}
                </div>
                <div className="field">
                  <label>End Date *</label>
                  <input type="date" name="endDate" value={exp.endDate} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`endDate_${index}`] && <small className="err">{errors[`endDate_${index}`]}</small>}
                </div>

                <div className="field full">
                  <label>Roles & Responsibilities *</label>
                  <textarea name="roles" value={exp.roles} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`roles_${index}`] && <small className="err">{errors[`roles_${index}`]}</small>}
                </div>

                <div className="field">
                  <label>Duration *</label>
                  <input name="duration" value={exp.duration} readOnly />
                  {errors[`duration_${index}`] && <small className="err">{errors[`duration_${index}`]}</small>}
                </div>

                {/* ✅ Resume upload (experience) */}
                <div className="field ">
                  <label>Upload Resume *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleResumeUpload(e, index)}
                  />
                  {(errors[`resume_${index}`] || resumeError) && (
                    <small className="err">{errors[`resume_${index}`] || resumeError}</small>
                  )}
                </div>
               

                <div className="field full">
                  <label>Projects *</label>
                  <textarea name="projects" value={exp.projects} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`projects_${index}`] && <small className="err">{errors[`projects_${index}`]}</small>}
                </div>

                <div className="field">
                  <label>Skills *</label>
                  <input name="skills" value={exp.skills} onChange={(e) => handleExperienceChange(index, e)} />
                  {errors[`skills_${index}`] && <small className="err">{errors[`skills_${index}`]}</small>}
                </div>

                <div className="field">
                  <label>Salary *</label>
              <input
  name="salary"
  value={exp.salary}
  onChange={(e) => handleSalaryChange(index, e)}
  placeholder="Enter salary (digits & commas only)"
/>
{errors[`salary_${index}`] && <small className="err">{errors[`salary_${index}`]}</small>}

                </div>
              </div>

              {localData.experiences.length > 1 && (
                <button type="button" className="btn remove" onClick={() => removeExperience(index)}>
                  Remove Experience
                </button>
              )}
            </div>
          ))}

          <div className="add-exp-btn-wrap">
            <button type="button" className="btn add" onClick={addExperience}>
              Add More Experience
            </button>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn secondary" onClick={() => setActive('education')}>
          Back
        </button>
        <button className="btn primary_app" onClick={next}>
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
};

export default ProfessionalDetails;