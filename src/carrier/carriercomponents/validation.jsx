// ---------- BASIC HELPERS ----------
const isEmpty = (v) => !v || String(v).trim() === '';

const isValidName = (s) => /^[A-Za-z\s]+$/.test(s?.trim());
const isEmail = (s) =>
  /^[\w.%+-]+@(gmail|yahoo|outlook)\.com$/i.test(s?.trim());

const isValidPhone = (s) => /^[0-9]{10}$/.test(s?.trim());

const isValidAddress = (s) => typeof s === "string" && s.trim().length >= 3;

const isValidYear = (y) => /^[0-9]{4}$/.test(String(y));

const isValidCGPA = (c) => /^([0-9](\.\d{1,2})?|10(\.0{1,2})?)$/.test(String(c));


// -----------------------------------------------------
//                PERSONAL VALIDATION
// -----------------------------------------------------
export const simpleValidatePersonal = (data) => {
  const errs = {};

  // First Name
  if (isEmpty(data.firstName)) {
    errs.firstName = "First name is required";
  } else if (!isValidName(data.firstName)) {
    errs.firstName = "First name must contain only letters";
  }

  // Last Name
  if (isEmpty(data.lastName)) {
    errs.lastName = "Last name is required";
  } else if (!isValidName(data.lastName)) {
    errs.lastName = "Last name must contain only letters";
  }

  // Email
  if (isEmpty(data.email)) {
    errs.email = "Email is required";
  } else if (!isEmail(data.email)) {
    errs.email = "Email must be a valid @gmail/@yahoo/@outlook address";
  }

  // Phone
  if (isEmpty(data.phone)) {
    errs.phone = "Phone number is required";
  } else if (!isValidPhone(data.phone)) {
    errs.phone = "Phone number must be exactly 10 digits";
  }

  // Gender
  if (isEmpty(data.gender)) errs.gender = "Gender is required";

  // Current Address
  if (!isValidAddress(data.currentAddress))
    errs.currentAddress = "Current address is required";

  // Permanent Address
  if (!isValidAddress(data.permanentAddress))
    errs.permanentAddress = "Permanent address is required";

  // Pincode
  if (!/^[0-9]{6}$/.test(data.pincode))
    errs.pincode = "Pincode must be a 6-digit number";

  // Landmark
  if (!isValidAddress(data.landmark)) errs.landmark = "Landmark is required";

  // State
  if (!isValidName(data.state)) errs.state = "State must contain only letters";

  // Photo
  if (!data.photo) {
    errs.photo = "Please upload a photo";
  } else if (!data.photo.type?.startsWith("image/")) {
    errs.photo = "Uploaded file must be an image";
  }

  return errs;
};


// -----------------------------------------------------
//                EDUCATION VALIDATION
// -----------------------------------------------------
export const simpleValidateEducation = (data) => {
  const errs = {};

  // ---- 10th ----
  if (isEmpty(data.schoolName10))
    errs.schoolName10 = "School name required";
  else if (!isValidName(data.schoolName10))
    errs.schoolName10 = "School name must contain only letters";

  if (!isValidYear(data.year10))
    errs.year10 = "Enter valid 10th passing year (YYYY)";

  if (!isValidCGPA(data.cgpa10)) errs.cgpa10 = "Enter valid 10th CGPA (0–10)";


  // ---- Inter / Diploma ----
  if (isEmpty(data.interOrDiploma))
    errs.interOrDiploma = "Select Intermediate or Diploma";

  if (isEmpty(data.collegeName12))
    errs.collegeName12 = "College name required";

  if (!isValidYear(data.year12))
    errs.year12 = "Enter valid passing year (YYYY)";

  if (!isValidCGPA(data.cgpa12)) errs.cgpa12 = "Enter valid CGPA (0–10)";


  // ---- UG ----
  if (isEmpty(data.collegeNameUG))
    errs.collegeNameUG = "College name required";

  if (!isValidYear(data.yearUG))
    errs.yearUG = "Enter valid UG passing year (YYYY)";

  if (!isValidCGPA(data.cgpaUG)) errs.cgpaUG = "Enter valid CGPA (0–10)";


  // ---- GAP CHECK 10th → 12th ----
  const year10 = Number(data.year10);
  const year12 = Number(data.year12);

  if (year10 && year12) {
    const expected = data.interOrDiploma === "Intermediate" ? 2 : 3;
    const diff = year12 - year10;

    if (diff !== expected) {
      errs.gapReason12 =
        `Expected ${expected} year gap between 10th and ${data.interOrDiploma}. Please specify reason.`;
    }
  }

  // ---- GAP CHECK 12th → UG ----
  const yearUG = Number(data.yearUG);

  if (year12 && yearUG) {
    const expectedUG = data.interOrDiploma === "Intermediate" ? 4 : 3;
    const diff = yearUG - year12;

    if (diff !== expectedUG) {
      errs.gapReasonUG =
        `Expected ${expectedUG} year gap between ${data.interOrDiploma} and Degree. Please specify reason.`;
    }
  }

  if (errs.gapReason12 && isEmpty(data.gapReason12))
    errs.gapReason12 = "Reason for this gap is required.";

  if (errs.gapReasonUG && isEmpty(data.gapReasonUG))
    errs.gapReasonUG = "Reason for this gap is required.";

  return errs;
};


// -----------------------------------------------------
//             PROFESSIONAL VALIDATION
// -----------------------------------------------------
export const simpleValidateProfessional = (data) => {
  const errs = {};

  if (!data.jobType) {
    errs.jobType = "Please select Fresher or Experienced.";
    return errs;
  }

  // -------- FRESHER --------
  if (data.jobType === "fresher") {
    if (isEmpty(data.skills)) errs.skills = "Skills are required.";

    if (data.resume && data.resume.type !== "application/pdf") {
      errs.resume = "Only PDF resumes are allowed.";
    }
  }

  // -------- EXPERIENCED --------
  if (data.jobType === "experienced") {
    if (!data.experiences || data.experiences.length === 0) {
      errs.experiences = "Please add at least one experience.";
    } else {
      data.experiences.forEach((exp, i) => {
        if (isEmpty(exp.companyName))
          errs[`exp_${i}_companyName`] = "Company name required";
        else if (!isValidName(exp.companyName))
          errs[`exp_${i}_companyName`] =
            "Company name must contain only letters";

        if (isEmpty(exp.role))
          errs[`exp_${i}_role`] = "Role is required";

        if (isEmpty(exp.years))
          errs[`exp_${i}_years`] = "Experience years required";
        else if (!/^[0-9]{1,2}$/.test(exp.years))
          errs[`exp_${i}_years`] = "Years must be a valid number";
      });
    }
  }

  return errs;
};


// -----------------------------------------------------
export function validateAll(personal, education, professional) {
  return {
    ...simpleValidatePersonal(personal),
    ...simpleValidateEducation(education),
    ...simpleValidateProfessional(professional),
  };
}
