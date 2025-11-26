// ✅ src/pages/Task.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Task.css";

export default function Task({ selectedFY, onUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://internal-website-rho.vercel.app";
  const employeeId = localStorage.getItem("employeeId");
  const employeeName = localStorage.getItem("employeeName");

  // 🔹 Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedFY) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/tasks?fy=${encodeURIComponent(selectedFY)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();

        if (res.ok) {
          // ✅ Only show tasks assigned to the logged-in employee
          const filteredTasks = (data.tasks || []).filter(
            (t) => String(t.assignedTo) === String(employeeId)
          );

          console.log("✅ Filtered tasks for employee:", filteredTasks);
          setTasks(filteredTasks);
          if (onUpdate) onUpdate(filteredTasks);
        }
        else {
          console.error("Error fetching tasks:", data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedFY]);

  // 🔹 Add new task (open form)
  const addTask = () => {
    setNewTask({
      text: "",
      assignedBy: employeeName,
      assignedTo: employeeId,
      assignedDate: new Date().toISOString().split("T")[0],
      assignedDateTime: new Date().getTime(),
      dueDate: "",
      fy: selectedFY,
    });
  };

  // 🔹 Save new task (POST)
  const handleSave = async () => {
    if (!newTask.text || !newTask.dueDate) return;

    const payload = {
      text: newTask.text,
      assignedBy: employeeName,
      assignedTo: employeeId,
      assignedDate: newTask.assignedDate,
      assignedDateTime: newTask.assignedDateTime,
      dueDate: newTask.dueDate,
      fy: selectedFY,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Task created:", data.task);

        // Immediately refresh list from backend
        await fetchTasks();

        // Optionally keep the UI list synced
        const updatedTasks = [...tasks, data.task];
        setTasks(updatedTasks);
        if (onUpdate) onUpdate(updatedTasks);
      } else {
        console.error("Error creating task:", data);
      }
    } catch (err) {
      console.error("❌ Failed to create task:", err);
    }

    setNewTask(null);
  };

  // 🔹 Fetch tasks again (for refetch use)
  const fetchTasks = async () => {
    if (!selectedFY) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/tasks?fy=${encodeURIComponent(selectedFY)}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (res.ok) {
        const filteredTasks = (data.tasks || []).filter(
          (t) => String(t.assignedTo) === String(employeeId)
        );
        setTasks(filteredTasks);
        if (onUpdate) onUpdate(filteredTasks);
      }
    } catch (err) {
      console.error("❌ Error refetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit task
  const handleEdit = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, isEditing: true } : t))
    );
  };

  // 🔹 Update existing task (PUT)
  const handleUpdate = async (id, text, dueDate) => {
    if (!text || !dueDate) return;
    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, dueDate }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Task updated:", data.task);
        const updatedTasks = tasks.map((t) =>
          t._id === id ? data.task || { ...t, text, dueDate, isEditing: false } : t
        );
        setTasks(updatedTasks);
        if (onUpdate) onUpdate(updatedTasks);
      } else {
        console.error("Error updating task:", data);
      }
    } catch (err) {
      console.error("❌ Failed to update task:", err);
    }
  };

  // 🔹 Delete task (DELETE)
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("🗑️ Task deleted:", id);
        const updatedTasks = tasks.filter((t) => t._id !== id);
        setTasks(updatedTasks);
        if (onUpdate) onUpdate(updatedTasks);
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("❌ Delete request failed:", err);
    }
  };

  // 🔹 Check if editable within 24 hours
  const isWithin24Hours = (assignedDateTime) => {
    if (!assignedDateTime) return false;
    const now = Date.now();
    const diffHours = (now - assignedDateTime) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  return (
    <div className="tasks-task-container">
      <h3>Assigned Tasks ({selectedFY})</h3>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="tasks-task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned By</th>
              <th>Assigned Date</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && !newTask && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No tasks added.
                </td>
              </tr>
            )}

            {tasks.map((task) => {
              const editable = isWithin24Hours(task.assignedDateTime);
              const taskId = task._id || task.id;

              return (
                <tr key={taskId}>
                  <td>
                    {task.isEditing ? (
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t._id === taskId ? { ...t, text: e.target.value } : t
                            )
                          )
                        }
                      />
                    ) : (
                      task.text
                    )}
                  </td>
                  <td>{task.assignedBy}</td>
                  <td>{task.assignedDate ? task.assignedDate.split("T")[0] : "-"}</td>
                  <td>
                    {task.isEditing ? (
                      <input
                        type="date"
                        value={task.dueDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t._id === taskId ? { ...t, dueDate: e.target.value } : t
                            )
                          )
                        }
                      />
                    ) : (
                      task.dueDate ? task.dueDate.split("T")[0] : "-"
                    )}
                  </td>
                  <td>
                    {task.isEditing ? (
                      <button
                        className="tasks-save-btn"
                        onClick={() => handleUpdate(taskId, task.text, task.dueDate)}
                        disabled={!task.text || !task.dueDate}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="tasks-edit-btn"
                          onClick={() => handleEdit(taskId)}
                          disabled={!editable}
                          title={
                            editable
                              ? "Edit Task"
                              : "Editing disabled after 24 hours"
                          }
                        >
                          <FaEdit />
                        </button>
                        {/* <button
                          className="tasks-del-btn"
                          onClick={() => handleDelete(taskId)}
                          disabled={!editable}
                          title={
                            editable
                              ? "Delete Task"
                              : "Deletion disabled after 24 hours"
                          }
                        >
                          <FaTrash />
                        </button> */}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {newTask && (
              <tr>
                <td>
                  <input
                    type="text"
                    value={newTask.text}
                    onChange={(e) =>
                      setNewTask({ ...newTask, text: e.target.value })
                    }
                  />
                </td>
                <td>{newTask.assignedBy}</td>
                <td>{newTask.assignedDate}</td>
                <td>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    className="tasks-save-btn"
                    onClick={handleSave}
                    disabled={!newTask.text || !newTask.dueDate}
                  >
                    Save
                  </button>
                  <button
                    className="tasks-cancel-btn"
                    onClick={() => setNewTask(null)}
                    style={{ marginLeft: "5px" }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="tasks-add-task-section">
        {!newTask && (
          <button className="tasks-add-task-btn" onClick={addTask}>
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
}
