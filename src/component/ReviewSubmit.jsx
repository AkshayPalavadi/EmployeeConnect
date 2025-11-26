import React, { useState } from 'react';
import { validateAll } from './validation';
import './indexApp.css';
import { useNavigate } from "react-router-dom";

const ReviewSubmit = ({ personal, education, professional,prevStep, setErrors, onBack, onSuccess }) => {
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitErrors, setSubmitErrors] = useState({});
    const navigate = useNavigate();


  const handleSubmit = () => {
    setSubmitAttempted(true);
    const errs = validateAll(personal, education, professional);
    setErrors(errs);
    setSubmitErrors(errs);

    if (Object.keys(errs).length === 0) {

      console.log("✅ Validation passed — calling onSuccess()");
  if (onSuccess) onSuccess();
    } else {
      const el = document.querySelector('.content-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderField = (label, value) => (
    <tr>
      <td className="review-label">{label}</td>
      <td className="review-value">
        {value !== '' && value !== null && value !== undefined
          ? value
          : <span className="muted">Not provided</span>}
      </td>
    </tr>
  );
  const prev=()=>prevStep();

  return (
    <div className="form-wrap">
      <h3>Review & Submit</h3>
      <div className="review-card">

        {/* ---------- Personal Section ---------- */}
        <h4>Personal Details</h4>
        <table className="review-table">
          <tbody>
            {renderField('First Name', personal.firstName)}
            {renderField('Middle Name', personal.middleName)}
            {renderField('Last Name', personal.lastName)}
            {renderField('Father’s Name', personal.fatherName)}
            {renderField('Mother’s Name', personal.motherName)}
            {renderField('Email', personal.email)}
            {renderField('Phone', personal.phone)}
            {renderField('Alternative Phone', personal.alternativePhone)}
            {renderField('Gender', personal.gender)}
            {renderField('Blood Group', personal.bloodGroup)}
            {renderField('Emergency Contact Number', personal.emergencyNumber)}
            {renderField('Nominee 1', personal.nominee1)}
            {renderField('Nominee 1Relation', personal.nominee1Relation)}
            {renderField('Nominee 1Phone', personal.nominee1Phone)}
            {renderField('Nominee 1Percentage', personal.nominee1Percentage)}
            {renderField('Nominee 2', personal.nominee2)}
            {renderField('Nominee 2Relation', personal.nominee2Relation)}
            {renderField('Nominee 2Phone', personal.nominee2Phone)}
            {renderField('Nominee 2 Percentage', personal.nominee2Percentage)}
            {renderField('Current Address', personal.currentAddress)}
            {renderField('Permanent Address', personal.permanentAddress)}
            {renderField('Same as Permanent', personal.sameAddress ? 'Yes' : 'No')}
            {renderField('Landmark', personal.landmark)}
            {renderField('Pincode', personal.pincode)}
            {renderField('Village', personal.village)}
            {renderField('State', personal.state)}
            {renderField('Aadhar Number', personal.aadharNumber)}
            {renderField('PAN Number', personal.panNumber)}
            {renderField('Photo', personal.photo ? personal.photo.name : 'No file uploaded')}
            {renderField('Aadhar Upload', personal.aadharUpload ? personal.aadharUpload.name : 'No file uploaded')}
            {renderField('PAN Upload', personal.panUpload ? personal.panUpload.name : 'No file uploaded')}
            {personal.isMarried && renderField('Marriage Certificate', personal.marriageCertificate ? personal.marriageCertificate.name : 'No file uploaded')}
          </tbody>
        </table>

        {/* ---------- Education Section ---------- */}
        {/* ---------- Education Section ---------- */}
<h4>Education Details</h4>

{/* 10th Class */}
<h5>10th Class</h5>
<table className="review-table">
  <tbody>
    {renderField('School Name', education.schoolName10)}
    {renderField('Year of Passing', education.year10)}
    {renderField('CGPA / Percentage', education.cgpa10)}
    {renderField('Certificate', education.certificate10 ? education.certificate10.name : 'No file uploaded')}
  </tbody>
</table>

{/* Intermediate / Diploma */}
<h5>Intermediate / Diploma</h5>
<table className="review-table">
  <tbody>
    {renderField('Type', education.interOrDiploma)}
    {renderField('College Name', education.collegeName12)}
    {renderField('Year of Passing', education.year12)}
    {renderField('CGPA / Percentage', education.cgpa12)}
    {renderField('Certificate', education.certificate12 ? education.certificate12.name : 'No file uploaded')}
    {renderField('Gap Reason (if any)', education.gapReason12)}
  </tbody>
</table>

{/* UG / B.Tech */}
<h5>B.Tech / Degree</h5>
<table className="review-table">
  <tbody>
    {renderField('College Name', education.collegeNameUG)}
    {renderField('Year of Passing', education.yearUG)}
    {renderField('CGPA / Percentage', education.cgpaUG)}
    {renderField('Certificate', education.certificateUG ? education.certificateUG.name : 'No file uploaded')}
    {renderField('Gap Reason (if any)', education.gapReasonUG)}
  </tbody>
</table>

{/* M.Tech / ISM Tech */}
{education.hasMTech && (
  <>
    <h5>PG</h5>
    <table className="review-table">
      <tbody>
        {renderField('College Name', education.collegeNameMTech)}
        {renderField('Year of Passing', education.yearMTech)}
        {renderField('CGPA / Percentage', education.cgpaMTech)}
        {renderField('Certificate', education.certificateMTech ? education.certificateMTech.name : 'No file uploaded')}
      </tbody>
    </table>
  </>
)}
{education.hasCourse && (
  <>
    <h5>Certificate Course</h5>
    <table className="review-table">
      <tbody>
        {renderField('College Name', education.courseName)}
        {renderField('College Name', education.institueName)}

        {renderField('Year of Passing', education.yearCourse)}
        {renderField('CGPA / Percentage', education.cgpaCourse)}
        {renderField('Certificate', education.certificateCourse ? education.certificateCourse.name : 'No file uploaded')}
      </tbody>
    </table>
  </>
)}


        {/* ---------- Professional Section ---------- */}
        <h4>Professional Details</h4>
        <table className="review-table">
          <tbody>
            {renderField("Employee ID", professional.employeeId)}
            {renderField("Date of Joining", professional.dateOfJoining)}
            {renderField("Role / Designation", professional.role)}
            {renderField("Department", professional.department)}
            {renderField("Has Work Experience", professional.hasExperience ? "Yes" : "No")}
          </tbody>
        </table>

        {professional.hasExperience && professional.experiences.length > 0 && (
          <>
            <h5>Work Experience Details</h5>
            {professional.experiences.map((exp, index) => (
              <div key={index} className="review-subcard">
                <h5>Experience {index + 1}</h5>
                <table className="review-table">
                  <tbody>
                    {renderField("Company Name", exp.companyName)}
                    {renderField("Company Location", exp.companyLocation)}
                    {renderField("Job Title", exp.jobTitle)}
                    {renderField("Start Date", exp.startDate)}
                    {renderField("End Date", exp.endDate)}
                    {renderField("Duration", exp.duration)}
                    {renderField("Roles & Responsibilities", exp.roles)}
                    {renderField("Projects", exp.projects)}
                    {renderField("Skills", exp.skills)}
                    {renderField("Salary", exp.salary)}
                    {renderField(
                      "Relieving Letter",
                      exp.relievingLetter ? exp.relievingLetter.name : "No file uploaded"
                    )}
                    {renderField(
                      "Salary Slips",
                      exp.salarySlips ? exp.salarySlips.name : "No file uploaded"
                    )}
                    {renderField("HR Name", exp.hrName)}
                    {renderField("HR Email", exp.hrEmail)}
                    {renderField("HR Phone", exp.hrPhone)}
                    {renderField("Manager Name", exp.managerName)}
                    {renderField("Manager Email", exp.managerEmail)}
                    {renderField("Manager Phone", exp.managerPhone)}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
        

        

        
      </div>

      {/* ---- Validation Errors ---- */}
      {submitAttempted && Object.keys(submitErrors).length > 0 && (
        <div className="submit-err">
          Please fill the required fields highlighted above.<br />
          Missing: {Object.keys(submitErrors).join(', ')}
        </div>
      )}

      <div className="form-actions">
        <button className="btn secondary" onClick={prev}>Back</button>
        <button className="btn primary" onClick={handleSubmit}>Submit Application</button>
      </div>
    </div>
  );
};

export default ReviewSubmit;
