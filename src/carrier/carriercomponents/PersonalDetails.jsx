import React, { useState } from 'react';
import { simpleValidatePersonal } from './validation';

// Filters
const onlyLetters = (v) => v.replace(/[^A-Za-z\s]/g, "");
const onlyDigits = (v) => v.replace(/\D/g, "");

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other"
];

const PersonalDetails = ({ data, setData, setActive, errors, setErrors }) => {

  const [photoPreview, setPhotoPreview] = useState(null);

  // ---------------------- HANDLE CHANGE ----------------------
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // ---------- Checkbox: Same Address ----------
    if (type === "checkbox" && name === "sameAddress") {
      if (checked) {
        setData(prev => ({
          ...prev,
          sameAddress: true,
          permanentAddress: prev.currentAddress,
          permanentLandmark: prev.landmark,
          permanentPincode: prev.pincode,
          permanentVillage: prev.village,
          permanentState: prev.state
        }));
      } else {
        setData(prev => ({
          ...prev,
          sameAddress: false,
          permanentAddress: "",
          permanentLandmark: "",
          permanentPincode: "",
          permanentVillage: "",
          permanentState: ""
        }));
      }
      return;
    }

    // ---------- File Upload ----------
    if (type === "file") {
      const file = files[0];
      setData(prev => ({ ...prev, [name]: file }));
      setPhotoPreview(URL.createObjectURL(file));
      return;
    }

    // ------------- TEXT INPUT VALIDATION FILTERS -------------
    let newValue = value;

    // Name fields – allow only letters
    if (["firstName", "middleName", "lastName", "village"].includes(name)) {
      newValue = onlyLetters(value);
    }

    // Pincode – only 6 digits max
    if (name === "pincode" || name === "permanentPincode") {
      newValue = onlyDigits(value).slice(0, 6);
    }

    // Landmark – no special validation (allow letters, numbers)
    // Address – allow everything

    // ---------- Update State ----------
    setData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };

      // If "sameAddress" is on, sync other permanent fields
      if (prev.sameAddress) {
        if (name === "currentAddress") updated.permanentAddress = newValue;
        if (name === "landmark") updated.permanentLandmark = newValue;
        if (name === "pincode") updated.permanentPincode = newValue;
        if (name === "village") updated.permanentVillage = onlyLetters(newValue);
        if (name === "state") updated.permanentState = newValue;
      }

      return updated;
    });

    // Clear field error
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // ---------------------- NEXT ----------------------
  const next = () => {
    const errs = simpleValidatePersonal(data);
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setActive("education");
    }
  };

  return (
    <div className="form-wrap">
      <h3>Personal Details</h3>
      <div className="form-grid">

        {/* ---------------- NAMES ---------------- */}
        <div className="field">
          <label>First Name <span className="required-star">*</span></label>
          <input
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
          />
          <small className="err">{errors.firstName}</small>
        </div>

        <div className="field">
          <label>Middle Name</label>
          <input
            name="middleName"
            value={data.middleName}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Last Name <span className="required-star">*</span></label>
          <input
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
          />
          <small className="err">{errors.lastName}</small>
        </div>

        {/* ---------------- EMAIL ---------------- */}
        <div className="field">
          <label>Email <span className="required-star">*</span></label>
          <input
            name="email"
            value={data.email}
            onChange={handleChange}
          />
          <small className="err">{errors.email}</small>
        </div>

        {/* ---------------- PHONE ---------------- */}
        <div className="field">
          <label>Phone <span className="required-star">*</span></label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={(e) => {
              const value = onlyDigits(e.target.value).slice(0, 10);
              setData({ ...data, phone: value });
              setErrors(prev => ({ ...prev, phone: "" }));
            }}
            placeholder="Enter 10-digit number"
          />
          <small className="err">{errors.phone}</small>
        </div>

        <div className="field">
          <label>Alternative Phone</label>
          <input
            type="tel"
            name="alternativePhone"
            value={data.alternativePhone}
            onChange={(e) => {
              const value = onlyDigits(e.target.value).slice(0, 10);
              setData({ ...data, alternativePhone: value });
            }}
          />
        </div>

        {/* ---------------- GENDER ---------------- */}
        <div className="field">
          <label>Gender <span className="required-star">*</span></label>
          <select name="gender" value={data.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <small className="err">{errors.gender}</small>
        </div>

        {/* ---------------- PHOTO UPLOAD ---------------- */}
        <div className="field full">
          <label>Upload Photo <span className="required-star">*</span></label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          <small className="err">{errors.photo}</small>

          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              style={{
                marginTop: "8px",
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                objectFit: "cover"
              }}
            />
          )}
        </div>

        {/* ---------------- CURRENT ADDRESS ---------------- */}
        <div className="field full">
          <label>Current Address <span className="required-star">*</span></label>
          <textarea
            name="currentAddress"
            value={data.currentAddress}
            onChange={handleChange}
          />
          <small className="err">{errors.currentAddress}</small>
        </div>

        <div className="field">
          <label>Landmark</label>
          <input
            name="landmark"
            value={data.landmark}
            onChange={handleChange}
          />
          <small className="err">{errors.landmark}</small>
        </div>

        <div className="field">
          <label>Pincode <span className="required-star">*</span></label>
          <input
            name="pincode"
            value={data.pincode}
            onChange={handleChange}
            placeholder="6-digit"
          />
          <small className="err">{errors.pincode}</small>
        </div>

        <div className="field">
          <label>Village</label>
          <input
            name="village"
            value={data.village}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>State <span className="required-star">*</span></label>
          <select name="state" value={data.state} onChange={handleChange}>
            <option value="">Select</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <small className="err">{errors.state}</small>
        </div>

        {/* ---------------- SAME ADDRESS ---------------- */}
        <div className="field full checkbox-field">
          <label>
            <input
              type="checkbox"
              name="sameAddress"
              checked={data.sameAddress || false}
              onChange={handleChange}
            /> Same as Current Address
          </label>
        </div>

        {/* ---------------- PERMANENT ADDRESS ---------------- */}
        <div className="field full">
          <label>Permanent Address <span className="required-star">*</span></label>
          <textarea
            name="permanentAddress"
            value={data.permanentAddress}
            disabled={data.sameAddress}
            onChange={handleChange}
          />
          <small className="err">{errors.permanentAddress}</small>
        </div>

        <div className="field">
          <label>Landmark</label>
          <input
            name="permanentLandmark"
            value={data.permanentLandmark}
            disabled={data.sameAddress}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Pincode</label>
          <input
            name="permanentPincode"
            value={data.permanentPincode}
            disabled={data.sameAddress}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Village</label>
          <input
            name="permanentVillage"
            value={data.permanentVillage}
            disabled={data.sameAddress}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>State</label>
          <select
            name="permanentState"
            value={data.permanentState}
            disabled={data.sameAddress}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="form-actions">
        <button className="btn primary" onClick={next}>Next: Education</button>
      </div>
    </div>
  );
};

export default PersonalDetails;
