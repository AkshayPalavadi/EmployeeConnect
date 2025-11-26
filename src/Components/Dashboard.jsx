// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Img from "../assets/logo.jpg";
import "./Dashboard.css";

/* ---------------- Helpers (kept your original project logic) ---------------- */

const calculateStatus = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  if (today < start) return "Future";
  if (today >= start && today <= end) return "In Progress";
  return "Completed";
};

const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

const getDuration = (startDate, endDate) =>
  calculateWorkingDays(new Date(startDate), new Date(endDate));

const getAllProjectDays = (projects) => {
  if (!projects?.length)
    return {
      chartData: [{ name: "Idle days", value: 1 }],
      detailMap: { "Idle days": [{ range: "N/A", label: "No projects" }] },
    };

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // sort chronologically
  const sorted = [...projects].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  let completed = 0,
    inProgress = 0,
    future = 0,
    idle = 0;

  const details = {
    "Completed days": [],
    "In Progress days": [],
    "Future days": [],
    "Idle days": [],
  };

  let lastEnd = null;

  sorted.forEach((p) => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    const total = calculateWorkingDays(start, end);

    // ----------------- IDLE BETWEEN PROJECTS -----------------
    if (lastEnd && start > lastEnd) {
      // The full raw range (do NOT remove weekends)
      const idleStart = new Date(lastEnd);
      idleStart.setDate(idleStart.getDate() + 1);

      const idleEnd = new Date(start);
      idleEnd.setDate(idleEnd.getDate() - 1);

      // Prevent invalid ranges (start after end)
      if (idleStart <= idleEnd) {
        const idleWork = calculateWorkingDays(idleStart, idleEnd);

        if (idleWork > 0) {
          idle += idleWork;

          details["Idle days"].push({
            label: `${idleWork} idle working days`,
            range: `${idleStart.toDateString()} → ${idleEnd.toDateString()}`,
          });
        }
      }
    }

    // ----------------- FUTURE PROJECT -----------------
    if (today < start) {
      future += total;
      details["Future days"].push({
        label: `${p.projectName}: ${total} working days`,
        range: `${start.toDateString()} → ${end.toDateString()}`,
      });
    }

    // ----------------- COMPLETED PROJECT -----------------
    else if (today > end) {
      completed += total;
      details["Completed days"].push({
        label: `${p.projectName}: ${total} working days`,
        range: `${start.toDateString()} → ${end.toDateString()}`,
      });
    }

    // ----------------- IN PROGRESS -----------------
    else {
      const completedPart = calculateWorkingDays(start, today);
      const remainingPart = total - completedPart;

      completed += completedPart;
      inProgress += remainingPart;

      details["Completed days"].push({
        label: `${p.projectName}: ${completedPart} working days`,
        range: `${start.toDateString()} → ${today.toDateString()}`,
      });

      if (remainingPart > 0) {
        details["In Progress days"].push({
          label: `${p.projectName}: ${remainingPart} working days`,
          range: `${today.toDateString()} → ${end.toDateString()}`,
        });
      }
    }

    lastEnd = lastEnd ? new Date(Math.max(lastEnd, end)) : end;
  });

  return {
    chartData: [
      { name: "Completed days", value: completed },
      { name: "In Progress days", value: inProgress },
      { name: "Idle days", value: idle },
      { name: "Future days", value: future },
    ],
    detailMap: details,
  };
};

const CustomTooltip = ({ active, payload, detailMap }) => {
  if (active && payload && payload.length) {
    const label = payload[0].name;
    return (
      <div className="employeedashboard-custom-tooltip">
        <h4>{label}</h4>
        <ul>
          {detailMap[label]?.map((d, i) => (
            <li key={i}>
              <strong>{d.label}</strong> ({d.range})
            </li>
          )) || <li>No data</li>}
        </ul>
      </div>
    );
  }
  return null;
};

/* ---------------- Main Component ---------------- */

