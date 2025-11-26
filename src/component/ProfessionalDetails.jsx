import React, { useState, useEffect } from "react";
import { simpleValidateProfessional } from "./validation";

const ProfessionalDetails = ({ data, setData, nextStep, prevStep }) => {
  const [localData, setLocalData] = useState({
    employeeId: data.employeeId || "",
    dateOfJoining: data.dateOfJoining || "",
    role: data.role || "",
    department: data.department || "",
    salary: data.salary || "",
    hasExperience: data.hasExperience || false,
    experiences: data.experiences || [],
  });

  const [localErrors, setLocalErrors] = useState({});

  const departments = [
    "Engineering",
    "Human Resources",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
    "IT Support",
    "Administration",
  ];

  // ✅ Keep parent data synced when localData changes
  useEffect(() => {
    setData(localData);
  }, [localData, setData]);

  // =========================
  // 🔹 Handle basic field change
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === "checkbox" ? checked : type === "file" ? files[0] : value;

    let updated = { ...localData, [name]: val };

    // Handle hasExperience toggle
    if (name === "hasExperience") {
      if (val) {
        // Add one empty experience if none exist
        if (updated.experiences.length === 0) {
          updated.experiences = [
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
              relivingLetter: null,
              salarySlips: null,
              hrName: "",
              hrEmail: "",
              hrPhone: "",
              managerName: "",
              managerEmail: "",
              managerPhone: "",
            },
          ];
        }
      } else {
        updated.experiences = [];
      }
    }

    setLocalData(updated);

    // Clear error for this field
    setLocalErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // =========================
  // 🔹 Handle Experience Change
  // =========================
  const handleExperienceChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const val = type === "file" ? files[0] : value;

    const newExperiences = [...localData.experiences];
    newExperiences[index][name] = val;

    // Auto calculate duration
    const start = new Date(newExperiences[index].startDate);
    const end = new Date(newExperiences[index].endDate);
    if (!isNaN(start) && !isNaN(end) && end > start) {
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

    // ✅ Clear only this specific experience field error
    setLocalErrors((prev) => ({ ...prev, [`${name}_${index}`]: "" }));
  };

  // =========================
  // 🔹 Add / Remove experience
  // =========================
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
          relivingLetter: null,
          salarySlips: null,
          hrName: "",
          hrEmail: "",
          hrPhone: "",
          managerName: "",
          managerEmail: "",
          managerPhone: "",
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    const updated = localData.experiences.filter((_, i) => i !== index);
    setLocalData((prev) => ({ ...prev, experiences: updated }));
  };

  // =========================
  // ✅ Next Button (final fix)
  // =========================
  const next = () => {
    console.log("DEBUG localData before validation:", localData);

    const errs = simpleValidateProfessional(localData);
    console.log("DEBUG validation output:", errs);

    setLocalErrors({ ...errs }); // ensures re-render

    // ✅ Move to next immediately if no errors
    if (Object.keys(errs).length === 0) {
      nextStep();
    }
  };

  const prev = () => prevStep();

  // =========================
  // 🔹 UI
  // =========================
  return (
    <div className="form-wrap">
      {/* <h3>Professional Details</h3> */}

      <div className="form-grid">
        <div className="field">
          <label>Employee ID <span className="required-star">*</span></label>
          <input name="employeeId" value={localData.employeeId} onChange={handleChange} />
          {localErrors.employeeId && <small className="err">{localErrors.employeeId}</small>}
        </div>

        <div className="field">
          <label>Date of Joining <span className="required-star">*</span></label>
          <input type="date" name="dateOfJoining" value={localData.dateOfJoining} onChange={handleChange} />
          {localErrors.dateOfJoining && <small className="err">{localErrors.dateOfJoining}</small>}
        </div>

        <div className="field">
          <label>Role <span className="required-star">*</span></label>
          <input name="role" value={localData.role} onChange={handleChange} />
          {localErrors.role && <small className="err">{localErrors.role}</small>}
        </div>

        <div className="field">
          <label>Department <span className="required-star">*</span></label>
          <select name="department" value={localData.department} onChange={handleChange}>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {localErrors.department && <small className="err">{localErrors.department}</small>}
        </div>

        
      </div>

      <div className="field checkbox-field">
        <label style={{marginTop:"10px"}}>
          <input
            type="checkbox"
            name="hasExperience"
            checked={localData.hasExperience}
            onChange={handleChange}
          />
          &nbsp;  Experienced?
        </label>
      </div>

      {localData.hasExperience && (
        <div>
          {localData.experiences.map((exp, index) => (
            <div key={index} className="experience-block">
              {index===0 ?<h4> Current Comapany Experience</h4>  :
                            <h4>Previous Company Experience {index}</h4>

}
              <div className="form-grid">
                {[
                  ["companyName", "Company Name"],
                  ["companyLocation", "Company Location"],
                  ["jobTitle", "Job Title"],
                  ["startDate", "Start Date", "date"],
                  ["endDate", "End Date", "date"],
                  ["duration","duration"],
                  ["roles", "Roles & Responsibilities", "textarea"],
                  ["projects", "Projects", "textarea"],
                  ["skills", "Skills"],
                  ["salary", "Salary"],
                  ["hrName", "HR Name"],
                  ["hrEmail", "HR Email"],
                  ["hrPhone", "HR Phone"],
                  ["managerName", "Manager Name"],
                  ["managerEmail", "Manager Email"],
                  ["managerPhone", "Manager Phone"],
                ].map(([field, label, type = "text"]) => (
                  <div key={field} className="field">
                    <label>{label} <span className="required-star">*</span></label>
                    {type === "textarea" ? (
                      <textarea
                        name={field}
                        value={exp[field]}
                        onChange={(e) => handleExperienceChange(index, e)}
                      />
                    ) : (
                      <input
                        type={type}
                        name={field}
                        value={exp[field]}
                        onChange={(e) => handleExperienceChange(index, e)}
                      />
                    )}
                    {localErrors[`${field}_${index}`] && (
                      <small className="err">{localErrors[`${field}_${index}`]}</small>
                    )}
                  </div>
                ))}

                {index===0 ? <div className="field">
                  <label>OfferLetter (PDF) <span className="required-star">*</span></label>
                  <input
                    type="file"
                    accept=".pdf"
                    name="offerLetter"
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {localErrors[`offerLetter_${index}`] && (
                    <small className="err">{localErrors[`offerLetter_${index}`]}</small>
                  )}
                </div> : <div className="field">
                  <label>Reliving Letter (PDF) <span className="required-star">*</span></label>
                  <input
                    type="file"
                    accept=".pdf"
                    name="relivingLetter"
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {localErrors[`relivingLetter_${index}`] && (
                    <small className="err">{localErrors[`relivingLetter_${index}`]}</small>
                  )}
                </div>}

                <div className="field">
                  <label>Salary Slips (PDF) <span className="required-star">*</span></label>
                  <input
                    type="file"
                    accept=".pdf"
                    name="salarySlips"
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {localErrors[`salarySlips_${index}`] && (
                    <small className="err">{localErrors[`salarySlips_${index}`]}</small>
                  )}
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
        <button className="btn secondary" onClick={prev}>
          Back
        </button>
        <button className="btn primary" onClick={next}>
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
};

export default ProfessionalDetails;
