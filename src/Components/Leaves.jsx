
// src/pages/Leaves.jsx
import { useState, useEffect,useRef } from "react";
import "./Leaves.css";
import History from "./History.jsx";



export default function Leaves() {
  const [activeTab, setActiveTab] = useState("form");
  const diseaseDropdownRef = useRef(null);


  // Form states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [daysApplied, setDaysApplied] = useState(0);
  const [leaveType, setLeaveType] = useState("none");
  const [customTypes, setCustomTypes] = useState([]);
  const [reason, setReason] = useState("");
  const [compoffDates, setCompoffDates] = useState([]);
  const [file, setFile] = useState(null);
  const [disease, setDisease] = useState("");
  const [customDisease, setCustomDisease] = useState("");
  const [customSelected, setCustomSelected] = useState([]);

const [diseaseDropdownOpen, setDiseaseDropdownOpen] = useState(false);
const [diseaseSearch, setDiseaseSearch] = useState("");
const diseaseOptions = [
  "-- None --","Fever", "Cold", "Injury", "Headache", "Food Poison",
  "Weakness", "Stomach Pain", "Infection", "Allergy", "Other"
];

  // Status + requests
  const [status, setStatus] = useState("draft");
  const [granted, setGranted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Popups + errors
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [showGrantedPopup, setShowGrantedPopup] = useState(false);
  const [showCustomConfirmPopup, setShowCustomConfirmPopup] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [errors, setErrors] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState(null);


  const today = new Date().toLocaleDateString("en-CA");

  // Leave balances
  const [leaveBalances, setLeaveBalances] = useState({
    casual: 0,
    sick: 0,
    earned: 0,
    optional: 0,
  });
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      diseaseDropdownRef.current &&
      !diseaseDropdownRef.current.contains(event.target)
    ) {
      setDiseaseDropdownOpen(false);  // close dropdown
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Calculate days excluding Saturdays and Sundays
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (end >= start) {
        let count = 0;
        let current = new Date(start);
        while (current <= end) {
          const day = current.getDay();
          if (day !== 0 && day !== 6) count++;
          current.setDate(current.getDate() + 1);
        }
        setDaysApplied(count);
      } else {
        setDaysApplied(0);
      }
    }
  }, [fromDate, toDate]);

  const allLeavesZero = Object.values(leaveBalances).every((val) => val === 0);

  const updateLastRequestStatus = (newStatus) => {
    setRequests((prev) =>
      prev.map((req, idx) =>
        idx === prev.length - 1 ? { ...req, status: newStatus } : req
      )
    );
  };

  const getValidCompoffDates = () => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let dates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isoDate = date.toLocaleDateString("en-CA");
      if (date < todayDate && date.getDay() === 0) dates.push(isoDate);
    }
    return dates;
  };
  const validCompoffDates = getValidCompoffDates();

  const handleCompoffCheckbox = (e) => {
    const value = e.target.value;
    if (e.target.checked) setCompoffDates([...compoffDates, value]);
    else setCompoffDates(compoffDates.filter((d) => d !== value));
  };

  const handleCustomCheckbox = (e) => {
    const value = e.target.value;
    if (e.target.checked) setCustomTypes([...customTypes, value]);
    else setCustomTypes(customTypes.filter((c) => c !== value));
  };

const handleFileChange = (e) => {
  const uploadedFile = e.target.files[0];
  if (!uploadedFile) return;

const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

  if (!allowedTypes.includes(uploadedFile.type)) {
    setErrors(["Only PDF files are allowed."]);
    setFile(null);
    return;
  }

  if (uploadedFile.size > 2 * 1024 * 1024) {
    setErrors(["File size must not exceed 2MB."]);
    setFile(null);
    return;
  }

  // ✅ Just keep file (not base64) — we’ll send it via FormData
  setFile(uploadedFile);
};

const [customLeaveSummary, setCustomLeaveSummary] = useState({});

