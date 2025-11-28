import React, { useState } from "react";
import { simpleValidatePersonal } from "./validation";
import "./indexApp.css";
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other",
];

const PersonalDetails = ({
  data,
  setData,
  setActive,
  errors,
  nextStep,
  setErrors,
}) => {
  const [childInput, setChildInput] = useState("");

const addChild = () => {
  if (!childInput.trim()) return;

  setData((prev) => ({
    ...prev,
    children: [...(prev.children || []), childInput.trim()],
  }));

  setChildInput("");
};

const removeChild = (index) => {
  setData((prev) => ({
    ...prev,
    children: prev.children.filter((_, i) => i !== index),
  }));
};
  const [photoPreview, setPhotoPreview] = useState(null);
  const isPhone = (s) => /^[6-9]\d{9}$/.test(String(s).trim());
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  if (name === "alternativePhone") {
    // Only update if valid number or empty (so user can delete)
    if (value === "" || /^[6-9]\d{0,9}$/.test(value)) {
      setData({ ...data, [name]: value });
    }
  } else {
    setData({ ...data, [name]: value });}
    // Local state for input

  

    // Fields that should only accept letters and spaces
    const nameFields1 = [
      "firstName",
      "lastName",
      "fatherName",
      "motherName",
      "nominee1",
      "nominee1Relation",

      "nominee2",
      "nominee2Relation",
      "middleName",
      "villageCurrent",
      "villagePermanent",

      "spouse",
    ];

    if (nameFields1.includes(name)) {
      // Allow only letters and spaces — filter out numbers and symbols
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
      setData((prev) => ({ ...prev, [name]: lettersOnly }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear errors for name fields
    if (nameFields1.includes(name)) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // Checkbox for same address
    if (type === "checkbox" && name === "sameAddress") {
      setData((prev) => ({
        ...prev,
        sameAddress: checked,
        permanentAddress: checked ? prev.currentAddress : "",
        villagePermanent:checked ? prev.villageCurrent:"",
        landmarkPermanent: checked ? prev.landmarkCurrent:"",
        pincodePermanent: checked ? prev.pincodeCurrent:"",
        statePermanent:checked ? prev.stateCurrent:"",
      }));
      setErrors((prev) => ({ ...prev, permanentAddress: "",
         landmarkPermanent: "",
         villagePermanent: "",
         pincodePermanent: "",
         statePermanent:"",
       }));
      return;
    }

    // Checkbox for marriage
    if (type === "checkbox" && name === "isMarried") {
      setData((prev) => ({
        ...prev,
        isMarried: checked,
        marriageCertificate: checked ? prev.marriageCertificate : null,
      }));
      return;
    }

    // File uploads
    if (type === "file") {
      const file = files[0];
      setData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: "" }));

      if (name === "photo") setPhotoPreview(URL.createObjectURL(file));

      return;
    }

    // Regular text/select input
    setData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "currentAddress" && prev.sameAddress
        ? { permanentAddress: value ,
        }
        : {}),
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const next = () => {
    const errs = simpleValidatePersonal(data);

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="form-wrap">
      {/* <h3>Personal Details</h3> */}

      <div className="form-grid">
        {/* Existing fields */}
        {/* ---- Basic Info ---- */}
        
        <div className="field">
          <label>
            First Name <span className="required-star">*</span>
          </label>
          <input
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <small className="err">{errors.firstName}</small>
          )}
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
          <label>
            Last Name <span className="required-star">*</span>
          </label>
          <input
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <small className="err">{errors.lastName}</small>}
        </div>

        {/* ---- New Fields ---- */}
        <div className="field">
          <label>
            Father’s Name <span className="required-star">*</span>
          </label>
          <input
            name="fatherName"
            value={data.fatherName || ""}
            onChange={handleChange}
          />
          {errors.fatherName && (
            <small className="err">{errors.fatherName}</small>
          )}
        </div>

        <div className="field">
          <label>
            Mother’s Name <span className="required-star">*</span>
          </label>
          <input
            name="motherName"
            value={data.motherName || ""}
            onChange={handleChange}
          />
          {errors.motherName && (
            <small className="err">{errors.motherName}</small>
          )}
        </div>
        <div className="field">
          <label>
            Email <span className="required-star">*</span>
          </label>
          <input name="email" value={data.email} onChange={handleChange} />
          {errors.email && <small className="err">{errors.email}</small>}
        </div>

        <div className="field">
          <label>
            Phone <span className="required-star">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, phone: value }));
                setErrors((prev) => ({ ...prev, phone: "" }));
              }
            }}
            placeholder="Enter 10-digit number"
          />
          {errors.phone && <small className="err">{errors.phone}</small>}
        </div>

        <div className="field">
          <label>Alternative Phone</label>
          <input
            type="tel"
            name="alternativePhone"
            value={data.alternativePhone}
onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, alternativePhone: value }));
                setErrors((prev) => ({ ...prev, alternativePhone: "" }));
              }
            }}            placeholder="Enter alternate number"
          />
        </div>

        {/* ---- Gender and Blood Group ---- */}
        <div className="field">
          <label>
            Gender <span className="required-star">*</span>
          </label>
          <select
            name="gender"
            value={data.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <small className="err">{errors.gender}</small>}
        </div>

        <div className="field">
          <label>
            Blood Group <span className="required-star">*</span>
          </label>
          <select
            name="bloodGroup"
            value={data.bloodGroup || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.bloodGroup && (
            <small className="err">{errors.bloodGroup}</small>
          )}
        </div>

        {/* ---- Photo Upload ---- */}
        <div className="field full">
          <label>
            Upload Profile Photo <span className="required-star">*</span>
          </label>
          <input
            type="file"
            name="photo"
            accept="image/jpeg, image/png"
            alt="Image"
            onChange={handleChange}
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              style={{
                marginTop: "8px",
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
          {errors.photo && <small className="err">{errors.photo}</small>}
        </div>

        {/* ---- Address field-employees ---- */}
        <div className="field full">
          <label>
            Current Address <span className="required-star">*</span>
          </label>
          <textarea
            name="currentAddress"
            value={data.currentAddress || ""}
            onChange={handleChange}
          />
          {errors.currentAddress && (
            <small className="err">{errors.currentAddress}</small>
          )}
        </div>
        {/* ---- Additional Address Info ---- */}
        <div className="field">
          <label>
            Landmark <span className="required-star">*</span>
          </label>
          <input
            name="landmarkCurrent"
            value={data.landmarkCurrent || ""}
            onChange={handleChange}
          />
          {errors.landmarkCurrent && (<small className="err">{errors.landmarkCurrent}</small>)}
        </div>

        <div className="field">
          <label>
            Pincode <span className="required-star">*</span>
          </label>
          <input
            type="text"
            name="pincodeCurrent"
            value={data.pincodeCurrent}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 6
              if (/^\d{0,6}$/.test(value)) {
                setData((prev) => ({ ...prev, pincodeCurrent: value }));
                setErrors((prev) => ({ ...prev, pincodeCurrent: "" }));
              }
            }}
            placeholder="Enter 6-digit pincode"
          />

          {errors.pincodeCurrent && <small className="err">{errors.pincodeCurrent}</small>}
        </div>

        <div className="field">
          <label>Village</label>
          <input
            name="villageCurrent"
            value={data.villageCurrent || ""}
            onChange={handleChange}
          />
          {errors.villageCurrent && <small className="err">{errors.villageCurrent}</small>}

        </div>

        <div className="field">
          <label>
            State <span className="required-star">*</span>
          </label>
          <select name="stateCurrent" value={data.stateCurrent || ""} onChange={handleChange}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.stateCurrent && <small className="err">{errors.stateCurrent}</small>}
        </div>

        <div className="field full checkbox-field">
          <label>
            <input
              type="checkbox"
              name="sameAddress"
              checked={data.sameAddress || false}
              onChange={handleChange}
            />{" "}
            Same as Current Address
          </label>
        </div>

        <div className="field full">
          <label>
            Permanent Address <span className="required-star">*</span>
          </label>
          <textarea
            name="permanentAddress"
            value={data.permanentAddress || ""}
            onChange={handleChange}
            disabled={data.sameAddress}
          />
          {errors.permanentAddress && (
            <small className="err">{errors.permanentAddress}</small>
          )}
        </div>

        {/* ---- Additional Address Info ---- */}
        <div className="field">
          <label>
            Landmark <span className="required-star">*</span>
          </label>
          <input
            name="landmarkPermanent"
            value={data.landmarkPermanent || ""}
            onChange={handleChange}

          />
          {errors.landmarkPermanent && (<small className="err">{errors.landmarkPermanent}</small>)}
        </div>

        <div className="field">
          <label>
            Pincode <span className="required-star">*</span>
          </label>
          <input
            type="text"
            name="pincodePermanent"
            value={data.pincodePermanent}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 6
              if (/^\d{0,6}$/.test(value)) {
                setData((prev) => ({ ...prev, pincodePermanent: value }));
                setErrors((prev) => ({ ...prev, pincodePermanent: "" }));
              }
            }}
            placeholder="Enter 6-digit pincode"
          />

          {errors.pincodePermanent && <small className="err">{errors.pincodePermanent}</small>}
        </div>

        <div className="field">
          <label>Village</label>
          <input
            name="villagePermanent"
            value={data.villagePermanent || ""}
            onChange={handleChange}
          />
                    {errors.villagePermanent && <small className="err">{errors.villagePermanent}</small>}

        </div>

        <div className="field">
          <label>
            State <span className="required-star">*</span>
          </label>
          <select name="statePermanent" value={data.statePermanent || ""} onChange={handleChange}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.statePermanent && <small className="err">{errors.statePermanent}</small>}
        </div>

        <div className="field">
          <label>
            Emergency Contact Number <span className="required-star">*</span>
          </label>
          <input
            type="tel"
            name="emergencyNumber"
            value={data.emergencyNumber || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, emergencyNumber: value }));
                setErrors((prev) => ({ ...prev, emergencyNumber: "" }));
              }
            }}
            placeholder="Enter 10-digit number"
          />
          {errors.emergencyNumber && (
            <small className="err">{errors.emergencyNumber}</small>
          )}
        </div>

        <div className="field">
          <label>
            Nominee 1 <span className="required-star">*</span>
          </label>
          <input
            name="nominee1"
            value={data.nominee1 || ""}
            onChange={handleChange}
          />
          {errors.nominee1 && <small className="err">{errors.nominee1}</small>}
        </div>
        <div className="field">
          <label>
            Nominee 1 Relation <span className="required-star">*</span>
          </label>
          <input
            name="nominee1Relation"
            value={data.nominee1Relation || ""}
            onChange={handleChange}
          />
          {errors.nominee1Relation && <small className="err">{errors.nominee1Relation}</small>}
        </div>
        <div className="field">
          <label>
            Nominee1 Phone <span className="required-star">*</span>
          </label>
          <input
            type="tel"
            name="nominee1phone"
            value={data.nominee1phone}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, nominee1phone: value }));
                setErrors((prev) => ({ ...prev, nominee1phone: "" }));
              }
            }}
            placeholder="Enter 10-digit number"
          />
          {errors.nominee1phone && <small className="err">{errors.nominee1phone}</small>}
        </div>
        
        <div className="field">
          <label>
            Nominee 1 percentage <span className="required-star">*</span>
          </label>
          <input
            name="nominee1Percentage"
            value={data.nominee1Percentage || ""}
            onChange={handleChange}
          />
          {errors.nominee1Percentage && <small className="err">{errors.nominee1Percentage}</small>}
        </div>
        

        <div className="field">
          <label>
            Nominee 2 <span className="required-star">*</span>
          </label>
          <input
            name="nominee2"
            value={data.nominee2 || ""}
            onChange={handleChange}
          />
          {errors.nominee2 && <small className="err">{errors.nominee2}</small>}
        </div>
        <div className="field">
          <label>
            Nominee 2 Relation <span className="required-star">*</span>
          </label>
          <input
            name="nominee2Relation"
            value={data.nominee2Relation || ""}
            onChange={handleChange}
          />
          {errors.nominee2Relation && <small className="err">{errors.nominee2Relation}</small>}
        </div>
        <div className="field">
          <label>
            Nominee2 Phone <span className="required-star">*</span>
          </label>
          <input
            type="tel"
            name="nominee2phone"
            value={data.nominee2phone}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10
              if (/^\d{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, nominee2phone: value }));
                setErrors((prev) => ({ ...prev, nominee2phone: "" }));
              }
            }}
            placeholder="Enter 10-digit number"
          />
          {errors.nominee2phone && <small className="err">{errors.nominee2phone}</small>}
        </div>
        <div className="field">
          <label>
            Nominee 2 Percentage <span className="required-star">*</span>
          </label>
          <input
            name="nominee2Percentage"
            value={data.nominee2Percentage || ""}
            onChange={handleChange}
          />
          {errors.nominee2Percentage && <small className="err">{errors.nominee2Percentage}</small>}
        </div>

        <div className="field">
          <label>
            Aadhar Number <span className="required-star">*</span>
          </label>
          <input
            name="aadharNumber"
            value={data.aadharNumber || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,12}$/.test(value)) {
                setData((prev) => ({ ...prev, aadharNumber: value }));
                setErrors((prev) => ({ ...prev, aadharNumber: "" }));
              }
            }}
            placeholder="12-digit Aadhar number"
          />
          {errors.aadharNumber && (
            <small className="err">{errors.aadharNumber}</small>
          )}
        </div>

        <div className="field">
          <label>
            Upload Aadhar Card <span className="required-star">*</span>
          </label>
          <input
            type="file"
            name="aadharUpload"
            accept="image/*,.pdf"
            onChange={handleChange}
          />
          {errors.aadharUpload && (
            <small className="err">{errors.aadharUpload}</small>
          )}
        </div>

        <div className="field">
          <label>
            PAN Number <span className="required-star">*</span>
          </label>
          <input
            name="panNumber"
            value={data.panNumber || ""}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (/^[A-Z0-9]{0,10}$/.test(value)) {
                setData((prev) => ({ ...prev, panNumber: value }));
                setErrors((prev) => ({ ...prev, panNumber: "" }));
              }
            }}
            placeholder="ABCDE1234F"
          />
          {errors.panNumber && (
            <small className="err">{errors.panNumber}</small>
          )}
        </div>

        <div className="field">
          <label>
            Upload PAN Card <span className="required-star">*</span>
          </label>
          <input
            type="file"
            name="panUpload"
            accept="image/*,.pdf"
            onChange={handleChange}
          />
          {errors.panUpload && (
            <small className="err">{errors.panUpload}</small>
          )}
        </div>

        <div className="field full checkbox-field">
          <label>
            <input
              type="checkbox"
              name="isMarried"
              checked={data.isMarried || false}
              onChange={handleChange}
            />{" "}
            Married?
          </label>
        </div>

        {data.isMarried && (
          <div  style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            <div className="field">
          <label>
            spouse <span className="required-star">*</span>
          </label>
          <input
            name="spouse"
            value={data.spouse|| ""}
            onChange={handleChange}
          />
          {errors.spouse && <small className="err">{errors.spouse}</small>}
        </div>
        <div className="field">
  <label>
    Children 
  </label>

  <div className="tag-input-box">
    <div className="tags-list">
      {(data.children || []).map((child, index) => (
        <span key={index} className="tag">
          {child}
          <button
            type="button"
            className="remove-tag"
            onClick={() => removeChild(index)}
          >
            ×
          </button>
        </span>
      ))}
    </div>

    <div className="add-child-row">
      <input
        type="text"
        value={childInput}
        placeholder="Enter child name"
        onChange={(e) => setChildInput(e.target.value.replace(/[^A-Za-z ]/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChild())}
      />
      <button type="button" className="add-btn" onClick={addChild}>
        Add
      </button>
    </div>
  </div>

  {errors.children && <small className="err">{errors.children}</small>}
</div>

          <div className="field full">
            <label>Marriage Certificate (optional)</label>
            <input
              type="file"
              name="marriageCertificate"
              accept="image/*,.pdf"
              onChange={handleChange}
            />
            {errors.marriageCertificate && (
              <small className="err">{errors.marriageCertificate}</small>
            )}
          </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn primary" onClick={next}>
          Next: Education
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
