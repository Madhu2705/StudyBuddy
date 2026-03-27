import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function SyllabusUpload() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      const res = await api.get("/syllabus");
      setSyllabusList(res.data);
    } catch (err) {
      console.error("Failed to load syllabus:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!subject || !topic || !notes) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/syllabus/${editingId}`, {
          subject,
          topic,
          notes,
        });
        setSyllabusList(
          syllabusList.map((s) => (s._id === editingId ? res.data : s))
        );
        setEditingId(null);
      } else {
        const res = await api.post("/syllabus", {
          subject,
          topic,
          notes,
        });
        setSyllabusList([res.data, ...syllabusList]);
      }
      setSubject("");
      setTopic("");
      setNotes("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setSubject(item.subject);
    setTopic(item.topic);
    setNotes(item.notes);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this syllabus?")) return;

    try {
      await api.delete(`/syllabus/${id}`);
      setSyllabusList(syllabusList.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setSubject("");
    setTopic("");
    setNotes("");
  };

  return (
    <div>
      <Navbar />
      <div className="container study-container">
        <h2>📚 Syllabus & Notes Manager</h2>

        <div className="form-section">
          <h3>{editingId ? "Edit Syllabus" : "Add New Syllabus"}</h3>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="e.g., Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Topic</label>
            <input
              type="text"
              placeholder="e.g., Calculus"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Important Notes/Topics</label>
            <textarea
              placeholder="Write important points, formulas, definitions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="6"
            />
          </div>

          <div className="form-buttons">
            <button onClick={handleAdd} className="btn btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="notes-section">
          <h3>Saved Syllabus Notes</h3>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : syllabusList.length === 0 ? (
            <p className="empty-text">No syllabus notes yet. Add one above!</p>
          ) : (
            <div className="notes-grid">
              {syllabusList.map((item) => (
                <div key={item._id} className="note-card">
                  <div className="note-header">
                    <h4>{item.subject}</h4>
                    <div className="note-actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn-icon edit"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn-icon delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="note-topic">
                    <strong>Topic:</strong> {item.topic}
                  </p>
                  <p className="note-content">{item.notes}</p>
                  <small className="note-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
