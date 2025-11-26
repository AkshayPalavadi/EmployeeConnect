import React, { useState } from "react";
import "./QuickDetails.css";
import Logo from "../assets/dhatvi.jpg";
import { useNavigate } from "react-router-dom";

const QuickDetails = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    course: "",
    otherCourse: "",
    department: "",
    yearOfPassing: "",
    college: "",
    cgpa: "",
    gradeType: "",
    employeeType: "",
    companyName: "",
    experienceYears: "",
    resume: null,
    skills: [],
  });

  const refs = {
  firstName: React.useRef(null),
  lastName: React.useRef(null),
  email: React.useRef(null),
  phone: React.useRef(null),
  course: React.useRef(null),
  otherCourse: React.useRef(null),
  department: React.useRef(null),
  college: React.useRef(null),
  gradeType: React.useRef(null),
  cgpa: React.useRef(null),
  employeeType: React.useRef(null),
  companyName: React.useRef(null),
  experienceYears: React.useRef(null),
  skills: React.useRef(null),
  resume: React.useRef(null),
};


  // Validators
const isEmailValid = (email) =>
  /^(?=.*[A-Za-z])[A-Za-z0-9._%+-]+@gmail\.com$/.test(email);

  const isPhoneValid = (phone) => /^[0-9]{10}$/.test(phone);

  // Main handleChange
  const handleChange = (e) => {
  const { name, value, files } = e.target;

  // Clear error immediately when typing/selecting
  setErrors(prev => ({ ...prev, [name]: "" }));

  let newValue = value;

  // Alphabet-only fields
  if (["firstName", "lastName", "college", "department", "companyName"].includes(name)) {
    newValue = value.replace(/[^A-Za-z\s]/g, "");
  }

  // COURSE
  if (name === "course") {
    setErrors(prev => ({ ...prev, course: "", otherCourse: "" }));
    if (value !== "Other") {
      setFormData(prev => ({ ...prev, course: value, otherCourse: "" }));
    } else {
      setFormData(prev => ({ ...prev, course: value }));
    }
    return;
  }

  // OTHER COURSE
  if (name === "otherCourse") {
    newValue = value.replace(/[^A-Za-z\s]/g, "");
    setErrors(prev => ({ ...prev, otherCourse: "" }));
  }

  // EMAIL VALIDATION LIVE
if (name === "email") {
  if (!newValue) {
    setErrors(prev => ({ ...prev, email: "Email is required" }));
  } else if (!/^[A-Za-z0-9._%+-]*$/.test(newValue.split("@")[0])) {
    setErrors(prev => ({ ...prev, email: "Invalid characters" }));
  } else if (/^[0-9]+@?.*/.test(newValue)) {
    setErrors(prev => ({ ...prev, email: "Email must contain letters" }));
  } else if (!isEmailValid(newValue)) {
    setErrors(prev => ({ ...prev, email: "Enter valid Gmail address" }));
  } else {
    setErrors(prev => ({ ...prev, email: "" }));
  }
}

  // PHONE VALIDATION LIVE
  if (["phone"].includes(name)) {
    newValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    setErrors(prev => ({
      ...prev,
      phone: newValue.length === 10 ? "" : prev.phone
    }));
  }

  // EMPLOYEE TYPE
  if (name === "employeeType") {
    setErrors(prev => ({
      ...prev,
      employeeType: "",
      companyName: "",
      experienceYears: ""
    }));
  }

  // EXPERIENCE YEARS
  if (name === "experienceYears") {
    setErrors(prev => ({ ...prev, experienceYears: "" }));
  }

  // RESUME
  if (name === "resume" && files) {
    const file = files[0];
    const MAX_SIZE = 2 * 1024 * 1024;

    if (file.type !== "application/pdf") {
      setErrors(prev => ({ ...prev, resume: "Only PDF allowed" }));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrors(prev => ({ ...prev, resume: "File must be under 2MB" }));
      e.target.value = "";
      return;
    }

    setFormData(prev => ({ ...prev, resume: file }));
    setErrors(prev => ({ ...prev, resume: "" }));
    return;
  }

  // UPDATE FORM DATA
  setFormData(prev => ({ ...prev, [name]: newValue }));
};


  // CGPA / Percentage Validation
