import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeReview.css";
import { useParams } from "react-router-dom";

export default function EmployeeReview() {
  const { email } = useParams();

  // get email from URL or fallback to logged-in user
  const employeeEmail = email || localStorage.getItem("userEmail");
  console.log(employeeEmail);
  const token = localStorage.getItem("token");

  const [personal, setPersonal] = useState({});
  const [education, setEducation] = useState({});
  const [professional, setProfessional] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState({
    personal: false,
    education: false,
    professional: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // 🚀 FETCH EMPLOYEE DETAILS
  // ============================================
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);

        if (!employeeEmail) {
          setError("❌ Employee email missing.");
          return;
        }

        if (!token) {
          setError("❌ No token found. Please log in again.");
          return;
        }

        // Using Vite proxy → /api maps to your backend
        const apiUrl = `/api/employee/${employeeEmail}`;
        console.log("🔗 Fetching employee details:", apiUrl);

        const res = await axios.get(apiUrl, {
          timeout: 10000,
          headers: { Authorization: `Bearer ${token}` },
        });

        // ===============================
        // ✅ BACKEND RETURNS THIS FORMAT:
        // {
        //   msg,
        //   officialEmail,
        //   personal: {...},
        //   education: {...},
        //   professional: {...}
        // }
        // ===============================

        if (res.data?.personal) {
          setPersonal(res.data.personal);
          setEducation(res.data.education);
          setProfessional(res.data.professional);
        } else {
          setError("❌ No employee data found.");
        }
      } catch (err) {
        if (err.response?.status === 401)
          setError("❌ Unauthorized – Token expired or invalid.");
        else if (err.response?.status === 404)
          setError("❌ Employee not found.");
        else if (err.code === "ECONNABORTED")
          setError("⏳ Request timed out. Please try again.");
        else setError("⚠️ Failed to fetch employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeEmail, token]);

  // ============================================
  // ✏️ Toggle Edit Mode
  // ============================================
  const handleEditToggle = (section) =>
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));

  // ============================================
  // ✏️ Handle Input Change
  // ============================================
  const handleInputChange = (section, field, value) => {
    if (section === "personal")
      setPersonal((prev) => ({ ...prev, [field]: value }));
    else if (section === "education")
      setEducation((prev) => ({ ...prev, [field]: value }));
    else if (section === "professional")
      setProfessional((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: false }));
    alert(`✅ ${section} updated successfully!`);
  };

  // ============================================
  // ⏳ Loading UI
  // ============================================
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>⏳ Loading employee details...</p>
      </div>
    );

  // ============================================
  // ❌ Error UI
  // ============================================
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        <p>{error}</p>
      </div>
    );

  // ============================================
  // 🧩 Render Section Fields
  // ============================================
  const renderSection = (sectionData, sectionName) => (
    <div className="education-info">
      <div className="info-header">
        <h3>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Info</h3>
        <span className="edit-icon" onClick={() => handleEditToggle(sectionName)}>
          ✎
        </span>
      </div>

      {Object.entries(sectionData).map(([key, value]) => {
        if (typeof value === "object" || key.startsWith("_")) return null;
        const hiddenFields = [
        "photo",
        "createdAt",
        "updatedAt",
        "__v",
        "_id",
        "sameAddress",
        "maritalStatus",
        "isMarried",
         // remove from personal section
      ];
            if (hiddenFields.includes(key)) return null;

        return (
          <p key={key}>
            <b>{key.replace(/([A-Z])/g, " $1")}:</b>{" "}
            {editMode[sectionName] ? (
              <input
                type={key.includes("date") ? "date" : "text"}
                value={value || ""}
                onChange={(e) =>
                  handleInputChange(sectionName, key, e.target.value)
                }
              />
            ) : (
              value?.toString() || "N/A"
            )}
          </p>
        );
      })}

      {editMode[sectionName] && (
        <button className="save-btn" onClick={() => handleSave(sectionName)}>
          Save
        </button>
      )}
    </div>
  );

  // ============================================
  // 🖼️ MAIN UI
  // ============================================
  return (
    <div className="employee-details-container">
      {/* HEADER */}
      <div className="employee-header">
        <img
          src={personal.photo || "https://i.ibb.co/5Y8N8tL/avatar.png"}
          alt={personal.firstName || "Employee"}
          className="emp-photo"
        />
        <div className="emp-info">
          <p>
            <strong>Name:</strong> {personal.firstName || "N/A"}{" "}
            {personal.lastName || ""}
          </p>
          <p>
            <strong>Email:</strong> {personal.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {personal.phone || "N/A"}
          </p>
          <p>
            <strong>Blood Group:</strong> {personal.bloodGroup || "N/A"}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-employee">
        {["personal", "education", "professional"].map((tab) => (
          <span
            key={tab}
            className={`tab-employee ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "personal" && renderSection(personal, "personal")}
      {activeTab === "education" && renderSection(education, "education")}
      {activeTab === "professional" && renderSection(professional, "professional")}
    </div>
  );
}
