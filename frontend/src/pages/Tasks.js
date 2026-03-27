import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Tasks() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    subtasks: [],
    linkedToSubject: "",
    linkedToTopic: ""
  });

  const [subtaskInput, setSubtaskInput] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Load tasks and study plan
  useEffect(() => {
    loadTasks();
    loadStudyPlan();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await api.get("/task");
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  const loadStudyPlan = async () => {
    try {
      const res = await api.get("/study");
      setStudyPlan(res.data);
    } catch (err) {
      console.error("Error loading study plan:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: subtaskInput, completed: false }]
      }));
      setSubtaskInput("");
    }
  };

  const removeSubtask = (index) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingId) {
        await api.put(`/task/${editingId}`, formData);
      } else {
        await api.post("/task", formData);
      }
      loadTasks();
      resetForm();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      deadline: "",
      subtasks: [],
      linkedToSubject: "",
      linkedToTopic: ""
    });
    setSubtaskInput("");
    setEditingId(null);
    setShowForm(false);
  };

  const editTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline ? task.deadline.slice(0, 16) : "",
      subtasks: task.subtasks || [],
      linkedToSubject: task.linkedToSubject || "",
      linkedToTopic: task.linkedToTopic || ""
    });
    setEditingId(task._id);
    setShowForm(true);
  };

  const deleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await api.delete(`/task/${id}`);
        loadTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await api.patch(`/task/${id}/toggle`);
      loadTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      await api.patch(`/task/${taskId}/subtask/${subtaskId}`);
      loadTasks();
    } catch (err) {
      console.error("Error toggling subtask:", err);
    }
  };

  const autoAddTasksFromTimetable = () => {
    if (!studyPlan || !studyPlan.timetable) {
      alert("No study plan found. Create a study plan first!");
      return;
    }

    studyPlan.timetable.forEach(item => {
      const existingTask = tasks.find(
        t => t.linkedToSubject === item.subject && t.linkedToTopic === item.topic
      );

      if (!existingTask) {
        const taskData = {
          title: `${item.subject} - ${item.topic}`,
          description: `Duration: ${item.duration} minutes`,
          priority: "Medium",
          deadline: item.scheduledAt,
          subtasks: [],
          linkedToSubject: item.subject,
          linkedToTopic: item.topic
        };

        api.post("/task", taskData).then(() => loadTasks());
      }
    });

    alert("Tasks added from timetable!");
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const priorityMatch = filterPriority === "All" || task.priority === filterPriority;
    const statusMatch = filterStatus === "All" || 
      (filterStatus === "Completed" && task.completed) ||
      (filterStatus === "Pending" && !task.completed);
    return priorityMatch && statusMatch;
  });

  const getCompletedCount = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    return task.subtasks.filter(s => s.completed).length;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#dc2626";
      case "Medium": return "#ea580c";
      case "Low": return "#16a34a";
      default: return "#2563eb";
    }
  };

  const isOverdue = (deadline) => {
    return deadline && new Date(deadline) < new Date() && !false;
  };

  return (
    <>
      <Navbar />
      <div className="container task-container">
        <div className="task-header">
          <h1>📋 Task Manager</h1>
          <div className="task-header-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Add Task"}
            </button>
            <button 
              className="btn btn-success"
              onClick={autoAddTasksFromTimetable}
              title="Auto-add tasks from your study timetable"
            >
              📅 Auto-add from Timetable
            </button>
          </div>
        </div>

        {/* Add/Edit Task Form */}
        {showForm && (
          <div className="task-form-container">
            <form onSubmit={handleSubmit} className="task-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add task details..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Link to Subject (Optional)</label>
                  <input
                    type="text"
                    name="linkedToSubject"
                    value={formData.linkedToSubject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div className="form-group">
                  <label>Link to Topic (Optional)</label>
                  <input
                    type="text"
                    name="linkedToTopic"
                    value={formData.linkedToTopic}
                    onChange={handleInputChange}
                    placeholder="e.g., Calculus"
                  />
                </div>
              </div>

              {/* Subtasks */}
              <div className="form-group">
                <label>Subtasks</label>
                <div className="subtask-input">
                  <input
                    type="text"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    placeholder="Add a subtask..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubtask())}
                  />
                  <button type="button" onClick={addSubtask} className="btn btn-small">
                    Add
                  </button>
                </div>

                {formData.subtasks.length > 0 && (
                  <div className="subtask-list">
                    {formData.subtasks.map((subtask, index) => (
                      <div key={index} className="subtask-item">
                        <span>✓ {subtask.title}</span>
                        <button
                          type="button"
                          onClick={() => removeSubtask(index)}
                          className="btn-remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update Task" : "Create Task"}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="task-filters">
          <div className="filter-group">
            <label>Priority:</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="task-stats">
            <span>📊 {filteredTasks.length} tasks</span>
            <span>✅ {filteredTasks.filter(t => t.completed).length} completed</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create one to get started! 🚀</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const completedSubtasks = getCompletedCount(task);
              const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
              const progress = totalSubtasks === 0 ? (task.completed ? 100 : 0) : (completedSubtasks / totalSubtasks) * 100;
              const overdue = isOverdue(task.deadline) && !task.completed;

              return (
                <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
                  <div className="task-header-card">
                    <div className="task-checkbox-title">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task._id, task.completed)}
                        className="task-checkbox"
                      />
                      <div className="task-title-section">
                        <h3>{task.title}</h3>
                        {task.description && <p className="task-description">{task.description}</p>}
                      </div>
                    </div>
                    <div className="task-priority" style={{ borderColor: getPriorityColor(task.priority) }}>
                      {task.priority}
                    </div>
                  </div>

                  {task.deadline && (
                    <div className={`task-deadline ${overdue ? 'overdue-text' : ''}`}>
                      📅 {new Date(task.deadline).toLocaleString()}
                      {overdue && <span className="overdue-badge">OVERDUE</span>}
                    </div>
                  )}

                  {(task.linkedToSubject || task.linkedToTopic) && (
                    <div className="task-links">
                      {task.linkedToSubject && <span className="task-tag">{task.linkedToSubject}</span>}
                      {task.linkedToTopic && <span className="task-tag">{task.linkedToTopic}</span>}
                    </div>
                  )}

                  {/* Subtasks */}
                  {totalSubtasks > 0 && (
                    <div className="subtasks-section">
                      <div className="subtasks-header">
                        <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
                      </div>
                      {task.subtasks.map((subtask, idx) => (
                        <div key={idx} className="subtask-row">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => toggleSubtask(task._id, subtask._id)}
                            className="subtask-checkbox"
                          />
                          <span className={subtask.completed ? 'completed-text' : ''}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  {totalSubtasks > 0 && (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: progress === 100 ? '#16a34a' : '#2563eb'
                          }}
                        />
                      </div>
                      <span className="progress-text">{Math.round(progress)}%</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