const handleCgpaOrPercentage = (e) => {
  let value = e.target.value;

  // Allow clearing
  if (value === "") {
    setFormData(prev => ({ ...prev, cgpa: "" }));
    setErrors(prev => ({ ...prev, cgpa: "" }));
    return;
  }

  let newErrors = { ...errors };

  // -------------------------
  // ⭐ CGPA VALIDATION
  // -------------------------
  if (formData.gradeType === "cgpa") {
    if (!/^\d{0,2}(\.\d{0,2})?$/.test(value)) return;

    const num = Number(value);

    if (num>10) return;

    if (num < 4 || num > 10) {
      newErrors.cgpa = "CGPA must be between 4 and 10";
    } else {
      newErrors.cgpa = "";
    }

    setErrors(newErrors);
    setFormData(prev => ({ ...prev, cgpa: value }));
    return;
  }

  // -------------------------
  // ⭐ PERCENTAGE VALIDATION (FULLY CLEARABLE)
  // -------------------------
  if (formData.gradeType === "percentage") {
    let clean = value.replace("%", "");

    // Allow digits + decimal
    if (!/^\d{0,3}(\.\d{0,2})?$/.test(clean)) return;

    // Allow clearing to empty
    if (clean === "") {
      setFormData(prev => ({ ...prev, cgpa: "" }));
      setErrors(prev => ({ ...prev, cgpa: "" }));
      return;
    }

    const num = Number(clean);

    // Prevent numbers above 100
    if (num > 100) return;

    // Validate range
    if (num < 40) {
      newErrors.cgpa = "Percentage must be between 40% and 100%";
    } else {
      newErrors.cgpa = "";
    }

    // Add % ONLY when numbers exist
    const finalValue = clean + "%";

    setErrors(newErrors);
    setFormData(prev => ({ ...prev, cgpa: finalValue }));
  }
};




  // Add Skill
 const addSkill = () => {
  const skill = skillInput.trim();
  if (skill && !formData.skills.includes(skill)) {
    setFormData({ ...formData, skills: [...formData.skills, skill] });
    setErrors(prev => ({ ...prev, skills: "" })); // ← FIX
  }
  setSkillInput("");
};


  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  // Final Validation
 const validateAll = () => {
  let newErrors = {};

  // NAME
  if (!formData.firstName) newErrors.firstName = "First name is required";
  if (!formData.lastName) newErrors.lastName = "Last name is required";

  // EMAIL
  if (!formData.email) newErrors.email = "Email is required";
  else if (!isEmailValid(formData.email)) newErrors.email = "Invalid Gmail address";

  // PHONE
  if (!formData.phone) newErrors.phone = "Phone number is required";
  else if (!isPhoneValid(formData.phone)) newErrors.phone = "Must be 10 digits";

  // COURSE
  if (!formData.course) newErrors.course = "Course is required";
  if (formData.course === "Other" && !formData.otherCourse)
    newErrors.otherCourse = "Enter your course";

  // DEPARTMENT
  if (!formData.department) newErrors.department = "Department is required";

  // COLLEGE
  if (!formData.college) newErrors.college = "College name is required";

  // GRADE TYPE
  if (!formData.gradeType) newErrors.gradeType = "Select grade type";

  // CGPA / PERCENTAGE
  if (!formData.cgpa) newErrors.cgpa = "Enter CGPA / Percentage";

  // EMPLOYEE TYPE
  if (!formData.employeeType)
    newErrors.employeeType = "Select employee type";

  // EXPERIENCE DETAILS
  if (formData.employeeType === "Experience") {
    if (!formData.companyName) newErrors.companyName = "Company name required";
    if (!formData.experienceYears) newErrors.experienceYears = "Select experience";
  }

  // SKILLS
  if (formData.skills.length === 0)
    newErrors.skills = "Add at least one skill";

  // RESUME
  if (!formData.resume) newErrors.resume = "Upload resume";

  setErrors(newErrors);

  setErrors(newErrors);

// scroll to first error
const firstErrorKey = Object.keys(newErrors)[0];
if (firstErrorKey && refs[firstErrorKey]?.current) {
  refs[firstErrorKey].current.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
  refs[firstErrorKey].current.focus();
}

return Object.keys(newErrors).length === 0;


  return Object.keys(newErrors).length === 0;
};

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

   if (!validateAll()) {
  return; // no alert, just show inline errors
}


    localStorage.setItem("quickDetailsData", JSON.stringify(formData));
    navigate("/carrier");
  };

  return (
    <div className="quick-details-container">
      <div className="quick-details-container-header">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="logo-text">
          <span className="dhatvi-text">DhaTvi</span>
          <div className="green-line"></div>
          <span className="business-text">BUSINESS SOLUTIONS PVT. LTD</span>
        </div>
      </div>

      <h2 className="quick-details-title">Basic Details</h2>

      <form className="details-form" onSubmit={handleSubmit}>
        {/* NAME */}
<label className="required-label">Full Name</label>
        <div className="name-row">
          <input   ref={refs.firstName} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
          
          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
        </div>
        {(errors.firstName || errors.lastName) && <p className="error">{errors.firstName || errors.lastName}</p>}

        {/* EMAIL */}
<label className="required-label">Email</label>
        <input  ref={refs.email} name="email" value={formData.email} onChange={handleChange} placeholder="Enter Gmail" />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* PHONE */}
