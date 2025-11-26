import React, { useMemo, useState, useRef, useEffect } from "react";
import Select from "react-select";
import "./TimeSheet.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function TimeSheet() {
  // --- State ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState({});
  const [category, setCategory] = useState("");
  const [projectName, setProjectName] = useState(null);
  const [projectCode, setProjectCode] = useState(null);
  const [projectType, setProjectType] = useState("billable");
  const [hours, setHours] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");
  const [leaveDays, setLeaveDays] = useState([]);

  useEffect(() => {
  // Example: static leaves for current month/year
  const leaves = [
    "2025-10-15",
    "2025-11-04",
  ];

  // Optionally, filter leaves for current month/year
  const filteredLeaves = leaves.filter((dateStr) => {
    const d = new Date(dateStr);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  setLeaveDays(filteredLeaves);
}, [month, year]); // rerun if month/year changes




  // 🟢 Holidays from API
  const [holidays, setHolidays] = useState([]);
    // --- Fetch Holidays from API ---
useEffect(() => {
  const fetchHolidays = async () => {
    try {
      const res = await fetch("https://internal-website-rho.vercel.app/api/holidays");
      if (!res.ok) throw new Error("Failed to fetch holidays");
      const data = await res.json();
      console.log("Holiday API response:", data);

      let holidaysArray = [];

      if (Array.isArray(data)) {
        holidaysArray = data;
      } else if (Array.isArray(data.holidays)) {
        holidaysArray = data.holidays;
      } else if (Array.isArray(data.data)) {
        holidaysArray = data.data;
      }

      // normalize key names
      const normalized = holidaysArray.map((h) => ({
        date: (h.date || h.holiday_date).split("T")[0],
        name: h.name || h.holiday_name || "Public Holiday",
      }));

      setHolidays(normalized);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setHolidays([]);
    }
  };
  fetchHolidays();
}, []);

// ✅ Fetch existing timesheet entries from backend when component mounts or month/year changes
useEffect(() => {
  const fetchTimesheetEntries = async () => {
  try {
    // ✅ Get token inside the function
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");


    if (!token) {
      console.error("❌ No token found. Please log in again.");
      return;
    }

    const res = await fetch(
      `https://internal-website-rho.vercel.app/api/timesheet?month=${month + 1}&year=${year}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ now defined
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch timesheet entries");

    const data = await res.json();
    console.log("Fetched entries from API:", data.entries);

    const formattedEntries = {};
    if (Array.isArray(data.entries)) {
    data.entries.forEach((entry) => {
    const key = entry.date.split("T")[0];  // always safe

    formattedEntries[key] = {
      category: entry.category,
      projectName: entry.projectName,
      projectCode: entry.projectCode,
      projectType: entry.projectType,
      hours: entry.hours,
      date: key,
    };

  });
}

    console.log("Formatted entries:", formattedEntries);
    
    setEntries(formattedEntries);
    console.log("✅ Loaded timesheet entries from backend:", formattedEntries);

  } catch (err) {
    console.error("❌ Error loading timesheet entries:", err);
  }
};


  fetchTimesheetEntries();
}, [month, year]);




    const holidaysSet = useMemo(() => new Set(holidays.map((h) => h.date)), [holidays]);

const isOverdue = (dateObj) => {
  const key = fmtKey(dateObj);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - dateObj) / (1000 * 60 * 60 * 24));
 
  // Overdue if no hours entered and older than 2 days
  return !entries[key] && diffDays > 2;
};

  const formRef = useRef(null);
  const calendarRef = useRef(null);

  // --- Categories with projects and codes ---
  const CATEGORIES = {
    Finance: {
      "Budget Analysis": ["FIN101", "FIN102", "FIN103", "FIN104"],
      "Payroll Management": ["PAY201", "PAY202", "PAY203"],
      "Audit & Compliance": ["AUD301", "AUD302", "AUD303"],
    },
    "Front-End Developer": {
      "UI Enhancement": ["FE101", "FE102", "FE103"],
      "React UI Design": ["FE201", "FE202", "FE203"],
      "Website Optimization": ["FE301", "FE302", "FE303"],
    },
    "Back-End Developer": {
      "API Development": ["BE101", "BE102", "BE103"],
      "Database Management": ["BE201", "BE202", "BE203"],
      "Microservices": ["BE301", "BE302", "BE303"],
    },
    Marketing: {
      "Digital Campaigns": ["MKT101", "MKT102", "MKT103"],
      "SEO Optimization": ["MKT201", "MKT202", "MKT203"],
      "Brand Strategy": ["MKT301", "MKT302", "MKT303"],
    },
    "HR(Human Resources)": {
      "Recruitment Drive": ["HR101", "HR102", "HR103"],
      "Employee Training": ["HR201", "HR202", "HR203"],
      "Employee Engagement": ["HR301", "HR302", "HR303"],
    },
    Sales: {
      "Lead Generation": ["SAL101", "SAL102", "SAL103"],
      "Client Acquisition": ["SAL201", "SAL202", "SAL203"],
      "CRM Maintenance": ["SAL301", "SAL302", "SAL303"],
    },
    Design: {
      "UX Research": ["DSN101", "DSN102", "DSN103"],
      "Wireframing": ["DSN201", "DSN202", "DSN203"],
      "Graphic Design": ["DSN301", "DSN302", "DSN303"],
    },
    Operations: {
      "Workflow Automation": ["OPS101", "OPS102", "OPS103"],
      "Inventory Management": ["OPS201", "OPS202", "OPS203"],
      "Process Optimization": ["OPS301", "OPS302", "OPS303"],
    },
    "IT Support": {
      "Helpdesk Support": ["IT101", "IT102", "IT103"],
      "System Maintenance": ["IT201", "IT202", "IT203"],
      "Network Setup": ["IT301", "IT302", "IT303"],
    },
  };


  const fmtKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const monthName = useMemo(
    () => new Date(year, month).toLocaleString("default", { month: "long" }),
    [month, year]
  );

   const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    setSelectedDate(null);
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const totalHours = Object.entries(entries).reduce((sum, [k, e]) => {
    const parts = k.split("-").map((x) => parseInt(x, 10));
    if (parts[0] === year && parts[1] === month + 1) return sum + (e.hours || 0);
    return sum;
  }, 0);

  const isDateEditable = (dateObj) => {
  const key = fmtKey(dateObj);
  if (holidaysSet.has(key) || leaveDays.includes(key)) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - dateObj) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
};


  const buildWeeks = () => {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastOfMonth.getDate();

  const weeks = [];
  let currentWeek = [];

  // --- Fill empty slots before the 1st day ---
  for (let i = 0; i < firstOfMonth.getDay(); i++) {
    currentWeek.push(null); // placeholder
  }

  // --- Fill actual days ---
  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day);
    currentWeek.push(dateObj);

    // When week is full (7 days), push it
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // --- Fill empty slots after last day ---
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null); // placeholder
    }
    weeks.push(currentWeek);
  }

  return weeks;
};



  const weeks = buildWeeks();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedDate) return alert("Select a date first!");
  if (!isDateEditable(selectedDate))
    return alert("Cannot update timesheet for holidays or older than 2 days.");
  if (!projectName || !projectCode) return alert("Select project and code!");

  const key = fmtKey(selectedDate);
  const h = parseFloat(hours || 0);
  if (isNaN(h) || h < 0 || h > 24) return alert("Enter valid hours (0 - 24).");

  const month = new Date(selectedDate).getMonth() + 1;
  const year = new Date(selectedDate).getFullYear();
  const userEmail = localStorage.getItem("userEmail");
  const employeeId = localStorage.getItem("employeeId");

  const newEntry = {
    category,
    projectName: projectName.value,
    projectCode: projectCode.value,
    projectType,
    hours: h,
    date: key,
    month,
    year,
    userEmail,
    employeeId,
  };

  // Update local state immediately
  setEntries({
    ...entries,
    [key]: newEntry,
  });

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    let response, result;

    if (entries[key]) {
      // ✅ Update existing entry via PUT
      response = await fetch("https://internal-website-rho.vercel.app/api/timesheet/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      result = await response.json();
      console.log("📦 PUT Response:", response.status, result);
      if (!response.ok) throw new Error(result.msg || "Failed to update timesheet entry");
      // alert("✅ Timesheet updated successfully!");
    } else {
      // ✅ New entry via POST
      response = await fetch("https://internal-website-rho.vercel.app/api/timesheet/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      result = await response.json();
      console.log("📦 POST Response:", response.status, result);
      if (!response.ok) throw new Error(result.msg || "Failed to save timesheet entry");
      alert("✅ Timesheet saved successfully!");
    }
  } catch (err) {
    console.error("❌ Error saving/updating timesheet:", err);
    alert("Failed to save/update timesheet. Please try again later.");
  }

  // reset form
  setCategory("");
  setProjectName(null);
  setProjectCode(null);
  setProjectType("billable");
  setHours("");

  if (calendarRef.current)
    calendarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
};


  const sameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

     const exportToExcel = () => {
    const allEntries = Object.entries(entries).map(([key, entry]) => {
      const [yearVal, monthVal, dayVal] = key.split("-").map(Number);
      return {
        Date: `${dayVal}/${monthVal}/${yearVal}`,
        Category: entry.category || "N/A",
        "Project Name": entry.projectName || "N/A",
        "Project Code": entry.projectCode || "N/A",
        "Project Type": entry.projectType || "N/A",
        Hours: entry.hours || 0,
      };
    });

    if (allEntries.length === 0) {
      alert("No timesheet data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(allEntries);

    // Protect the sheet by marking cells as read-only (non-editable)
    Object.keys(worksheet).forEach((key) => {
      if (key[0] !== "!") worksheet[key].s = { protection: { locked: true } };
    });

    worksheet["!protect"] = {
      password: "timesheet", // sheet protection password
      selectLockedCells: true,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Timesheet_${year}_${month + 1}.xlsx`);
      };


  return (
    <div className="timesheet-container">
      {/* Calendar */}
      <div ref={calendarRef}>
        <header className="header">
          <button onClick={handlePrev}>&lt;</button>
          <h2>
            {monthName} {year}
          </h2>
          <button onClick={handleNext}>&gt;</button>
        </header>

        <div className="weekday-row">
          {weekDays.map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
          <div className="week-total-header">Weekly Hours</div>
        </div>

        <div className="weeks-wrapper">
          {weeks.map((week, wi) => {
             const weekTotal = week.reduce((sum, dateObj) => {
                if (!dateObj) return sum; // ✅ prevents error
                const key = fmtKey(dateObj);
                return sum + ((entries[key] && entries[key].hours) || 0);
              }, 0);

            return (
              <div className="week-row" key={wi}>
              {week.map((dateObj, ci) => {
                // handle placeholder (null) cells for alignment
                if (!dateObj) {
                  return <div key={ci} className="cell empty"></div>;
                }

                const key = fmtKey(dateObj);
                const entry = entries[key];
                const currentMonth = dateObj.getMonth() === month && dateObj.getFullYear() === year;
                const editable = isDateEditable(dateObj);
                const isSunday = dateObj.getDay() === 0;
                const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
                const holiday = holidays.find((h) => h.date === dateStr);
                const hoursValue = entry?.hours ?? null;
                const leave = leaveDays.includes(key);


                let cellClass = "cell";
                if (!currentMonth) cellClass += " other-month";
                if (holiday) cellClass += " holiday";
                if (leave) cellClass += " leave-cell";
                if (hoursValue >= 9) cellClass += " cell-green";
                else if (hoursValue > 0) cellClass += " cell-yellow";
                else if (hoursValue === 0) cellClass += " cell-red";
                if (dateObj.getDay() === 6) cellClass += " weekend";
                if (isSunday) cellClass += " sunday-cell";
                if (!editable) cellClass += " not-editable";
                if (sameDay(selectedDate, dateObj)) cellClass += " selected-day";

                return (
                  <div
                    key={ci}
                    className={cellClass}
                    title={
                      holiday
                        ? `Public Holiday: ${holiday.name}`
                        : dateObj > new Date()
                        ? "Future date (not allowed)"
                        : ""
                    }
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (dateObj > today) return;

                      if (!currentMonth) {
                        setMonth(dateObj.getMonth());
                        setYear(dateObj.getFullYear());
                      }

                      setSelectedDate(new Date(dateObj));
                      if (entries[key]) setShowPopup(true);
                      if (formRef.current)
                        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    <div className="day">{dateObj.getDate()}</div>
                    {holiday && <div className="holiday-dot"></div>}
                    {entry && <div className="hours">{entry.hours}h</div>}
                  </div>
                );
              })}

                <div className="week-total-cell">{weekTotal.toFixed(1)}h</div>
              </div>
            );
          })}

          <div className="total-summary-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 0 }}>
           <div className="working-days">
              <h3>
                Working Days: {
                  Object.entries(entries).filter(([key, entry]) => {
                    const [y, m] = key.split('-').map(Number);
                    return y === year && m === month + 1 && entry.hours > 0;
                  }).length
                }
              </h3>
            </div>

            <div className="total-summary">
              <h3>Monthly Total: {totalHours.toFixed(1)} hours</h3>
            </div>
          </div>



          {selectedDate && (
  <div className="selected-date-display" style={{ marginTop: 12 }}>
{selectedDate && (
  <div
    className="selected-date-display"
    style={{
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: "15px",
    }}
  >
    <span>📅 Selected Date:</span>
    <strong>{selectedDate.toDateString()}</strong>


    {/* Manager Request Button */}
    {isOverdue(selectedDate) && selectedDate <= new Date() && (
      <button
        style={{
          fontSize: "0.8rem",
          background: "#ff7043",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "4px 6px",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          const key = fmtKey(selectedDate);

          const existingRequest = pendingRequests.find(
            (r) => r.date === key
          );
          if (existingRequest) {
            alert("You have already requested manager approval for this date!");
            return;
          }

          setPendingRequests([
            ...pendingRequests,
            { date: key, status: "pending" },
          ]);
          alert(`Request sent for ${selectedDate.toDateString()}`);
        }}
      >
        Request Manager Approval
      </button>
    )}
  </div>
)}
  <button
      style={{
        fontSize: "0.8rem",
        background: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "4px 8px",
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.stopPropagation();
        exportToExcel();
      }}
    >
      Export Timesheet to Excel
    </button>
  </div>
)}

        </div>
      </div>

      {/* --- Entry Form --- */}
      <form className="entry-form" onSubmit={handleSubmit} ref={formRef} style={{ marginTop: 20 }}>
        <h4>Add / Update Entry</h4>

        {/* Category */}
        <div className="form-row">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setProjectName(null);
              setProjectCode(null);
            }}
            required
          >
            <option value="">Select Category</option>
            {Object.keys(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Project Name */}
        <div className="form-row">
          <label>Project Name:</label>
          <Select
            className="project-name"
            value={projectName}
            onChange={(val) => {
              setProjectName(val);
              setProjectCode(null);
            }}
            options={
              category
                ? Object.keys(CATEGORIES[category]).map((p) => ({ value: p, label: p }))
                : []
            }
            placeholder="Search or select project"
            isDisabled={!category}
            isSearchable
          />
        </div>

        {/* Project Code */}
        <div className="form-row">
          <label>Project Code:</label>
          <Select
            className="project-name"
            value={projectCode}
            onChange={(val) => setProjectCode(val)}
            options={
              projectName
                ? CATEGORIES[category][projectName.value].map((c) => ({ value: c, label: c }))
                : []
            }
            placeholder="Search or select code"
            isDisabled={!projectName}
            isSearchable
          />
        </div>

        {/* Project Type */}
        <div className="project-type">
          <label className="project-type-label">Project Type:</label>

          <label className={`radio-option ${projectType === "billable" ? "selected" : ""}`}>
            <input
              type="radio"
              name="projectType"
              value="billable"
              checked={projectType === "billable"}
              onChange={(e) => setProjectType(e.target.value)}
            />
            <span>Billable</span>
          </label>

          <label className={`radio-option ${projectType === "non-billable" ? "selected" : ""}`}>
            <input
              type="radio"
              name="projectType"
              value="non-billable"
              checked={projectType === "non-billable"}
              onChange={(e) => setProjectType(e.target.value)}
            />
            <span>Non-Billable</span>
          </label>
        </div>

        {/* Hours */}
        <div className="form-row">
          <label>Hours:</label>
          <input
            type="number"
            min="1"
            max="9"
            value={hours}
          onChange={(e) => {
            const val = e.target.value;
            if (
              val === "" ||
              (parseInt(val, 10) >= 1 && parseInt(val, 10) <= 9
              )){
              setHours(val);
              setError("");
            } else {
              setError("Please enter a hours between 1 and 9.");
            }
                }}           
            required
          />
          {error && <p className="error-text">{error}</p>}
        </div>

        <button type="submit">Save Entry</button>
      </form>

      {/* Popup */}
      {showPopup && selectedDate && (
        <div className="popup-overlay-timesheet" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedDate.toDateString()} - Project Details</h3>
            <hr />
            {entries[fmtKey(selectedDate)] ? (
              <>
                <p>
                  <strong>Category:</strong> {entries[fmtKey(selectedDate)].category}
                </p>
                <p>
                  <strong>Project Name:</strong> {entries[fmtKey(selectedDate)].projectName}
                </p>
                <p>
                  <strong>Project Code:</strong> {entries[fmtKey(selectedDate)].projectCode}
                </p>
                <p>
                  <strong>Project Type:</strong> {entries[fmtKey(selectedDate)].projectType}
                </p>
                <p>
                  <strong>Hours:</strong> {entries[fmtKey(selectedDate)].hours}h
                </p>
              </>
            ) : (
              <p>No data available for this date.</p>
            )}
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}