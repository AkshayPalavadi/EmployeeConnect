// import React, { useState } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import "./Profile.css";
// import { BsPassport } from "react-icons/bs";

// const Profile = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     dateofbirth:"",
//     personalEmail: "",
//     phoneNumber: "",
//     bloodGroup: "",
//     gender: "",
//     married: "",   // "Yes" or "No"
//     marriageCertificate: null,
//     address: "",
//     aadharNumber: "",
//     panNumber: "",
//     Passport:"",
//     education: {
//   "10th": { schoolName: "", year: "", marks: "", certificate: null },
// "12th": { schoolName: "", year: "", marks: "", certificate: null, careerGap: "", careerGapReason: "" },
// "Degree/B.Tech": { collegeName: "", year: "", marks: "", certificate: null, degreeType: "", careerGap: "", careerGapReason: "" },

// },

//     fullName: "",
//     officialEmail: "",
//     doj: "",
//     role: "",
//     department: "",
//     employeeId: "",
//     PhoneNumber: "",
//     skills:"",
//     RolesandResponsibilities:"",

//     experiences: [],

//   });

//   const [passportPhoto, setPassportPhoto] = useState(null);
//   const [aadharFile, setAadharFile] = useState(null);
//   const [panFile, setPanFile] = useState(null);
//   const [resumeFile, setResumeFile] = useState(null);
//   const [marriageFile, setMarriageFile] = useState(null);
//   // const [postTenthEducation, setPostTenthEducation] = useState("");
//   // const [degreeType, setDegreeType] = useState("");
//   // const [passportDoc, setPassportDoc] = useState(null);
// // At the top of your component
// const [aadharSegments, setAadharSegments] = useState(["", "", ""]);
// const aadharRefs = [React.useRef(null), React.useRef(null), React.useRef(null)];
// const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(name => name.trim() !== "").join(" ");

//   const departments = [
//   "HR",
//   "Finance",
//   "Development",
//   "Marketing",
//   "Sales",
//   "Operations",
//   "Support",
//   "Legal",
//   "IT",
//   "Admin"
//   // Add any other departments you have
// ];



//   const countryCodes = [
//   { name: "India", code: "+91" },
//   { name: "United States", code: "+1" },
//   { name: "United Kingdom", code: "+44" },
//   { name: "Canada", code: "+1" },
//   { name: "Australia", code: "+61" },
//   // Add more countries
// ];

// const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
// const [localNumber, setLocalNumber] = useState("");

// const currentYear = new Date().getFullYear();
// const years = [];
// for (let y = currentYear; y >= 1970; y--) {
//   years.push(y);
// }

//   const [errors, setErrors] = useState({});


//   const handleCountrySelect = (e) => {
//   const val = e.target.value;
//   const match = countryCodes.find(c => val.includes(c.name));
//   if (match) {
//     setSelectedCountry(match);
//     // Update phone number in formData with selected country code
//     setFormData(prev => ({ ...prev, phoneNumber: match.code + phone }));
//   }
// };


//   const handleChange = (e) => {
//   const { name, value } = e.target;
//   let newErrors = { ...errors };

//   // Basic pattern checks
//   if (name === "phoneNumber") {
//   const phoneRegex = /^\d{6,15}$/; // Allow local numbers from 6 to 15 digits
// if (!phoneRegex.test(value)) {
//   newErrors.phoneNumber = "Phone number must be 6–15 digits";
// } else {
//       delete newErrors.phoneNumber;
//     }
// }


//   if (name === "aadharNumber") {
//     const aadharRegex = /^\d{12}$/;
//     if (!aadharRegex.test(value)) {
//       newErrors.aadharNumber = "Aadhar number must be 12 digits";
//     } else {
//       delete newErrors.aadharNumber;
//     }
//   }

