import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import "./Reviews.css";

export default function Reviews({ task, tasks, setTasks }) {
  const role = localStorage.getItem("userRole") || "Employee";
  const isManager = role === "Manager";
  const BASE_URL = "https://internal-website-rho.vercel.app";

  const [rating, setRating] = useState(task.rating || 0);
  const [newComment, setNewComment] = useState("");
  const [editState, setEditState] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setRating(task.rating || 0);
  }, [task]);

  const persistTasks = (updatedTasks) => {
    if (typeof setTasks === "function") setTasks(updatedTasks);
  };

  // ✅ Update rating both locally & backend
  const handleRatingClick = async (value) => {
    if (!isManager && task.managerEdited) return;
    const taskId = task._id || task._id;
    setRating(value);

    // Optimistic UI
    const updatedTasks = tasks.map((t) =>
      t._id === task._id
        ? { ...t, rating: value, managerEdited: isManager ? true : t.managerEdited || false }
        : t
    );
    persistTasks(updatedTasks);

    // Backend update
    try {
      await fetch(`${BASE_URL}/api/tasks/${taskId}/rating`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });
    } catch (err) {
      console.error("Failed to update rating:", err);
    }
  };

  // Helper for safe comments array
  const ensureCommentsArray = (t) => (t.comments ? t.comments : []);

  // ✅ Add new comment (POST)
  const addComment = async () => {
    if (!newComment.trim()) return;
    const taskId = task._id || task._id;

    const commentObj = {
      text: newComment.trim(),
      author: isManager ? "Manager" : "Employee",
      timestamp: new Date().toISOString(),
    };

    // Optimistic update first
    const updatedTasks = tasks.map((t) =>
      t._id === task._id
        ? { ...t, comments: [...ensureCommentsArray(t), commentObj] }
        : t
    );
    persistTasks(updatedTasks);
    setNewComment("");

    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentObj),
      });
      const data = await res.json();
      if (!res.ok) console.error("Error posting comment:", data);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className={`reviews-container ${!isManager && task.managerEdited ? "locked" : ""}`}>
      <h4>{task.text}</h4>

      {/* ⭐ Rating */}
      <div
        className={`reviews-rating-stars ${!isManager && task.managerEdited ? "locked" : ""}`}
        style={{ marginTop: 8 }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => handleRatingClick(n)}
            style={{
              cursor:
                isManager || (!task.managerEdited && role === "Employee")
                  ? "pointer"
                  : "default",
              color: rating >= n ? "#ffb400" : "#ccc",
              fontSize: "22px",
              marginRight: "6px",
              transition: "transform 0.2s, color 0.2s",
            }}
            title={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </span>
        ))}
      </div>

      {!isManager && task.managerEdited && (
        <p style={{ color: "#999", marginTop: 8 }}>
          (Rating locked — Manager has finalized this task's rating)
        </p>
      )}

      {/* 💬 Comments */}
      <div style={{ marginTop: 12 }}>
        {(task.comments || []).map((c, idx) => {
          const isEditing = editState && editState.cIndex === idx;
          return (
            <div
              key={c._id || `${idx}`}
              className={`reviews-comment-chat-bubble ${c.author === "Manager" ? "left" : "right"}`}
              style={{ marginBottom: 8 }}
            >
            <div className="reviews-chat-text">{c.text}</div>
              <div className="reviews-comment-chat-footer">
                <span className="reviews-comment-chat-time">
                  {new Date(c.timestamp).toLocaleString()}
                  {c.edited && " (edited)"}
                </span>
              </div>
            </div>
          );
        })}

        <div className="reviews-chat-input-container" style={{ marginTop: 6 }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
          />
          <button onClick={addComment}>💬</button>
        </div>
      </div>
    </div>
  );
}
