import {useState, useEffect} from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function Login(){

 const nav=useNavigate();
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [errors,setErrors]=useState({});
 const token = localStorage.getItem("token");

 useEffect(() => {
   if (token) nav("/dashboard");
 }, [token, nav]);

 const validateForm = () => {
   const newErrors = {};
   
   if (!email.trim()) {
     newErrors.email = "Email is required";
   } else if (!validateEmail(email)) {
     newErrors.email = "Please enter a valid email address";
   }
   
   if (!password.trim()) {
     newErrors.password = "Password is required";
   }
   
   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
 };

 const login=async()=>{
   if (!validateForm()) return;
   
   try {
     const res=await api.post("/auth/login",{email,password});
     localStorage.setItem("user",JSON.stringify(res.data.user));
     localStorage.setItem("token",res.data.token);
     nav("/dashboard");
   } catch(err) {
     const msg = err.response?.data?.error || "Login failed";
     alert(msg);
     console.log(err);
   }
 };

 return(
  <div>
    <Navbar />
    <div className="container auth-wrapper">
     <div className="card">
       <h2>Login</h2>
       <input 
         placeholder="email" 
         onChange={e=>setEmail(e.target.value)}
         className={errors.email ? "input-error" : ""}
       />
       {errors.email && <span className="error-msg">{errors.email}</span>}
       
       <input 
         type="password" 
         placeholder="password"
         onChange={e=>setPassword(e.target.value)}
         className={errors.password ? "input-error" : ""}
       />
       {errors.password && <span className="error-msg">{errors.password}</span>}
       
       <button onClick={login}>Login</button>
       <p>
         Don't have account? <Link to="/register">Register</Link>
       </p>
     </div>
    </div>
  </div>
 );
}