// src/pages/History.jsx
import React from "react";
import "./History.css";

export default function History({ requests = [], onDelete }) {
  if (!requests || requests.length === 0) {
    return <p>No leave requests submitted yet.</p>;
  }

  return (
    <div className="employeehistory-history-container">
      <div className="employeehistory-table-wrapper">
        <table className="employeehistory-history-table">
          <thead>
            <tr>
              <th>From Date</th>
              <th>To Date</th>
              <th>Total Days</th>
              <th>Leave Type</th>
              <th>Reason</th>
              <th>File</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[...requests]
              .sort(
  (a, b) =>
    new Date(b.createdAt || b.fromDate) - new Date(a.createdAt || a.fromDate)
)

              .map((req, idx) => (
                <tr key={idx}>
                  <td>{new Date(req.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(req.toDate).toLocaleDateString()}</td>
                  <td>{req.daysApplied}</td>
                  <td>
                    {req.leaveType.charAt(0).toUpperCase() + req.leaveType.slice(1)}
                    {req.leaveDetails &&
                      Object.keys(req.leaveDetails).length > 0 && (
                        <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
                          {Object.entries(req.leaveDetails).map(([type, days]) => (
                            <li key={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}: {days} day{days > 1 ? "s" : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                  </td>
                  <td>{req.reason}</td>
                  <td>
                    {req.file ? (
                      <a
                        href={`https://internal-website-rho.vercel.app/api/leaves/file/${req._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="employeehistory-file-emoji"
                      >
                        📄
                      </a>
                    ) : (
                      "_"
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        req.status === "Sent" || req.status === "Pending"
                          ? "pending"
                          : req.status === "Granted" || req.status === "Manager Approved" || req.status === "HR Approved"
                          ? "approved"
                          : "rejected"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
