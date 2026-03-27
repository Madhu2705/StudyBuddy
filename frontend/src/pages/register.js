import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function Register() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [errors,setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async () => {
    if (!validateForm()) return;
    
    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration Successful ✅");
      navigate("/");
    } catch(err){
      const msg = err.response?.data?.error || "Registration failed";
      alert(msg);
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container auth-wrapper">
        <div className="card">
          <h2>Register</h2>

          <input
            placeholder="Name"
            onChange={(e)=>setName(e.target.value)}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
          
          <input
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
          
          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <span className="error-msg">{errors.password}</span>}

          <button onClick={registerUser}>
            Register
          </button>

          <p>
            Already have account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}