<label className="required-label">Phone</label>
        <div className="phone-row">
          <input ref={refs.phone} name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
          <input name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} placeholder="Alternate" />
        </div>
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* COURSE */}
<label className="required-label">Course</label>
        <select ref={refs.course} name="course" value={formData.course} onChange={handleChange} className="course-qd">
          <option value="">Select Course</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
          <option value="Degree">Degree</option>
          <option value="Other">Other</option>
        </select>

        {formData.course === "Other" && (
          <input ref={refs.otherCourse}
            name="otherCourse"
            value={formData.otherCourse}
            onChange={handleChange}
            placeholder="Enter Your Course"
            className="course-enter-qd"
          />
          
        )}
        {errors.course && <p className="error">{errors.course}</p>}
        {errors.otherCourse && <p className="error">{errors.otherCourse}</p>}

        {/* DEPARTMENT */}
        <label className="required-label">Department</label>

        <input ref={refs.department} name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="department-qd" />
        {errors.department && <p className="error">{errors.department}</p>}


        {/* COLLEGE */}
        <label className="required-label">College Name</label>

        <input ref={refs.college} name="college" value={formData.college} onChange={handleChange} placeholder="College Name" className="college-qd"/>
                {errors.college && <p className="error">{errors.college}</p>}


<label className="required-label">Grade</label>
<div className="grade-radio-group">
  <label className="grade-option">
    <input
    ref={refs.gradeType}
      type="radio"
      name="gradeType"
      value="cgpa"
      checked={formData.gradeType === "cgpa"}
      onChange={handleChange}
    />
    CGPA
  </label>

  <label className="grade-option">
    <input ref={refs.gradeType}
      type="radio"
      name="gradeType"
      value="percentage"
      checked={formData.gradeType === "percentage"}
      onChange={handleChange}
    />
    Percentage
  </label>
</div>

{formData.gradeType && (
  <input
    className="grade-input"
    type="text"
    name="cgpa"
    placeholder={
      formData.gradeType === "cgpa"
        ? "Enter CGPA (4 - 10)"
        : "Enter Percentage (35% - 100%)"
    }
    value={formData.cgpa}
    onChange={handleCgpaOrPercentage}
    required
  />
)}

{errors.cgpa && <p className="error">{errors.cgpa}</p>}


        {/* EMPLOYEE TYPE */}
        <label className="required-label">Employee Type</label>
        <div className="employee-type">
          <label>
            <input
            ref={refs.employeeType}
              type="radio"
              name="employeeType"
              value="Fresher"
              checked={formData.employeeType === "Fresher"}
              onChange={handleChange}
            />{" "}
            Fresher
          </label>

          <label>
            <input
              ref={refs.employeeType}
              type="radio"
              name="employeeType"
              value="Experience"
              checked={formData.employeeType === "Experience"}
              onChange={handleChange}
            />{" "}
            Experience
          </label>
        </div>

        {/* EXPERIENCE FIELDS (Only When Experience = selected) */}
        {formData.employeeType === "Experience" && (
          <>
<label className="required-label">Company Name</label>
            <input
              ref={refs.companyName}
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter Company Name"
            />
            {errors.companyName && <p className="error">{errors.companyName}</p>}

            <label className="required-label">Experience</label>
            <select
              ref={refs.experienceYears}
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
            >
              <option value="">Select Experience</option>
              <option value="Less than 1 Year">Less than 1 Year</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="2-3 Years">2-3 Years</option>
              <option value="3-4 Years">3-4 Years</option>
              <option value="4-5 Years">4-5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>

            {errors.experienceYears && <p className="error">{errors.experienceYears}</p>}
          </>
        )}

        {/* SKILLS */}
<label className="required-label">Skills</label>
        <div className="skill-input-row">
          <input
          ref={refs.skills}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value.replace(/[^A-Za-z\s]/g, ""))}
            placeholder="Enter Skill"
    
          />
          <button type="button" onClick={addSkill}>Add</button>
        </div>
        {errors.skills && <p className="error">{errors.skills}</p>}

        <div className="skills-qd">
          {formData.skills.map((skill, idx) => (
            <span key={idx} className="skill-chip">
              {skill} <button type="button" onClick={() => removeSkill(skill)}>x</button>
            </span>
          ))}
        </div>

        {/* RESUME */}
<label className="required-label">Upload Resume</label>
        <input ref={refs.resume} type="file" name="resume" accept=".pdf" onChange={handleChange} />
        {errors.resume && <p className="error">{errors.resume}</p>}

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default QuickDetails;
