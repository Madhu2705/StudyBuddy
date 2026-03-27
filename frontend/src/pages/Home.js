import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [errors, setErrors] = useState({});

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, []);

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!regName.trim()) {
      newErrors.regName = "Name is required";
    }
    
    if (!regEmail.trim()) {
      newErrors.regEmail = "Email is required";
    } else if (!validateEmail(regEmail)) {
      newErrors.regEmail = "Please enter a valid email";
    }
    
    if (!regPassword.trim()) {
      newErrors.regPassword = "Password is required";
    } else if (regPassword.length < 6) {
      newErrors.regPassword = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setShowLoginModal(false);
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      alert(msg);
    }
  };

  const handleRegister = async () => {
    if (!validateRegisterForm()) return;
    
    try {
      const res = await api.post("/auth/register", { 
        name: regName, 
        email: regEmail, 
        password: regPassword 
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setShowLoginModal(false);
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      alert(msg);
    }
  };

  const renderStars = (rating) => {
    return "⭐️".repeat(rating);
  };

  return (
    <div className="home-page">
      <Navbar />
      <header className="hero">
        <div className="hero-content">
  <h1>StudyBuddy</h1>

  <p>
  StudyBuddy is your intelligent learning companion designed to help you
  plan smarter, stay focused, and achieve your academic goals with confidence.
  From AI-powered study plans to productivity tracking, everything you need
  for effective learning is in one place.
  </p>

  <div className="hero-quote">
    <p>
      "Small daily progress leads to big achievements. Stay consistent,
      stay focused, and let StudyBuddy guide your journey."
    </p>
  </div>
</div>
        <div className="hero-image">
          <img src="/plan.jpg" width="650px" height="490px" alt="students learning" />
        </div>
      </header>

      

      <section className="features">
        <h2>Why Choose StudyBuddy?</h2>
        <div className="feature-list">
          <div className="feature">
            <div className="feature-icon">📚</div>
            <h3>Structured Learning</h3>
            <p>Organize your subjects and create personalized study plans tailored to your goals.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⏱️</div>
            <h3>Focus Timer</h3>
            <p>Track study sessions with our intelligent timer and build consistent study habits.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>Analytics & Insights</h3>
            <p>Monitor your progress with detailed analytics and get recommendations for improvement.</p>
          </div>
        </div>
      </section>

      <section className="trusted-by">
        <h2>Trusted By Thousands of Students</h2>
        <div className="trusted-logos">
          <div className="trusted-logo">🎓</div>
          <div className="trusted-logo">📚</div>
          <div className="trusted-logo">🏆</div>
          <div className="trusted-logo">💡</div>
          <div className="trusted-logo">🚀</div>
          <div className="trusted-logo">⭐</div>
        </div>
        <p className="trusted-text">Join thousands of students who have improved their study habits and academic performance with StudyBuddy</p>
      </section>

      <section className="ratings">
        <h2>Get Started Today</h2>
        <div style={{ textAlign: "center", padding: "30px" }}>
          <p style={{ marginBottom: "20px" }}>Join thousands of students improving their study habits with StudyBuddy</p>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="btn btn-primary"
          >
            Start Learning Now
          </button>
        </div>
      </section>

      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            
            <div className="auth-tabs">
              <button 
                className={`tab ${!isRegistering ? 'active' : ''}`}
                onClick={() => setIsRegistering(false)}
              >
                Login
              </button>
              <button 
                className={`tab ${isRegistering ? 'active' : ''}`}
                onClick={() => setIsRegistering(true)}
              >
                Register
              </button>
            </div>

            {!isRegistering ? (
              <div className="login-form">
                <h2>Welcome Back!</h2>
                <div>
                  <input 
                    type="email"
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
                <div>
                  <input 
                    type="password"
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "input-error" : ""}
                  />
                  {errors.password && <span className="error-msg">{errors.password}</span>}
                </div>
                <button 
                  onClick={handleLogin}
                  className="btn btn-primary btn-block"
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="register-form">
                <h2>Create Account</h2>
                <div>
                  <input 
                    type="text"
                    placeholder="Enter your name" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className={errors.regName ? "input-error" : ""}
                  />
                  {errors.regName && <span className="error-msg">{errors.regName}</span>}
                </div>
                <div>
                  <input 
                    type="email"
                    placeholder="Enter your email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={errors.regEmail ? "input-error" : ""}
                  />
                  {errors.regEmail && <span className="error-msg">{errors.regEmail}</span>}
                </div>
                <div>
                  <input 
                    type="password"
                    placeholder="Enter your password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className={errors.regPassword ? "input-error" : ""}
                  />
                  {errors.regPassword && <span className="error-msg">{errors.regPassword}</span>}
                </div>
                <button 
                  onClick={handleRegister}
                  className="btn btn-primary btn-block"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StudyBuddy</h3>
            <p>Empowering students with intelligent study planning and time management tools.</p>
            <p>StudyBuddy helps students plan schedules, stay focused, and track progress using intelligent tools designed for modern learning.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          
          
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 StudyBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

