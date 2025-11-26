import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";
import "./TrainingAndDevelopment.css";

const TrainingAndDevelopment = () => {
  // DETAILS CARD STATE
  const [details, setDetails] = useState({
    topic: "React",
    trainer: "John Doe",
    mode: "Online",
    level: "Intermediate",
    from: "2025-01-10",
    to: "2025-01-20"
  });

  // LINE CHART STATE
  const [examData, setExamData] = useState([
    { exam: "Exam 1", score: 78 },
    { exam: "Exam 2", score: 82 },
    { exam: "Exam 3", score: 91 },
    { exam: "Exam 4", score: 88 }
  ]);

  // BAR CHART STATE (Final Scores)
  const [barData, setBarData] = useState([
    { topic: "React", final: 85 },
    { topic: "Node", final: 90 },
    { topic: "Soft Skills", final: 75 },
    { topic: "Leadership", final: 92 }
  ]);

  // TABLE DATA (Result column = final score from barData)
  const [tableData, setTableData] = useState([
    {
      topic: "React",
      trainer: "John Doe",
      mode: "Online",
      level: "Intermediate",
      from: "2025-01-10",
      to: "2025-01-20",
      result: 85,
      rating: 4.5
    },
    {
      topic: "Node",
      trainer: "Alice",
      mode: "Online",
      level: "Intermediate",
      from: "2025-01-15",
      to: "2025-01-25",
      result: 90,
      rating: 4.8
    },
    {
      topic: "Soft Skills",
      trainer: "Bob",
      mode: "Offline",
      level: "Beginner",
      from: "2025-02-01",
      to: "2025-02-10",
      result: 75,
      rating: 4.0
    },
    {
      topic: "Leadership",
      trainer: "Sarah",
      mode: "Offline",
      level: "Advanced",
      from: "2025-02-05",
      to: "2025-02-15",
      result: 92,
      rating: 4.9
    }
  ]);

  return (
    <div className="td-container">

      {/* LEFT SIDE */}
      <div className="td-left">

        {/* DETAILS CARD */}
        <div className="td-card td-details-card">
          <h3 className="td-card-title">Training Details</h3>
          <div className="td-details">
            <div><strong>Training Topic:</strong> {details.topic}</div>
            <div><strong>Trainer Name:</strong> {details.trainer}</div>
            <div><strong>Mode:</strong> {details.mode}</div>
            <div><strong>Level:</strong> {details.level}</div>
            <div><strong>From:</strong> {details.from}</div>
            <div><strong>To:</strong> {details.to}</div>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="td-card td-line-chart">
          <h3 className="td-card-title">Training Topic - {details.topic}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={examData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exam" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* RIGHT: BAR GRAPH */}
      <div className="td-card td-bar-graph">
        <h3 className="td-card-title">Final Scores by Training Topic</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="final" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE SECTION */}
      <div className="td-card td-table-card">
        <h3 className="td-card-title">Training History</h3>
        <table className="td-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Trainer Name</th>
              <th>Mode</th>
              <th>Level</th>
              <th>From</th>
              <th>To</th>
              <th>Result</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((d, index) => (
              <tr key={index}>
                <td>{d.topic}</td>
                <td>{d.trainer}</td>
                <td>{d.mode}</td>
                <td>{d.level}</td>
                <td>{d.from}</td>
                <td>{d.to}</td>
                <td>{d.result}</td>
                <td>{d.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TrainingAndDevelopment;
