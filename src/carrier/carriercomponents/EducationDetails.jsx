import React from 'react';
import { simpleValidateEducation } from './validation';

const EducationDetails = ({ data, setData, setActive, errors, setErrors }) => {
  const years = Array.from({ length: 2025 - 1960 + 1 }, (_, i) => 2025 - i);

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const clean = value.replace(/[^A-Za-z\s]/g, ""); // ⛔ BLOCK DIGITS
    setData(prev => ({ ...prev, [name]: clean }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleGapReasonChange = (e) => {
    const { name, value } = e.target;

    // allow letters, spaces, and basic punctuation for typing explanation
    const clean = value.replace(/[^A-Za-z0-9\s,.()-]/g, "");

    setData(prev => ({ ...prev, [name]: clean }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const next = () => {
    const errs = simpleValidateEducation(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setActive('professional');
    }
  };

  return (
    <div className="form-wrap">
      <h3>Education Details</h3>

      <div className="form-grid">
        
        {/* ---------- 10th Class ---------- */}
        <div className="field full"><h4>10th Class</h4></div>

        <div className="field">
          <label>School Name *</label>
          <input
            name="schoolName10"
            value={data.schoolName10 || ''}
            onChange={handleNameChange}  // ⛔ NO DIGITS
          />
          {errors.schoolName10 && <small className="err">{errors.schoolName10}</small>}
        </div>

        <div className="field">
          <label>Year of Passing *</label>
          <select name="year10" value={data.year10 || ''} onChange={handleChange}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year10 && <small className="err">{errors.year10}</small>}
        </div>

        <div className="field">
          <label>CGPA / Percentage *</label>
          <input
            type="number"
            step="0.01"
            name="cgpa10"
            value={data.cgpa10 || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData(prev => ({ ...prev, cgpa10: value }));
              }
            }}
            placeholder="Enter CGPA or %"
          />
          {errors.cgpa10 && <small className="err">{errors.cgpa10}</small>}
        </div>

        {/* ---------- Intermediate / Diploma ---------- */}
        <div className="field full"><h4>Intermediate / Diploma</h4></div>

        <div className="field">
          <label>Choose *</label>
          <select
            name="interOrDiploma"
            value={data.interOrDiploma || ''}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Diploma">Diploma</option>
          </select>
          {errors.interOrDiploma && <small className="err">{errors.interOrDiploma}</small>}
        </div>

        <div className="field">
          <label>College Name *</label>
          <input
            name="collegeName12"
            value={data.collegeName12 || ''}
            onChange={handleNameChange} // ⛔ NO DIGITS
          />
          {errors.collegeName12 && <small className="err">{errors.collegeName12}</small>}
        </div>

        <div className="field">
          <label>Year of Passing *</label>
          <select name="year12" value={data.year12 || ''} onChange={handleChange}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year12 && <small className="err">{errors.year12}</small>}
        </div>

        <div className="field">
          <label>CGPA / Percentage *</label>
          <input
            type="number"
            step="0.01"
            name="cgpa12"
            value={data.cgpa12 || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData(prev => ({ ...prev, cgpa12: value }));
              }
            }}
          />
          {errors.cgpa12 && <small className="err">{errors.cgpa12}</small>}
        </div>

        {errors.gapReason12 && (
          <div className="field full">
            <label>Reason for Gap *</label>
            <input
              name="gapReason12"
              value={data.gapReason12 || ''}
              onChange={handleGapReasonChange}
              placeholder="Explain your gap after 10th"
            />
            <small className="err">{errors.gapReason12}</small>
          </div>
        )}

        {/* ---------- UG ---------- */}
        <div className="field full"><h4>B.Tech / Degree</h4></div>

        <div className="field">
          <label>College Name *</label>
          <input
            name="collegeNameUG"
            value={data.collegeNameUG || ''}
            onChange={handleNameChange}  // ⛔ NO DIGITS
          />
          {errors.collegeNameUG && <small className="err">{errors.collegeNameUG}</small>}
        </div>

        <div className="field">
          <label>Year of Passing *</label>
          <select name="yearUG" value={data.yearUG || ''} onChange={handleChange}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.yearUG && <small className="err">{errors.yearUG}</small>}
        </div>

        <div className="field">
          <label>CGPA / Percentage *</label>
          <input
            type="number"
            step="0.01"
            name="cgpaUG"
            value={data.cgpaUG || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
                setData(prev => ({ ...prev, cgpaUG: value }));
              }
            }}
          />
          {errors.cgpaUG && <small className="err">{errors.cgpaUG}</small>}
        </div>

        {errors.gapReasonUG && (
          <div className="field full">
            <label>Reason for Gap *</label>
            <input
              name="gapReasonUG"
              value={data.gapReasonUG || ''}
              onChange={handleGapReasonChange}
            />
            <small className="err">{errors.gapReasonUG}</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn secondary" onClick={() => setActive('personal')}>Back</button>
        <button className="btn primary_app" onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default EducationDetails;