export default function Dashboard() {
  const employeeId = localStorage.getItem("employeeId"); // used for projects API
  const [projects, setProjects] = useState([]);

  // KPI placeholders (you'll provide real APIs later)
  const [attendanceMonth, setAttendanceMonth] = useState(0);
  const [attendanceFY, setAttendanceFY] = useState(0);
  const [usedLeaves, setUsedLeaves] = useState(0);
  const [leftLeaves, setLeftLeaves] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);


  // achievements tab
  const [activeTab, setActiveTab] = useState("awards");

  const [activeProfileTab, setActiveProfileTab] = useState("personal");

  // profile data fetched from employee API
  const [employee, setEmployee] = useState({
    personal: {},
    professional: {},
    officialEmail: "",
  });

  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1–12

    // FY rolls over on April 1
    if (month >= 4) {
      // FY starts this year → ends next year
      const yy = String(year).slice(2);
      const next = String(year + 1).slice(2);
      return `FY (${yy} - ${next})`;
    } else {
      // Jan–Mar → Still in previous FY
      const prev = year - 1;
      const yy = String(prev).slice(2);
      const next = String(year).slice(2);
      return `FY (${yy} - ${next})`;
    }
  };

  // static choices you provided for missing fields
  const PROJECT_PLACEHOLDER = "Dhatvi Internal Portal";
  const LEVEL_PLACEHOLDER = "L1";
  const REPORTEE_PLACEHOLDER = "None";

  const [achievements, setAchievements] = useState({
    awards: [
      "Employee of the Month - August 2025",
      "Best Performer - Q2 2025",
    ],
    appreciations: [
      "Appreciated by client for timely delivery.",
      "Praised by manager for mentoring juniors.",
      "Received positive feedback in peer review.",
    ],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fy = getFinancialYear();
        const encodedFY = encodeURIComponent(fy);

        const res = await fetch(
          `https://internal-website-rho.vercel.app/api/tasks?fy=${encodedFY}&employeeId=${employeeId}`
        );

        const data = await res.json();
        const tasks = data.tasks || [];

        const today = new Date();
        today.setHours(0,0,0,0); // normalize

        const assigned = tasks.filter(t => !t.archived).length;
        const pending = tasks.filter(t => new Date(t.dueDate) >= today).length;

        setAssignedTasks(assigned);
        setPendingTasks(pending);

      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    // fetch projects (keep your existing logic)
    const fetchProjects = async () => {
      try {
        const res = await fetch(`https://internal-website-rho.vercel.app/api/projects/employee/${employeeId}`);
        const data = await res.json();
        if (data.projects && Array.isArray(data.projects)) {
          const assignedProjects = data.projects.filter((p) => p.assignedTo?.includes(employeeId));
          setProjects(assignedProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    // fetch employee profile from provided API
    const fetchEmployee = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        const res = await fetch(`https://internal-website-rho.vercel.app/api/employee/${userEmail}`);
        if (!res.ok) throw new Error("Employee fetch failed");
        const data = await res.json();
        // store the structure we need
        setEmployee({
          personal: data.personal || {},
          professional: data.professional || {},
          officialEmail: data.officialEmail || data.personal?.officialEmail || "",
        });

        // If you want, derive age from DOB (if dob present)
        // Not altering anything else now.
      } catch (err) {
        console.warn("Employee fetch error:", err);
      }
    };

    const fetchLeaveSummary = async () => {
      try {
        const res = await fetch(`https://internal-website-rho.vercel.app/api/leaves/summary/${employeeId}`);
        const data = await res.json();

        if (!data.summary?.summary) return;

        const months = data.summary.summary;

        // Total used leaves (sum of CL + SL)
        const totalUsed =
          months.reduce((sum, m) => sum + (m.usedCL || 0) + (m.usedSL || 0), 0);

        // Balance leaves = last month balance
        const last = months[months.length - 1];
        const totalLeft = (last.balanceCL || 0) + (last.balanceSL || 0);

        setUsedLeaves(totalUsed);
        setLeftLeaves(totalLeft);
      } catch (err) {
        console.error("Leave summary fetch failed:", err);
      }
    };

    // placeholder KPI fetchers — keep but do not crash if endpoints are absent
    const fetchKPIs = async () => {
      try {
        // Example placeholders; replace once you provide real endpoints
        setAttendanceMonth(0);
        setAttendanceFY(0);
        setUsedLeaves(0);
        setLeftLeaves(0);
        setAssignedTasks(tasks.length);
        setPendingTasks(0);
      } catch (err) {
        console.warn("KPI fetch error:", err);
      }
    };

    fetchProjects();
    fetchEmployee();
    fetchLeaveSummary();
    fetchKPIs();
    fetchTasks();
  }, [employeeId]);

  const COLORS = {
    "Completed days": "#00C49F",
    "In Progress days": "#FF8042",
    "Idle days": "#FF9999",
    "Future days": "#757575",
  };
  const { chartData: timelineData, detailMap } = getAllProjectDays(projects);
  const inProgressProjects = projects.filter((p) => calculateStatus(p.startDate, p.endDate) === "In Progress");

  // helper to show name fields cleanly
  const fullName = `${employee.personal?.firstName || ""} ${employee.personal?.middleName || ""} ${employee.personal?.lastName || ""}`.replace(/\s+/g, " ").trim();

  // derive age if dob exists (personal does not include dob in data sample; left as placeholder)
  const computeAge = (dobStr) => {
    if (!dobStr) return "";
    const dob = new Date(dobStr);
    if (isNaN(dob)) return "";
    const diff = Date.now() - dob.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return (
    <div className="employeedashboard-dashboard">
      <h1>My Dashboard</h1>

      {/* Grid: left column (kpis + profile) and right tall achievements (350px) */}
      <div className="employeedashboard-grid">
        {/* LEFT COLUMN */}
        <div className="employeedashboard-left">
          {/* Top row: 3 KPI cards side-by-side */}
          <div className="employeedashboard-kpi-row">
            <div className="employeedashboard-kpi-card">
              <h3>Working Days</h3>
              <p><strong>This Month:</strong> {attendanceMonth}</p>
              <p><strong>This Year:</strong> {attendanceFY}</p>
            </div>

            <div className="employeedashboard-kpi-card">
              <h3>Leaves</h3>
              <p><strong>Used:</strong> {usedLeaves}</p>
              <p><strong>Left:</strong> {leftLeaves}</p>
            </div>

            <div className="employeedashboard-kpi-card">
              <h3>Tasks</h3>
              <p><strong>Assigned:</strong> {assignedTasks}</p>
              <p><strong>Pending:</strong> {pendingTasks}</p>
            </div>
          </div>

          {/* Profile big card (spans full left column width) */}
          <div className="employeedashboard-profile-card">
            <div className="employeedashboard-profile-tabs">
              <button
                className={activeProfileTab === "personal" ? "emp-profile-active" : "emp-profile-inactive"}
                onClick={() => {
                  window.__profileTab = "personal";
                  // force update by small state trick
                  const ev = new Event("profileTabChange");
                  window.dispatchEvent(ev);
                  setActiveProfileTab("personal");
                }}
              >
                Personal Details
              </button>
              <button
                className={activeProfileTab === "professional" ? "emp-profile-active" : "emp-profile-inactive"}
                onClick={() => {
                  window.__profileTab = "professional";
                  const ev = new Event("profileTabChange");
                  window.dispatchEvent(ev);
                  setActiveProfileTab("professional");
                }}
              >
                Professional Details
              </button>
            </div>

            <ProfileContent
              personal={employee.personal || {}}
              professional={employee.professional || {}}
              projectPlaceholder={PROJECT_PLACEHOLDER}
              levelPlaceholder={LEVEL_PLACEHOLDER}
              reporteePlaceholder={REPORTEE_PLACEHOLDER}
              computeAge={computeAge}
            />
          </div>
        </div>

        {/* RIGHT: Tall Achievements card (350px) */}
        <div className="employeedashboard-achievements-tall">
          <h2>My Achievements</h2>

          <div className="employeedashboard-achievement-tabs">
            <button className={activeTab === "awards" ? "emp-achievements-active" : "emp-achievements-inactive"} onClick={() => setActiveTab("awards")}>Awards</button>
            <button className={activeTab === "appreciations" ? "emp-achievements-active" : "emp-achievements-inactive"} onClick={() => setActiveTab("appreciations")}>Appreciations</button>
          </div>

          <div className="employeedashboard-tab-content achievements-list">
            {activeTab === "awards" ? (
              <ul>
                {achievements.awards.map((a, i) => (
                  <li key={i} className="achievement-item">{a}</li>
                ))}
              </ul>
            ) : (
              <ul>
                {achievements.appreciations.map((a, i) => (
                  <li key={i} className="achievement-item">{a}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* keep Outlet / your other routes */}
      <Outlet />

      {/* ------------------- Projects section (kept your existing graph code exactly) ------------------- */}
      <div className="employeedashboard-charts-row">
        {inProgressProjects.length > 0 ? (
          inProgressProjects.map((project, idx) => {
            const start = new Date(project.startDate);
            const today = new Date();
            const daysPassed = Math.min(
              calculateWorkingDays(start, today),
              getDuration(project.startDate, project.endDate)
            );

            const remainingDays = getDuration(project.startDate, project.endDate) - daysPassed;

            return (
              <div key={idx} className="employeedashboard-chart-card">
                <h2>{project.projectName} Progress</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed days", value: daysPassed },
                        { name: "In Progress days", value: remainingDays },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      <Cell fill={"#00C49F"} />
                      <Cell fill={"#FF8042"} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p><strong>Start Date:</strong> {project.startDate?.split("T")[0]}</p>
                <p><strong>End Date:</strong> {project.endDate?.split("T")[0]}</p>
                <p><strong>Duration:</strong> {getDuration(project.startDate, project.endDate)} days</p>
              </div>
            );
          })
        ) : (
          <div style={{ color: COLORS["Idle days"], fontWeight: "bold" }}>
            No current projects
          </div>
        )}
      </div>

      {/* All Projects Timeline Pie */}
      <div className="employeedashboard-charts-row">
        <div className="employeedashboard-chart-card wide">
          <h2>All Projects Timeline</h2>
          {projects.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timelineData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {timelineData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip detailMap={detailMap} />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No Projects found</p>
          )}
        </div>
      </div>

      {/* Projects Table (kept as-is) */}
      <div className="employeedashboard-completed-projects">
        <h2>Projects Overview</h2>
        <div className="table-wrapper">
        <table className="employeedashboard-projects-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Assigned By</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              // Sort by assignedDate descending so newest is on top
              [...projects]
                .sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate))
                .map((p, idx) => {
                  const status = calculateStatus(p.startDate, p.endDate);
                  const duration = getDuration(p.startDate, p.endDate);

                  const start = new Date(p.startDate);
                  const end = new Date(p.endDate);
                  const formatDate = (d) => {
                    if (!d) return "N/A";
                    const dateObj = new Date(d);
                    if (isNaN(dateObj)) return "N/A";
                    return dateObj.toISOString().split("T")[0];
                  };

                  return (
                    <tr key={idx}>
                      <td>{p.projectId || p._id || "N/A"}</td>
                      <td>{p.projectName || "Unnamed Project"}</td>
                      <td>{p.assignedBy || "N/A"}</td>
                      <td>{formatDate(start)}</td>
                      <td>{formatDate(end)}</td>
                      <td>{duration} days</td>
                      <td>
                        <span
                          className={`employeedashboard-status-badge ${
                            status === "Completed"
                              ? "employeedashboard-status-completed"
                              : status === "In Progress"
                              ? "employeedashboard-status-inprogress"
                              : "employeedashboard-status-future"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helper component for profile content (keeps main tidy) ---------------- */

function ProfileContent({ personal = {}, professional = {}, projectPlaceholder, levelPlaceholder, reporteePlaceholder, computeAge }) {
  // small local state to re-render when global profile tab changes (we used window events above)
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("profileTabChange", handler);
    return () => window.removeEventListener("profileTabChange", handler);
  }, []);

  const tab = window.__profileTab || "personal";

  return (
    <div className="employeedashboard-profile-content">
      {tab === "personal" ? (
        <div className="profile-grid">
          <div><b>Full Name:</b> {`${personal?.firstName || ""} ${personal?.middleName || ""} ${personal?.lastName || ""}`.trim()}</div>
          <div><b>Mail ID:</b> {personal?.officialEmail || personal?.email || "N/A"}</div>
          <div><b>Phone Number:</b> {personal?.phone || personal?.emergencyNumber || "N/A"}</div>
          <div><b>Date of Birth:</b> {personal?.dob || "N/A"}</div>
          <div><b>Gender:</b> {personal?.gender || "N/A"}</div>
          <div><b>Age:</b> {computeAge(personal?.dob) || "N/A"}</div>
          <div className="full"><b>Date of Joining:</b> {professional?.dateOfJoining ? new Date(professional.dateOfJoining).toISOString().split("T")[0] : "N/A"}</div>
        </div>
      ) : (
        <div className="profile-grid">
          <div><b>Employee ID:</b> {professional?.employeeId || "N/A"}</div>
          <div><b>Role:</b> {professional?.role || "N/A"}</div>
          <div><b>Department:</b> {professional?.department || "N/A"}</div>
          <div><b>Project:</b> {projectPlaceholder}</div>
          <div><b>Level:</b> {levelPlaceholder}</div>
          <div><b>Manager Name:</b> {professional?.experiences?.[0]?.managerName || "N/A"}</div>
          <div className="full"><b>Reportee Name:</b> {reporteePlaceholder}</div>
        </div>
      )}
    </div>
  );
}