//   if (name === "panNumber") {
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     if (!panRegex.test(value)) {
//       newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
//     } else {
//       delete newErrors.panNumber;
//     }
//   }

//   if (name === "personalEmail") {
//   const emailRegex = /^[^\s@]+@(gmail|yahoo|outlook)\.com$/;
//   if (!emailRegex.test(value)) {
//     newErrors[name] = "Email domain mismatch";
//     // newErrors[name] = "Email domain must be @gmail.com, @yahoo.com, or @outlook.com";
//   } else delete newErrors[name];
// }

// if (name === "officialEmail") {
//   const emailRegex = /^[^\s@]+@(dhatvibs)\.com$/;
//   if (!emailRegex.test(value)) {
//     newErrors[name] = "Email domain must be @dhatvibs.com";
//   } else delete newErrors[name];
// }

//   setErrors(newErrors);
//   setFormData({ ...formData, [name]: value });
// };


//   const handleFileChange = (e, type, level = null) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
//   if (file.size > MAX_SIZE) {
//     setErrors((prev) => ({
//       ...prev,
//       [type === "certificate" ? `${level}-certificate` : `${type}File`]: "File size must be less than 2 MB",
//     }));
//     return;
//   }

//     if (type === "passport") {
//       if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
//         setErrors((prev) => ({ ...prev, passportPhoto: "Only JPG, JPEG, PNG allowed" }));
//         return;
//       } else setErrors((prev) => ({ ...prev, passportPhoto: null }));
//       setPassportPhoto(file);
//     } else if (type === "aadhar") {
//       if (file.type !== "application/pdf") {
//         setErrors((prev) => ({ ...prev, aadharFile: "Only PDF allowed" }));
//         return;
//       } else setErrors((prev) => ({ ...prev, aadharFile: null }));
//       setAadharFile(file);
//     } else if (type === "pan") {
//       if (file.type !== "application/pdf") {
//         setErrors((prev) => ({ ...prev, panFile: "Only PDF allowed" }));
//         return;
//       } else setErrors((prev) => ({ ...prev, panFile: null }));
//       setPanFile(file);
//     } else if (type === "certificate") {
//       if (file.type !== "application/pdf") {
//         setErrors((prev) => ({ ...prev, [`${level}-certificate`]: "Only PDF allowed" }));
//         return;
//       } else setErrors((prev) => ({ ...prev, [`${level}-certificate`]: null }));
//       setFormData((prev) => ({
//         ...prev,
//         education: {
//           ...prev.education,
//           [level]: { ...prev.education[level], certificate: file },
//         },
//       }));
//     } else if (type === "resume") {
//   if (file.type !== "application/pdf") {
//     setErrors((prev) => ({ ...prev, resumeFile: "Only PDF allowed" }));
//     return;
//   } else setErrors((prev) => ({ ...prev, resumeFile: null }));
//   setResumeFile(file);
// } else if (type === "marriage") {
//   if (file.type !== "application/pdf") {
//     setErrors((prev) => ({ ...prev, marriageFile: "Only PDF allowed" }));
//     return;
//   } else setErrors((prev) => ({ ...prev, marriageFile: null }));
//   setMarriageFile(file);
//   setFormData((prev) => ({ ...prev, marriageCertificate: file }));
// } else if (type === "passportDoc") {
//   if (file.type !== "application/pdf") {
//     setErrors((prev) => ({ ...prev, passportDoc: "Only PDF allowed" }));
//     return;
//   } else setErrors((prev) => ({ ...prev, passportDoc: null }));
//   setPassportDoc(file);
//   setFormData((prev) => ({ ...prev, Passport: file.name })); // store file name if needed
// }
// else if (type === "experience") {
//   if (file.type !== "application/pdf/zip") {
//     setErrors((prev) => ({ ...prev, experience: "Only PDF/zip allowed" }));
//     return;
//   } else setErrors((prev) => ({ ...prev, experience: null }));
//   setFormData((prev) => ({ ...prev, experienceCertificate: file }));
// }


//   };

//   const addExperience = () => {
//     setFormData((prev) => ({
//       ...prev,
//       experiences: [
//         ...prev.experiences,
//         { company: "", companyAddress: "", prevCompanyMail: "", role: "", startDate: "", endDate: "", days: 0,
//           hrName: "",
//           hrEmail: "",
//           hrContact: "",
//           managerName: "",
//           managerEmail: "",
//           managerContact: "",
//           reason: "" },
//       ],
//     }));
//   };

//   const removeExperience = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       experiences: prev.experiences.filter((_, i) => i !== index),
//     }));
//   };


//   const handleAadharChange = (e, idx) => {
//   const value = e.target.value.replace(/\D/g, ""); // only digits
//   if (value.length <= 4) {
//     const newSegments = [...aadharSegments];
//     newSegments[idx] = value;
//     setAadharSegments(newSegments);

//     // auto-focus next box
//     if (value.length === 4 && idx < 2) {
//       aadharRefs[idx + 1].current.focus();
//     }

//     // update concatenated Aadhar in formData
//     setFormData(prev => ({
//       ...prev,
//       aadharNumber: newSegments.join(" ")
//     }));
//   }
// };

// const handleAadharKeyDown = (e, idx) => {
//   if (e.key === "Backspace" && aadharSegments[idx] === "" && idx > 0) {
//     aadharRefs[idx - 1].current.focus();
//   }
// };


//   const handleExperienceChange = (index, field, value) => {
//     const newExperiences = [...formData.experiences];
//     newExperiences[index][field] = value;

//     if (field === "startDate" || field === "endDate") {
//   const start = new Date(newExperiences[index].startDate);
//   const end = new Date(newExperiences[index].endDate);

//   if (!isNaN(start) && !isNaN(end)) {
//     if (start > end) {
//       alert(`Start Date must be before End Date for experience ${index + 1}`);
//       // Reset the invalid field
//       newExperiences[index][field] = "";
//       newExperiences[index].days = 0;
//     } else {
//       newExperiences[index].days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
//     }
//   }
// }


//     setFormData((prev) => ({ ...prev, experiences: newExperiences }));
//   };

//   const handleEducationChange = (level, field, value) => {
//   setFormData((prev) => ({
//     ...prev,
//     education: {
//       ...prev.education,
//       [level]: {
//         ...prev.education[level],
//         [field]: value,
//       },
//     },
//   }));
// };


//   const loadFileAsDataURL = (file) => {
//     return new Promise((resolve) => {
//       if (!file) return resolve(null);
//       const reader = new FileReader();
//       reader.onload = (e) => resolve(e.target.result);
//       reader.readAsDataURL(file);
//     });
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   let newErrors = {};

//   // Extract only the last 10 digits of phone number
//   const rawPhone = formData.phoneNumber.replace(/\D/g, ''); // remove + or other chars
//   const actualPhone = rawPhone.slice(-10);

//   // On submit
// const phoneRegex = /^\d{6,15}$/; // Allow local numbers from 6 to 15 digits
// if (!phoneRegex.test(localNumber)) {
//   newErrors.phoneNumber = "Phone number must be 6–15 digits";
// }

// // Extract digits and check length
// const rawAadhar = aadharSegments.join('');
// if (!/^\d{12}$/.test(rawAadhar)) {
//   newErrors.aadharNumber = "Aadhar must be exactly 12 digits";
// }

//   // const aadharRegex = /^\d{12}$/;
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

//   // if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";
//   // if (!aadharRegex.test(formData.aadharNumber)) newErrors.aadharNumber = "Aadhar number must be 12 digits";
//   if (!panRegex.test(formData.panNumber)) newErrors.panNumber = "PAN must match Indian format";

//   if (!resumeFile) newErrors.resumeFile = "Resume PDF is required";
//   if (!passportPhoto) newErrors.passportPhoto = "Passport photo is required";
//   if (!aadharFile) newErrors.aadharFile = "Aadhar PDF is required";
//   if (!panFile) newErrors.panFile = "PAN PDF is required";
//   if (formData.married === "Yes" && !marriageFile) {
//     newErrors.marriageFile = "Marriage certificate PDF is required";
//   }


//   Object.entries(formData.education).forEach(([level, edu]) => {
//   if (edu.selected || level === "10th" || edu.degreeType) {
//     if (!edu.year) newErrors[`${level}-year`] = `${level} Year is required`;
//     if (!edu.marks) newErrors[`${level}-marks`] = `${level} Marks/CGPA is required`;
//     if (!edu.certificate) newErrors[`${level}-certificate`] = `${level} certificate is required`;

//     // if (edu.careerGap && parseInt(edu.careerGap) >= 1 && !edu.careerGapReason) {
//     //   newErrors[`${level}-careerGapReason`] = `Reason required for career gap of ${edu.careerGap} year(s)`;
//     // }
//   }
// });


//   formData.experiences.forEach((exp, idx) => {
//   if (exp.startDate && exp.endDate) {
//     const start = new Date(exp.startDate);
//     const end = new Date(exp.endDate);
//     if (start > end) {
//       newErrors[`experience-${idx}`] = `Start Date must be before End Date for experience ${idx + 1}`;
//     }
//   }
// });

//   setErrors(newErrors);
//   if (Object.keys(newErrors).length > 0) return;

//   const doc = new jsPDF();

//   // Title
//   doc.setFontSize(24);
//   doc.text("Employee Profile", 105, 15, { align: "center" });

//   // Passport Photo
//   if (passportPhoto) {
//     const imgData = await loadFileAsDataURL(passportPhoto);
//     if (imgData) {
//       doc.addImage(imgData, "JPEG", 160, 20, 40, 40);
//     }
//   }

//   // ✅ Personal Information Table
//   autoTable(doc, {
//     startY: 70,
//     head: [["Personal Information", "Details"]],
//     body: [
//       ["First Name", formData.firstName],
//       ["Middle Name", formData.middleName],
//       ["Last Name", formData.lastName],
//       ["Date of Birth",formData.dateofbirth],
//       ["Personal Email", formData.personalEmail],
//       ["Phone Number", formData.phoneNumber],
//       ["Blood Group", formData.bloodGroup],
//       ["Gender", formData.gender],
//       ["Marital Status", formData.married === "Yes" ? "Married" : "Unmarried"],
//       ["Address", formData.address],
//       ["Aadhar Number", formData.aadharNumber],
//       ["PAN Number", formData.panNumber],
//       // ["Pass Port",formData.Passport],
//     ],
//     theme: "grid",
//     headStyles: { fillColor: [39, 174, 96] },
//   });

//   // ✅ Professional Information Table
//   autoTable(doc, {
//     startY: doc.lastAutoTable.finalY + 10,
//     head: [["Professional Information", "Details"]],
//     body: [
//       ["Full Name", fullName],
//       ["Official Email", formData.officialEmail],
//       ["Date of Joining", formData.doj],
//       ["Role", formData.role],
//       ["Department", formData.department],
//       ["Employee ID", formData.employeeId],
//       [" Phone Number", formData.PhoneNumber],
//       ["Skills", formData.Skills],
//       ["Roles and Responsibilities", formData.RolesandResponsibilities],
//     ],
//     theme: "grid",
//     headStyles: { fillColor: [39, 174, 96] },
//   });

//   // ✅ Experiences Table
// if (formData.experiences.length > 0) {
// formData.experiences.forEach((exp, idx) => {
//   // Add a heading row for each experience
//   autoTable(doc, {
//     startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 70,
//     head: [[`Previous Experience ${idx + 1}`, "Details"]],
//     body: [
//       ["Company Name", exp.company],
//       ["Company Address", exp.companyAddress],
//       ["Previous Company Email", exp.prevCompanyMail],
//       ["Role", exp.role],
//       ["Start Date", exp.startDate],
//       ["End Date", exp.endDate],
//       ["Days Worked", exp.days.toString()],
//       ["HR Name", exp.hrName],
//       ["HR Email", exp.hrEmail],
//       ["HR Contact", exp.hrContact],
//       ["Manager Name", exp.managerName],
//       ["Manager Email", exp.managerEmail],
//       ["Manager Contact", exp.managerContact],
//       ["Reason", exp.reason],
//     ],
//     theme: "grid",
//     headStyles: { fillColor: [39, 174, 96] },
//   });
// });

// }

// // ✅ Education Table (with School/College Name, Year, Marks, Career Gap & Reason)
// const educationBody = [];

// // 10th always
// educationBody.push([
//   "10th",
//   formData.education["10th"].schoolName, // School Name
//   formData.education["10th"].year,
//   formData.education["10th"].marks,
//   // gap >= 1 ? formData.education["10th"].careerGap : "None",
//   ""
// ]);

// // 12th / Diploma (conditionally)
// if (formData.education["12th"].selected) {
//   const gap = formData.education["12th"].careerGap
//     ? formData.education["12th"].careerGap
//     : 0;
//   educationBody.push([
//     formData.education["12th"].selected,
//     formData.education["12th"].schoolName, // School Name
//     formData.education["12th"].year,
//     formData.education["12th"].marks,
//     gap >= 1 ? formData.education["12th"].careerGap : "None",
//     gap >= 1 ? formData.education["12th"].careerGapReason || "" : ""
//   ]);
// }

// // Degree / B.Tech / Other (conditionally)
// if (formData.education["Degree/B.Tech"].degreeType) {
//   const gap = formData.education["Degree/B.Tech"].careerGap
//     ? formData.education["Degree/B.Tech"].careerGap
//     : 0;
//   educationBody.push([
//     formData.education["Degree/B.Tech"].degreeType,
//     formData.education["Degree/B.Tech"].collegeName, // College Name
//     formData.education["Degree/B.Tech"].year,
//     formData.education["Degree/B.Tech"].marks,
//     gap >= 1 ? formData.education["Degree/B.Tech"].careerGap : "None",
//     gap >= 1 ? formData.education["Degree/B.Tech"].careerGapReason || "" : ""
//   ]);
// }

// autoTable(doc, {
//   startY: doc.lastAutoTable.finalY + 10,
//   head: [["Education Level", "School/College Name", "Year", "Marks/CGPA", "Career Gap", "Reason"]],
//   body: educationBody,
//   theme: "grid",
//   headStyles: { fillColor: [39, 174, 96] },
// });

//   // ✅ Documents Table
//   // autoTable(doc, {
//   //   startY: doc.lastAutoTable.finalY + 10,
//   //   head: [["Document", "File"]],
//   //   body: [
//   //     ["Aadhar", aadharFile?.name || "Not Uploaded"],
//   //     ["PAN", panFile?.name || "Not Uploaded"],
//   //   ],
//   //   theme: "grid",
//   //   headStyles: { fillColor: [39, 174, 96] },
//   // });

//   // ✅ Terms & Conditions
//   // autoTable(doc, {
//   //   startY: doc.lastAutoTable.finalY + 10,
//   //   head: [["Terms & Conditions"]],
//   //   body: [
//   //     [
//   //       "By submitting this form, you confirm that all information provided is true and correct. Any false information may result in disciplinary action or termination."
//   //     ],
//   //     [
//   //       "The company reserves the right to verify your documents and use the provided data strictly for official purposes only."
//   //     ],
//   //     [
//   //       "Your personal data will be securely stored and not shared with third parties except when legally required."
//   //     ],
//   //   ],
//   //   theme: "grid",
//   //   headStyles: { fillColor: [127, 140, 141] },
//   // });

//   doc.save(`${formData.firstName}_${formData.lastName}_Profile.pdf`);
// };


//   return (
//     <div className="container">
//       <h1>Employee Details Form</h1>
//       <form className="form" onSubmit={handleSubmit}>

//         {/* Personal Info */}
//         <h2>Personal Information</h2>
//         <div className="row">
//           <label>
//             <p>
//               First Name<span className="required">*</span>:
//             </p>
//             <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
//             {errors.firstName && <span className="error">{errors.firstName}</span>}
//           </label>
//           <label>
//             <p>
//               Middle Name:
//             </p>
//             <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
//           </label>
//           <label>
//              <p>
//               Last Name<span className="required">*</span>:
//             </p>

//             <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
//             {errors.lastName && <span className="error">{errors.lastName}</span>}
//           </label>
//         </div>
//         <label>
//            <p>
//              Passport Size Photo<span className="required">*</span>:
//             </p>
//           <input type="file" onChange={(e) => handleFileChange(e, "passport")} required />
//           {errors.passportPhoto && <span className="error">{errors.passportPhoto}</span>}
//         </label>
//         <label>
//           <p>
//                Date of Birth<span className="required">*</span>:
//             </p>
//   <input
//     type="date"
//     name="dateofbirth"
//     value={formData.dateofbirth}
//     onChange={handleChange}
//     required
//   />
//   {errors.dateofbirth && <span className="error">{errors.dateofbirth}</span>}
// </label>

//         <label>
//          < p>
//               Upload Resume(PDF only)<span className="required">*</span>:
//             </p>
//   <input type="file" onChange={(e) => handleFileChange(e, "resume")} required />
//   {errors.resumeFile && <span className="error">{errors.resumeFile}</span>}
// </label>


//         <label>
//           < p>
//               Personal Email<span className="required">*</span>:
//             </p>
//           <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} required />
//           {errors.personalEmail && <span className="error">{errors.personalEmail}</span>}
//         </label>

//         <label>
//            < p>
//               Phone Number<span className="required">*</span>:
//             </p>
//   <div style={{ display: "flex", gap: "8px" }}>
//     <select
//       value={selectedCountry.code}
//       onChange={(e) => {
//         const country = countryCodes.find(c => c.code === e.target.value);
//         setSelectedCountry(country);
//       }}
//       style={{ width: "200px" }}
//     >
//       {countryCodes.map((c, idx) => (
//         <option key={idx} value={c.code}>{c.name} ({c.code})</option>
//       ))}
//     </select>

//     <input
//       type="tel"
//       name="phoneNumber"
//       placeholder="Enter phone number"
//       value={localNumber}
//       onChange={(e) => {
//         const onlyNums = e.target.value.replace(/\D/g, ""); // digits only
//         setLocalNumber(onlyNums);

//         // Update formData phoneNumber for submission/PDF
//         setFormData(prev => ({ ...prev, phoneNumber: selectedCountry.code + onlyNums }));
//       }}
//       maxLength={15} // max reasonable length for international number
//       required
//       style={{ flex: 1 }}
//     />
//   </div>
//   {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
// </label>

//         <label>
//             <p>
//      Blood Group<span className="required">*</span>:
//             </p>
//   <select
//     name="bloodGroup"
//     value={formData.bloodGroup}
//     onChange={handleChange}
//     required
//   >
//     <option value="">-- Select Blood Group --</option>
//     <option value="A+">A+</option>
//     <option value="A-">A-</option>
//     <option value="B+">B+</option>
//     <option value="B-">B-</option>
//     <option value="O+">O+</option>
//     <option value="O-">O-</option>
//     <option value="AB+">AB+</option>
//     <option value="AB-">AB-</option>
//   </select>
//   {errors.bloodGroup && <span className="error">{errors.bloodGroup}</span>}
// </label>


//         <label>< p>
//               Gender<span className="required">*</span>:
//             </p>
//         <select
//           name="gender"
//           value={formData.gender}
//           onChange={handleChange}
//           required
//         >
//     <option value="">Select Gender</option>
//     <option value="Male">Male</option>
//     <option value="Female">Female</option>
//     <option value="Other">Other</option>
//   </select>
//   </label>

//       <label>< p>
//               Are you married<span className="required">*</span>?
//             </p></label>
// <div className="marriage">
//   <div>
//   <label>
//     <input
//       type="radio"
//       name="married"
//       value="Yes"
//       checked={formData.married === "Yes"}
//       onChange={(e) => setFormData({ ...formData, married: e.target.value })}
//       style={{width: "20px"}}
//       required
//     /> Yes
//   </label>
//   </div>
//   <div>
//   <label>
//     <input
//       type="radio"
//       name="married"
//       value="No"
//       checked={formData.married === "No"}
//       onChange={(e) => setFormData({ ...formData, married: e.target.value, marriageCertificate: null, marriageFile: null })}
//       style={{width: "20px"}}
//     /> No
//   </label>
// </div>
// </div>

// {formData.married === "Yes" && (
//   <label>Upload Marriage Certificate (PDF only):
//     <input type="file" onChange={(e) => handleFileChange(e, "marriage")} />
//     {errors.marriageFile && <span className="error">{errors.marriageFile}</span>}
//   </label>
// )}

// <label>
//   <p>
//     Address<span className="required">*</span>:
//   </p>
//   <input type="text" name="address" value={formData.address} onChange={handleChange} required />
// </label>


//         <div className="row">
//   <label>
//     < p>
//               Aadhar Number<span className="required">*</span>:
//             </p>
//   </label>
//   <div style={{ display: "flex", gap: "8px" }}>
//     {aadharSegments.map((seg, idx) => (
//       <input
//         key={idx}
//         type="text"
//         value={seg}
//         maxLength={4}
//         ref={aadharRefs[idx]}
//         onChange={(e) => handleAadharChange(e, idx)}
//         onKeyDown={(e) => handleAadharKeyDown(e, idx)}
//         style={{ width: "60px", textAlign: "center" }}
//         required
//       />
//     ))}
//   </div>
//   {errors.aadharNumber && <span className="error">{errors.aadharNumber}</span>}
// </div>

// <label>
//   < p>
//               Upload Aadhar(PDF only)<span className="required">*</span>:
//             </p>
//   <input type="file" onChange={(e) => handleFileChange(e, "aadhar")} required />
//   {errors.aadharFile && <span className="error">{errors.aadharFile}</span>}
// </label>

//         <div className="row">
//           <label>
//              < p>
//              PAN Number<span className="required">*</span>:
//             </p>
//             <input type="text" name="panNumber" value={formData.panNumber} pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" onChange={handleChange} required />
//             {errors.panNumber && <span className="error">{errors.panNumber}</span>}
//           </label>
//           <label>
//               < p>
//              Upload PAN(PDF only)<span className="required">*</span>:
//             </p>
//             <input type="file" onChange={(e) => handleFileChange(e, "pan")} required />
//             {errors.panFile && <span className="error">{errors.panFile}</span>}
//           </label>
//         </div>

//         <label>
//            < p>
//              Upload Passport Document (PDF only)
//             </p>
//   <input type="file" onChange={(e) => handleFileChange(e, "passportDoc")} />
//   {errors.passportDoc && <span className="error">{errors.passportDoc}</span>}
// </label>


        

// {/* Education Section */}
// <h2>Education</h2>

// {/* 10th always visible */}
// <div className="row">
//   <label>
//      < p>
//             10th School Name<span className="required">*</span>:
//             </p>
//     <input
//       type="text"
//       value={formData.education["10th"].schoolName}
//       onChange={(e) => handleEducationChange("10th", "schoolName", e.target.value)}
//       required
//     />
//     {errors["10th-schoolName"] && <span className="error">{errors["10th-schoolName"]}</span>}
//   </label>

//   <label>
//      < p>
//             10th Year<span className="required">*</span>:
//             </p>
//   <select
//     value={formData.education["10th"].year}
//     onChange={(e) => handleEducationChange("10th", "year", e.target.value)}
//     required
//   >
//     <option value="">Select Year</option>
//     {years.map((y) => (
//       <option key={y} value={y}>{y}</option>
//     ))}
//   </select>
//   {errors["10th-year"] && <span className="error">{errors["10th-year"]}</span>}
// </label>


//   <label>
//     < p>
//             10th Marks/CGPA<span className="required">*</span>:
//             </p>
//     <input
//       type="text"
//       value={formData.education["10th"].marks}
//       onChange={(e) => handleEducationChange("10th", "marks", e.target.value)}
//       required
//     />
//     {errors["10th-marks"] && <span className="error">{errors["10th-marks"]}</span>}
//   </label>

//   <label>
//     < p>
//            Upload 10th Certificate (PDF only)<span className="required">*</span>:
//             </p>
//     <input
//       type="file"
//       onChange={(e) => handleFileChange(e, "certificate", "10th")}
//       required
//     />
//     {errors["10th-certificate"] && <span className="error">{errors["10th-certificate"]}</span>}
//   </label>
// </div>


// {/* 12th / Diploma dropdown */}
// <div className="row">
//   <label>
//     < p>
//            Post-10th Qualification<span className="required">*</span>:
//             </p>
//     <select
//       value={formData.education["12th"].selected || ""}
//       onChange={(e) => handleEducationChange("12th", "selected", e.target.value)} required
//     >
//       <option value="">Select</option>
//       <option value="12th">12th</option>
//       <option value="Diploma">Diploma</option>
//     </select>
//   </label>
// </div>

// {/* 12th / Diploma details (conditionally visible) */}
// {formData.education["12th"].selected && (
//   <div className="row">
//     <label>< p>{formData.education["12th"].selected} School Name<span className="required">*</span>:
//             </p>
//       <input
//         type="text"
//         value={formData.education["12th"].schoolName}
//         onChange={(e) => handleEducationChange("12th", "schoolName", e.target.value)}
//         required
//       />
//       {errors["12th-schoolName"] && <span className="error">{errors["12th-schoolName"]}</span>}
//     </label>
//     {formData.education["12th"].selected && (
//   <label>< p>{formData.education["12th"].selected} Year<span className="required">*</span>:
//             </p>
//     <select
//       value={formData.education["12th"].year}
//       onChange={(e) => handleEducationChange("12th", "year", e.target.value)}
//       required
//     >
//       <option value="">Select Year</option>
//       {years.map((y) => (
//         <option key={y} value={y}>{y}</option>
//       ))}
//     </select>
//     {errors["12th-year"] && <span className="error">{errors["12th-year"]}</span>}
//   </label>
// )}

//     <label>< p>{formData.education["12th"].selected} Marks/CGPA<span className="required">*</span>:
//             </p>
//       <input
//         type="text"
//         value={formData.education["12th"].marks}
//         onChange={(e) => handleEducationChange("12th", "marks", e.target.value)}
//         required
//       />
//       {errors["12th-marks"] && <span className="error">{errors["12th-marks"]}</span>}
//     </label>
//     <label>
//       <p>Upload {formData.education["12th"].selected} Certificate (PDF only)<span className="required">*</span>:
//             </p>
//       <input
//         type="file"
//         onChange={(e) => handleFileChange(e, "certificate", "12th")}
//         required
//       />
//       {errors["12th-certificate"] && <span className="error">{errors["12th-certificate"]}</span>}
//     </label>

//     {/* Career Gap */}
//     <label>< p>
//            Career Gap (Years)<span className="required">*</span>:
//             </p>
//       <select
//         value={formData.education["12th"].careerGap || ""}
//         onChange={(e) => handleEducationChange("12th", "careerGap", e.target.value)}
//       >
//         <option value="">Select</option>
//         <option value="0">None</option>
//         <option value="1">1 year</option>
//         <option value="2">2 years</option>
//         <option value="3">3 years</option>
//         <option value="4">More than 3 years</option>
//       </select>
//     </label>

//     {/* Career Gap Reason */}
//     {formData.education["12th"].careerGap >= 1 && (
//       <label>Reason for Career Gap:
//         <input
//           type="text"
//           value={formData.education["12th"].careerGapReason || ""}
          
//           onChange={(e) => handleEducationChange("12th", "careerGapReason", e.target.value)}
//         />
//         {errors["12th-careerGapReason"] && <span className="error">{errors["12th-careerGapReason"]}</span>}
//       </label>
//     )}
//   </div>
// )}

// {/* Degree / B.Tech dropdown */}
// <div className="row">
//   <label>
//     < p>Degree / B.Tech / Others <span className="required">*</span>
//             </p>
//     <select
//       value={formData.education["Degree/B.Tech"].degreeType || ""}
//       onChange={(e) => handleEducationChange("Degree/B.Tech", "degreeType", e.target.value)} required
//     >
//       <option value="">Select</option>
//       <option value="Degree">Degree</option>
//       <option value="B.Tech">B.Tech</option>
//       <option value="Other">Other</option>
//     </select>
//   </label>
// </div>

// {/* Degree / B.Tech details (conditionally visible) */}
// {formData.education["Degree/B.Tech"].degreeType && (
//   <div className="row">
//     <label>< p>{formData.education["Degree/B.Tech"].degreeType} College Name<span className="required">*</span>
//             </p>
//       <input
//         type="text"
//         value={formData.education["Degree/B.Tech"].collegeName}
//         onChange={(e) => handleEducationChange("Degree/B.Tech", "collegeName", e.target.value)}
//         required
//       />
//       {errors["Degree/B.Tech-collegeName"] && <span className="error">{errors["Degree/B.Tech-collegeName"]}</span>}
//     </label>
//     {formData.education["Degree/B.Tech"].degreeType && (
//   <label><p>{formData.education["Degree/B.Tech"].degreeType} Year<span className="required">*</span>
//             </p>
//     <select
//       value={formData.education["Degree/B.Tech"].year}
//       onChange={(e) => handleEducationChange("Degree/B.Tech", "year", e.target.value)}
//       required
//     >
//       <option value="">Select Year</option>
//       {years.map((y) => (
//         <option key={y} value={y}>{y}</option>
//       ))}
//     </select>
//     {errors["Degree/B.Tech-year"] && <span className="error">{errors["Degree/B.Tech-year"]}</span>}
//   </label>
// )}

//     <label><p>{formData.education["Degree/B.Tech"].degreeType} Marks/CGPA <span className="required">*</span>
//             </p>
//       <input
//         type="text"
//         value={formData.education["Degree/B.Tech"].marks}
//         onChange={(e) => handleEducationChange("Degree/B.Tech", "marks", e.target.value)}
//         required
//       />
//       {errors["Degree/B.Tech-marks"] && <span className="error">{errors["Degree/B.Tech-marks"]}</span>}
//     </label>
//     <label><p>Upload {formData.education["Degree/B.Tech"].degreeType} Certificate (PDF only)<span className="required">*</span>:
//             </p>
//       <input
//         type="file"
//         onChange={(e) => handleFileChange(e, "certificate", "Degree/B.Tech")}
//         required
//       />
//       {errors["Degree/B.Tech-certificate"] && <span className="error">{errors["Degree/B.Tech-certificate"]}</span>}
//     </label>

//     {/* Career Gap */}
//     <label>< p>Career Gap (Years)<span className="required">*</span>:
//             </p>
//       <select
//         value={formData.education["Degree/B.Tech"].careerGap || ""}
//         onChange={(e) => handleEducationChange("Degree/B.Tech", "careerGap", e.target.value)}
//       >
//         <option value="">Select</option>
//         <option value="0">None</option>
//         <option value="1">1 year</option>
//         <option value="2">2 years</option>
//         <option value="3">3 years</option>
//         <option value="4">More than 3 years</option>
//       </select>
//     </label>

//     {/* Career Gap Reason */}
//     {formData.education["Degree/B.Tech"].careerGap >= 1 && (
//       <label>Reason for Career Gap:
//         <input
//           type="text"
//           value={formData.education["Degree/B.Tech"].careerGapReason || ""}
//           onChange={(e) => handleEducationChange("Degree/B.Tech", "careerGapReason", e.target.value)}
//         />
//         {errors["Degree/B.Tech-careerGapReason"] && <span className="error">{errors["Degree/B.Tech-careerGapReason"]}</span>}
//       </label>
//     )}
//   </div>
// )}


//         {/* Previous Experience */}
//         <h2>Previous Experience</h2>
//         {formData.experiences.map((exp, index) => (
//           <div key={index} className="experience-block">
//             <div className="row">
//               <label>
//                  <p>
//         Company Name<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, "company", e.target.value)} required />
//               </label>
//               <label>
//                  <p>
//         Company Address<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.companyAddress} onChange={(e) => handleExperienceChange(index, "companyAddress", e.target.value)} required /></label>
//               <label>
//                 < p>Previous Company Mail<span className="required">*</span>:
//             </p>
//                 <input type="email" value={exp.prevCompanyMail} onChange={(e) => handleExperienceChange(index, "prevCompanyMail", e.target.value)} required /></label>
//               <label>
//                  <p>
//       Role<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.role} onChange={(e) => handleExperienceChange(index, "role", e.target.value)} required />
//               </label>
//               <label>
//                  <p>
//      Upload Experience Certificate (PDF/ZIP file)<span className="required">*</span>:
//             </p>
//   <input type="file" onChange={(e) => handleFileChange(e, "experience")} required />
//   {errors.experience && <span className="error">{errors.experience}</span>}
// </label>

//               <label>
//                  <p>
//      Start Date<span className="required">*</span>:
//             </p>
//                 <input type="date" value={exp.startDate} onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)} required />
//                 {errors[`experience-${index}`] && (
//                   <span className="error">{errors[`experience-${index}`]}</span>
//                 )}
//               </label>
//               <label>
//                  <p>
//      End Date<span className="required">*</span>:
//             </p>
//                 <input type="date" value={exp.endDate} onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)} required />
//                 {errors[`experience-${index}`] && (
//                   <span className="error">{errors[`experience-${index}`]}</span>
//                 )}
//               </label>
//               <label>Days Worked:
//                 <input type="number" className="durationBox" value={exp.days} readOnly />
//               </label>
//               <label><p>
//      HR Name<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.hrName} onChange={(e) => handleExperienceChange(index, "hrName", e.target.value)} required /></label>
//               <label>
//                 <p>
//      HR Email<span className="required">*</span>:
//             </p>
//                 <input type="email" value={exp.hrEmail} onChange={(e) => handleExperienceChange(index, "hrEmail", e.target.value)} required /></label>
//               <label>
//                 <p>
//      HR Contact<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.hrContact} pattern="[0-9]{10}" maxLength={10} onChange={(e) => handleExperienceChange(index, "hrContact", e.target.value)} required />
//                 </label>

//               <label>
//                 <p>
//      Manager Name<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.managerName} onChange={(e) => handleExperienceChange(index, "managerName", e.target.value)} required /></label>
//               <label>
//                 <p>
//      Manager Email<span className="required">*</span>:
//             </p>
//                 <input type="email" value={exp.managerEmail} onChange={(e) => handleExperienceChange(index, "managerEmail", e.target.value)} required /></label>
//               <label>
//                 <p>
//      Manager Contact<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.managerContact} pattern="[0-9]{10}" maxLength={10} onChange={(e) => handleExperienceChange(index, "managerContact", e.target.value)} required /></label>

//               <label>
//                 <p>
//      Reason for Leaving<span className="required">*</span>:
//             </p>
//                 <input type="text" value={exp.reason} onChange={(e) => handleExperienceChange(index, "reason", e.target.value)} required />
//               </label>
//               <button type="button" onClick={() => removeExperience(index)}>Remove</button>
//             </div>
//           </div>
//         ))}
//         <button type="button" onClick={addExperience} className="addexp-btn">+ Add Experience</button>

//         {/* Professional Info */}
//         <h2>Professional Information</h2>
//         <label>
//           <p>
//      Full Name:
//             </p>
//   <input type="text" name="fullName" value={fullName} readOnly style={{cursor: "not-allowed"}}/>
// </label>

//         <label>
//           <p>
//      Official Email<span className="required">*</span>:
//             </p>
//           <input type="email" name="officialEmail" value={formData.officialEmail} onChange={handleChange} required />
//           {errors.officialEmail && <span className="error">{errors.officialEmail}</span>}
//         </label>
//         <label>
//           <p>
//      Date of Joining<span className="required">*</span>:
//             </p>
//           <input type="date" name="doj" value={formData.doj} onChange={handleChange} required />
//         </label>
//         <label>
//           <p>
//      Role<span className="required">*</span>:
//             </p>
//           <input type="text" name="role" value={formData.role} onChange={handleChange} required />
//         </label>
//         <label><p>
//      Department<span className="required">*</span>:
//             </p>
//   <select name="department" value={formData.department} onChange={handleChange} required>
//     <option value="">-- Select Department --</option>
//     {departments.map((dept, idx) => (
//       <option key={idx} value={dept}>{dept}</option>
//     ))}
//   </select>
//   {errors.department && <span className="error">{errors.department}</span>}
// </label>

//         <label><p>
//      Employee ID<span className="required">*</span>:
//             </p>
//           <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
//           {errors.employeeId && <span className="error">{errors.employeeId}</span>}
//         </label>
//         <label> <p>
//      Phone Number<span className="required">*</span>:
//             </p>
//           <input type="text" name="PhoneNumber" value={formData.PhoneNumber} pattern="[0-9]{10}" onChange={handleChange} required maxLength={10} />
//           {errors.PhoneNumber && <span className="error">{errors.PhoneNumber}</span>}
//         </label>
//          <label> Skills:
//           <input type="text" name="Skills" value={formData.Skills}  onChange={handleChange} required maxLength={10} />
//           {errors.Skills && <span className="error">{errors.Skills}</span>}
//         </label>
//        < label> Roles and Responsibilities:
//           <input type="text" name="RolesandResponsibilities" value={formData.RolesandResponsibilities}  onChange={handleChange} required maxLength={10} />
//           {errors.RolesandResponsibilities && <span className="error">{errors.RolesandResponsibilities}</span>}
//         </label>

//         {/* Terms & Conditions */}
//         <div className="terms">
//           <h3>Terms & Conditions</h3>
//           <div className="terms-box">
//             <p>By submitting this form, you confirm that all information provided is true and correct. Any false information may result in disciplinary action or termination.</p>
//             <p>The company reserves the right to verify your documents and use the provided data strictly for official purposes only.</p>
//             <p>Your personal data will be securely stored and not shared with third parties except when legally required.</p>
//           </div>
//         </div>

// <div className="terms-checkbox">
//   <input type="checkbox" id="terms" name="terms" required />
//   <label htmlFor="terms"><p>
//      I agree to the Terms & Conditions<span className="required">*</span>
//             </p></label>
// </div>


//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default Profile;
