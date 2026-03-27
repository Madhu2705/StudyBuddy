import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const [subjects, setSubjects] = useState([]);
  const [currentSub, setCurrentSub] = useState("");
  const [currentTopics, setCurrentTopics] = useState("");
  const [currentDuration, setCurrentDuration] = useState(60);
  const [startTime, setStartTime] = useState("");
  const [plan, setPlan] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/study");
        setPlan(res.data);
        if (res.data) {
          if (res.data.subjects) setSubjects(res.data.subjects);
          if (res.data.startTime) setStartTime(new Date(res.data.startTime).toISOString().slice(0,16));
        } else {
          // no plan in database, clear local state
          setSubjects([]);
          setStartTime("");
        }
      } catch (err) {}
    }
    load();
  }, []);

  // whenever subjects or start time change, update timetable display
  useEffect(() => {
    regeneratePlan(subjects, startTime);
  }, [subjects, startTime]);

  const addSubject = () => {
    if (!currentSub) {
      alert("Please enter a subject name");
      return;
    }
    const topics = currentTopics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    if (topics.length === 0) {
      alert("Please enter at least one topic");
      return;
    }

    const newItem = { name: currentSub, topics, duration: currentDuration };
    let updated;
    if (editingIndex >= 0) {
      updated = subjects.map((it, idx) => (idx === editingIndex ? newItem : it));
      setEditingIndex(-1);
    } else {
      updated = [...subjects, newItem];
    }
    setSubjects(updated);
    regeneratePlan(updated, startTime);
    // automatically persist changes
    savePlan(false);
    setCurrentSub("");
    setCurrentTopics("");
    setCurrentDuration(60);
  };

  const savePlan = async (showAlert = true) => {
    if (!subjects || subjects.length === 0) {
      alert("Please add at least one subject first!");
      return;
    }

    const payload = { subjects };
    if (startTime) payload.startTime = startTime;
    try {
      const res = await api.post("/study", payload);
      setPlan(res.data);
      localStorage.setItem('studyPlan', JSON.stringify(res.data));
      if (showAlert) alert("Study plan generated successfully! ✅");
    } catch (err) {
      console.error('savePlan error', err);
    }
  };

  const deleteSubject = async (index) => {
    if (!window.confirm('Delete this subject?')) return;
    
    const updated = subjects.filter((_, idx) => idx !== index);
    setSubjects(updated);
    
    // Clear form if editing this subject
    if (editingIndex === index) {
      setEditingIndex(-1);
      setCurrentSub('');
      setCurrentTopics('');
      setCurrentDuration(60);
    }

    // If no subjects left, clear plan and database
    if (updated.length === 0) {
      setPlan(null);
      localStorage.removeItem('studyPlan');
      // Delete plan from backend
      try {
        await api.delete("/study");
      } catch (err) {
        console.log("Could not delete plan from backend");
      }
    } else {
      // Save updated subjects to backend
      const payload = { subjects: updated };
      if (startTime) payload.startTime = startTime;
      try {
        const res = await api.post("/study", payload);
        setPlan(res.data);
        localStorage.setItem('studyPlan', JSON.stringify(res.data));
      } catch (err) {
        console.error('Error saving after delete', err);
      }
    }
  };

  // auto save when subjects or startTime change
  useEffect(() => {
    regeneratePlan(subjects, startTime);
  }, [subjects, startTime]);

  // regenerate timetable on the client after subjects change
  const regeneratePlan = (subs = subjects, start = startTime) => {
    const table = [];
    let current = start ? new Date(start) : new Date();
    subs.forEach((sub) => {
      const dur = sub.duration || 60;
      sub.topics.forEach((topic) => {
        table.push({
          subject: sub.name,
          topic,
          duration: dur,
          scheduledAt: current.toISOString()
        });
        current = new Date(current.getTime() + dur * 60 * 1000);
      });
    });
    const newPlan = { subjects: subs, timetable: table, startTime: start ? new Date(start) : undefined };
    setPlan(newPlan);
    localStorage.setItem('studyPlan', JSON.stringify(newPlan));
  };

  return (
    <div className="container">
      <Navbar />
      <h1>Dashboard</h1>

      <section className="plan-form card">
        <h2>Create / Edit Study Plan</h2>
        
        <label>
          Start time for timetable:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>

        <input
          placeholder="Subject Name"
          value={currentSub}
          onChange={(e) => setCurrentSub(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSubject()}
        />
        
        <input
          placeholder="Topics (comma separated)"
          value={currentTopics}
          onChange={(e) => setCurrentTopics(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSubject()}
        />
        
        <input
          type="number"
          min="1"
          placeholder="Duration (min per topic)"
          value={currentDuration}
          onChange={(e) => setCurrentDuration(Number(e.target.value))}
        />
        
        <button onClick={addSubject}>{editingIndex >= 0 ? "Update Subject" : "Add Subject"}</button>

        {subjects.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Added Subjects:</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {subjects.map((s, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f5f5f5', marginBottom: '8px', borderRadius: '4px' }}>
                  <span>
                    <strong>{s.name}</strong> ({s.duration} min/topic): {s.topics.join(", ")}
                  </span>
                  <span>
                    <button
                      onClick={() => {
                        setCurrentSub(s.name);
                        setCurrentTopics(s.topics.join(", ")); 
                        setCurrentDuration(s.duration);
                        setEditingIndex(i);
                      }}
                      style={{ marginRight: '6px', padding: '6px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSubject(i)}
                      style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}


      </section>

      {plan && plan.timetable && (
        <section className="timetable card">
          <h2>Generated Timetable</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Topic</th>
                <th>Duration (min)</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {plan.timetable.map((item, i) => (
                <tr key={i}>
                  <td>{item.subject}</td>
                  <td>{item.topic}</td>
                  <td>{item.duration}</td>
                  <td>{new Date(item.scheduledAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}