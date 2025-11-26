import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PersonalDetails from "./PersonalDetails.jsx";
import EducationDetails from "./EducationaDetails.jsx";
import ProfessionalDetails from "./ProfessionalDetails.jsx";
import ReviewSubmit from "./ReviewSubmit.jsx";
import Stepper from "./Stepper.jsx";
import "./indexApp.css";
import {
  simpleValidatePersonal,
  simpleValidateEducation,
  simpleValidateProfessional,
} from "./validation.jsx";

function PersonApp({ setApplicationSubmitted }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // -------------------- STEP MANAGEMENT --------------------
  const steps = [
    "Personal Details",
    "Education Details",
    "Professional Details",
    "Review & Submit",
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const getStepName = () => {
    switch (currentStep) {
      case 0:
        return "personal";
      case 1:
        return "education";
      case 2:
        return "professional";
      case 3:
        return "review";
      default:
        return "personal";
    }
  };

  const active = getStepName();

  
const handleSuccess = () => {
  const officialEmail = localStorage.getItem("userEmail");
localStorage.setItem("mustFillPersonalDetails", false);
localStorage.setItem("mustFillEducationDetails", false);
localStorage.setItem("mustFillProfessionalDetails", false);


  // Redirect to review page
  navigate(`/employee/profile/${officialEmail}`);
};

 



  // -------------------- FORM STATES --------------------
  const [personal, setPersonal] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    alternativePhone: "",
    gender: "",
    bloodGroup: "",
    dob: "",
    maritalStatus: "",
    isMarried: false,
    emergencyNumber: "",
    nominee1: "",
    nominee1Relation:"",
    nominee1Phone:"",
    nominee1Percentage:"",
    nominee2: "",
    nominee2Relation:"",
    nominee2Phone:"",
    nominee2Percentage:"",
    currentAddress: "",
    permanentAddress: "",
    sameAddress: false,
    landmark: "",
    pincode: "",
    village: "",
    state: "",
    aadharNumber: "",
    panNumber: "",
    photo: null,
    aadharUpload: null,
    panUpload: null,
    spouse:"",
    children:[],
    marriageCertificate: null,
  });

  const [education, setEducation] = useState({
    
    schoolName10: "",
    year10: "",
    cgpa10: "",
    certificate10: null,
    interOrDiploma: "",
    collegeName12: "",
    year12: "",
    cgpa12: "",
    certificate12: null,
    gapReason12: "",
    collegeNameUG: "",
    yearUG: "",
    cgpaUG: "",
    certificateUG: null,
    gapReasonUG: "",
    hasMTech: false,
    collegeNameMTech: "",
    yearMTech: "",
    cgpaMTech: "",
    certificateMTech: null,
    hasCourse:false,
    courseName:"",
    institueName:"",
    courseDuration:"",
    cgpaCourse:"",
    certificateCourse:"",
    yearCourse:"",
  });

  const [professional, setProfessional] = useState({
    employeeId: "",
    dateOfJoining: "",
    role: "",
    department: "",
    salary: "",
    hasExperience: false,
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
  });

  // -------------------- VALIDATION --------------------
  const validateCurrentStep = () => {
    let newErrors = {};
    if (currentStep === 0) newErrors = simpleValidatePersonal(personal);
    else if (currentStep === 1) newErrors = simpleValidateEducation(education);
    else if (currentStep === 2)
      newErrors = simpleValidateProfessional(professional);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- API CALLS --------------------
  const savePersonal = async () => {
  try {
    const formData = new FormData();
    
    for (const key in personal) {
      if (personal[key] instanceof File)
        formData.append(key, personal[key]);
      else formData.append(key, personal[key] ?? "");
    }

    console.log("📤 Sending data to: /api/personal/save");

    const res = await axios.post(
"/api/personal/save",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);


    // ✅ check if backend responded properly
    console.log("✅ Personal data saved:", res);

    // Some APIs don’t return `success: true`, so we just assume if no error => OK
    return true;
  } catch (err) {
    console.error("❌ Personal save failed:", err);
    return false;
  }
};


  const saveEducation = async () => {
    try {
      const formData = new FormData();
      for (const key in education) {
        if (education[key] instanceof File)
          formData.append(key, education[key]);
        else formData.append(key, education[key] ?? "");
      }

      console.log("📤 Sending data to: /api/education/save");
      const res = await axios.post(
"/api/education/save",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);

      console.log("✅ Education data saved:", res.data);
      return true;
    } catch (err) {
      console.error("❌ Education save failed:", err);
      return false;
    }
  };

  const saveProfessional = async () => {
    try {
      const formData = new FormData();

      for (const key in professional) {
        if (key === "experiences") {
          formData.append("experiences", JSON.stringify(professional.experiences));
        } else if (professional[key] instanceof File) {
          formData.append(key, professional[key]);
        } else {
          formData.append(key, professional[key] ?? "");
        }
      }

      console.log("📤 Sending data to: /api/professional/save");
      const res = await axios.post(
"/api/professional/save",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);

      console.log("✅ Professional data saved:", res.data);
      return true;
    } catch (err) {
      console.error("❌ Professional save failed:", err);
      return false;
    }
  };

  // -------------------- STEP CONTROL --------------------
  const nextStep = async () => {
  console.log("🟡 Current Step:", currentStep);

  const isValid = validateCurrentStep();
  console.log("🔹 Validation Passed?", isValid);

  if (!isValid) return;

  let success = false;

  
  
  setCurrentStep(prev => prev + 1); // just go next  


  // ✅ Always log the result
  console.log("🟢 Save success?", success);

  if (success) {
    console.log("➡️ Moving to next step...");
    setCurrentStep((prev) => {
      console.log("🔄 Next Step Index:", prev + 1);
      return Math.min(prev + 1, steps.length - 1);
    });
  } else {
    console.log("❌ Save failed, staying on this step.");
  }
};


  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // -------------------- RENDER --------------------
  return (
    <div className="dashboard-employee">
      <main className="main-content">
        <header className="topbar-employee">
          <h2>Employee Application Form</h2>
        </header>

        <section className="content-card">
          <Stepper steps={steps} currentStep={currentStep} />

          {active === "personal" && (
            <PersonalDetails
              data={personal}
              setData={setPersonal}
              errors={errors}
              setErrors={setErrors}
              nextStep={nextStep}
            />
          )}

          {active === "education" && (
            <EducationDetails
              data={education}
              setData={setEducation}
              errors={errors}
              setErrors={setErrors}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {active === "professional" && (
            <ProfessionalDetails
              data={professional}
              setData={setProfessional}
              errors={errors}
              setErrors={setErrors}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {active === "review" && (
            <ReviewSubmit
              personal={personal}
              education={education}
              professional={professional}
              setErrors={setErrors}
              prevStep={prevStep}
              onSuccess={handleSuccess}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default PersonApp;
