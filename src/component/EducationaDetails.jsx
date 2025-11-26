import React, { useState } from "react";
import { simpleValidateEducation } from "./validation";
import "./indexApp.css";

const EducationDetails = ({
  data,
  setData,
  setActive,
  nextStep,
  prevStep,
  errors,
  setErrors,
}) => {
  const years = Array.from({ length: 2025 - 1960 + 1 }, (_, i) => 2025 - i);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Fields that should only accept letters and spaces
    const nameFields = [
      "schoolName10",
      "collegeName12",
      "collegeNameUG",
      "collegeNameMTech",
      "courseName",
      "institueName"
    ];

    if (nameFields.includes(name)) {
      // Allow only letters and spaces — filter out numbers and symbols
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
      setData((prev) => ({ ...prev, [name]: lettersOnly }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear existing error message for the field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGapReasonChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // File upload validation
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          [field]: "Only PDF files are allowed",
        }));
        setData((prev) => ({ ...prev, [field]: null }));
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File size must be below 3MB",
        }));
        setData((prev) => ({ ...prev, [field]: null }));
        return;
      }
      setData((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const next = () => {
    const errs = simpleValidateEducation(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      nextStep();
    }
  };

  const prev = () => prevStep();

  return (
    <div className="form-wrap">
      {/* <h3>Education Details</h3> */}

      <div className="form-grid">
        {/* ---------- 10th Class ---------- */}
      
        <div className="field full">
          <h4>10th Class</h4>
        </div>

        <div className="field">
          <label>
            School Name <span className="required-star">*</span>
          </label>
          <input
            name="schoolName10"
            value={data.schoolName10 || ""}
            onChange={handleChange}
          />
          {errors.schoolName10 && (
            <small className="err">{errors.schoolName10}</small>
          )}
        </div>

        <div className="field">
          <label>
            Year of Passing <span className="required-star">*</span>
          </label>
          <select
            name="year10"
            value={data.year10 || ""}
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {errors.year10 && <small className="err">{errors.year10}</small>}
        </div>

        <div className="field">
          <label>
            CGPA / Percentage <span className="required-star">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="cgpa10"
            value={data.cgpa10 || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData((prev) => ({ ...prev, cgpa10: value }));
                setErrors((prev) => ({ ...prev, cgpa10: "" }));
              }
            }}
            placeholder="Enter CGPA or %"
          />
          {errors.cgpa10 && <small className="err">{errors.cgpa10}</small>}
        </div>

        {/* 10th Certificate */}
        <div className="field ">
          <label>
            10th Certificate (PDF, max 3MB){" "}
            <span className="required-star">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileUpload(e, "certificate10")}
          />
          {errors.certificate10 && (
            <small className="err">{errors.certificate10}</small>
          )}
        </div>

        {/* ---------- Intermediate / Diploma ---------- */}
        <div className="field full ">
          <h4>Intermediate / Diploma</h4>
        </div>

        <div className="field">
          <label>
            Choose <span className="required-star">*</span>
          </label>
          <select
            name="interOrDiploma"
            value={data.interOrDiploma || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Diploma">Diploma</option>
          </select>
          {errors.interOrDiploma && (
            <small className="err">{errors.interOrDiploma}</small>
          )}
        </div>

        <div className="field">
          <label>
            College Name <span className="required-star">*</span>
          </label>
          <input
            name="collegeName12"
            value={data.collegeName12 || ""}
            onChange={handleChange}
          />
          {errors.collegeName12 && (
            <small className="err">{errors.collegeName12}</small>
          )}
        </div>

        <div className="field">
          <label>
            Year of Passing <span className="required-star">*</span>
          </label>
          <select
            name="year12"
            value={data.year12 || ""}
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {errors.year12 && <small className="err">{errors.year12}</small>}
        </div>

        <div className="field">
          <label>
            CGPA / Percentage <span className="required-star">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="cgpa12"
            value={data.cgpa12 || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData((prev) => ({ ...prev, cgpa12: value }));
                setErrors((prev) => ({ ...prev, cgpa12: "" }));
              }
            }}
            placeholder="Enter CGPA or %"
          />
          {errors.cgpa12 && <small className="err">{errors.cgpa12}</small>}
        </div>

        {/* Intermediate Certificate */}
        <div className="field ">
          <label>
            Intermediate / Diploma Certificate (PDF, max 3MB){" "}
            <span className="required-star">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileUpload(e, "certificate12")}
          />
          {errors.certificate12 && (
            <small className="err">{errors.certificate12}</small>
          )}
        </div>

        {/* Gap Reason */}
        {errors.gapReason12 && (
          <div className="field full">
            <label>
              Reason for Gap <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="gapReason12"
              value={data.gapReason12 || ""}
              onChange={handleGapReasonChange}
              placeholder="Explain your gap after 10th"
            />
            {errors.gapReason12 && (
              <small className="err">{errors.gapReason12}</small>
            )}
          </div>
        )}

        {/* ---------- UG ---------- */}
        <div className="field full">
          <h4>B.Tech / Degree</h4>
        </div>

        <div className="field">
          <label>
            College Name <span className="required-star">*</span>
          </label>
          <input
            name="collegeNameUG"
            value={data.collegeNameUG || ""}
            onChange={handleChange}
          />
          {errors.collegeNameUG && (
            <small className="err">{errors.collegeNameUG}</small>
          )}
        </div>

        <div className="field">
          <label>
            Year of Passing <span className="required-star">*</span>
          </label>
          <select
            name="yearUG"
            value={data.yearUG || ""}
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {errors.yearUG && <small className="err">{errors.yearUG}</small>}
        </div>

        <div className="field">
          <label>
            CGPA / Percentage <span className="required-star">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="cgpaUG"
            value={data.cgpaUG || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData((prev) => ({ ...prev, cgpaUG: value }));
                setErrors((prev) => ({ ...prev, cgpaUG: "" }));
              }
            }}
            placeholder="Enter CGPA or %"
          />
          {errors.cgpaUG && <small className="err">{errors.cgpaUG}</small>}
        </div>

        {/* UG Certificate */}
        <div className="field ">
          <label>
            B.Tech / Degree Certificate (PDF, max 3MB){" "}
            <span className="required-star">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileUpload(e, "certificateUG")}
          />
          {errors.certificateUG && (
            <small className="err">{errors.certificateUG}</small>
          )}
        </div>

        {/* Gap Reason for UG */}
        {errors.gapReasonUG && (
          <div className="field full">
            <label>
              Reason for Gap <span className="required-star">*</span>
            </label>
            <input
              name="gapReasonUG"
              value={data.gapReasonUG || ""}
              onChange={handleGapReasonChange}
              placeholder="Explain your gap before Degree"
            />
            {errors.gapReasonUG && (
              <small className="err">{errors.gapReasonUG}</small>
            )}
          </div>
        )}

        {/* ---------- M.Tech / ISM Tech ---------- */}
        {/* ---------- M.Tech / ISM Tech ---------- */}
        <div className="field full">
          <h4>PostGraduation</h4>
        </div>

        <div className="field checkbox-field">
          <label>
            <input
              type="checkbox"
              name="hasPG"
              checked={data.hasPG || false}
              onChange={(e) =>
                setData((prev) => ({ ...prev, hasPG: e.target.checked }))
              }
            />
            &nbsp; hasPG
          </label>
        </div>

        {data.hasPG && (
          <>
            <div className="field full">
              <label>
                College Name <span className="required-star">*</span>
              </label>
              <input
                name="collegeNameMTech"
                value={data.collegeNameMTech || ""}
                onChange={handleChange}
              />
              {errors.collegeNameMTech && (
                <small className="err">{errors.collegeNameMTech}</small>
              )}
            </div>

            <div className="field">
              <label>
                Year of Passing <span className="required-star">*</span>
              </label>
              <select
                name="yearMTech"
                value={data.yearMTech || ""}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.yearMTech && (
                <small className="err">{errors.yearMTech}</small>
              )}
            </div>
            <div className="field">
              <label>
                CGPA / Percentage <span className="required-star">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="cgpaPG"
                value={data.cgpaMTech || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (/^\d*\.?\d*$/.test(value) && value <= 100)
                  ) {
                    setData((prev) => ({ ...prev, cgpaMTech: value }));
                    setErrors((prev) => ({ ...prev, cgpaMTech: "" }));
                  }
                }}
                placeholder="Enter CGPA or %"
              />
              {errors.cgpaUG && <small className="err">{errors.cgpaUG}</small>}
            </div>

            <div className="field ">
              <label>
                M.Tech / ISM Tech Certificate (PDF, max 3MB){" "}
                <span className="required-star">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e, "certificateMTech")}
              />
              {errors.certificateMTech && (
                <small className="err">{errors.certificateMTech}</small>
              )}
            </div>
          </>
        )}
        <div className="field full">
          <h4>CourseCertifications</h4>
        </div>

        <div className="field checkbox-field">
          <label>
            <input
              type="checkbox"
              name="hasCourse"
              checked={data.hasCourse || false}
              onChange={(e) =>
                setData((prev) => ({ ...prev, hasCourse: e.target.checked }))
              }
            />
            &nbsp; hasCourse
          </label>
        </div>

        {data.hasCourse && (
          <>
            <div className="field full">
              <label>
                CourseName <span className="required-star">*</span>
              </label>
              <input
                name="courseName"
                value={data.courseName || ""}
                onChange={handleChange}
              />
              {errors.courseName && (
                <small className="err">{errors.courseName }</small>
              )}
            </div>
            <div className="field">
              <label>
                  InstitueName <span className="required-star">*</span>
              </label>
              <input
                name="institueName"
                value={data.institueName || ""}
                onChange={handleChange}
              />
              {errors.institueName && (
                <small className="err">{errors.institueName }</small>
              )}
            </div>
            <div className="field">
              <label>
                Course Duration <span className="required-star">*</span>
              </label>
              <input
                name="courseDuration"
                value={data.courseDuration || ""}
                onChange={handleChange}
              />
              {errors.courseDuration && (
                <small className="err">{errors.courseDuration }</small>
              )}
            </div>
               
            <div className="field">
              <label>
                Year of Passing <span className="required-star">*</span>
              </label>
              <select
                name="yearCourse"
                value={data.yearCourse || ""}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.yearCourse && (
                <small className="err">{errors.yearCourse}</small>
              )}
            </div>
            <div className="field">
              <label>
                CGPA / Percentage <span className="required-star">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="cgpaCourse"
                value={data.cgpaCourse || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (/^\d*\.?\d*$/.test(value) && value <= 100)
                  ) {
                    setData((prev) => ({ ...prev, cgpaCourse: value }));
                    setErrors((prev) => ({ ...prev, cgpCourse: "" }));
                  }
                }}
                placeholder="Enter CGPA or %"
              />
              {errors.cgpaCourse && <small className="err">{errors.cgpaCourse}</small>}
            </div>

            <div className="field ">
              <label>
                Course Certificate (PDF, max 3MB){" "}
                <span className="required-star">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e, "certificateCourse")}
              />
              {errors.certificateCourse && (
                <small className="err">{errors.certificateCourse}</small>
              )}
            </div>
          </>
        )}
        
      </div>
      

      {/* ---------- Buttons ---------- */}
      <div className="form-actions">
        <button className="btn secondary" onClick={prev}>
          Back: Personal
        </button>
        <button className="btn primary" onClick={next}>
          Next: Professional
        </button>
      </div>
    </div>
  );
};

export default EducationDetails;