const finalizeSubmit = async (request) => {
  setShowSubmitPopup(true);

  setCustomLeaveSummary(request.leaveDetails || {});

  // Reset form
  setFromDate("");
  setToDate("");
  setDaysApplied(0);
  setLeaveType("none");
  setCustomTypes([]);
  setReason("");
  setDisease("");
  setCustomDisease("");
  setCompoffDates([]);
  setFile(null);

  // Refetch requests from backend
  try {
    const empId = localStorage.getItem("employeeId")

    const response = await fetch(`https://internal-website-rho.vercel.app/api/leaves/summary/${empId}`);
    if (response.ok) {
      const data = await response.json();
      const list = Array.isArray(data.data) ? data.data : [];

      setRequests(list);
      setCurrentIndex(list.length > 0 ? list.length - 1 : null);
      fetchRequests()
    }
  } catch (error) {
    console.error("Error updating requests:", error);
  }
};

const fetchRequests = async () => {
  try {
    const empId = localStorage.getItem("employeeId");

    const response = await fetch(
      `https://internal-website-rho.vercel.app/api/leaves/${empId}`
    );

    if (!response.ok) {
      console.error("Failed to fetch leave requests");
      return;
    }

    const data = await response.json();
    console.log("API Response:", data);

    // data.data is an ARRAY of leave entries
    const list = Array.isArray(data.data) ? data.data : [];

    const filtered = list.filter(
      (leave) => String(leave.employeeId) === String(empId)
    );

    setRequests(filtered);
    console.log("Filtered Requests:", filtered);

  } catch (error) {
    console.error("Error fetching leave", error);
  }
};

useEffect(() => {

  fetchRequests();
}, []);

