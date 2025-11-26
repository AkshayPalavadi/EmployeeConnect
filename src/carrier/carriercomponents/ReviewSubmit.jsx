import React, { useState } from 'react';
import { validateAll } from './validation';

const ReviewSubmit = ({ personal, education, professional, setErrors, onBack, onSuccess }) => {
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitErrors, setSubmitErrors] = useState({});
const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
  setSubmitAttempted(true);
  const errs = validateAll(personal, education, professional);
  setErrors(errs);
  setSubmitErrors(errs);

  
  if (Object.keys(errs).length === 0) {
    setShowPopup(true);  // <-- open modal
    onSuccess(); // you can keep this if it performs logic, not alert
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
      {renderField('Email', personal.email)}
      {renderField('Phone', personal.phone)}
      {renderField('Alternative Phone', personal.alternativePhone)}
      {renderField('Gender', personal.gender)}
      {renderField('Blood Group', personal.bloodGroup)}
      {renderField('Current Address', personal.currentAddress)}
      {renderField('Permanent Address', personal.permanentAddress)}
      {renderField('Same as Permanent', personal.sameAddress ? 'Yes' : 'No')}
      {renderField('Landmark', personal.landmark)}
      {renderField('Pincode', personal.pincode)}
      {renderField('Village', personal.village)}
      {renderField('State', personal.state)}
      {renderField('Photo', personal.photo ? personal.photo.name : 'No file uploaded')}
    </tbody>
  </table>

  {/* ---------- Education Section ---------- */}
  <h4>Education Details</h4>

  <h5>10th Class</h5>
  <table className="review-table">
    <tbody>
      {renderField('School Name', education.schoolName10)}
      {renderField('Year of Passing', education.year10)}
      {renderField('CGPA / Percentage', education.cgpa10)}
    </tbody>
  </table>

  <h5>Intermediate / Diploma</h5>
  <table className="review-table">
    <tbody>
      {renderField('Type', education.interOrDiploma)}
      {renderField('College Name', education.collegeName12)}
      {renderField('Year of Passing', education.year12)}
      {renderField('CGPA / Percentage', education.cgpa12)}
      {renderField('Gap Reason (if any)', education.gapReason12)}
    </tbody>
  </table>

  <h5>B.Tech / Degree</h5>
  <table className="review-table">
    <tbody>
      {renderField('College Name', education.collegeNameUG)}
      {renderField('Year of Passing', education.yearUG)}
      {renderField('CGPA / Percentage', education.cgpaUG)}
      {renderField('Gap Reason (if any)', education.gapReasonUG)}

    </tbody>
  </table>

  {/* ---------- Professional Section ---------- */}
  <h4>Professional Details</h4>
  <table className="review-table">
    <tbody>
      {renderField('Job Type', professional.jobType)}
    </tbody>
  </table>

  {professional.jobType === 'fresher' && (
    <table className="review-table">
      <tbody>
        {renderField('Resume', professional.resume ? professional.resume.name : 'No file uploaded')}
        {renderField('Skills', professional.skills)}
        {renderField('Projects', professional.projects)}
        {renderField('LinkedIn Profile', professional.linkedin)}
        {renderField('Certifications', professional.certifications)}
        {renderField('Achievements', professional.achievements)}
      </tbody>
    </table>
  )}

  {professional.jobType === 'experience' && (
    <>
      {professional.experiences.length > 0 ? (
        professional.experiences.map((exp, index) => (
          <div key={index} className="review-subcard">
            <h5>Experience {index + 1}</h5>
            <table className="review-table">
              <tbody>
                {renderField('Company Name', exp.companyName)}
                {renderField('Location', exp.companyLocation)}
                {renderField('Job Title', exp.jobTitle)}
                {renderField('Start Date', exp.startDate)}
                {renderField('End Date', exp.endDate)}
                {renderField('Duration', exp.duration)}
                {renderField('Roles', exp.roles)}
                {renderField('Projects', exp.projects)}
                {renderField('Skills', exp.skills)}
                {renderField('Salary', exp.salary)}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div className="muted">No work experience added.</div>
      )}
    </>
  )}
</div>

              {submitAttempted && Object.keys(submitErrors).length > 0 && ( <div className="submit-err"> Please fill the required fields highlighted above. Missing: {Object.keys(submitErrors).join(', ')} </div> )}

               <div className="form-actions">
                 <button className="btn secondary" onClick={onBack}>
                  Back
                  </button>
                   <button className="btn primary_app" onClick={handleSubmit}>
                    Submit Application</button>
                     </div>


            {showPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>🎉 Application Submitted Successfully!</h3>
      <p>Your details have been recorded.</p>
      <div className="popup-actions">
        <button className="btn primary_app" onClick={() => setShowPopup(false)}>OK</button>
        <button
          className="btn secondary"
          onClick={() => window.location.href = '/'} // change route if using react-router
        >
          Home
        </button>
      </div>
    </div>
  </div>
)}


      </div>
  );
};

export default ReviewSubmit;