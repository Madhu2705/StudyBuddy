import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Timer() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/study");
        setPlan(res.data);
      } catch (err) {}
    };
    // try local first
    const stored = localStorage.getItem('studyPlan');
    if (stored) {
      setPlan(JSON.parse(stored));
    }
    load();

    const handleStorage = (e) => {
      if (e.key === 'studyPlan') {
        setPlan(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s === 0) {
            setMinutes((m) => m - 1);
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (minutes < 0) {
      stopTimer(true);
    }
  }, [minutes]);

  const startTimer = () => {
    if (!selectedSubject) return;
    setRunning(true);
  };

  const stopTimer = async (auto = false) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    const elapsed = (auto ? 0 : minutes) * 60 + seconds;
    const usedMinutes = Math.ceil(elapsed / 60);
    if (selectedSubject && usedMinutes > 0) {
      await api.post("/session", {
        subject: selectedSubject,
        minutes: usedMinutes
      });
      alert("Session saved");
    }
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="container">
      <Navbar />
      <h1>Focus Timer</h1>
      {plan && plan.subjects && (
        <div className="card" style={{ padding: '20px' }}>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">--select subject--</option>
            {plan.subjects.map((s, i) => (
              <option key={i} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="timer-display">
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
      {!running ? (
        <button onClick={startTimer}>Start</button>
      ) : (
        <button onClick={() => stopTimer(false)}>Stop</button>
      )}
    </div>
  );
}