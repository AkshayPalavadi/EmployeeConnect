import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Reviews from "./Reviews.jsx";
import Task from "./Task.jsx";
import "./PerformanceManagement.css";

const PerformanceManagement = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: localStorage.getItem("employeeName") || "",
    id: localStorage.getItem("employeeId") || "",
    department: localStorage.getItem("employeeDepartment") || "",
    experience: localStorage.getItem("employeeExperience") || "",
  });

  const BASE_URL = "https://internal-website-rho.vercel.app";

// --- DOJ based Appraisal Logic ---
const dojRaw = localStorage.getItem("employeeDateOfJoining");
const dojDate = dojRaw ? new Date(dojRaw.split("T")[0]) : null;

const dojMonth = dojDate?.getMonth(); // 0=Jan, 3=April
const dojYear = dojDate?.getFullYear();

// --- Generate FY list (last 3 years + current) ---
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const fyStart = month >= 3 ? year : year - 1;

const makeFY = (startYear) =>
  `FY (${String(startYear).slice(-2)} - ${String(startYear + 1).slice(-2)})`;

const currentFYLabel = makeFY(fyStart);

const fyList = [];
for (let i = fyStart; i >= fyStart - 3; i--) {
  fyList.push(makeFY(i));
}

// --- Classify PEA vs YEA based on DOJ rules ---
let PEA_list = [];
let YEA_list = [];

if (dojDate) {
  const dojFYStart = dojMonth >= 3 ? dojYear : dojYear - 1;

  fyList.forEach((fy) => {
    const fyStartYear = Number("20" + fy.substring(4, 6)); // extract 24 from FY (24 - 25)
    const isFirstYear = fyStartYear === dojFYStart;

    if (dojMonth === 3) {
      // Joined in April → Only YEA is allowed
      YEA_list.push(fy);
    } else {
      if (isFirstYear) {
        PEA_list.push(fy); // First year only → PEA
      } else {
        YEA_list.push(fy); // Next years → YEA
      }
    }
  });
}

const [selectedType, setSelectedType] = useState(
  PEA_list.length > 0 ? "PEA" : "YEA"
);

