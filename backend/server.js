const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>{
  console.error("MongoDB connection error", err);
  process.exit(1);
});

app.get("/",(req,res)=>res.send("API running"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/study", require("./routes/study"));
app.use("/api/session", require("./routes/session"));
app.use("/api/rating", require("./routes/rating"));
app.use("/api/task", require("./routes/task"));
app.use("/api/notes", require("./routes/notes"));

app.listen(process.env.PORT, ()=>{
 console.log("Server running");
});