useEffect(() => {
  const fetchLeaveSummary = async () => {
    try {
      const empId = localStorage.getItem("employeeId");

      const response = await fetch(
        `https://internal-website-rho.vercel.app/api/leaves/summary/${empId}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data)

        // Your API returns: { summary: [ ... ] }
        const months = data.summary.summary || [];
        console.log(months)

        // pick last month
        const latestMonth = months[months.length - 1] || {};

        setLeaveBalances({
          casual: latestMonth.balanceCL ?? 0,
          sick: latestMonth.balanceSL ?? 0,
          earned: latestMonth.balanceEL ?? 0,
          optional: latestMonth.balanceOptional ?? 0,
        });
      } else {
        console.error("Failed to fetch leave summary");
      }
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    }
  };

  fetchLeaveSummary();
}, []);

  const insufficientMsg =
    (leaveType !== "none" &&
      leaveType in leaveBalances &&
      daysApplied > leaveBalances[leaveType]) ||
    (leaveType === "compoff" && daysApplied > compoffDates.length)
      ? "⚠️ Insufficient leave balance for selected type."
      : "";

const handleSubmit = async (e) => {
  e.preventDefault();
  if (insufficientMsg) return;

  let validationErrors = [];

  if (leaveType === "none") validationErrors.push("Please select a leave type.");
  if (leaveType === "custom" && customTypes.length === 0)
    validationErrors.push("Select at least one custom leave type.");
  if (leaveType === "sick" && !disease)
    validationErrors.push("Please select disease type.");
  if (!reason.trim() && leaveType !== "sick")
    validationErrors.push("Reason is required.");
  if (leaveType === "compoff" && compoffDates.length === 0)
    validationErrors.push("Please select at least one Compoff day.");
  if (leaveType === "sick" && daysApplied > 2 && !file)
    validationErrors.push("File upload is mandatory for sick leave over 2 days.");

  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }

// ✅ Define finalReason BEFORE using it anywhere
let finalReason = reason;
if (leaveType === "sick") {
  finalReason = disease === "Other" ? customDisease : disease;
}

// ⚠️ Check insufficient balance — show LOP popup before submit
// 🧮 Calculate total available leaves
let totalAvailable = 0;

if (leaveType === "custom") {
  totalAvailable = customTypes.reduce(
    (sum, type) => sum + (leaveBalances[type] || 0),
    0
  );
} else if (leaveType in leaveBalances) {
  totalAvailable = leaveBalances[leaveType];
}

// ⚠️ If applied days exceed total available, warn before submit
if (daysApplied > totalAvailable) {
  setPendingRequest({
    fromDate,
    toDate,
    daysApplied,
    leaveType,
    customTypes,
    reason: finalReason,
    status: "Sent",
  });
  setShowCustomConfirmPopup(true);
  return; // stop here, wait for user confirmation
}


  let leaveDetails = {};
  if (leaveType === "custom") {
    const priorityOrder = ["casual", "sick", "earned", "optional", "compoff", "maternity", "paternity", "other", "lop"];
    const sortedTypes = [...customTypes].sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b));

    let remaining = daysApplied;
    for (const type of sortedTypes) {
      const available = leaveBalances[type] || 0;
      const applied = Math.min(available, remaining);
      if (applied > 0) {
        leaveDetails[type] = applied;
        remaining -= applied;
      }
    }
    if (remaining > 0) leaveDetails["lop"] = remaining;
  }

  // ✅ Create FormData for backend upload (supports files)
  const formData = new FormData();
  formData.append("fromDate", fromDate);
  formData.append("toDate", toDate);
  formData.append("daysApplied", daysApplied);
  formData.append("leaveType", leaveType);
  formData.append("reason", finalReason);
  formData.append("status", "Sent");
  formData.append("employeeId", localStorage.getItem("employeeId"));
  formData.append("employeeName", localStorage.getItem("employeeName"));

  formData.append("requestDate", new Date().toISOString());

  // Add file only if selected
if (file) formData.append("file", file);

  // Add JSON fields as strings
  formData.append("customTypes", JSON.stringify(customTypes));
  formData.append("leaveDetails", JSON.stringify(leaveDetails));

  const token=localStorage.getItem("token");
  console.log("token", token)

  try {
    const response = await fetch("https://internal-website-rho.vercel.app/api/leaves/apply", {
        method: "POST",
        headers:{
          Authorization:`Bearer ${token}`
        },
        body: formData, // ✅ no need for Content-Type (browser sets it automatically)

    });

    if (response.ok) {
      finalizeSubmit({
        fromDate,
        toDate,
        daysApplied,
        leaveType,
        customTypes,
        leaveDetails,
        reason: finalReason,
        file,
        status: "Sent",
      });
      setActiveTab("history")
    } else {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      alert("❌ Failed to submit leave. Server rejected the request.");
    }
  } catch (error) {
    console.error("Error submitting leave:", error);
    alert("⚠️ Error submitting leave. Check network or server.");
  }
};

const handleBackendSubmit = async (request) => {
  try {
    const formData = new FormData();
    formData.append("fromDate", request.fromDate);
    formData.append("toDate", request.toDate);
    formData.append("daysApplied", request.daysApplied);
    formData.append("leaveType", request.leaveType);
    formData.append("reason", request.reason);
    formData.append("status", request.status);
    formData.append("employeeId", localStorage.getItem("employeeId"));
    formData.append("employeeName", localStorage.getItem("employeeName"));
    formData.append("requestDate", new Date().toISOString());
    formData.append("customTypes", JSON.stringify(request.customTypes || []));
    formData.append("leaveDetails", JSON.stringify(request.leaveDetails || {}));
    if (file) formData.append("file", file);

    const response = await fetch("https://internal-website-rho.vercel.app/api/leaves/apply",{
      method: "POST",
      body: formData,
      // headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),

    });

    if (response.ok) {
      finalizeSubmit(request);
    } else {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      alert("❌ Failed to submit leave with LOP. Server error.");
    }
  } catch (error) {
    console.error("Error submitting leave with LOP:", error);
    alert("⚠️ Network or server error.");
  }
};

  const handleConfirmYes = () => {
    if (pendingRequest) {
      const updatedRequest = {
        ...pendingRequest,
        customTypes: [...pendingRequest.customTypes, "lop"],
      };
      setSubmitted(true);
      setStatus("sent");
      handleBackendSubmit(updatedRequest);
    }
    setPendingRequest(null);
    setShowCustomConfirmPopup(false);
  };

  const handleConfirmNo = () => {
    setPendingRequest(null);
    setShowCustomConfirmPopup(false);
  };

  const handleManagerApproval = () => {
    if (status === "sent") {
      setStatus("manager");
      updateLastRequestStatus("Manager Approved");
      setStatus("hr");
      updateLastRequestStatus("HR Approved");
      handleGrant();
    }
  };

  const handleGrant = () => {
    setStatus("granted");
    setGranted(true);
    updateLastRequestStatus("Granted");

    if (requests[currentIndex]) {
      const req = requests[currentIndex];
      const days = req.daysApplied;
      if (req.leaveType === "custom") {
        let remaining = days;
        const newBalances = { ...leaveBalances };
        for (const type of req.customTypes) {
          if (type !== "lop" && type in newBalances && remaining > 0) {
            const deduction = Math.min(newBalances[type], remaining);
            newBalances[type] -= deduction;
            remaining -= deduction;
          }
        }
        setLeaveBalances(newBalances);
      } else if (req.leaveType in leaveBalances && req.leaveType !== "lop") {
        setLeaveBalances((prev) => ({
          ...prev,
          [req.leaveType]: Math.max(0, prev[req.leaveType] - days),
        }));
      }
    }

    setShowSubmitPopup(false);
    setShowGrantedPopup(true);
  };

  const leaveOptions = [
    { id: "casual", label: "Casual" },
    { id: "sick", label: "Sick" },
    { id: "earned", label: "Earned" },
    { id: "optional", label: "Optional(Female)" },
    ...(allLeavesZero ? [{ id: "lop", label: "Loss of Pay" }] : []),
    { id: "maternity", label: "Maternity" },
    { id: "paternity", label: "Paternity" },
    ...(allLeavesZero ? [{ id: "other", label: "Other" }] : []),
    { id: "compoff", label: "Compoff" },
  ];

  const mainLeaveTypes = ["casual", "sick", "earned", "optional"];

  const handleDeleteRequest = (index) => {
    setRequests((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="employeeleaves-leaves-page">
      <div className="employeeleaves-tabs">
        <button
          className={activeTab === "form" ? "tab active" : "tab"}
          onClick={() => setActiveTab("form")}
        >
          Leave Form
        </button>
        <button
          className={activeTab === "requests" ? "tab active" : "tab"}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
      </div>

      {activeTab === "form" ? (
        <div className="employeeleaves-form-box">
          <h2>Employee Leave</h2>

          <form onSubmit={handleSubmit}>
            <div className="employeeleaves-date-row">
            <div className="employeeleaves-form-group">
              <label><strong>From Date</strong></label>
             <input
  type="date"
  value={fromDate}
  min={today}
  max={
    leaveType === "sick"
      ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : ""
  }
  onChange={(e) => {
    const selected = new Date(e.target.value);
    const day = selected.getDay();

    // Disable Saturday (6) and Sunday (0)
    if (day === 0 || day === 6) {
      e.target.value = "";
      return;
    }

    // For sick leave: restrict selection to within 2 days
    if (leaveType === "sick") {
      const todayDate = new Date();
      const maxDate = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate() + 2
      );
      if (selected > maxDate) {
        alert("⚠️ Sick Leave can only start within 2 days from today.");
        e.target.value = "";
        return;
      }
    }

    setFromDate(e.target.value);
  }}
  required
/>

            </div>

            <div className="employeeleaves-form-group">
              <label><strong>To Date</strong></label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  min={fromDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const selected = new Date(e.target.value);
                    const day = selected.getDay();
                    if (day === 0 || day === 6) {
                      setToDate("");
                    } else {
                      setToDate(e.target.value);
                    }
                  }}
                  required
                />
            </div>
</div>
            <p><b>Total Days Applied: <span className="employeeleaves-green-text">{daysApplied}</span></b></p>
<div className="employeeleaves-two-column">
      <div className="employeeleaves-left-column" >
        <div className="employeeleaves-leave-breakdown-box">
          <ul>
            <li><b style={{ color: "red" }}>Leaves Left:</b></li>
            <li><b>Casual: </b>{leaveBalances.casual} day{leaveBalances.casual !== 1 ? "s" : ""}</li>
            <li><b>Sick: </b>{leaveBalances.sick} day{leaveBalances.sick !== 1 ? "s" : ""}</li>
            <li><b>Earned: </b>{leaveBalances.earned} day{leaveBalances.earned !== 1 ? "s" : ""}</li>
            <li><b>Optional: </b>{leaveBalances.optional} day{leaveBalances.optional !== 1 ? "s" : ""}</li>
          </ul>
        </div>
      </div>
<div className="employeeleaves-right-column" >
{/* Leave Type Dropdown */}
<div className="employeeleaves-form-group">
  <label><strong>Leave Type</strong></label>
  <select
    value={leaveType}
    onChange={e => setLeaveType(e.target.value)}
    required
  >
    <option value="none">-- Select Type --</option>
    {leaveOptions.map(opt => {
      const balance = leaveBalances[opt.id] ?? 0;
      const isDisabled = mainLeaveTypes.includes(opt.id) && balance <= 0;
      return (
       <option key={opt.id} value={opt.id} disabled={isDisabled}>
      {opt.label}
      </option>
      );
    })}
    <option value="custom">Custom (Select Multiple)</option>
  </select>

  {insufficientMsg && (
    <p className="employeeleaves-warning-text" style={{ color: "red", marginTop: "5px" }}>
      {insufficientMsg}
    </p>
  )}
</div>

{/* Custom Leave Checkbox Selection */}
{leaveType === "custom" && (
  <div className="employeeleaves-form-group">
    <label><strong>Select Multiple Leave Types</strong></label>
    <div className="employeeleaves-checkbox-group">
      {leaveOptions.map(opt => {
  const balance = leaveBalances[opt.id] ?? 0;
  const maternitySelected = customTypes.includes("maternity");
  const paternitySelected = customTypes.includes("paternity");

  const isOtherDisabled =
    (maternitySelected && opt.id !== "maternity") ||
    (paternitySelected && opt.id !== "paternity");

  const isCheckboxDisabled =
    (mainLeaveTypes.includes(opt.id) && balance <= 0) || isOtherDisabled;

  return (
    <label
      key={opt.id}
      style={{
        opacity: isCheckboxDisabled ? 0.5 : 1,
        pointerEvents: isCheckboxDisabled ? "none" : "auto"
      }}
    >
      <input
        type="checkbox"
        value={opt.id}
        checked={customTypes.includes(opt.id)}
        onChange={handleCustomCheckbox}
        disabled={isCheckboxDisabled}
      />
       {opt.label}
    </label>
  );
})}
    </div>

    {/* Show compoff dates if compoff selected */}
   {leaveType === "custom" && customTypes.includes("compoff") && (
  <div className="employeeleaves-form-group">
    <label><strong>Select Worked Days (Sundays)</strong></label>

    <div className="compoff-inline">
      {validCompoffDates.length > 0 ? (
        validCompoffDates.map((date) => (
          <label key={date} className="compoff-item">
            <input
              type="checkbox"
              value={date}
              checked={compoffDates.includes(date)}
              onChange={handleCompoffCheckbox}
            />
            <span>  </span>
            {new Date(date).toDateString()}
          </label>
        ))
      ) : (
        <p>No available Sundays this month.</p>
      )}
    </div>
  </div>
)}

  </div>
)}

{leaveType === "sick" && (
  <div className="employeeleaves-form-group" ref={diseaseDropdownRef}>
    <label><strong>Reason</strong></label>

    <div
      className="custom-dropdown"
      onClick={() => setDiseaseDropdownOpen(!diseaseDropdownOpen)}
    >
      {disease || "-- Select Reason --"}
    </div>

    {diseaseDropdownOpen && (
      <div className="custom-dropdown-menu">
        <input
          type="text"
          placeholder="Search reason..."
          value={diseaseSearch}
          onChange={(e) => setDiseaseSearch(e.target.value)}
          className="custom-dropdown-search"
        />

        <div className="custom-dropdown-options">
          {diseaseOptions
            .filter(opt =>
              opt.toLowerCase().includes(diseaseSearch.toLowerCase())
            )
            .map(opt => (
              <div
                key={opt}
                className={`custom-dropdown-option ${disease === opt ? "selected" : ""}`}
                onClick={() => {
                  if (opt === "-- None --") {
                    setDisease("");
                    setCustomDisease("");
                  } else {
                    setDisease(opt);
                  }
                  setDiseaseDropdownOpen(false);
                  setDiseaseSearch("");
                }}
              >
                {opt}
              </div>
            ))}
        </div>
      </div>
    )}

    {disease === "Other" && (
      <input
        type="text"
        placeholder="Enter disease"
        value={customDisease}
        onChange={(e) => setCustomDisease(e.target.value)}
        required
      />
    )}
  </div>
)}

           {(leaveType === "compoff" || (leaveType === "custom" && reason === "compoff")) && (
<div className="compoff-inline">
  {validCompoffDates.map((d) => (
    <label key={d} className="compoff-item">
      <input
        type="checkbox"
        value={d}
        checked={compoffDates.includes(d)}
        onChange={handleCompoffCheckbox}
      />
      <span> </span>
      {new Date(d).toDateString()}
    </label>
  ))}
</div>

)}
            {leaveType !== "sick" && (
              <div className="employeeleaves-form-group">
                <label><strong>Reason</strong></label>
                <input type="text" placeholder="Reason for leave" value={reason} onChange={e => setReason(e.target.value)} required />
              </div>
            )}

            <div className="employeeleaves-form-group">
              <label><strong>Upload Document</strong></label>
              <input
  type="file"
  accept=".pdf,.jpeg,.png"
  onChange={handleFileChange}
  required={leaveType === "sick" && daysApplied > 2}
/>

            </div>
</div>
</div>
            <button type="submit" className="employeeleaves-submit-btn">Submit</button>
            {errors.length > 0 && (
  <div className="employeeleaves-error-box">
    {errors.map((err, i) => (
      <p key={i} style={{ color: "red", margin: "4px 0" }}>
        ⚠️ {err}
      </p>
    ))}
  </div>
)}
          </form>
        </div>
      ) : (
        <div className="employeeleaves-form-box">
        <div className="employeeleaves-requests-box">
          <h2>My Leave Requests</h2>
          {(requests?.length ?? 0) === 0 ? (
            <p>No leave requests submitted yet.</p>
          ) : (
            <History

            // requests={requests.length >0 && requests.filter(req => req.employeeId === localStorage.getItem("employeeId"))}
requests={requests}

onDelete={handleDeleteRequest}
/>

          )}
        </div>
        </div>
      )}

      {showSubmitPopup && (
        <div className="employeeleaves-popup-overlay">
          <div className="employeeleaves-popup-box">
            <h3>✅ Leave Submitted!</h3>
            <p>Your leave request has been submitted successfully.</p>
            {Object.keys(customLeaveSummary).length > 0 && (
  <div className="employeeleaves-custom-summary">
    <h4>Custom Leave Breakdown:</h4>
    <ul>
      {Object.entries(customLeaveSummary).map(([type, days]) => (
        <li key={type}>
          {type.charAt(0).toUpperCase() + type.slice(1)}: {days} day{days > 1 ? "s" : ""}
        </li>
      ))}
    </ul>
  </div>
)}
           <button
  onClick={() => {
    setShowSubmitPopup(false);
    setActiveTab("requests"); // redirect to History tab
  }}
>
  OK
</button>

          </div>
        </div>
      )}

      {showGrantedPopup && (
        <div className="employeeleaves-popup-overlay">
          <div className="employeeleaves-popup-box">
            <h3>🎉 Leave Granted!</h3>
            <p>Your leave has been approved.</p>
            <button onClick={() => setShowGrantedPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showCustomConfirmPopup && (
        <div className="employeeleaves-popup-overlay">
          <div className="employeeleaves-popup-box">
            <h3>⚠️ Insufficient Leave Balance</h3>
            <p>
              The number of days available is less than you applied.
              Do you want to continue with LOP?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={handleConfirmYes} className="employeeleaves-submit-btn">Yes</button>
              <button onClick={handleConfirmNo} className="employeeleaves-delete-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
