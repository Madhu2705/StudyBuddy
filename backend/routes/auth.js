const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/user");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

router.post("/register",async(req,res)=>{
  console.log("register request", req.body);
  try {
    const {name,email,password} = req.body;
    
    if(!name || !email || !password) {
      return res.status(400).json({error:"Name, email and password are required"});
    }

    if (!validateEmail(email)) {
      return res.status(400).json({error:"Please provide a valid email address"});
    }

    if (password.length < 6) {
      return res.status(400).json({error:"Password must be at least 6 characters"});
    }

    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error:"Email already registered"});

    const hash = await bcrypt.hash(password,10);
    const user = await User.create({ name,email,password:hash });
    res.json(user);
  } catch(err) {
    console.error("register error", err);
    res.status(500).json({error:"Registration failed"});
  }
});

router.post("/login",async(req,res)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password) {
      return res.status(400).json({error:"Email and password are required"});
    }

    if (!validateEmail(email)) {
      return res.status(400).json({error:"Please provide a valid email address"});
    }

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:"No user"});

    const ok = await bcrypt.compare(password,user.password);
    if(!ok) return res.status(400).json({error:"Wrong credentials"});

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.json({token,user});
  } catch(err) {
    console.error("login error", err);
    res.status(500).json({error:"Login failed"});
  }
});

module.exports=router;