const [selectedYear, setSelectedYear] = useState(
  (PEA_list.length > 0 ? PEA_list[0] : YEA_list[0]) || ""
);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [openTaskReview, setOpenTaskReview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [finalReviews, setFinalReviews] = useState({});
  const [manager, setManager] = useState({ name: "Manager Name", id: "MGR001" });
  const [hr, setHr] = useState({ name: "HR Name", id: "HR001" });
  const [loadingReview, setLoadingReview] = useState(false);

  // --- Fetch review data from API ---
  useEffect(() => {
    const fetchFinalReview = async () => {
      try {
        setLoadingReview(true);
        const res = await fetch(
          `${BASE_URL}/api/tasks/final-review?fy=${encodeURIComponent(selectedYear)}&employeeId=${encodeURIComponent(user.id)}`
        );

        const data = await res.json();

        if (!res.ok || !data?.review) {
          console.warn("⚠️ No review data found for", selectedYear);
          setFinalReviews((prev) => ({ ...prev, [selectedYear]: null }));
          return;
        }

        const r = data.review;

        const bandScore = r.bandScore || "-";
        const managerComments = r.managerComments || "";

        setFinalReviews((prev) => ({
          ...prev,
          [selectedYear]: {
            fy: r.fy || selectedYear,
            employeeId: r.employeeId,
            rating: r.avgRating || 0,
            bandScore,
            comments: managerComments, // <<< read-only manager comments
            empComment: r.empComment || "",
            agree: r.agree || false,
            disagree: r.disagree || false,
            managerFinalizedOn: r.managerFinalizedOn || "",
          },
        }));

      } catch (err) {
        console.error("❌ Error fetching final review:", err);
      } finally {
        setLoadingReview(false);
      }
    };

    if (user.id) fetchFinalReview();
  }, [selectedYear, user.id]);

  // --- Fetch employee tasks for selected FY ---
  useEffect(() => {
    const fetchEmployeeTasks = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/tasks?fy=${encodeURIComponent(selectedYear)}`
        );
        const data = await res.json();

        if (res.ok) {
          const employeeId = localStorage.getItem("employeeId");
          const filtered = (data.tasks || []).filter(
            (t) => String(t.assignedTo) === String(employeeId)
          );
          setTasks(filtered);
          console.log("✅ Loaded tasks for PerformanceManagement:", filtered);
        } else {
          console.error("Error fetching tasks:", data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch tasks:", err);
      }
    };

    if (user.id && selectedYear) {
      fetchEmployeeTasks();
    }
  }, [selectedYear, user.id]);

  const reviewData =
    finalReviews[selectedYear] || {
      fy: selectedYear,
      rating: 0,
      comments: "",
      bandScore: "-",
      agree: false,
      disagree: false,
      empComment: "",
    };

  const isSubmitted =
    reviewData.managerFinalizedOn || reviewData.finalizedOn; // from API

  const canEmployeeRespond =
    reviewData.bandScore !== "-" && reviewData.comments !== "";

  const isActionTaken =
    reviewData.agree === true || reviewData.disagree === true;

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  // --- Handlers ---
  const defaultReviewState = {
    fy: selectedYear,
    rating: 0,
    comments: "",
    bandScore: "-",
    agree: false,
    disagree: false,
    empComment: "",
  };

  const handleAgree = () => {
    setFinalReviews((prev) => {
      const current = { ...defaultReviewState, ...(prev[selectedYear] || {}) };
      return {
        ...prev,
        [selectedYear]: {
          ...current,
          agree: !current.agree,
          disagree: false, // force the opposite off
        },
      };
    });
  };

  const handleDisagree = () => {
    setFinalReviews((prev) => {
      const current = { ...defaultReviewState, ...(prev[selectedYear] || {}) };
      return {
        ...prev,
        [selectedYear]: {
          ...current,
          disagree: !current.disagree,
          agree: false, // force the opposite off
        },
      };
    });
  };

  const handleEmpCommentChange = (e) => {
    const newComment = e.target.value;
    setFinalReviews((prev) => ({
      ...prev,
      [selectedYear]: { ...prev[selectedYear], empComment: newComment },
    }));
  };

  // --- Submit review to backend ---
  const handleFinalize = async () => {
      const updatedReview = {
        empComment: reviewData.empComment,
        agree: true,
        disagree: false,
      };

    try {
      const res = await fetch(`${BASE_URL}/api/tasks/final-review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fy: selectedYear,
          employeeId: user.id,
          ...updatedReview
        }),
      });
      if (res.ok) {
        alert("Final review submitted!");
      } else {
        alert("Failed to submit review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    const updatedReview = {
      empComment: reviewData.empComment,
      agree: false,
      disagree: true,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/tasks/final-review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fy: selectedYear,
          employeeId: user.id,
          ...updatedReview
        }),
      });

      if (res.ok) {
        alert("Submitted successfully!");
      } else {
        alert("Failed to update review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Calculate task progress using dueDate ---
  const calculateProgress = (task) => {
    const assigned = new Date(task.assignedDate);
    const due = new Date(task.dueDate);
    const today = new Date();

    const totalDuration = due - assigned;
    const elapsed = today - assigned;

    if (totalDuration <= 0) return 100; // due date passed / incorrect dates

    const progress = (elapsed / totalDuration) * 100;

    return Math.min(Math.max(progress, 0), 100); // clamp 0–100
  };

  const pendingTasks = tasks.filter(t => calculateProgress(t) < 100).length;
  const completedTasks = tasks.filter(t => calculateProgress(t) >= 100).length;

  // --- Rating ---
  const totalRating = tasks.reduce((sum, t) => sum + (t.rating || 0), 0);
  const avgRating = tasks.length ? (totalRating / tasks.length).toFixed(2) : 0;

  const canFinalize = reviewData.bandScore && reviewData.comments;

  return (
    <div className="performancemanagement-perf-container">
      <h2 className="performancemanagement-page-title">Performance Management</h2>

      {/* Employee Details + Training Card Wrapper */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        {/* LEFT SIDE (Employee + Dropdown + Training) */}
        <div style={{ flex: 1 }}>

          {/* Employee Details */}
          <div className="performancemanagement-employee-card">
            <h3>Employee Details</h3>
            <div className="performancemanagement-emp-info">
              <div><strong>Employee Name:</strong> {user.name}</div>
              <div><strong>Employee ID:</strong> {user.id}</div>
              <div><strong>Department:</strong> {user.department}</div>
              <div><strong>Experience:</strong> {user.experience} years</div>
              <div><strong>Manager Name:</strong> {manager.name}</div>
              <div><strong>HR Name:</strong> {hr.name}</div>
            </div>
          </div>

          {/* DROPDOWN + TRAINING side-by-side */}
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

            {/* Appraisal Dropdowns */}
            <div className="performancemanagement-role-card performancemanagement-dropdown-flex">
              {/* Appraisal Type + FY Selection */}
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedYear(
                    e.target.value === "PEA" ? (PEA_list[0] || "") : (YEA_list[0] || "")
                  );
                }}
                className="performancemanagement-fy-dropdown"
              >
                {PEA_list.length > 0 && <option value="PEA">Project End Appraisal</option>}
                {YEA_list.length > 0 && selectedYear !== PEA_list[0] && <option value="YEA">Year End Appraisal</option>}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="performancemanagement-fy-dropdown"
              >
                {(selectedType === "PEA" ? PEA_list : YEA_list).map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>

              <p>April - March</p>
            </div>

            {/* Training Card */}
            <div
              className="performancemanagement-employee-card"
              style={{
                width: "250px",
                background: "#fee2e2",
                borderLeft: "6px solid #ef4444",
                cursor: "pointer"
              }}
              onClick={() => navigate("/employee/traininganddevelopment")}
            >
              <h3>Training & Development</h3>
              <p style={{ marginTop: "10px", color: "#b91c1c" }}>
                View and update your training progress.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE OVERVIEW CARD */}
        <div
          className="performancemanagement-employee-card"
          style={{
            width: "520px",
            minHeight: "100%",
            alignSelf: "stretch",
          }}
        >
          <h3>My Overview</h3>
          <p>Total Tasks: {tasks.length}</p>
          <p>Pending Tasks: {pendingTasks}</p>
          <p>Completed Tasks: {completedTasks}</p>
          <p>Avg Rating: {avgRating}</p>
          <p>Band Score: {reviewData.bandScore}</p>
        </div>

      </div>

      {/* Tasks Section */}
      <div className="performancemanagement-goals-section">
        <h3 className="performancemanagement-goals-header">Goals / Tasks</h3>
        {tasks.length === 0 ? (
          <p className="performancemanagement-no-goals">No tasks assigned for {selectedYear}</p>
        ) : (
          <table className="performancemanagement-goals-table fade-in">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned By</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Rating</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => {
                const progress = calculateProgress(task);

                let progressColor = "#f44336";
                if (progress >= 50 && progress < 85) progressColor = "#ffeb3b";
                if (progress >= 85) progressColor = "#4caf50";

                const uniqueKey = task.id || `${task.text}-${index}`;

                return (
                  <React.Fragment key={uniqueKey}>
                    <tr
                      key={`${uniqueKey}-main`}
                      className="performancemanagement-task-row"
                      onClick={() =>
                        setOpenTaskReview(task._id === openTaskReview ? null : task._id)
                      }
                    >
                      <td>{task.text}</td>
                      <td>{task.assignedBy}</td>
                      <td>{task.assignedDate ? task.assignedDate.split("T")[0] : "-"}</td>
                      <td>{task.dueDate ? task.dueDate.split("T")[0] : "-"}</td>
                      <td>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={`star-${uniqueKey}-${i}`}
                            style={{
                              color: i < (task.rating || 0) ? "#ffb400" : "#ccc",
                            }}
                          />
                        ))}
                      </td>
                      <td>
                        <div className="performancemanagement-progress-wrapper">
                          <div className="performancemanagement-progress-bar">
                            <div
                              className="performancemanagement-progress-fill"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: progressColor,
                              }}
                            ></div>
                          </div>
                          <span className="performancemanagement-progress-label">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </td>
                    </tr>

                    {openTaskReview === task._id && (
                      <tr key={`${uniqueKey}-review`}>
                        <td colSpan="6" className="performancemanagement-task-review-section">
                          <Reviews task={task} tasks={tasks} setTasks={updateTasks} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {tasks.length > 0 && (
                <tr className="performancemanagement-overall-row">
                  <td colSpan="4">Overall Average Rating</td>
                  <td colSpan="2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        style={{
                          color: i < Math.round(avgRating) ? "#ffb400" : "#ccc",
                        }}
                      />
                    ))}
                    <span style={{ marginLeft: "6px" }}>{avgRating}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="performancemanagement-add-task-wrapper">
          <button
            className="performancemanagement-add-task-btn"
            onClick={() => setShowTaskModal(true)}
            disabled={selectedYear !== currentFYLabel}
          >
            Add Task
          </button>
        </div>

        {showTaskModal && (
          <div
            className="performancemanagement-modal-overlay"
            onClick={() => setShowTaskModal(false)}
          >
            <div
              className="performancemanagement-modal-content modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <Task selectedFY={selectedYear} onUpdate={updateTasks} />
            </div>
          </div>
        )}
      </div>

      {/* Final Review Section */}
      <div className="performancemanagement-final-review-container">
        <div
          className="performancemanagement-final-review-toggle"
          onClick={() => setShowReviewBox(!showReviewBox)}
        >
          <h3>Final Review ({selectedYear})</h3>
          {showReviewBox ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {showReviewBox && (
          <div className="performancemanagement-final-review fade-in">
            <div className="performancemanagement-final-left">
              <p className="performancemanagement-emp-name">{user.name}</p>

              <div className="performancemanagement-overall-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    style={{
                      color: i < Math.round(avgRating) ? "#ffb400" : "#ccc",
                    }}
                  />
                ))}
                <span style={{ marginLeft: 6 }}>{avgRating}</span>
              </div>

              <div className="performancemanagement-band-score">
                Band Score: {reviewData.bandScore || "-"}
              </div>

              <h4>Manager Comments</h4>
              <textarea value={reviewData.comments || ""} readOnly />
            </div>

            <div className="performancemanagement-final-right">
              <div className="performancemanagement-agree-disagree">
                <label>
                  <input
                    type="checkbox"
                    checked={reviewData.agree}
                    onChange={handleAgree}
                    disabled={!canEmployeeRespond || isSubmitted}
                  />{" "}
                  Agree
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={reviewData.disagree}
                    onChange={handleDisagree}
                    disabled={!canEmployeeRespond || isSubmitted}
                  />{" "}
                  Disagree
                </label>
              </div>

              <textarea
                className="performancemanagement-emp-comment"
                placeholder="Add your comments here..."
                value={reviewData.empComment || ""}
                onChange={handleEmpCommentChange}
                disabled={!canEmployeeRespond || isSubmitted}
              />

              {reviewData.agree && (
                <button
                  className="performancemanagement-finalize-btn"
                  onClick={handleFinalize}
                  disabled={!canFinalize || !reviewData.agree || isSubmitted}
                >
                  {isActionTaken ? "Finalized" : "Finalize"}
                </button>
              )}

              {reviewData.disagree && (
                <button
                  className="performancemanagement-report-btn"
                  onClick={handleReport}
                  disabled={!canFinalize || !reviewData.disagree || isSubmitted}
                >
                  {isActionTaken ? "Reported" : "Report to TL"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceManagement;
