import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function CreateNotes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [color, setColor] = useState("#FFF9E6");
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const colors = [
    "#FFF9E6",
    "#FFE6E6",
    "#E6F3FF",
    "#E6FFE6",
    "#F3E6FF",
    "#FFF0CC",
  ];
  const categories = ["General", "Mathematics", "Science", "History", "Literature", "Other"];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotesList(res.data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!title || !content) {
      alert("Please enter title and content");
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/notes/${editingId}`, {
          title,
          content,
          category,
          color,
        });
        setNotesList(notesList.map((n) => (n._id === editingId ? res.data : n)));
        setEditingId(null);
      } else {
        const res = await api.post("/notes", {
          title,
          content,
          category,
          color,
        });
        setNotesList([res.data, ...notesList]);
      }
      setTitle("");
      setContent("");
      setCategory("General");
      setColor("#FFF9E6");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save");
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category || "General");
    setColor(note.color || "#FFF9E6");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotesList(notesList.filter((n) => n._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("General");
    setColor("#FFF9E6");
  };

  return (
    <div>
      <Navbar />
      <div className="container study-container">
        <h2>📝 My Study Notes</h2>

        <div className="form-section">
          <h3>{editingId ? "Edit Note" : "Create New Note"}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes Content</label>
            <textarea
              placeholder="Write your important notes, formulas, definitions, concepts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
            />
          </div>

          <div className="form-group">
            <label>Choose Color</label>
            <div className="color-picker">
              {colors.map((c) => (
                <div
                  key={c}
                  className={`color-option ${color === c ? "selected" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="form-buttons">
            <button onClick={handleAdd} className="btn btn-primary">
              {editingId ? "Update Note" : "Create Note"}
            </button>
            {editingId && (
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="notes-section">
          <h3>All Your Notes</h3>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : notesList.length === 0 ? (
            <p className="empty-text">No notes yet. Create your first note above!</p>
          ) : (
            <div className="notes-grid">
              {notesList.map((note) => (
                <div
                  key={note._id}
                  className="note-card"
                  style={{ backgroundColor: note.color }}
                >
                  <div className="note-header">
                    <h4>{note.title}</h4>
                    <div className="note-actions">
                      <button
                        onClick={() => handleEdit(note)}
                        className="btn-icon edit"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="btn-icon delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="note-category">
                    <strong>{note.category}</strong>
                  </p>
                  <p className="note-content">{note.content}</p>
                  <small className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString()}
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
